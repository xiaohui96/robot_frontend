//依赖类
import React from 'react';
import Reflux from 'reflux';
import { Spin, Card, Col,Row, InputNumber, Form, Select, Divider, Icon, Button, Modal, Input } from 'antd';
import ReactEchartsCore from 'echarts-for-react/lib/core';
import echarts from 'echarts/lib/echarts';
import 'echarts/lib/chart/gauge';

//组件类
import {formItemLayoutInModal} from 'components/layout';
import Model from 'routes/lab/Model';
import ModelBase from 'components/Widgets/Models/ModelBase'

//样式类
import './Widget.less'
import intl from 'react-intl-universal';

const FormItem = Form.Item;
const Option = Select.Option;
const InputGroup = Input.Group;

class Widget3DModel extends React.Component {
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

  render(){
    const { modalVisible } = this.state;
    const { params, keyValue, monitor,plantInfo,signalParaList,dataPool } = this.props;
    const title = monitor ? params?.title : intl.get('3DModel');

    //console.log(dataPool);

    return (
      <Card title={title || " "} onDoubleClick={this.onEdit} className="widget-3d-model">
        {/*<Model modelPath="BallBeamSystem"/>*/}
        <ModelBase params={params} monitor={monitor} plantInfo={plantInfo} signalParaList={signalParaList}dataPool={dataPool} onParamsConfig={this.props.onParamsConfig} keyValue={keyValue}/>
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
            <FormItem label={intl.get('name')}{...formItemLayoutInModal}>
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

            <FormItem label={intl.get('param name')} {...formItemLayoutInModal}>
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

            <FormItem label={intl.get('parameter')}{...formItemLayoutInModal}>
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

            <FormItem label={intl.get('lower limit')} {...formItemLayoutInModal}>
              {getFieldDecorator('min', {
                initialValue: modalFormData?.min || ""
              })(
                <InputNumber />
              )}
            </FormItem>

            <FormItem label={intl.get('upper limit')} {...formItemLayoutInModal}>
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

export default Widget3DModel;
