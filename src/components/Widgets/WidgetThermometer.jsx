//依赖类
import React from 'react';
import Reflux from 'reflux';
import { Spin, Card, Col,Row, InputNumber, Form, Select, Divider, Icon, Button, Modal, Input } from 'antd';
import ReactEchartsCore from 'echarts-for-react/lib/core';
import echarts from 'echarts/lib/echarts';
import 'echarts/lib/chart/bar';
import 'echarts/lib/chart/scatter';

//组件类
import {formItemLayoutInModal} from 'components/layout';

//样式类
import './Widget.less'
import intl from 'react-intl-universal';

const FormItem = Form.Item;
const Option = Select.Option;
const InputGroup = Input.Group;

class WidgetThermometer extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      modalVisible: false,
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
    var value = 41.0;
    var kd = [];
    // 刻度使用柱状图模拟，短设置3，长的设置5；构造一个数据
    for (var i = 0, len = 130; i <= len; i++) {
        if (i > 100 || i < 30) {
            kd.push('0')
        } else {
            if (i % 5 === 0) {
                kd.push('50');
            } else {
                kd.push('30');
            }
        }

    }
    // console.log(kd)
    // 因为柱状初始化为0，温度存在负值，所以，原本的0-100，改为0-130，0-30用于表示负值
    function getData(value) {
        return [value + 30];
    }
    var data = getData(value);
    var mercuryColor = '#fd4d49';
    var borderColor = '#fd4d49';

    const option = {
        title: {
            text: '温度计',
            show: false
        },
        yAxis: [{
            show: false,
            min: 0,
            max: 130,
        }, {
            show: false,
            data: [],
            min: 0,
            max: 130,
        }],
        xAxis: [{
            show: false,
            data: []
        }, {
            show: false,
            data: []
        }, {
            show: false,
            data: []
        }, {
            show: false,
            min: -160,
            max: 100,

        }],
        series: [{
            name: '条',
            type: 'bar',
            // 对应上面XAxis的第一个对象配置
            xAxisIndex: 0,
            data: data,
            barWidth: 18,
            itemStyle: {
                normal: {
                    color: mercuryColor,
                    barBorderRadius: 0,
                }
            },
            label: {
                normal: {
                    show: true,
                    position: 'top',
                    formatter: function(param) {
                        // 因为柱状初始化为0，温度存在负值，所以，原本的0-100，改为0-130，0-30用于表示负值
                        return param.value - 30 + '°C';
                    },
                    textStyle: {
                        color: '#ccc',
                        fontSize: '10',
                    }
                }
            },
            z: 2
        }, {
            name: '白框',
            type: 'bar',
            xAxisIndex: 1,
            barGap: '-100%',
            data: [128],
            barWidth: 28,
            itemStyle: {
                normal: {
                    color: '#ffffff',
                    barBorderRadius: 50,
                }
            },
            z: 1
        }, {
            name: '外框',
            type: 'bar',
            xAxisIndex: 2,
            barGap: '-100%',
            data: [130],
            barWidth: 38,
            itemStyle: {
                normal: {
                    color: borderColor,
                    barBorderRadius: 50,
                }
            },
            z: 0
        }, {
            name: '圆',
            type: 'scatter',
            hoverAnimation: false,
            data: [0],
            xAxisIndex: 0,
            symbolSize: 48,
            itemStyle: {
                normal: {
                    color: mercuryColor,
                    opacity: 1,
                }
            },
            z: 2
        }, {
            name: '白圆',
            type: 'scatter',
            hoverAnimation: false,
            data: [0],
            xAxisIndex: 1,
            symbolSize: 60,
            itemStyle: {
                normal: {
                    color: '#ffffff',
                    opacity: 1,
                }
            },
            z: 1
        }, {
            name: '外圆',
            type: 'scatter',
            hoverAnimation: false,
            data: [0],
            xAxisIndex: 2,
            symbolSize: 70,
            itemStyle: {
                normal: {
                    color: borderColor,
                    opacity: 1,
                }
            },
            z: 0
        }, {
            name: '刻度',
            type: 'bar',
            yAxisIndex: 1,
            xAxisIndex: 3,
            label: {
                normal: {
                    show: true,
                    position: 'right',
                    distance: 10,
                    color: '#525252',
                    fontSize: 12,
                    formatter: function(params) {
                        // 因为柱状初始化为0，温度存在负值，所以，原本的0-100，改为0-130，0-30用于表示负值
                        if (params.dataIndex > 100 || params.dataIndex < 30) {
                            return '';
                        } else {
                            if (params.dataIndex % 5 === 0) {
                                return params.dataIndex - 30;
                            } else {
                                return '';
                            }
                        }
                    }
                }
            },
            barGap: '-100%',
            data: kd,
            barWidth: 1,
            itemStyle: {
                normal: {
                    color: borderColor,
                    barBorderRadius: 10,
                }
            },
            z: 0
        }]
    };

    return option;

  }

  render(){
    const { modalVisible } = this.state;
    const { params, keyValue, monitor } = this.props;
    const title = monitor ? params?.title : intl.get('thermometer');

    return (
      <Card title={title || " "} onDoubleClick={this.onEdit}>
        <ReactEchartsCore
          echarts={echarts}
          style={{
            height:"100%",
            width:"100%"
          }}
          option={this.getOption()}
        />
        <WidgetModal visible={modalVisible} hideModal={this.hideModal} keyValue={keyValue} modalFormData={params} onParamsConfig={this.props.onParamsConfig}/>
      </Card>

    )
  }
}

@Form.create()
class WidgetModal extends React.Component {
  constructor(props){
    super(props);
    this.state = {
    }
  }

  handleSubmit = (e) => {
    e.preventDefault();

    this.props.form.validateFields((err, formData) => {
      if (!err) {
        this.props.onParamsConfig({
          key: this.props.keyValue,
          params: formData
        });
        this.props.hideModal();
      }
    });
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const { visible, modalFormData } = this.props;

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
                initialValue: modalFormData?.title || ""
              })(
                <Input placeholder={intl.get('chart name tip')} />
              )}
            </FormItem>

            <FormItem label={intl.get('param name')}{...formItemLayoutInModal}>
              {getFieldDecorator('name', {
                rules: [{
                  required: true,
                  message: intl.get('input name tip')
                }],
                validateTrigger: "onSubmit",
                initialValue: modalFormData?.name || ""
              })(
                <Input placeholder={intl.get('input name tip')} />
              )}
            </FormItem>

            <FormItem label={intl.get('parameter')} {...formItemLayoutInModal}>
              {getFieldDecorator('param', {
                rules: [{
                  required: true,
                  message: intl.get('select params tip')
                }],
                validateTrigger: "onSubmit",
                initialValue: modalFormData?.param || ""
              })(
                <Select >
                  <Option value="jack">Jack</Option>
                  <Option value="ulucy">Lucy</Option>
                  <Option value="disabled">Disabled</Option>
                  <Option value="Yiminghe">yiminghe</Option>
                </Select>
              )}
            </FormItem>

            <FormItem label={intl.get('temperature lower limit')} {...formItemLayoutInModal}>
              {getFieldDecorator('min', {
                initialValue: modalFormData?.min || ""
              })(
                <InputNumber />
              )}
            </FormItem>

            <FormItem label={intl.get('temperature upper limit')} {...formItemLayoutInModal}>
              {getFieldDecorator('max', {
                initialValue: modalFormData?.max || ""
              })(
                <InputNumber />
              )}
            </FormItem>

          </Form>
        </Modal>
      </div>
    )
  }
}

export default WidgetThermometer;
