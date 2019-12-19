//依赖类
import React from 'react';
import Reflux from 'reflux';
import { Route } from 'react-router-dom';
import { Row, Col, Table, Card, Modal, Form, Icon, Select, Input, InputNumber, Button, Badge, Tooltip, DatePicker } from 'antd';
import moment from 'moment';

//数据流
import AdminActions from 'actions/AdminActions';
import usersStore from 'stores/usersStore';

//组件类
import _Icon from 'components/Icon';
import {formItemLayoutInModal} from 'components/layout';

//HOC
import withModal from 'HOC/withModal';

import './UsersConfig.less';

const FormItem = Form.Item;
const Option = Select.Option;
const Column = Table.Column;
const { MonthPicker, RangePicker, WeekPicker } = DatePicker;

class UsersConfig extends Reflux.Component {
  constructor(props) {
    super(props);
    this.store = usersStore;
    this.storeKeys = ['usersList'];
    this.state = {
      usersList:[],
      filteredInfo: {},
      selectedRows:[],
    };
  }

  componentWillMount() {
    super.componentWillMount();
    AdminActions.Users.retrieve();
  }

  onLock = (record) => {
    Modal.confirm({
      title: `确定要锁定 ${record.account} 吗?`,
      okText: "确定",
      cancelText: "取消",
      onOk() {
        return new Promise((resolve,reject)=>{
          AdminActions.Users.retrieve(record.id, () => resolve());
        })
      }
    });
  }

  handleFormChange = (formData) => {
    if (formData === null) {
      this.setState({
        filteredInfo:{},
        selectedRows:[]
      })
    } else {
      this.setState( prevState=>({
        filteredInfo: {...prevState.filteredInfo, ...formData},
        selectedRows:[]
      }));
    }
  }

  handleSelectRows = (rows) => {
    this.setState({
      selectedRows: rows,
    });
  }

  bulkDeletion = () => {
    const {selectedRows} = this.state;
    Modal.confirm({
      title: `确定批量删除 ${this.state.selectedRows.length} 个用户吗?`,
      okText: "确定",
      cancelText: "取消",
      onOk() {
        return new Promise((resolve,reject)=>{
          AdminActions.Users.retrieve(selectedRows, () => resolve());
        })
      }
    });
  }

