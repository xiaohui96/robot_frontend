//依赖类
import React from 'react';
import Reflux from 'reflux';
import { Tooltip,Spin, Card, Col,Row, InputNumber, Form, Select, Divider, Icon, Button, Modal, Input } from 'antd';
import ReactEchartsCore from 'echarts-for-react/lib/core';
import echarts from 'echarts/lib/echarts';
import 'echarts/lib/chart/line';
import 'echarts/lib/component/legend';
import 'echarts/lib/component/toolbox';
import 'echarts/lib/component/dataZoom';
//组件类
import {formItemLayoutInModal} from 'components/layout';

import TreeModal from './TreeModal';

import intl from 'react-intl-universal';

//样式类
import './Widget.less'

const FormItem = Form.Item;
const Option = Select.Option;
const InputGroup = Input.Group;

class WidgetLineChart extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      modalVisible: false,
    }
    this.currentTime=0;
  }

  shouldComponentUpdate(nextProps, nextState){
      const {dataPool,monitor,pause}=nextProps;

      if(monitor==false){
          return true;
      }
      if(pause==true){
          // console.log(pause);
          return false;
      }
      if(monitor&&dataPool.getCurrentTime()-this.currentTime>=1){
          this.currentTime=dataPool.getCurrentTime();
          return true;
      }
      else{
          return false;
      }
  }

  onEdit = (e)=>{
    if(this.props.monitor == false){
      this.setState({
        modalVisible: true
      })
    }
  }

  hideModal = () => {
    this.setState({
      modalVisible: false
    })
  }

  getOption = () => {
    const {dataPool,params,monitor}=this.props;
    if(monitor&&dataPool&&params){


        const dataSet=dataPool.getDataByParams(params.params,params?.range || 10);
        //this.dataSet=dataSet;
        //console.log(dataSet);

        var series=[];
        dataSet.forEach(data=>{
            var serie={
                data:data,
                type:'line',
                showSymbol : false
            };
            series.push(serie);
        });

        var legend=[];
        var i=0;
        params.params.forEach(param=>{
            legend.push(param.sig.name);
            series[i].name=param.sig.name;
            i++;
        });
        //console.log(legend);
        //console.log(series);
        return {
            animation:false,
            grid:{
                top: "10%",
                bottom: "10%"
            },
            legend:{
                show:true,
                data:legend
            },
            // dataZoom: {
            //         type: 'slider',
            //         show: true,
            //         xAxisIndex: [0],
            //     },
            toolbox: {
                show: true,
                feature: {
                    dataZoom: {
                    },
                    saveAsImage: {},
                }
            },
            xAxis: {
                type: 'value',
                min: this.currentTime>params.range ? this.currentTime-params.range :0 ,
                max: this.currentTime>params.range ? this.currentTime: params.range ,
            },
            yAxis: {
                type: 'value'
            },
            series:series
        };
    }
    return {
      grid:{
        top: "10%",
        bottom: "10%"
      },
      legend:{
        data:['1','2']
      },
        toolbox: {
            show: true,
            feature: {
                dataZoom: {
                    yAxisIndex: 'none'
                },
                saveAsImage: {}
            }
        },
      xAxis: {
          type: 'value',
      },
      yAxis: {
          type: 'value'
      },
      series: [{
          data: [[100,820], [200,932], [300,901], [400,934], [500,1290], [600,1330], [700,1320]],
          type: 'line',
          name:'1'
      },
          {
          data: [[100,720], [200,632], [300,901], [400,934], [500,1290], [600,1330], [700,1000]],
          type: 'line',
          name:'2'
        }
      ]
    };
  }

  getPackedData=(dataSet)=>{
      const {params}=this.props;
      var data="";
      data+="time\t";

      params.params.forEach(param=>{
          data+=(param.sig.name)+"\t";
      });
      data+="\n";

      dataSet.forEach((sigs)=>{
          sigs.forEach((sig)=>{
              data+=sig+"\t";
          });
          data+="\n";
      });

      return data;
  }

  downloadData=()=>{
      const {dataPool,params}=this.props;
      console.log("downloadData");

      //var content=this.getPackedData();
      var dataSet=dataPool.getPackedDataByParams(params.params,params?.range || 10);
      var content=this.getPackedData(dataSet);
      //console.log(content);
      var aLink = document.createElement('a');
      var blob = new Blob([content]);
      //var evt = document.createEvent("HTMLEvents");
      //evt.initEvent("click", false, false);//initEvent 不加后两个参数在FF下会报错, 感谢 Barret Lee 的反馈
      aLink.download = "data.txt";
      aLink.href = URL.createObjectURL(blob);
      aLink.click();

      /*var link = document.createElement("a");
      link.download = "Hello";
      link.href = "Hello";
      link.click();*/
  }

  render(){
    const { modalVisible } = this.state;
    //add user props
    const { params, keyValue, monitor, signalParaList,dataPool,pause, user } = this.props;
    const monitorTitle =  "chart-"+user.account+":"+user.realname+"-"+(new Date()).toLocaleString()
    const title = monitor ? monitorTitle : intl.get('chart');

    //console.log(params);

    return (
      <Card
          title={title?<div >{monitor?<a onClick={this.downloadData}><Tooltip title={intl.get('download data')}><Icon type="file" /></Tooltip></a>:null}<span>{title}</span></div>:""}
          onDoubleClick={this.onEdit}
      >
        <ReactEchartsCore
          echarts={echarts}
          style={{
            height:"100%",
            width:"100%"
          }}
          option={this.getOption()}
        />
        <WidgetModal signalParaList={signalParaList} visible={modalVisible} hideModal={this.hideModal} keyValue={keyValue} params={params} onParamsConfig={this.props.onParamsConfig} user={user}/>
      </Card>

    )
  }
}

