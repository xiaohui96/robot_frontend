import React from 'react';
import ReactDom from 'react-dom';
import Reflux from 'reflux';

import { Modal,Form,Input,InputNumber } from 'antd';

import WidgetButton from 'components/WidgetButton';

import DataPool from 'routes/experiment/DataPool';

import AppActions from 'actions/AppActions';
import appStore from 'stores/appStore';

import './joint.css';


import {formItemLayoutInModal} from 'components/layout';

const FormItem = Form.Item;


class SamaDiagram extends Reflux.Component {
    constructor(props) {
        super(props);
        this.state = {
            monitor: false, /*是否在监视状态*/
            ws:undefined, /*与rtlab服务器通讯的web socket*/
            dataPool:undefined, /*数据缓冲池*/
            currentTime:0, /*当前最新数据的时间戳*/
            currentBlock:undefined,
            paraModalVisible:false
        }
        this.params=undefined;
    }

    componentDidMount() {
        this.diagram = this.props.init(this.mount);
        //console.log(this.diagram);
        this.findSignals();
        this.findParameters(this.diagram.blocks);

        console.log(this.params);

        const {paper}=this.diagram;

        paper.on('element:pointerdblclick', this.onElementDbClick);

    }

    findParameters(blocks){
        const {signalParaList} = this.props;
        //console.log(blocks);

        blocks.forEach((block)=>{
            block.paras.forEach((para)=>{
                var param = {};
                signalParaList.paras.forEach((sig)=>{
                    if(sig.path.match(para.path)!=null){
                        param.sig = sig;
                        param.type = 2;
                        param.pos = '2_' + sig.position + '_0_0';
                        para.pos=param.pos;
                    }
                });
                if (param.pos) {
                    this.params.push(param);
                }
            });
        });
    }

    onElementDbClick=(elementView)=>{
        const {monitor}=this.state;
        const {model}=elementView;

        if(monitor){
            //console.log(model);
            const block=this.findBlock(model);
            console.log(block);

            if(block){
                this.setState({
                    currentBlock:block,
                    paraModalVisible:true
                });
            }
        }
    }

    findBlock=(model)=>{
        //console.log(this.diagram);
        const {blocks}=this.diagram;


        for(var i in blocks){
            const item=blocks[i];
            if(item.block==model){
                return item;
            }
        }
    }

    findSignals = () => {

        const {signalParaList, paraNames} = this.props;

        console.log(signalParaList);
        var params = [];
        paraNames.forEach((paraName) => {
            var param = {};
            if (param.pos == undefined) {
                signalParaList.signals.forEach((sig) => {
                    if (sig.name == paraName) {
                        param.sig = sig;
                        param.type = 1;
                        param.pos = '1_' + sig.position + '_0_0';
                    }
                });
            }

            if (param.pos == undefined) {
                signalParaList.paras.forEach((sig) => {
                    if (sig.name == paraName) {
                        param.name = sig;
                        param.type = 2;
                        param.pos = '2_' + sig.position + '_0_0';
                    }
                });
            }

            if (param.pos) {
                params.push(param);
            }

        });

        /*

        this.props.onParamsConfig({
            key: this.props.keyValue,
            params: {params:params}
        });*/
        this.params=params;
        console.log(params);
    }

    /*暂停监控*/
    onPauseMonitor = () => {
        const {ws}=this.state;
        if(ws!=undefined){
            //console.log(ws);
            ws.close();
        }
        this.setState({
            monitor: false
        })
    }

    /*启动监控*/
    onBeginMonitor = () => {
        this.startExperiment();
        this.setState({
            monitor: true
        })
    }

    /*获得Websokcet是ws还是wss协议*/
    getWsProtocols=(protocolString)=>{
        var protocols=protocolString.split('/');
        if(protocols[1]){
            return protocols[1];
        }
        else{
            return "ws";
        }
    }