  render() {
    const {usersList, filteredInfo, selectedRows } = this.state;
    //console.log("test");
    //console.log(this.state);
    return (
      <Card id="users-config">
        <FilterForm handleFormChange={this.handleFormChange}/>
        {
          selectedRows.length > 0 && (
            <span className="tableListOperator">
              <Button onClick={this.bulkDeletion}>批量删除</Button>
              <Button onClick={this.props.onAdd}>批量编辑</Button>
            </span>
          )
        }
        <Table
          showHeader={true}
          rowSelection={{
            selectedRowKeys:selectedRows,
            onChange:this.handleSelectRows,
            fixed:true,
          }}
          dataSource={usersList}
          pagination={{
            showQuickJumper: true,
            showSizeChanger: true,
            showTotal: (total) => `总共 ${total} 项记录`,
          }}
					rowKey="id"
          //x应该大于各列宽度之和加上rowSelection的宽度62px
          //并且留一列不要添加width属性，以自适应屏幕宽度，避免固定列重复
          scroll={{ x: 1500 }}
          onRow={(record) => {
            return {
              onDoubleClick: () => this.props.onEdit(record),
            };
          }}
        >
          <Column
            title="用户名"
            dataIndex="account"
            width={180}
            fixed="left"
            filteredValue= {filteredInfo.account ? [filteredInfo.account] : null}
            onFilter= {(value, record) => record.account.includes(value)}
          />
          <Column
            title="真实姓名"
            dataIndex="realName"
            width={120}
            filteredValue= {filteredInfo.realname ? [filteredInfo.realname] : null}
            onFilter= {(value, record) => record.realname.includes(value)}
          />
          <Column
            title="邮箱"
            dataIndex="email"
            filteredValue= {filteredInfo.email ? [filteredInfo.email] : null}
            onFilter= {(value, record) => record.email.includes(value)}
          />
          <Column
              title="实验时间"
              dataIndex="totalTime"
              width={100}
              render={(totalTime)=>Math.floor(totalTime/1000/60)+"分钟"}
              filteredValue= {filteredInfo.totalTime ? [filteredInfo.totalTime] : null}
              onFilter= {(value, record) => record.email.includes(value)}
          />
          <Column
            title="上次登陆"
            dataIndex="lastLand"
            width={200}
            render={(date)=> moment(date).format('Y年M月D日 HH:mm:ss')}
            sorter={(a, b) => moment(a.lastLand).unix() - moment(b.lastLand).unix() }
            filteredValue= {filteredInfo.lastLand && filteredInfo.lastLand.length != 0 ? [filteredInfo.lastLand] : null}
            onFilter= {([start, end], record) => moment(record.lastLand).isBetween(start, end)}
          />
          <Column
            title="注册时间"
            dataIndex="regDate"
            width={160}
            render={(date)=> moment(date).format('Y年M月D日')}
            sorter={(a, b) => moment(a.regDate).unix() - moment(b.regDate).unix()}
            filteredValue= {filteredInfo.regDate && filteredInfo.regDate.length != 0 ? [filteredInfo.regDate] : null}
            onFilter= {([start, end], record) => moment(record.regDate).isBetween(start, end)}
          />
          <Column
            title="用户角色"
            dataIndex="role"
            width={150}
            sorter={(a, b) => a.role - b.role }
            filteredValue= {filteredInfo.role ? [filteredInfo.role] : null}
            onFilter= {(value, record) => record.role === value}
            render={(text, record) => {
                switch (text) {
                  /*case 1:  return "访客";
                  case 2:  return "临时用户";
                  case 3:  return "初级用户";
                  case 4:  return "普通用户";
                  case 5:  return "高级用户";
                  case 6:  return "设备管理员";
                  case 7:  return "系统管理员";
                  default: return "未知";*/
                    case 1:  return "管理员";
                    default: return "一般用户";
                }
              }
            }
          />
          <Column
            title="剩余实验时间"
            dataIndex="restTime"
            width={130}
          />
          <Column
            title="账户状态"
            dataIndex="statusCode"
            width={130}
            filters={[
              { text: "锁定中", value: 0},
              { text: "已激活", value: 1},
            ]}
            onFilter={(value, record) => record.statusCode == value}
            render={(statusCode) => {
              switch (statusCode) {
                case 0: return <Badge status={"default"} text={"锁定中"}/>
                case 1: return <Badge status={"success"} text={"已激活"}/>
                default: return <Badge status={"warning"} text={"未知状态"}/>
              }
            }}
          />
          <Column
            title="操作"
            width={120}
            fixed='right'
            key="operation"
            render={(record) => (
              <div className="table-operate">
                <Tooltip title="编辑">
                  <a onClick={()=> this.props.onEdit(record)}><_Icon iconid="edit"></_Icon> </a>
                </Tooltip>
                <Tooltip title="删除">
                  <a onClick={()=> this.props.onDel(record.account, record.id)}><_Icon iconid="delete"></_Icon> </a>
                </Tooltip>
                <Tooltip title="锁定">
                  <a onClick={()=> this.onLock(record)}><_Icon iconid="lock"></_Icon> </a>
                </Tooltip>
              </div>
            )}
          />
        </Table>
      </Card>
    )
  }
}