@Form.create()
class WidgetModal extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      dynamicParams: props.params?.params || [],
        treeVisible:false
    }
  }

  handleSubmit = (e) => {
    e.preventDefault();

    this.props.form.validateFields((err, formData) => {
      if (!err) {
        console.log("formData:");
        console.log(formData);
        /*
        this.setState({
          dynamicParams: formData.params
        })*/
        formData.params=this.state.dynamicParams;
        this.props.onParamsConfig({
          key: this.props.keyValue,
          params: formData
        });
        this.props.hideModal();
      }
    });
  }

  remove = (k) => {
    this.setState(prevState => ({
      dynamicParams: prevState.dynamicParams.filter( (item, index) => index != k)
    }))
  }

  add = () => {
    this.setState(prevState => ({
      dynamicParams: prevState.dynamicParams.concat({})
    }))
  }

  edit =(k) => {
      this.setState({
          treeVisible:true,
          paramK:k
      });
  }
  onSignalParaSelected=(signalPara)=>{
      const k=this.state.paramK;
      const { dynamicParams } = this.state;
      dynamicParams[k]=signalPara;
      this.setState({
          treeVisible:false,
          paramK:undefined,
          dynamicParams:dynamicParams
      });
  }

  dynamicAddParams = () => {
    const { getFieldDecorator } = this.props.form;
    const { dynamicParams } = this.state;

    //console.log(dynamicParams);

    const formItems = dynamicParams.map((item, k) => {
      return (
        <Row key={k} className="dynamic-add-row">
          <Col span={8} offset={2}>
            <FormItem required={false}>
              {getFieldDecorator(`params[${k}].name`, {
                validateTrigger: "onSubmit",
                rules: [{
                  required: true,
                  message: intl.get('input name tip'),
                }],
                initialValue: item?.sig?.name || ""
              })(
                <Input />
              )}
            </FormItem>
          </Col>
          <Col span={1} className="dynamic-add-symbol">
            <span className="dynamic-add-colon">:</span>
          </Col>
          <Col span={8} className="dynamic-add-params">
            <FormItem required={false}>
              {getFieldDecorator(`params[${k}].path`, {
                validateTrigger: "onSubmit",
                rules: [{
                  required: true,
                  message: intl.get('select params tip'),
                }],
                initialValue: item?.sig?.path || ""
              })(
                  <Input />
              )}
            </FormItem>
          </Col>
          <Col span={2} className="dynamic-add-symbol">

            <Icon
              className="dynamic-delete-button"
              type="edit-o"
              onClick={() => this.edit(k)}
            />
          </Col>
          <Col span={2} className="dynamic-add-symbol">
            <Icon
                className="dynamic-delete-button"
                type="minus-circle-o"
                onClick={() => this.remove(k)}
            />
          </Col>

        </Row>
      );
    });
    return (
      <>
        {formItems}
        <Row>
          <Col span={17} offset={2}>
            <FormItem >
              <Button type="dashed" className="dynamic-add-button" onClick={this.add}>
                <Icon type="plus" /> {intl.get('add linked parameters')}
              </Button>
            </FormItem>
          </Col>
        </Row>
      </>
    );
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const { visible, params,signalParaList} = this.props;
    const {treeVisible}=this.state;

    return (
      <div onMouseDown={ e => e.stopPropagation() }>
        <Modal
          visible={visible}
          title={intl.get('parameter config')}
          onOk={this.handleSubmit}
          onCancel={this.props.hideModal}
          afterClose={this.props.form.resetFields}
          okText={intl.get('ok')}
          cancelText={intl.get('cancel')}
        >
          <Form layout="horizontal" hideRequiredMark>
            <FormItem label={intl.get('name')}  {...formItemLayoutInModal}>
              {getFieldDecorator('title', {
                rules: [{
                  required: true,
                  message: intl.get('chart name tip')
                }],
                validateTrigger: "onSubmit",
                initialValue: params?.title || "Default"
              })(
                <Input placeholder={intl.get('chart name tip')}  />
              )}
            </FormItem>

            <FormItem label={intl.get('y lower limit')} {...formItemLayoutInModal}>
              {getFieldDecorator('min', {
                initialValue: params?.min || ""
              })(
                <InputNumber />
              )}
            </FormItem>

            <FormItem label={intl.get('y upper limit')} {...formItemLayoutInModal}>
              {getFieldDecorator('max', {
                initialValue: params?.max || ""
              })(
                <InputNumber />
              )}
            </FormItem>


              <FormItem label={intl.get('x range')} {...formItemLayoutInModal}>
                  {getFieldDecorator('range', {
                      initialValue: params?.range || 10
                  })(
                      <InputNumber />
                      )}
              </FormItem>



            <Divider>{intl.get('chart linked parameter')}</Divider>

            {this.dynamicAddParams()}

          </Form>
          <TreeModal
              visible={treeVisible}
              hideModal={()=>{this.setState({treeVisible:false})}}
              signalParaList={signalParaList}
              paraOnly={false}
              onSignalParaSelected={this.onSignalParaSelected}
          />
        </Modal>
      </div>
    )
  }
}

export default WidgetLineChart;
