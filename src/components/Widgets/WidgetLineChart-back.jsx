//依赖类
import React from 'react';
import Reflux from 'reflux';
import { Spin, Card, Col,Row, InputNumber, Form, Select, Divider, Icon, Button, Modal, Input } from 'antd';
import ReactEchartsCore from 'echarts-for-react/lib/core';
import echarts from 'echarts/lib/echarts';
import 'echarts/lib/chart/line';

//组件类
import {formItemLayoutInModal} from 'components/layout';

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
    return {
      grid:{
        top: "10%",
        bottom: "10%"
      },
      xAxis: {
          type: 'category',
          data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
      },
      yAxis: {
          type: 'value'
      },
      series: [{
          data: [820, 932, 901, 934, 1290, 1330, 1320],
          type: 'line'
      }]
    };
  }

  render(){
    const { modalVisible } = this.state;
    const { params, keyValue, monitor } = this.props;
    const title = monitor ? params?.title : "曲线图";

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
      dynamicParams: props.modalFormData?.params || []
    }
  }

  handleSubmit = (e) => {
    e.preventDefault();

    this.props.form.validateFields((err, formData) => {
      if (!err) {
        this.setState({
          dynamicParams: formData.params
        })
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

  dynamicAddParams = () => {
    const { getFieldDecorator } = this.props.form;
    const { dynamicParams } = this.state;
    const formItems = dynamicParams.map((item, k) => {
      return (
        <Row key={k} className="dynamic-add-row">
          <Col span={8} offset={2}>
            <FormItem required={false}>
              {getFieldDecorator(`params[${k}].name`, {
                validateTrigger: "onSubmit",
                rules: [{
                  required: true,
                  message: "请输入关联参数名称",
                }],
                initialValue: item.name || ""
              })(
                <Input />
              )}
            </FormItem>
          </Col>
          <Col span={1} className="dynamic-add-symbol">
            <span className="dynamic-add-colon">:</span>
          </Col>
          <Col span={10} className="dynamic-add-params">
            <FormItem required={false}>
              {getFieldDecorator(`params[${k}].path`, {
                validateTrigger: "onSubmit",
                rules: [{
                  required: true,
                  message: "请选择关联参数",
                }],
                initialValue: item.path || ""
              })(
                <Select >
                  <Option value="jack">Jack</Option>
                  <Option value="lucy">Lucy</Option>
                  <Option value="disabled" disabled>Disabled</Option>
                  <Option value="Yiminghe">yiminghe</Option>
                </Select>
              )}
            </FormItem>
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
          <Col span={19} offset={2}>
            <FormItem >
              <Button type="dashed" className="dynamic-add-button" onClick={this.add}>
                <Icon type="plus" /> 增加关联参数
              </Button>
            </FormItem>
          </Col>
        </Row>
      </>
    );
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const { visible, modalFormData } = this.props;

    return (
      <div onMouseDown={ e => e.stopPropagation() }>
        <Modal
          visible={visible}
          title="参数配置"
          onOk={this.handleSubmit}
          onCancel={this.props.hideModal}
          afterClose={this.props.form.resetFields}
          okText="确定"
          cancelText="取消"
        >
          <Form layout="horizontal" hideRequiredMark>
            <FormItem label="名称" {...formItemLayoutInModal}>
              {getFieldDecorator('title', {
                rules: [{
                  required: true,
                  message: '请输入图表名称！'
                }],
                validateTrigger: "onSubmit",
                initialValue: modalFormData?.title || "Default"
              })(
                <Input placeholder="请输入图表名称"  />
              )}
            </FormItem>

            <FormItem label="y轴下限" {...formItemLayoutInModal}>
              {getFieldDecorator('min', {
                initialValue: modalFormData?.min || ""
              })(
                <InputNumber />
              )}
            </FormItem>

            <FormItem label="y轴上限" {...formItemLayoutInModal}>
              {getFieldDecorator('max', {
                initialValue: modalFormData?.max || ""
              })(
                <InputNumber />
              )}
            </FormItem>

            <Divider>图表关联参数</Divider>

            {this.dynamicAddParams()}

          </Form>
        </Modal>
      </div>
    )
  }
}

export default WidgetLineChart;