@Form.create({
  onValuesChange(props, values) {
    props.handleFormChange(values)
  }
})
class FilterForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      formSimple: true,
    };
  }

  toggleForm = ()=> {
    //收起的同时重置表单
    this.handleReset();
    this.setState( prevState => ({
      formSimple: !prevState.formSimple
    }))
  }

  handleReset = () => {
    this.props.form.resetFields();
    //主动传递空对象给父组件，否则无法触发过滤。
    this.props.handleFormChange(null);
  }

  disabledDate = (current) => {
    //禁止选择未来时间
    return current && current.valueOf() > Date.now();
  }

  render(){
    const {formSimple} = this.state;
    const {getFieldDecorator} = this.props.form;

    const renderRangePicker = () => (
      <RangePicker
        disabledDate={this.disabledDate}
        ranges={{
          "本月":[moment().startOf('month'), moment()],
          "今年":[moment().startOf('year'), moment()],
          "近三年":[moment().startOf('year').subtract(2, 'years'), moment()]
        }}
      />
    )

    return (
      <Form onSubmit={this.handleSearch} layout="inline" className="table-filter-form">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col lg={8} md={12} sm={24}>
            <FormItem label="用户名">
              {getFieldDecorator('account')(
                <Input placeholder="请输入要查询的用户名" />
              )}
            </FormItem>
          </Col>
          { formSimple ? null :
            <Col lg={8} md={12} sm={24}>
              <FormItem label="真实姓名">
                {getFieldDecorator('realName')(
                  <Input placeholder="请输入要查询的真实姓名" />
                )}
              </FormItem>
            </Col>
          }
          { formSimple ? null :
            <Col lg={8} md={12} sm={24}>
              <FormItem label="用户邮箱">
                {getFieldDecorator('email')(
                  <Input placeholder="请输入要查询的用户邮箱" />
                )}
              </FormItem>
            </Col>
          }
          { formSimple ? null :
            <Col lg={8} md={12} sm={24}>
              <FormItem label="最后登陆">
                {getFieldDecorator('lastLand')(
                  renderRangePicker()
                )}
              </FormItem>
            </Col>
          }
          { formSimple ? null :
            <Col lg={8} md={12} sm={24}>
              <FormItem label="注册日期">
                {getFieldDecorator('regDate')(
                  renderRangePicker()
                )}
              </FormItem>
            </Col>
          }
          { formSimple ? null :
            <Col lg={8} md={12} sm={24}>
              <FormItem label="用户角色">
                {getFieldDecorator('role')(
                  <Select placeholder="请选择用户角色">
                    <Option value={1}>管理员</Option>
                    <Option value={2}>一般用户</Option>
                  </Select>
                )}
              </FormItem>
            </Col>
          }
          { !formSimple ? null :
            <Col lg={8} md={12} sm={24} >
              <div className="reset-filter-para form-simple">
                <Button type="primary" onClick={this.handleReset}>重置</Button>
                <a onClick={this.toggleForm}>
                  展开
                  <Icon type="down" />
                </a>
              </div>
            </Col>
          }
        </Row>
        { formSimple ? null :
          <div className="reset-filter-para form-advanced">
            <Button type="primary" onClick={this.handleReset}>重置</Button>
            <a onClick={this.toggleForm}>
              收起
              <Icon type="up" />
            </a>
          </div>
        }

      </Form>
    )
  }
}

@Form.create()
class UserModal extends React.Component {
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
          function timestampToTime(timestamp) {
              var date = new Date(timestamp);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
              var Y = date.getFullYear() + '-';
              var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
              var D = date.getDate() + ' ';
              var h = date.getHours() + ':';
              var m = date.getMinutes() + ':';
              var s = date.getSeconds();
              return Y+M+D+h+m+s;
          }
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

        console.log("弹窗表单信息:");
        console.log(modalFormData);

          // formData.account=modalFormData.account;
          // formData.realName=modalFormData.realName;
          // formData.email=modalFormData.email;
          // formData.lastLand=modalFormData.lastLand;
          // formData.regDate=modalFormData.regDate;
          // formData.address=modalFormData.address;
          // formData.tel=modalFormData.tel;
          // formData.statusCode=modalFormData.statusCode;
          // formData.institution=modalFormData.institution;
          // formData.id=modalFormData.id;
          var timestamp=new Date().getTime();
          formData.time =timestampToTime(timestamp);