    startExperiment=()=>{
        const {plantInfo} = this.props;
        //获得所有信号参数的列表
        const paramList=this.params.map((item)=>{
            return item.pos;
        });

        var that=this;
        //for( let i in that.state ){
        //  console.log("i= "+i);           //获得属性
        //   console.log("that= "+that[i]);  //获得属性值
        //}

        //console.log("that= "+that.state);
        //console.log(paramList);
        //console.log("paramList= "+paramList);
        //this.setState({downloadStatus:true});

        //algorithm.errorCode=undefined;

        var ws = null;
        var url=this.getWsProtocols(plantInfo.protocols)+"://"+plantInfo.serverUrl+"/websocket/experiment"
        if ('WebSocket' in window)
            ws = new WebSocket(url);
        else if ('MozWebSocket' in window)
            ws = new MozWebSocket(url);

        var onOpen=function(){
            console.log("Monitor connected");
            /*连接时，给rtlab下监控数据的列表，列表在paramList*/
            ws.send(JSON.stringify({
                com:'start',
                plantId:plantInfo.id,
                serverUrl:plantInfo.serverUrl,
                downloadPort:plantInfo.downloadPort+(plantInfo.copyNum?parseInt(plantInfo.copyNum):0),
                monitorPort:plantInfo.monitorPort+(plantInfo.copyNum?parseInt(plantInfo.copyNum):0),
                plantType:plantInfo.type,
                copyNum:plantInfo.copyNum,
                ip:plantInfo.ip,
                paramList:paramList
                //下载算法阶段已经传递该参数，注释掉此处能够解决不保存的情况下进行正常的监控和实验
                //packageSize:that.state.algInfo.packageSize,
                //stepSize:that.state.algInfo.stepSize
            }));
        }

        var onClose=function(){
            console.log("Monitor closed");
            that.setState({
                monitor:false
            });
        }

        var onMessage=function(msg){
            const message=JSON.parse(msg.data);

            switch (message.com){
                case 'UploadData':
                    //console.log(message);
                    that.onDataUpload(message);
                    break;
            }
        }

        var onError=function(){

        }

        ws.onopen=onOpen;
        ws.onclose=onClose;
        ws.onmessage=onMessage;
        ws.onerror=onError;

        this.setState({ws});
        this.setState({
            dataPool:new DataPool()
        });
    }

    /*当WevSocket获得新的事实数据的时候调用，将新数据存放在datapool中*/
    onDataUpload=(message)=>{
        const {dataPool}=this.state;
        //const {setAction}=this.props;
        //console.log(message);
        var currentTime=dataPool.addData(message);
        this.setState({currentTime});

        var i=0;

        this.diagram.valuePoints.forEach((point)=>{

            const param=this.params[i];
            const value=dataPool.getCurrentValueByPos(param.pos);

            point.label(0,{
                attrs: {
                    text:{
                        text: Math.floor(value*100)/100
                    }

                }
            });
            i++;
        });

        /*
        this.params.forEach((item)=>{
            const value=dataPool.getCurrentValueByPos(item.pos);
            //console.log(this.valuePoints);

            const point=this.diagram.valuePoints[i];

            point.label(0,{
                attrs: {
                    text:{
                        text: Math.floor(value*100)/100
                    }

                }
            });
            i++;
        });*/

        //console.log(dataPool.getCurrentValueByPos(this.params[0].pos));
        /*setAction(this.params.map((item)=>{
            return dataPool.getCurrentValueByPos(item.pos);
        }));*/
    }

    render() {

        const {monitor,paraModalVisible,currentBlock,dataPool} = this.state;
        const {plantInfo}=this.props;

        return (
            <>
            <ParaModal
                visible={paraModalVisible}
                hideModal={()=>this.setState({paraModalVisible:false})}
                currentBlock={currentBlock}
                dataPool={dataPool}
                plantInfo={plantInfo}
            />
            <div className="widget-list">
                {
                    monitor ?
                        <WidgetButton text="暂停监控" iconid="pause" onClick={this.onPauseMonitor}/>
                        :
                        <WidgetButton text="开始监控" iconid="start" onClick={this.onBeginMonitor}/>
                }
            </div>
            <div
                className="three-js-container"
                ref={(mount) => {
                    this.mount = mount;
                }}
            />
            </>
        );

    }
}

@Form.create()
class ParaModal extends Reflux.Component {
    constructor(props) {
        super(props);
        this.store=appStore;
    }

    handleSubmit = (e) => {
        e.preventDefault();

        const {currentBlock,plantInfo}=this.props;
        const {paras}=currentBlock;

        this.props.form.validateFields((err, formData) => {
            if (!err) {
                //onsole.log(currentBlock);
                paras.forEach((para)=>{
                    if(para.value!=undefined){
                        console.log(para.value,para.pos);
                        AppActions.SetParam(plantInfo,para.value,para.pos);
                    }
                });
                this.props.hideModal();
            }
        });
    }

    render(){
        const {visible,currentBlock,dataPool}=this.props;
        if(visible==false||currentBlock==undefined){
            return null;
        }

        //const {paras}=currentBlock;
        //console.log(currentBlock);
        return (
            <Modal
                visible={visible}
                title={"设置参数"}
                onCancel={this.props.hideModal}
                onOk={this.handleSubmit}
            >
                <Form layout="horizontal" hideRequiredMark>
                    {
                        currentBlock.paras.map((item)=>{
                            return (
                                <FormItem label={item.disp} {...formItemLayoutInModal} key={item.path}>

                                    <InputNumber
                                        defaultValue={dataPool.getCurrentValueByPos(item.pos)}
                                        onChange={(value)=>{
                                            item.value=value;
                                        }}
                                    />

                                </FormItem>
                            );
                        }



                        )

                    }

                </Form>

            </Modal>
        );
    }
}

export default SamaDiagram;