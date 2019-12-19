import React from 'react';
import Reflux from 'reflux';
import { Route, Switch } from 'react-router-dom';
import { Menu, Card, Form, Modal,Select, Input, InputNumber, Switch as Toggle, Radio, Badge,Button} from 'antd';

//数据流
import InfoActions from 'actions/InfoActions';
import InfoStore from 'stores/InfoStore';

import 'routes/admin/SystemConfig.less';
import intl from 'react-intl-universal';

const FormItem = Form.Item;
// const Option = Select.Option;

const formItemLayout = {
    labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
        md: { span: 8 },
        lg: { span: 8 },
    },
    wrapperCol: {
        xs: { span: 24 },
        sm: { span: 14 },
        md: { span: 12 },
        lg: { span: 8 },
    },
};

const submitFormLayout = {
    wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 14, offset: 8 },
        md: { span: 12, offset: 8 },
        lg: { span: 8, offset: 8 },
    },
};

// const roleList = (
//     <Select>
//         <Option value={0}>访客</Option>
//         <Option value={1}>临时用户</Option>
//         <Option value={2}>初级用户</Option>
//         <Option value={3}>普通用户</Option>
//         <Option value={4}>高级用户</Option>
//         <Option value={5}>设备管理员</Option>
//         <Option value={6}>系统管理员</Option>
//     </Select>
// );

const roleList= new Array('访客','临时用户','初级用户','普通用户','高级用户','设备管理员','系统管理员');
const statusList= new Array('锁定中','已激活');

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


@Form.create()
class UserDetail extends Reflux.Component {
    constructor(props) {
        super(props);
        this.store = InfoStore;
        this.state = {
            userFormData:{},
        }
        console.log(this.props)
    }


    componentWillMount() {
        super.componentWillMount();
        InfoActions.Info.retrieve();
    }

    handleSubmit = (e) => {
        const userId=this.state?.userFormData.id;
        console.log(userId);
        e.preventDefault();

        this.props.form.validateFields((err, userFormData) => {
            if (!err) {
                var timestamp=new Date().getTime();
                userFormData.time =timestampToTime(timestamp);
                console.log("表单信息：");
                console.log(userFormData);
                // console.log(this.props.form );
                InfoActions.Info.update(userFormData,userId);
            }
        });
    }





    render() {
        const { getFieldDecorator} = this.props.form;
        const { userFormData } = this.state;
        {getFieldDecorator('account',{initialValue: userFormData.account,})}
        {getFieldDecorator('realName',{initialValue: userFormData.realname,})}
        {getFieldDecorator('email',{initialValue: userFormData.email,})}
        {getFieldDecorator('lastLand',{initialValue: userFormData.last_land_time,})}
        {getFieldDecorator('regDate',{initialValue: userFormData.created_at,})}
        {getFieldDecorator('role',{initialValue: userFormData.role,})}
        {getFieldDecorator('restTime',{initialValue: userFormData.rest_time,})}
        {getFieldDecorator('statusCode',{initialValue: userFormData.status_code,})}
        {getFieldDecorator('id',{initialValue: userFormData.id,})}

        return (
            <div id="user-detail">
                <Card >
                    <Form
                        hideRequiredMark
                        onSubmit={this.handleSubmit}

                    >


                        <FormItem label={intl.get('account')} {...formItemLayout}>
                            <span className="ant-form-text">{userFormData.account}</span>
                        </FormItem>


                        <FormItem
                            label={intl.get('real name')}  {...formItemLayout}>
                            <span className="ant-form-text">{userFormData.realname}</span>
                        </FormItem>


                        <FormItem label={intl.get('email')} {...formItemLayout}>
                            <span className="ant-form-text">{userFormData.email}</span>
                        </FormItem>

                        <FormItem label={intl.get('last login')} {...formItemLayout}>
                            <span className="ant-form-text">{userFormData.last_land_time}</span>
                        </FormItem>

                        <FormItem label={intl.get('registration time')} {...formItemLayout}>
                            <span className="ant-form-text">{userFormData.created_at}</span>
                        </FormItem>

                        <FormItem label={intl.get('role')} {...formItemLayout}>
                            <span className="ant-form-text">{roleList[userFormData.role]}</span>
                        </FormItem>

                        <FormItem label={intl.get('experiment time left')} {...formItemLayout}>
                            <span className="ant-form-text">{userFormData.rest_time}</span>
                        </FormItem>

                        <FormItem label={intl.get('account status')} {...formItemLayout}>
                            <span className="ant-form-text">{statusList[userFormData.status_code]}</span>
                        </FormItem>


                        <FormItem  label={intl.get('institution')} {...formItemLayout}>
                            {getFieldDecorator('institution', {
                                initialValue: userFormData.institution,
                            })(
                                <Input />
                            )}
                        </FormItem>

                        <FormItem label={intl.get('address')} {...formItemLayout}>
                            {getFieldDecorator('address', {
                                initialValue: userFormData.address,
                            })(
                                <Input />
                            )}
                        </FormItem>

                        <FormItem label={intl.get('phone number')} {...formItemLayout}>
                            {getFieldDecorator('tel', {
                                initialValue: userFormData.tel,
                            })(
                                <Input />
                            )}
                        </FormItem>


                        <FormItem {...submitFormLayout} style={{ marginTop: 32 }}>
                            <Button type="primary" htmlType="submit" >
                                {intl.get('submit')}
                            </Button>

                        </FormItem>

                    </Form>
                </Card>
            </div>

        )
    }
}



export default UserDetail;
