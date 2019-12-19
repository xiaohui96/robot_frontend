//依赖类
import React from 'react';
import Reflux from 'reflux';
import {
    Table,
    Card,
    Modal,
    Spin,
    Tabs,
    Form,
    Select,
    Tag,
    Input,
    InputNumber,
    Drawer,
    Button,
    Badge,
    Tooltip
} from 'antd';

//数据流
import AppActions from 'actions/AppActions';
import appStore from 'stores/appStore';

//组件类
import Icon from 'components/Icon';
import {formItemLayoutInModal} from 'components/layout';

import ChatRoom from 'routes/ChatRoom/ChatRoom';

//页面内容
import Model from 'routes/lab/Model';
import Algorithm from 'routes/lab/Algorithm';
import Configuration from 'routes/lab/Configuration';
import Plant from 'routes/lab/Plant';
import FullControlTag from 'routes/lab/FullControlTag';

import './PlantDetail.less';
import Experiment from "routes/experiment/Experiment";

import ThermalPlant from './ThermalLab/ThermalPlant';

//语言
import intl from 'react-intl-universal';
import LangConsistent from "routes/LangConsistent";

const FormItem = Form.Item;
const Option = Select.Option;
const Column = Table.Column;
const TabPane = Tabs.TabPane;



class PlantDetail extends Reflux.Component {
    constructor(props) {
        super(props);
        this.store = appStore;
        this.state = {
            plantInfo: null, /*此设备的数据库基本信息*/
            activeAlgorithmId: 0, /*当前运行的算法，0表示没有算法运行*/
            activeKey: '1', /*当前指向的Table Pane*/
            configurationId: 0, /*当前的组态文件编号，0表示没有*/
            updateCount: 0,
            signalParas: undefined, /*当前运行的算法的信号和参数列表*/
            queueInfo: undefined, /*此设备申请控制权的排队列表*/
            lastErrorAlgorithmId:0,/*上一个出错的算法*/
            dialogVisible: false
        }

        this.currentUsers = undefined;
        //获取此设备的数据库基本信息
        AppActions.GetPlantInfo(this.props.match.params.path, this.onGetPlantInfo);

    }

    componentDidMount() {
        //AppActions.GetPlantInfo(this.props.match.params.path,this.onGetPlantInfo);
        // LangConsistent();
    }

    componentWillReceiveProps(nextProps) {
        //如果当前路径指向了另一个设备，需要装入相应设备的数据库信息到plantInfo
        if (nextProps.match.params.path != this.props.match.params.path) {
            //装入数据库信息
            AppActions.GetPlantInfo(nextProps.match.params.path, this.onGetPlantInfo);
            //重新复位Table Pane，并且复位当前组态文件
            this.setState({
                activeKey: '1',
                configurationId: 0
            });
        }
    }

    onGetCurrentAlgorithm = (activeAlgorithmId) => {
        //console.log("On GetCurrentAlgorithm"+activeAlgorithmId);

        if (activeAlgorithmId == 0) {
            this.setState({
                configurationId: 0
            });
        }

        //如果获得了当前算法，进一步获得当前算法的信号参数列表
        if (activeAlgorithmId != 0) {
            AppActions.GetSignalParas(this.state.plantInfo);
        }
        //如果当前没有算法运行的化，清除掉信号参数列表
        else {
            this.setState({
                signalParas: undefined
            });
        }
    }

    onGetPlantInfo = () => {

        //获得当前设备的信息之后，进一步获得当前设备运行的算法
        console.log("onGetPlantInfo");
        const {plantInfo, queueInfo} = this.state;

        plantInfo.copyNum=undefined; //当前设备的副本号
        if(plantInfo.type==1){
            //isFullControl=false;
            //plantInfo.copyNum=0;
            const currentUsers=JSON.parse(plantInfo.currentUsers);
            console.log(currentUsers);
            //console.log(Reflux.GlobalState.authStore.User.id);
            for(var i in currentUsers){
                if(currentUsers[i]==Reflux.GlobalState.authStore.User.id){
                    //isFullControl=true;
                    //copyNum=i;
                    plantInfo.copyNum=parseInt(i);
                    //console.log(plantInfo);

                    break;
                }
            }
        }

        AppActions.GetCurrentAlgorithm(plantInfo, this.onGetCurrentAlgorithm);


        //console.log(plantInfo);
        //console.log(queueInfo);


        /*
        if(plantInfo.type==1){
          //如果有副本，放到Algorithm.jsx中判断当前算法
            this.onGetCurrentAlgorithm();
        }
        else{
            AppActions.GetCurrentAlgorithm(plantInfo,this.onGetCurrentAlgorithm);
        }*/

    }

