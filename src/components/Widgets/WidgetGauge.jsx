//依赖类
import React from 'react';
import Reflux from 'reflux';
import { Spin, Card, Col,Row, InputNumber, Form, Select, Divider, Icon, Button, Modal, Input } from 'antd';
import ReactEchartsCore from 'echarts-for-react/lib/core';
import echarts from 'echarts/lib/echarts';
import 'echarts/lib/chart/gauge';

//组件类
import {formItemLayoutInModal} from 'components/layout';

import TreeModal from './TreeModal';

//样式类
import './Widget.less'

import intl from 'react-intl-universal';

const FormItem = Form.Item;
const Option = Select.Option;
const InputGroup = Input.Group;

const DEFAULT_MIN=0;
const DEFAULT_MAX=100;

class WidgetGauge extends  Reflux.Component {
  constructor(props){
    super(props);
    this.state = {
      modalVisible: false,
      selected: undefined,
    }
      // this.currentTime=0;
      this.value='';
      this.init=true;
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

    onSelected=(signalPara)=>{
        const {onParamsConfig,keyValue}=this.props;
        onParamsConfig({
            params:signalPara,
            key:keyValue
        });
        this.setState({
            selected:signalPara
        });
    }

    getCurrentValue=()=>{
        const { params, keyValue, monitor, signalParaList,dataPool } = this.props;
        //console.log(params.pos);
        if(params){
            return dataPool.getCurrentValueByPos(params.pos);
        }
        else{
            return '';
        }
    }

  getOption = () => {
      const {dataPool, params, monitor} = this.props;
      // console.log(params.min);


      if (monitor && dataPool && params) {
          return {
              tooltip: {
                  formatter: "{a} <br/>{b} : {c}%"
              },
              toolbox: {
                  feature: {
                      restore: {},
                      saveAsImage: {}
                  }
              },
              series:[
                  {   name: '1',
                      type: 'gauge',
                      data: [{value:Math.round(this.getCurrentValue()*100)/100,name:params.sig.name}],
                      min:params.min,
                      max:params.max,
                      title: {				// 仪表盘标题。
                          show: true,				// 是否显示标题,默认 true。
                          offsetCenter: [0,"100%"],//相对于仪表盘中心的偏移位置，数组第一项是水平方向的偏移，第二项是垂直方向的偏移。可以是绝对的数值，也可以是相对于仪表盘半径的百分比。
                          fontSize: 20,			// 文字的字体大小,默认 15。
                      },
                      detail:{
                          offsetCenter: [0,"70%"],
                          color:"#333",
                      },
                      axisLine: {				// 仪表盘轴线(轮廓线)相关配置。
                          show: true,				// 是否显示仪表盘轴线(轮廓线),默认 true。
                          lineStyle: {			// 仪表盘轴线样式。
                              color: [[0.2, '#91d5ff'], [0.8, '#40a9ff'], [1, '#096dd9']], 	//仪表盘的轴线可以被分成不同颜色的多段。每段的  结束位置(范围是[0,1]) 和  颜色  可以通过一个数组来表示。默认取值：[[0.2, '#91c7ae'], [0.8, '#63869e'], [1, '#c23531']]
                              opacity: 1,					//图形透明度。支持从 0 到 1 的数字，为 0 时不绘制该图形。
                              width: 30,					//轴线宽度,默认 30。
                              shadowBlur: 20,				//(发光效果)图形阴影的模糊大小。该属性配合 shadowColor,shadowOffsetX, shadowOffsetY 一起设置图形的阴影效果。
                              shadowColor: "#fff",		//阴影颜色。支持的格式同color。
                          }
                      },
                      splitLine: {			// 分隔线样式。
                          show: true,				// 是否显示分隔线,默认 true。
                          length: 30,				// 分隔线线长。支持相对半径的百分比,默认 30。
                          lineStyle: {			// 分隔线样式。
                              color: "#eee",				//线的颜色,默认 #eee。
                              opacity: 1,					//图形透明度。支持从 0 到 1 的数字，为 0 时不绘制该图形。
                              width: 2,					//线度,默认 2。
                              type: "solid",				//线的类型,默认 solid。 此外还有 dashed,dotted
                              shadowBlur: 10,				//(发光效果)图形阴影的模糊大小。该属性配合 shadowColor,shadowOffsetX, shadowOffsetY 一起设置图形的阴影效果。
                              shadowColor: "#fff",		//阴影颜色。支持的格式同color。
                          }
                      },
                      axisTick: {				// 刻度(线)样式。
                          show: true,				// 是否显示刻度(线),默认 true。
                          splitNumber: 5,			// 分隔线之间分割的刻度数,默认 5。
                          length: 8,				// 刻度线长。支持相对半径的百分比,默认 8。
                          lineStyle: {			// 刻度线样式。
                              color: "#003a8c",				//线的颜色,默认 #eee。
                              opacity: 1,					//图形透明度。支持从 0 到 1 的数字，为 0 时不绘制该图形。
                              width: 1,					//线度,默认 1。
                              type: "solid",				//线的类型,默认 solid。 此外还有 dashed,dotted
                              shadowBlur: 10,				//(发光效果)图形阴影的模糊大小。该属性配合 shadowColor,shadowOffsetX, shadowOffsetY 一起设置图形的阴影效果。
                              shadowColor: "#fff",		//阴影颜色。支持的格式同color。
                          },
                      },
                      itemStyle: {			// 仪表盘指针样式。
                          color: "auto",			// 指针颜色，默认(auto)取数值所在的区间的颜色
                          opacity: 1,				// 图形透明度。支持从 0 到 1 的数字，为 0 时不绘制该图形。
                          borderWidth: 0.5,			// 描边线宽,默认 0。为 0 时无描边。
                          borderType: "solid",	// 柱条的描边类型，默认为实线，支持 'solid', 'dashed', 'dotted'。
                          borderColor: "#000",	// 图形的描边颜色,默认 "#000"。支持的颜色格式同 color，不支持回调函数。
                          shadowBlur: 10,			// (发光效果)图形阴影的模糊大小。该属性配合 shadowColor,shadowOffsetX, shadowOffsetY 一起设置图形的阴影效果。
                          shadowColor: "#fff",	// 阴影颜色。支持的格式同color。
                      },
                  }
                  ]
          };

      }
      return {
          tooltip: {
              formatter: "{a} <br/>{b} : {c}%"
          },
          toolbox: {
              feature: {
                  restore: {},
                  saveAsImage: {}
              }
          },
          series: [
              {
                  name: '2',
                  type: 'gauge',
                  data: [{value:0, }],
                  min: 0,
                  max: 100,
                  detail:{
                      formatter: '{value}',
                      offsetCenter: [0,"70%"],
                      color:"#333",
                  },
                  axisLine: {				// 仪表盘轴线(轮廓线)相关配置。
                      show: true,				// 是否显示仪表盘轴线(轮廓线),默认 true。
                      lineStyle: {			// 仪表盘轴线样式。
                          color: [[0.2, '#91d5ff'], [0.8, '#40a9ff'], [1, '#096dd9']], 	//仪表盘的轴线可以被分成不同颜色的多段。每段的  结束位置(范围是[0,1]) 和  颜色  可以通过一个数组来表示。默认取值：[[0.2, '#91c7ae'], [0.8, '#63869e'], [1, '#c23531']]
                          opacity: 1,					//图形透明度。支持从 0 到 1 的数字，为 0 时不绘制该图形。
                          width: 30,					//轴线宽度,默认 30。
                          shadowBlur: 20,				//(发光效果)图形阴影的模糊大小。该属性配合 shadowColor,shadowOffsetX, shadowOffsetY 一起设置图形的阴影效果。
                          shadowColor: "#fff",		//阴影颜色。支持的格式同color。
                      }
                  },
                  axisTick: {				// 刻度(线)样式。
                      show: true,				// 是否显示刻度(线),默认 true。
                      splitNumber: 5,			// 分隔线之间分割的刻度数,默认 5。
                      length: 8,				// 刻度线长。支持相对半径的百分比,默认 8。
                      lineStyle: {			// 刻度线样式。
                          color: "#003a8c",				//线的颜色,默认 #eee。
                          opacity: 1,					//图形透明度。支持从 0 到 1 的数字，为 0 时不绘制该图形。
                          width: 1,					//线度,默认 1。
                          type: "solid",				//线的类型,默认 solid。 此外还有 dashed,dotted
                          shadowBlur: 10,				//(发光效果)图形阴影的模糊大小。该属性配合 shadowColor,shadowOffsetX, shadowOffsetY 一起设置图形的阴影效果。
                          shadowColor: "#fff",		//阴影颜色。支持的格式同color。
                      },
                  },
                  splitLine: {			// 分隔线样式。
                      show: true,				// 是否显示分隔线,默认 true。
                      length: 30,				// 分隔线线长。支持相对半径的百分比,默认 30。
                      lineStyle: {			// 分隔线样式。
                          color: "#eee",				//线的颜色,默认 #eee。
                          opacity: 1,					//图形透明度。支持从 0 到 1 的数字，为 0 时不绘制该图形。
                          width: 2,					//线度,默认 2。
                          type: "solid",				//线的类型,默认 solid。 此外还有 dashed,dotted
                          shadowBlur: 10,				//(发光效果)图形阴影的模糊大小。该属性配合 shadowColor,shadowOffsetX, shadowOffsetY 一起设置图形的阴影效果。
                          shadowColor: "#fff",		//阴影颜色。支持的格式同color。
                      }
                  },
                  itemStyle: {			// 仪表盘指针样式。
                      color: "auto",			// 指针颜色，默认(auto)取数值所在的区间的颜色
                      opacity: 1,				// 图形透明度。支持从 0 到 1 的数字，为 0 时不绘制该图形。
                      borderWidth: 0.5,			// 描边线宽,默认 0。为 0 时无描边。
                      borderType: "solid",	// 柱条的描边类型，默认为实线，支持 'solid', 'dashed', 'dotted'。
                      borderColor: "#000",	// 图形的描边颜色,默认 "#000"。支持的颜色格式同 color，不支持回调函数。
                      shadowBlur: 10,			// (发光效果)图形阴影的模糊大小。该属性配合 shadowColor,shadowOffsetX, shadowOffsetY 一起设置图形的阴影效果。
                      shadowColor: "#fff",	// 阴影颜色。支持的格式同color。
                  },

              }
          ]
      };
  }


  render(){
    const { modalVisible} = this.state;
    const { params, keyValue, monitor, signalParaList,dataPool  } = this.props;
    const title = monitor ? params?.title : intl.get('gauge');
    return (
      <Card title={title || intl.get('gauge')} onDoubleClick={this.onEdit}>
        <ReactEchartsCore
          echarts={echarts}
          style={{
            height:"100%",
            width:"100%"
          }}
          option={this.getOption()}
        />
        <WidgetModal signalParaList={signalParaList} visible={modalVisible} hideModal={this.hideModal} keyValue={keyValue}  params={params} onParamsConfig={this.props.onParamsConfig}/>
      </Card>

    )
  }
}

@Form.create()
class WidgetModal extends React.Component {
  constructor(props){
    super(props);
    this.state = {
        treeVisible:false,
        selected:props.params,

    }
  }

