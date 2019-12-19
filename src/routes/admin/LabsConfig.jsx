//依赖类
import React from 'react';
import Reflux from 'reflux';
import { Route } from 'react-router-dom';
import { Table, Card, Modal, Form, Select, Switch, Input, InputNumber,Radio, Button, Badge, Tooltip } from 'antd';

//数据流
import AdminActions from 'actions/AdminActions';
import labsStore from 'stores/labsStore';
import usersStore from 'stores/usersStore';

//组件类
import Icon from 'components/Icon';
import {formItemLayoutInModal} from 'components/layout';
import SelectLabs from 'components/Droplist/SelectLabs';

import './LabsConfig.less';

//语言类
import intl from 'react-intl-universal';
import qs from "qs";
const languageType = qs.parse(window.location.search.slice(1)).lang;
var nametype;
//var nameCN;
//var nameEN;
if (languageType =='en-US')
{
  nametype = "nameEN"
  // console.log("nametype= "+nametype)
  // console.log("languageTest= "+(languageType == 'en-US'))

}
else nametype = "nameCN";


const FormItem = Form.Item;
const Option = Select.Option;
const Column = Table.Column;

class LabsConfig extends Reflux.Component {
  constructor(props) {
    super(props);
    this.stores = [
        labsStore,
        usersStore];
    this.storeKeys = ['labsList', 'testRigsList', 'expandedRowKeys','usersList'];
    this.state = {
      labsList:[],
      labModalVisible: false,
      labModalFormData: null,
      testRigModalVisible: false,
      testRigModalFormData: null,
      usersList:[]
    }
  }

  componentWillMount() {
    super.componentWillMount();
    AdminActions.Labs.retrieve();
  }
    componentDidMount() {
    AdminActions.Users.retrieve();
    //const usersList=Reflux.GlobalState.usersStore.usersList;
    // console.log(usersList);
  }


  // onExpand = (expanded, record) => {
  //   //同时只有一行展开
  //   const expandedRowKeys = expanded ? [record.id] : [];
  //   if(expanded && !this.state.testRigsList[record.id] ) {
  //     AdminActions.TestRigs.getAll(record.id);
  //   }
  //   this.setState({
  //     expandedRowKeys
  //   })
  // }

  onAddLab = () => {
    this.setState({
      labModalVisible: true,
      labModalFormData: null
    })
  }

  onEditLab = (record) => {
    this.setState({
      labModalVisible: true,
      labModalFormData: record
    })
  }

  onDelLab = (record) => {
    Modal.confirm({
      title: `确定要删除 ${record.nameCN} 吗?`,
      okText: "确定",
      cancelText: "取消",
      onOk() {
        return new Promise((resolve,reject)=>{
          AdminActions.Labs.delete(record.id, () => resolve());
        })
      }
    });
  }

  onAddTestRig = (record) => {
    this.setState({
      testRigModalVisible: true,
      testRigModalFormData: {
        labid: record.id
      }
    })
  }

  onEditTestRig = (record) => {
    this.setState({
      testRigModalVisible: true,
      testRigModalFormData: record
    });
      // console.log(record);
  }

  onDelTestRig = (record) => {
    Modal.confirm({
      title: `确定要删除 ${record.nameCN} 吗?`,
      okText: "确定",
      cancelText: "取消",
      onOk() {
        return new Promise((resolve,reject)=>{
          AdminActions.TestRigs.delete(record.id, () => resolve());
        })
      }
    });
  }

  hideLabModal = () => {
    this.setState({
      labModalVisible: false
    })
  }

  hideTestRigModal = () => {
    this.setState({
      testRigModalVisible: false
    })
  }

