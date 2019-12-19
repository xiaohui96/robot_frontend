//依赖类
import React from 'react';
import Reflux from 'reflux';
import { Spin, Card, Switch, Form, Select, Modal, Input } from 'antd';

//组件类
import {formItemLayoutInModal} from 'components/layout';

import intl from 'react-intl-universal';

const FormItem = Form.Item;
const Option = Select.Option;

class WidgetSwitch extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      modalVisible: false,
    }
  }

  onChange = (e)=>{
    if(this.props.monitor){
      //Actions
    }
    console.log(e);
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
    const { params, keyValue, monitor } = this.props;
    const title = monitor ? params?.title : intl.get('switch');

    return (
      <Card title={title || " "} onDoubleClick={this.onEdit}>
        <Switch onChange={this.onChange}/>
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
                  message: intl.get('input name tip')
                }],
                validateTrigger: "onSubmit",
                initialValue: modalFormData?.title || ""
              })(
                <Input placeholder={intl.get('input name tip')}  />
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
                  <Option value="lucy">Lucy</Option>
                  <Option value="disabled" disabled>Disabled</Option>
                  <Option value="Yiminghe">yiminghe</Option>
                </Select>
              )}
            </FormItem>

          </Form>
        </Modal>
      </div>
    )
  }
}

export default WidgetSwitch;