    //来自Algorithm.jsx的回调函数，通知当前算法发生变化，在用户下载算法完成的时候被调用
    onActiveAlgorithmChange = (plantId, algorithmId) => {
        console.log(plantId + ":" + algorithmId);
        this.setState({
            activeAlgorithmId: algorithmId
        });
    }
    //在Tab变化的时候被调用
    keyChange = (activeKey) => {
        //console.log(activeKey);
        const {plantInfo,updateCount}=this.state;
        this.setState({activeKey: activeKey});
        if(activeKey==2){
            AppActions.GetCurrentAlgorithm(plantInfo,(algorithmId)=>{
                this.onActiveAlgorithmChange(plantInfo.id, algorithmId);
                //通知Configuration那个Tab更新
                this.setState({
                    updateCount: updateCount + 1
                });
            });
        }
    }

    //当用户选中组态文件的时候，切换到Experiment页面，被Configuration.jsx这个页面调用
    switchToExperiment = (configurationId) => {
        console.log(configurationId);
        this.setState({
            activeKey: '4',
            configurationId: configurationId
        });
    }

    //实际应该命名为onConfigurationSave，从experiment.jsx回调，当用户保存组态的时候，更新updateCount，通知Configuration.jsx页面更新
    onConfigurationChange = (configurationId) => {
        //console.log("onConfigurationChange");
        //console.log(this.state.configurationId);

        const {updateCount} = this.state;
        this.setState({
            updateCount: updateCount + 1,
            configurationId: configurationId
        });
    }

    //当算法被下载之后，algorithm.jsx会提取信号参数列表，当信号参数列表提取完毕之后，调用此回调函数
    onGetSignalParas = (signalParas) => {
        console.log(signalParas);
        this.setState({signalParas});
    }

    //当用户的权限队列发生变化的时候的回调函数，由FullControl.jsx回调
    onFullControlStatusChange = (queueInfo) => {
        //console.log(queueInfo);
        const {plantInfo} = this.state;

        //当type==1的时候，需要获取CopyNum

        //88888888

        //console.log("queue Change");

        if (plantInfo.type == 1) {
            //isFullControl=false;
            //plantInfo.copyNum=0;
            if (!this.currentUsers || this.currentUsers.toString() != queueInfo.currentUsers.toString()) {
                this.currentUsers = queueInfo.currentUsers;
                const currentUsers = queueInfo.currentUsers;
                var found = false;
                //console.log(currentUsers);
                for (var i in currentUsers) {
                    if (currentUsers[i] == Reflux.GlobalState.authStore.User.id) {
                        //isFullControl=true;
                        //copyNum=i;
                        plantInfo.copyNum = parseInt(i);
                        found = true;
                        //console.log(plantInfo);
                        break;
                    }
                }

                if (found == false) {
                    plantInfo.copyNum = undefined;
                }

                AppActions.GetCurrentAlgorithm(plantInfo, this.onGetCurrentAlgorithm);
            }

        }

        this.setState({queueInfo});
    }

    onDialogClose = () => {
        this.setState({
            dialogVisible: false,
        });
    }

    showDialog = () => {
        this.setState({
            dialogVisible: true,
        });
    };

    setLastErrorAlgorithmId=(lastErrorAlgorithmId)=>{
        this.setState({
            lastErrorAlgorithmId:lastErrorAlgorithmId
        });
    }