  render() {
    const {labsList, usersList,expandedRowKeys, labModalVisible, labModalFormData, testRigModalVisible, testRigModalFormData} = this.state;
    console.log(usersList);
    return (
      <Card >
        <Button type="primary" className="add-new" onClick={this.onAddLab}>新建实验室</Button>
        <Table
          showHeader={false}
          dataSource={labsList}
          pagination={false}
					rowKey="id"
          expandedRowRender= { record => (
            <Table
              dataSource={record.testRigs}
              pagination={false}
              rowKey="id"
              onRow={(record) => {
                return {
                  onDoubleClick: () => this.onEditTestRig(record),
                };
              }}
            >
              <Column title="设备名称" dataIndex={nametype}/>
              <Column title={intl.get('ip')} dataIndex="ip"/>
              <Column
                title="设备状态"
                dataIndex="statusCode"
                filters={[
                  { text: "已停用", value: 0},
                  { text: "已启用", value: 1},
                ]}
                onFilter={(value, record) => record.statusCode == value}
                render={(statusCode) => (
                  <Badge status={statusCode ? "success" : "default"} text={statusCode ? "已启用" : "已停用"}/>
                )}
              />
              <Column title="负责人" dataIndex="manager"
                       render={(record) => {
                           const { usersList } = this.state;
                           const manager= usersList.filter(item => item.id == record);
                           // console.log(manager[0].realName);
                           return manager[0]?.realName;
                       }
                       }
              />
              <Column title="当前使用者" dataIndex="currentUser"
                      render={(record) => {
                          const { usersList } = this.state;
                          const currentUser= usersList.filter(item => item.id == record);
                          return currentUser[0]?.realName || "无";
                      }
                      }
              />
              <Column title="排序优先级" dataIndex="order"/>
              <Column
                title="操作"
                width={120}
                key="operation"
                render={(record) => (
                  <div className="table-operate">
                    <Tooltip title="编辑">
                      <a onClick={()=> this.onEditTestRig(record)}><Icon iconid="edit"></Icon> </a>
                    </Tooltip>
                    <Tooltip title="删除">
                      <a onClick={()=> this.onDelTestRig(record)}><Icon iconid="delete"></Icon> </a>
                    </Tooltip>
                  </div>
                )}
              />
            </Table>
          )}
        >
          <Column title="实验室名称" dataIndex={nametype}/>
          <Column
            title="操作"
            width={120}
            key="operation"
            render={(record) => (
              <div className="table-operate">

                <Tooltip title="编辑">
                  <a onClick={()=> this.onEditLab(record)}><Icon iconid="edit"></Icon> </a>
                </Tooltip>
                <Tooltip title="删除">
                  <a onClick={()=> this.onDelLab(record)}><Icon iconid="delete"></Icon> </a>
                </Tooltip>
                <Tooltip title="新增">
                  <a onClick={()=> this.onAddTestRig(record)}><Icon iconid="add"></Icon> </a>
                </Tooltip>
              </div>
            )}
          />
        </Table>
        <LabModal visible={labModalVisible} hideModal={this.hideLabModal} modalFormData={labModalFormData}/>
        <TestRigModal visible={testRigModalVisible} hideModal={this.hideTestRigModal} modalFormData={testRigModalFormData} usersList={usersList}/>
      </Card>
    )
  }
}

@Form.create()
class LabModal extends React.Component {
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

        if ( modalFormData ) {
          AdminActions.Labs.update(formData, modalFormData.id, callback);
        } else {
          AdminActions.Labs.create(formData, callback)
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
        title={modalFormData ? "配置实验室" : "新建实验室"}
        maskClosable={true}
        confirmLoading={confirmLoading}
        onOk={this.handleSubmit}
        onCancel={this.props.hideModal}
        afterClose={this.props.form.resetFields}
        okText={modalFormData ? "修改" : "新建"}
        cancelText="取消"
      >
        <Form layout="horizontal" hideRequiredMark>
          <FormItem label="实验室名称" {...formItemLayoutInModal}>
            {getFieldDecorator('nameCN', {
              rules: [{
                required: true,
                message: '请输入实验室名称！'
              }],
              validateTrigger: "onBlur",
              initialValue: modalFormData?.nameCN || ""
            })(
              <Input placeholder="请输入实验室中文名称" />
            )}
          </FormItem>

          <FormItem label="英文名称" {...formItemLayoutInModal}>
            {getFieldDecorator('nameEN', {
              rules: [{
                required: true,
                message: '请输入实验室英文名称！'
              }],
              validateTrigger: "onBlur",
              initialValue: modalFormData?.nameEN || ""
            })(
              <Input placeholder="请输入实验室英文名称" />
            )}
          </FormItem>

          <FormItem label="路由" {...formItemLayoutInModal}>
            {getFieldDecorator('path', {
              rules: [{
                required: true,
                message: '请输入实验室路由信息！'
              }],
              validateTrigger: "onBlur",
              initialValue: modalFormData?.path || ""
            })(
              <Input placeholder="请输入实验室路由信息" />
            )}
          </FormItem>

          <FormItem label="图标" {...formItemLayoutInModal}>
            {getFieldDecorator('iconid', {
              initialValue: modalFormData?.iconid || ""
            })(
              <Input placeholder="请输入图标编号" />
            )}
          </FormItem>

          <FormItem label="排序优先级" {...formItemLayoutInModal}>
            {getFieldDecorator('order', {
              initialValue: modalFormData?.order || 1
            })(
              <InputNumber min={1}/>
            )}
          </FormItem>
        </Form>
      </Modal>
    )
  }
}

