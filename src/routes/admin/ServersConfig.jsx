//依赖类
import React from 'react';
import Reflux from 'reflux';
import { Route } from 'react-router-dom';
import { Table, Card, Modal, Form, Select, Switch, Input, InputNumber, Button, Badge, Tooltip} from 'antd';

//数据流
import AdminActions from 'actions/AdminActions';
import serversStore from 'stores/serversStore';

//组件类
import Icon from 'components/Icon';
import {formItemLayoutInModal} from 'components/layout';

//HOC
import withModal from 'HOC/withModal';

// import './ServersConfig.less';

const FormItem = Form.Item;
const Option = Select.Option;
const Column = Table.Column;

class ServersConfig extends Reflux.Component {
  constructor(props) {
    super(props);
    this.store = serversStore;
    this.storeKeys = ['serversList'];
    this.state = {
      serversList:[],
    };
  }

  componentWillMount() {
    super.componentWillMount();
    AdminActions.Servers.retrieve();
  }

  render() {
    const { serversList } = this.state;
    return (
      <Card >
        <Button type="primary" className="add-new" onClick={this.props.onAdd}>新建服务器</Button>
        <Table
          showHeader={true}
          dataSource={serversList}
          pagination={false}
					rowKey="id"
          //x应该大于各列宽度之和加上rowSelection的宽度62px
          //并且留一列不要添加width属性，以自适应屏幕宽度，避免固定列重复
          scroll={{x:1060}}
          onRow={(record) => {
            return {
              onDoubleClick: () => this.props.onEdit(record),
            };
          }}
        >
          <Column
            title="名称"
            dataIndex="name"
            width={200}
            fixed="left"
          />
          <Column
            title="主机"
            dataIndex="host"
            width={200}
          />
          <Column
            title="服务地址"
            dataIndex="webURL"
          />
          <Column
            title="服务器类型"
            dataIndex="type"
            width={120}
            render={(text, record) => {
              switch (text) {
                case 0: return "实验服务器";
                case 1: return "Matlab服务器";
                default: return "未知";
              }
            }}
          />
          <Column
            title="状态"
            width={120}
            dataIndex="statusCode"
            filters={[
              { text: "连接断开", value: 0},
              { text: "连接正常", value: 1},
            ]}
            onFilter={(value, record) => record.statusCode == value}
            render={(statusCode) => {
              switch (statusCode) {
                case 0: return <Badge status={"default"} text={"连接断开"}/>
                case 1: return <Badge status={"success"} text={"连接正常"}/>
                default: return <Badge status={"warning"} text={"未知状态"}/>
              }
            }}
          />
          <Column
            title="操作"
            width={100}
            fixed="right"
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
class ServerModal extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      confirmLoading: false
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
          AdminActions.Servers.update(formData, modalFormData.id, callback);
        } else {
          AdminActions.Servers.create(formData, callback)
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
        title={modalFormData ? "配置服务器" : "新建服务器"}
        maskClosable={true}
        confirmLoading={confirmLoading}
        onOk={this.handleSubmit}
        onCancel={this.props.hideModal}
        afterClose={this.props.form.resetFields}
        okText={modalFormData ? "修改" : "新建"}
        cancelText="取消"
      >
        <Form layout="horizontal" hideRequiredMark>
          <FormItem label="服务器名称" {...formItemLayoutInModal}>
            {getFieldDecorator('name', {
              rules: [{
                required: true,
                message: '请输入服务器名称！'
              }],
              validateTrigger: "onBlur",
              initialValue: modalFormData?.name || ""
            })(
              <Input placeholder="请输入服务器名称" />
            )}
          </FormItem>

          <FormItem label="主机" {...formItemLayoutInModal}>
            {getFieldDecorator('host', {
              rules: [{
                required: true,
                message: '请输入服务器主机！'
              }],
              validateTrigger: "onBlur",
              initialValue: modalFormData?.host || ""
            })(
              <Input placeholder="请输入服务器主机" />
            )}
          </FormItem>

          <FormItem label="服务地址" {...formItemLayoutInModal}>
            {getFieldDecorator('webURL', {
              rules: [{
                required: true,
                message: '请输入服务地址！'
              }],
              validateTrigger: "onBlur",
              initialValue: modalFormData?.webURL || ""
            })(
              <Input placeholder="请输入服务地址" />
            )}
          </FormItem>

          <FormItem label="服务器类型" {...formItemLayoutInModal}>
            {getFieldDecorator('type', {
              rules: [{
                required: true,
                message: '请选择服务器类型！'
              }],
              validateTrigger: "onBlur",
              initialValue: modalFormData?.type || 0
            })(
              <Select>
                <Option value={0}>实验服务器</Option>
                <Option value={1}>Matlab服务器</Option>
              </Select>
            )}
          </FormItem>

        </Form>
      </Modal>
    )
  }
}

export default withModal(AdminActions.Servers, ServerModal)(ServersConfig);