  handleSubmit = (e) => {
    e.preventDefault();

    this.props.form.validateFields((err, formData) => {
        const {selected}=this.state;
      if (!err) {
          // console.log(formData);
          selected.min=formData.min;
          selected.max=formData.max;
        this.props.onParamsConfig({
          key: this.props.keyValue,
          params: this.state.selected
        });
        this.props.hideModal();
          console.log(this.state.selected);
              // min:this.props.form.getFieldValue('min');
              // max:this.props.form.getFieldValue('max');

      }
    });
  }

    onSignalParaSelected=(signalPara)=>{
        //const {onSelected}=this.props;
        //onSelected(signalPara);

        console.log(signalPara);
        this.setState({
            treeVisible:false,
            selected:signalPara
        });

    }

  render() {
    const { getFieldDecorator } = this.props.form;
    const { visible, params,signalParaList} = this.props;
    const {treeVisible,selected}=this.state;
    // console.log(min);

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
            <FormItem label={intl.get('name')} {...formItemLayoutInModal}>
              {getFieldDecorator('title', {
                rules: [{
                  required: true,
                  message: intl.get('chart name tip')
                }],
                validateTrigger: "onSubmit",
                initialValue: params?.title || "Default"
              })(
                <Input placeholder={intl.get('chart name tip')} />
              )}
            </FormItem>

              <FormItem label={intl.get('upper limit')} {...formItemLayoutInModal}>
                  {getFieldDecorator('max', {
                      initialValue: params?.max || DEFAULT_MAX
                  })(
                      <InputNumber />
                      )}
              </FormItem>

            <FormItem label={intl.get('lower limit')} {...formItemLayoutInModal}>
              {getFieldDecorator('min', {
                initialValue: params?.min || DEFAULT_MIN
              })(
                <InputNumber />
              )}
            </FormItem>

              <Divider>{intl.get('link params')}</Divider>

              <FormItem label={intl.get('name')} {...formItemLayoutInModal} >

                  <Input value={selected?.sig?.name}  readOnly />

              </FormItem>

              <FormItem label={intl.get('path')} {...formItemLayoutInModal}>
                  <Input value={selected?.sig?.path} readOnly />
              </FormItem>
          </Form>
            <Button onClick={()=>{this.setState({treeVisible:true})}}>{intl.get('select params')}</Button>
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

export default WidgetGauge;