@Form.create()
class TestRigModal extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      confirmLoading: false,
        managerList:[],
        currentUser:[]
    }
  }

    renderOptions = () =>{
        const { usersList } = this.props;
        // const { managerList } = this.state;
        const managerList= usersList.filter(item => item.role == 1)
        console.log(managerList);
    return managerList.map(element =>
        <Option key={element.id} value={element.id}> {element.realName}</Option>)
    }

    renderCurrentUser = (record) =>{
        const { usersList } = this.props;
        console.log(record);
        const currentUser= usersList.filter(item => item.id == record)
        console.log(currentUser);
        return currentUser[0]?.realName ||"无"
    }

  handleSubmit = (e) => {
    e.preventDefault();

    this.props.form.validateFields((err, formData) => {
      if (!err) {
        const { modalFormData } = this.props;
        this.setState({
          confirmLoading: true
        })
          console.log(formData);
        //数据交互完成后回调函数关闭Modal
        const callback = ()=> {
          this.setState({
            confirmLoading: false
          });
          this.props.hideModal();
        };
          console.log(modalFormData);
        if ( modalFormData?.id ) {
          AdminActions.TestRigs.update(formData, modalFormData.id, callback);
        } else {
          AdminActions.TestRigs.create(formData, callback)
        }
      }
    });
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const { visible, modalFormData ,usersList} = this.props;
    const { confirmLoading ,managerList } = this.state;
      // console.log(usersList);
    return (
      <Modal
        visible={visible}
        title={modalFormData?.id ? "配置设备" : "新建设备"}
        maskClosable={true}
        confirmLoading={confirmLoading}
        onOk={this.handleSubmit}
        onCancel={this.props.hideModal}
        afterClose={this.props.form.resetFields}
        okText={modalFormData?.id ? "修改" : "新建"}
        cancelText="取消"
      >
        <Form layout="horizontal" hideRequiredMark className="ant-form-compact">
          <FormItem label="设备名称" {...formItemLayoutInModal}>
            {getFieldDecorator('nameCN', {
              rules: [{
                required: true,
                message: '请输入设备名称！'
              }],
              validateTrigger: "onBlur",
              initialValue: modalFormData?.nameCN || ""
            })(
              <Input placeholder="请输入设备中文名称" />
            )}
          </FormItem>

          <FormItem label="英文名称" {...formItemLayoutInModal}>
            {getFieldDecorator('nameEN', {
              rules: [{
                required: true,
                message: '请输入设备英文名称！'
              }],
              validateTrigger: "onBlur",
              initialValue: modalFormData?.nameEN || ""
            })(
              <Input placeholder="请输入设备英文名称" />
            )}
          </FormItem>

          <FormItem label="路由" {...formItemLayoutInModal}>
            {getFieldDecorator('path', {
              rules: [{
                required: true,
                message: '请输入设备路由信息！'
              }],
              validateTrigger: "onBlur",
              initialValue: modalFormData?.path || ""
            })(
              <Input placeholder="请输入设备路由信息" />
            )}
          </FormItem>

          <FormItem label="三维模型路径" {...formItemLayoutInModal}>
            {getFieldDecorator('model', {
              rules: [{
                required: true,
                message: '请输入三维模型路径！'
              }],
              validateTrigger: "onBlur",
              initialValue: modalFormData?.model || ""
            })(
              <Input placeholder="请输入三维模型路径" />
            )}
          </FormItem>

          <FormItem label={intl.get('ip')} {...formItemLayoutInModal}>
            {getFieldDecorator('ip', {
              rules: [{
                required: true,
                message: '请输入设备IP地址！'
              }],
              validateTrigger: "onBlur",
              initialValue: modalFormData?.ip || ""
            })(
              <Input placeholder="请输入设备IP地址" />
            )}
          </FormItem>

          <FormItem
            label="排序优先级"
            help="系统将按此值决定设备列表先后顺序，设置为0可隐藏该设备。"
            {...formItemLayoutInModal}
          >
            {getFieldDecorator('order', {
              initialValue: modalFormData?.order || 1
            })(
              <InputNumber min={1}/>
            )}
          </FormItem>

          <FormItem label="设备启停" {...formItemLayoutInModal}>
            {getFieldDecorator('statusCode', {
              valuePropName: 'checked',
              initialValue: modalFormData?.statusCode ? Boolean(modalFormData?.statusCode) : false
            })(
              <Switch checkedChildren="开" unCheckedChildren="关"/>
            )}
          </FormItem>

          <FormItem label="所属实验室" {...formItemLayoutInModal}>
            {getFieldDecorator('labid', {
              rules: [{
                required: true,
                message: '请选择所属实验室！'
              }],
              validateTrigger: "onBlur",
              initialValue: modalFormData?.labid || 1
            })(
              <SelectLabs />
            )}
          </FormItem>

          <FormItem label="系统平台" {...formItemLayoutInModal}>
            {getFieldDecorator('platform', {
              rules: [{
                required: true,
                message: '请选择系统平台！'
              }],
              validateTrigger: "onBlur",
              initialValue: modalFormData?.platform || 1
            })(
              <Radio.Group >
                <Radio value={1}>ARM9</Radio>
              </Radio.Group>
            )}
          </FormItem>

          <FormItem label="算法下载端口" {...formItemLayoutInModal}>
            {getFieldDecorator('downloadPort', {
              rules: [{
                required: true,
                message: '请输入算法下载端口！'
              }],
              validateTrigger: "onBlur",
              initialValue: modalFormData?.downloadPort || 17728
            })(
              <InputNumber min={1}/>
            )}
          </FormItem>

          <FormItem label="监控端口" {...formItemLayoutInModal}>
            {getFieldDecorator('monitorPort', {
              rules: [{
                required: true,
                message: '请输入监控端口！'
              }],
              validateTrigger: "onBlur",
              initialValue: modalFormData?.monitorPort || 17725
            })(
              <InputNumber min={1}/>
            )}
          </FormItem>

          <FormItem
            label="设备管理员"
            help="只显示级别为设备管理员以上的用户"
            {...formItemLayoutInModal}
          >
            {getFieldDecorator('manager', {
              rules: [{
                required: true,
                message: '请选择设备管理员！'
              }],
              validateTrigger: "onBlur",
              initialValue: modalFormData?.manager || 1
            })(
              <Select>
                {this.renderOptions()}
              </Select>
            )}
          </FormItem>

          <FormItem label="默认实验时间" {...formItemLayoutInModal}>
            {getFieldDecorator('experimentTime', {
              rules: [{
                required: true,
                message: '请输入默认实验时间！'
              }],
              validateTrigger: "onBlur",
              initialValue: modalFormData?.experimentTime || 30
            })(
              <InputNumber min={1}/>
            )}
            <span>分钟</span>
          </FormItem>

          <FormItem
            label="默认算法"
            help="默认算法将会在设备空闲时运行。"
            {...formItemLayoutInModal}
          >
            {getFieldDecorator('defaultAlgorithm', {
              rules: [{
                required: true,
                message: '请选择算法默认！'
              }],
              validateTrigger: "onBlur",
              initialValue: modalFormData?.defaultAlgorithm || 1
            })(
              <Select>
                <Option value={1}>PID算法</Option>
                <Option value={2}>LQR算法</Option>
              </Select>
            )}
          </FormItem>

          <FormItem label="算法默认步长" {...formItemLayoutInModal}>
            {getFieldDecorator('stepSize', {
              rules: [{
                required: true,
                message: '请输入算法默认步长！'
              }],
              validateTrigger: "onBlur",
              initialValue: modalFormData?.stepSize || 0.04
            })(
              <InputNumber step={0.01} min={0}/>
            )}
          </FormItem>

          <FormItem label="监控上传包大小" {...formItemLayoutInModal}>
            {getFieldDecorator('monitorPacketSize', {
              rules: [{
                required: true,
                message: '请输入默认监控上传包大小！'
              }],
              validateTrigger: "onBlur",
              initialValue: modalFormData?.monitorPacketSize || 25
            })(
              <InputNumber min={0}/>
            )}
          </FormItem>

          <FormItem label="当前使用者" {...formItemLayoutInModal}>
              {getFieldDecorator('currentUser', {
                  validateTrigger: "onBlur",
                  initialValue: modalFormData?.currentUser || 0
              })(
                  <span>{ this.renderCurrentUser(modalFormData?.currentUser || 0)}</span>
                  )}
          </FormItem>

        </Form>
      </Modal>
    )
  }
}

export default LabsConfig;