        if (modalFormData.id) {
          AdminActions.Users.update(formData, modalFormData.id, callback);
          console.log("传递数据:");
          console.log(formData);
        } else {
          AdminActions.Users.update(formData, this.props.selectedRows, callback)
        }
      }
    });
  }



  render() {
    const { getFieldDecorator} = this.props.form;
    const { visible, modalFormData  } = this.props;
    const { confirmLoading} = this.state;
      // {getFieldDecorator('account',{initialValue: modalFormData.account})}
      // {getFieldDecorator('realName',{initialValue: modalFormData.realname})}
      // {getFieldDecorator('email',{initialValue: modalFormData.email})}
      // {getFieldDecorator('lastLand',{initialValue: modalFormData.last_land_time})}
      // {getFieldDecorator('regDate',{initialValue: modalFormData.created_at})}
      // {getFieldDecorator('statusCode',{initialValue: modalFormData.status_code})}
      // {getFieldDecorator('id',{initialValue: modalFormData.id})}



    return (
        <div>

         <Modal
        visible={visible}
        title={modalFormData ? "用户数据编辑" : "用户数据批量编辑"}
        maskClosable={true}
        confirmLoading={confirmLoading}
        onOk={this.handleSubmit}
        onCancel={this.props.hideModal}
        afterClose={this.props.form.resetFields}
        okText="修改"
        cancelText="取消"
      >



        <Form layout="horizontal" hideRequiredMark>

          {
            modalFormData && (
                <>

                <FormItem  label="ID"  {...formItemLayoutInModal} >
                  {/*<span className="ant-form-text">{modalFormData.id}</span>    */}
                    {getFieldDecorator('id', {
                    initialValue: modalFormData.id,
                })(
                    <span>{ modalFormData.id}</span>
                )}

                </FormItem>

                <FormItem    label="用户名"  {...formItemLayoutInModal}>
                  {/*<span className="ant-form-text">{modalFormData.account}</span>*/}
                    {getFieldDecorator('account', {
                        initialValue: modalFormData.account,
                    })(
                        <span>{ modalFormData.account}</span>
                    )}
                </FormItem>

                <FormItem   label="真实姓名"  {...formItemLayoutInModal} >
                  {/*<span className="ant-form-text">{modalFormData.realName}</span>*/}
                    {getFieldDecorator('realName', {
                        initialValue: modalFormData.realName,
                    })(
                        <span>{ modalFormData.realName}</span>
                    )}
                </FormItem>


                <FormItem  label="邮箱"  {...formItemLayoutInModal}>
                  {/*<span className="ant-form-text">{modalFormData.email}</span>*/}
                    {getFieldDecorator('email', {
                        initialValue: modalFormData.email,
                    })(
                        <span>{ modalFormData.email}</span>
                    )}
                </FormItem>

                <FormItem   label="上次登录"  {...formItemLayoutInModal}>
                  {/*<span className="ant-form-text">{modalFormData.lastLand}</span>*/}
                    {getFieldDecorator('lastLand', {
                        initialValue: modalFormData.lastLand,
                    })(
                        <span>{ modalFormData.lastLand}</span>
                    )}
                </FormItem>

                <FormItem  label="注册时间"  {...formItemLayoutInModal} >
                  {/*<span className="ant-form-text">{modalFormData.regDate}</span>*/}
                    {getFieldDecorator('regDate', {
                        initialValue: modalFormData.regDate,
                    })(
                        <span>{ modalFormData.regDate}</span>
                    )}
                </FormItem>

                <FormItem   label="账户状态"  {...formItemLayoutInModal}>
                  {/*<span className="ant-form-text">{modalFormData.statusCode}</span>*/}
                    {getFieldDecorator('statusCode', {
                        initialValue: modalFormData.statusCode,
                    })(
                        <span>{ modalFormData.statusCode}</span>
                    )}
                </FormItem>

                <FormItem  label="联系地址"  {...formItemLayoutInModal}>
                    {getFieldDecorator('address', {
                        initialValue: modalFormData.address,
                    })(
                        <Input />
                    )}
                </FormItem>

                <FormItem  label="联系电话"  {...formItemLayoutInModal} >
                    {getFieldDecorator('tel', {
                        initialValue: modalFormData.tel,
                    })(
                        <Input />
                    )}
                </FormItem>


                <FormItem   label="所属单位"  {...formItemLayoutInModal}>
                    {getFieldDecorator('institution', {
                        initialValue: modalFormData.institution,
                    })(
                        <Input />
                    )}
                </FormItem>



                </>
            )
          }

          <FormItem label="用户角色" {...formItemLayoutInModal}>
            {getFieldDecorator('role', {
              rules: [{
                required: modalFormData ? true : false,
                message: '请选择用户角色！'
              }],
              validateTrigger: "onBlur",
              initialValue: modalFormData?.role || ''
            })(
              <Select placeholder="请选择用户角色">
                <Option value={1}>管理员</Option>
                <Option value={2}>一般用户</Option>
              </Select>
            )}
          </FormItem>

          <FormItem label="剩余实验时间" {...formItemLayoutInModal}>
            {getFieldDecorator('restTime', {
              rules: [{
                required: modalFormData ? true : false,
                message: '请输入剩余实验时间！'
              }],
              validateTrigger: "onBlur",
              initialValue: modalFormData?.restTime || ''
            })(
              <InputNumber min={0} />
            )}
          </FormItem>


          {/*formData.account=modalFormData.account;*/}
          {/*formData.realName=modalFormData.realName;*/}
          {/*formData.email=modalFormData.email;*/}
          {/*formData.lastLand=modalFormData.lastLand;*/}
          {/*formData.regDate=modalFormData.regDate;*/}
          {/*formData.address=modalFormData.address;*/}
          {/*formData.tel=modalFormData.tel;*/}
          {/*formData.statusCode=modalFormData.statusCode;*/}
          {/*formData.institution=modalFormData.institution;*/}
          {/*formData.id=modalFormData.id;*/}




        </Form>
      </Modal>
        </div>
    )
  }
}

export default withModal(AdminActions.Users, UserModal)(UsersConfig);
