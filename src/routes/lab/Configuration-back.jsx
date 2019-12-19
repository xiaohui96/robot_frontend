//依赖类
import React from 'react';
import Reflux from 'reflux';
import { Table, Card, Modal, Form, Select, Switch, Input, InputNumber,Radio, Button, Badge, Tooltip} from 'antd';

//数据流
import AppActions from 'actions/AppActions';
import appStore from 'stores/appStore';

//组件类
import Icon from 'components/Icon';
import {formItemLayoutInModal} from 'components/layout';

//HOC
import withModal from 'HOC/withModal';

// import './Configuration.less';

const FormItem = Form.Item;
const Option = Select.Option;
const Column = Table.Column;

class Configuration extends Reflux.Component {
  constructor(props) {
    super(props);
    this.state = {
      configurationList: props.configuration,
      sigParaList:[]
    }
  }

  render() {
    const {configurationList} = this.state;
    return (
      <Card >
        <Button type="primary" className="add-new" onClick={this.props.onAdd}>新建组态</Button>
        <Table
          showHeader={true}
          dataSource={configurationList?.private}
          onRow={(record) => {
            return {
              onDoubleClick: () => this.props.onEdit(record),
            };
          }}
          rowKey="id"
        >
          <Column title="名称" dataIndex="name"/>
          <Column
            title="操作"
            width={120}
            key="operation"
            render={(record) => (
              <div className="table-operate">
                <Tooltip title="编辑">
                  <a onClick={()=> this.props.onEdit(record)}><Icon iconid="edit"></Icon> </a>
                </Tooltip>
                <Tooltip title="删除">
                  <a onClick={()=> this.props.onDel(record.name, record.id)}><Icon iconid="delete"></Icon> </a>
                </Tooltip>
              </div>
            )}
          />
        </Table>
      </Card>
    )
  }
}

@Form.create()
class ConfigurationModal extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      confirmLoading: false,
    }
  }

  handleSubmit = (e) => {
    e.preventDefault();

    this.props.form.validateFields((err, formData) => {
      if (!err) {
        const { modalFormData } = this.props;
        this.setState({
          confirmLoading: true
        })

        //数据交互完成后回调函数关闭Modal
        const callback = ()=> {
          this.setState({
            confirmLoading: false
          });
          this.props.hideModal();
        };

        if (modalFormData) {
          AdminActions.Cameras.update(formData, modalFormData.id, callback);
        } else {
          AdminActions.Cameras.create(formData, callback)
        }
      }
    });
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const { visible, modalFormData } = this.props;
    const { confirmLoading } = this.state;

    return (
      <Modal
        visible={visible}
        title={modalFormData ? "编辑算法" : "新建算法"}
        maskClosable={true}
        confirmLoading={confirmLoading}
        onOk={this.handleSubmit}
        onCancel={this.props.hideModal}
        afterClose={this.props.form.resetFields}
        okText={modalFormData ? "修改" : "新建"}
        cancelText="取消"
      >
        <Form layout="horizontal" hideRequiredMark>
          <FormItem label="算法名称" {...formItemLayoutInModal}>
            {getFieldDecorator('nameCN', {
              rules: [{
                required: true,
                message: '请输入算法名称！'
              }],
              validateTrigger: "onBlur",
              initialValue: modalFormData?.name || ""
            })(
              <Input placeholder="请输入算法名称" />
            )}
          </FormItem>

          <FormItem label="算法步长" {...formItemLayoutInModal}>
            {getFieldDecorator('stepSize', {
              rules: [{
                required: true,
                message: '请输入算法步长！'
              }],
              validateTrigger: "onBlur",
              initialValue: modalFormData?.stepSize || 320
            })(
              <InputNumber min={0}/>
            )}
          </FormItem>

          <FormItem label="监控包大小" {...formItemLayoutInModal}>
            {getFieldDecorator('stepSize', {
              rules: [{
                required: true,
                message: '请输入算法步长！'
              }],
              validateTrigger: "onBlur",
              initialValue: modalFormData?.stepSize || 320
            })(
              <InputNumber min={0}/>
            )}
          </FormItem>

          <FormItem label="算法类别" {...formItemLayoutInModal}>
            {getFieldDecorator('algorithmType', {
              rules: [{
                required: true,
                message: '请选择算法类别！'
              }],
              initialValue: modalFormData?.algorithmType || 1
            })(
              <Select>
                <Option value={1}>本地仿真控制</Option>
                <Option value={2}>本地实物控制</Option>
                <Option value={3}>网络化仿真控制</Option>
                <Option value={4}>网络化实物控制</Option>
              </Select>
            )}
          </FormItem>

          <FormItem label="编译目标平台" {...formItemLayoutInModal}>
            {getFieldDecorator('targetPlatform', {
              rules: [{
                required: true,
                message: '请选择编译目标平台！'
              }],
              initialValue: modalFormData?.targetPlatform || 1
            })(
              <Select>
                <Option value={1}>ARM9</Option>
              </Select>
            )}
          </FormItem>

          <FormItem label="是否共享" {...formItemLayoutInModal}>
            {getFieldDecorator('public', {
              valuePropName: 'checked',
              initialValue: modalFormData?.public ? Boolean(modalFormData?.public) : true
            })(
              <Switch checkedChildren="是" unCheckedChildren="否"/>
            )}
          </FormItem>

        </Form>
      </Modal>
    )
  }
}

export default withModal(AppActions.Configurations, ConfigurationModal)(Configuration);
