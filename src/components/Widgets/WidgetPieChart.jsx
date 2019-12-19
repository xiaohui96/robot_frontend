//依赖类
import React from 'react';
import Reflux from 'reflux';
import { Spin, Card, Col,Row, InputNumber, Form, Select, Divider, Icon, Button, Modal, Input } from 'antd';
import ReactEchartsCore from 'echarts-for-react/lib/core';
import echarts from 'echarts/lib/echarts';
import 'echarts/lib/chart/pie';

//组件类
import {formItemLayoutInModal} from 'components/layout';

//样式类
import './Widget.less'

const FormItem = Form.Item;
const Option = Select.Option;
const InputGroup = Input.Group;

class WidgetPieChart extends React.Component {
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
      title : {
          text: '某站点用户访问来源',
          subtext: '纯属虚构',
          x:'center'
      },
      tooltip : {
          trigger: 'item',
          formatter: "{a} <br/>{b} : {c} ({d}%)"
      },
      legend: {
          orient: 'vertical',
          left: 'left',
          data: ['直接访问','邮件营销','联盟广告','视频广告','搜索引擎']
      },
      series : [
          {
              name: '访问来源',
              type: 'pie',
              radius : '55%',
              center: ['50%', '50%'],
              data:[
                  {value:335, name:'直接访问'},
                  {value:310, name:'邮件营销'},
                  {value:234, name:'联盟广告'},
                  {value:135, name:'视频广告'},
                  {value:1548, name:'搜索引擎'}
              ],
              itemStyle: {
                  emphasis: {
                      shadowBlur: 10,
                      shadowOffsetX: 0,
                      shadowColor: 'rgba(0, 0, 0, 0.5)'
                  }
              }
          }
      ]
    };
  }

  render(){
    const { modalVisible } = this.state;
    const { params, keyValue, monitor } = this.props;
    const title = monitor ? params?.title : "饼状图";

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
                initialValue: modalFormData?.title || ""
              })(
                <Input placeholder="请输入图表名称" />
              )}
            </FormItem>

            <FormItem label="数据刷新间隔" {...formItemLayoutInModal}>
              {getFieldDecorator('interval', {
                initialValue: modalFormData?.interval || ""
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

export default WidgetPieChart;