    render() {
        const {plantInfo, activeAlgorithmId, activeKey, configurationId, updateCount, signalParas, queueInfo} = this.state;


        //用户是否有控制权
        var isFullControl = queueInfo && (queueInfo.plantInfo.currentUser == Reflux.GlobalState.authStore.User.id);


        //console.log(isFullControl);

        //当设备的信息没有获得之前，显示Spin控件
        if (plantInfo == null) {
            return (
                <Spin className="loading-plant-info" size="large"/>
            )
        }

        //plantInfo.copyNum=undefined; //当前设备的副本号
        if (queueInfo && plantInfo.type == 1) {
            isFullControl = false;
            //plantInfo.copyNum=0;
            const currentUsers = queueInfo.currentUsers;
            //console.log(currentUsers);
            for (var i in currentUsers) {
                if (currentUsers[i] == Reflux.GlobalState.authStore.User.id) {
                    isFullControl = true;
                    //copyNum=i;
                    //plantInfo.copyNum=parseInt(i);
                    break;
                }
            }
        }

        return (
            <div>
                <div>
                    <FullControlTag plantInfo={plantInfo} user={Reflux.GlobalState.authStore.User}
                                    onFullControlStatusChange={this.onFullControlStatusChange}/> {/*用户操作FullControl的控件*/}

                    {/*<span><Tag color="#108ee9" onClick={this.showDialog}>聊天室</Tag></span>*/}
                    <ChatRoom plantInfo={plantInfo} user={Reflux.GlobalState.authStore.User}
                              lastMessage={queueInfo ?.plantInfo?.lastMessage}/>
                </div>
                {
                    (()=>{
                        if(plantInfo.labid==8){
                            return (
                                <ThermalPlant isFullControl={isFullControl}
                                              user={Reflux.GlobalState.authStore.User}
                                              onGetSignalParas={this.onGetSignalParas}
                                              plantInfo={plantInfo}
                                              activeAlgorithmId={activeAlgorithmId}
                                              signalParas={signalParas}
                                              onActiveAlgorithmChange={this.onActiveAlgorithmChange}/>
                            );
                        }
                        else{
                            return (
                                <Tabs activeKey={activeKey} onChange={this.keyChange}>
                                    <TabPane tab={intl.get('rig model')} key="1"><Model modelPath={plantInfo.model}/></TabPane>
                                    <TabPane tab={intl.get('rig info')} key="5"><Plant plantInfo={plantInfo} queueInfo={queueInfo}
                                                                       user={Reflux.GlobalState.authStore.User}/></TabPane>
                                    <TabPane tab={intl.get('experiment algorithm')} key="2"><Algorithm isFullControl={isFullControl}
                                                                           user={Reflux.GlobalState.authStore.User}
                                                                           onGetSignalParas={this.onGetSignalParas}
                                                                           plantInfo={plantInfo}
                                                                           lastErrorAlgorithmId={this.state.lastErrorAlgorithmId}
                                                                           setLastErrorAlgorithmId={this.setLastErrorAlgorithmId}
                                                                           onActiveAlgorithmChange={this.onActiveAlgorithmChange}/></TabPane>
                                    <TabPane tab={intl.get('monitoring configuration')} key="3"><Configuration user={Reflux.GlobalState.authStore.User}
                                                                               updateCount={updateCount}
                                                                               switchToExperiment={this.switchToExperiment}
                                                                               plantInfo={plantInfo}
                                                                               activeAlgorithmId={activeAlgorithmId}
                                                                               configurationId={configurationId}/></TabPane>
                                    <TabPane tab={intl.get('monitoring interface')} key="4"><Experiment isFullControl={isFullControl}
                                                                            user={Reflux.GlobalState.authStore.User}
                                                                            signalParas={signalParas}
                                                                            onConfigurationChange={this.onConfigurationChange}
                                                                            plantInfo={plantInfo} activeAlgorithmId={activeAlgorithmId}
                                                                            setLastErrorAlgorithmId={this.setLastErrorAlgorithmId}
                                                                            configurationId={configurationId}/></TabPane>
                                </Tabs>
                            );
                        }
                    })()
                }

                <Drawer
                    title="聊天室"
                    placement="right"
                    closable={false}
                    onClose={this.onDialogClose}
                    visible={this.state.dialogVisible}
                >
                </Drawer>

            </div>
        )
    }
}


export default PlantDetail;
