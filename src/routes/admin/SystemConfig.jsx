//依赖类
import React from 'react';
import Reflux from 'reflux';
import { Route, Switch } from 'react-router-dom';
import { Menu, Card, Form, Select, Input, InputNumber, Switch as Toggle, Radio, Button} from 'antd';

//数据流
import AdminActions from 'actions/AdminActions';
import systemStore from 'stores/systemStore';

import './SystemConfig.less';

const FormItem = Form.Item;
const Option = Select.Option;

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

const roleList = (
  <Select>
    <Option value={0}>访客</Option>
    <Option value={1}>临时用户</Option>
    <Option value={2}>初级用户</Option>
    <Option value={3}>普通用户</Option>
    <Option value={4}>高级用户</Option>
    <Option value={5}>设备管理员</Option>
    <Option value={6}>系统管理员</Option>
  </Select>
);

@Form.create()
class SystemConfig extends Reflux.Component {
  constructor(props) {
    super(props);
    this.store = systemStore;
    this.state = {
      systemParams : {
        loginLevel: 0,
        publicRegister: true,
        pubDefaultRole: 2,
        pubDefaultPeriod: "",
        internalRegister: true,
        internalDefaultRole: 4,
        internalDefaultPeriod: "",
        authCode: "",
        internalMailVerification: false,

        inspectionInterval: "",
        maxQueueLength: "",
        queuePriority: "",
        occupationLimit: "",
        duplicateClaim: true,

        physicalExperiment: true,
        uploadAlgorithm: true,
        onlineCompiling: true,
        onlineSimulink: true,
        uploadLevel: 3
      }
    }
  }

  componentWillMount() {
    super.componentWillMount();
    AdminActions.System.retrieve();
  }

  handleSubmit = (e) => {
    e.preventDefault();

    this.props.form.validateFields((err, formData) => {
      if (!err) {
        console.log("表单信息：");
        console.log(formData);
        AdminActions.System.update(formData);
      }
    });
  }

  render() {
    const { getFieldDecorator, getFieldValue } = this.props.form;

    const {
      loginLevel,
      publicRegister,
      pubDefaultRole,
      pubDefaultPeriod,
      internalRegister,
      internalDefaultRole,
      internalDefaultPeriod,
      authCode,
      internalMailVerification,

      inspectionInterval,
      maxQueueLength,
      queuePriority,
      occupationLimit,
      duplicateClaim,

      physicalExperiment,
      uploadAlgorithm,
      onlineCompiling,
      onlineSimulink,
      uploadLevel
    } = this.state.systemParams;

    return (
      <div id="system-config">
        <Card >
          <Form
            hideRequiredMark
            onSubmit={this.handleSubmit}
          >
            <FormItem label="登录级别下限" {...formItemLayout}>
              {getFieldDecorator('loginLevel', {
                initialValue : loginLevel
              })(
                roleList
              )}
            </FormItem>
            <FormItem label="公共注册" {...formItemLayout}>
              {getFieldDecorator('publicRegister', {
                valuePropName: 'checked',
                initialValue: publicRegister
              })(
                <Toggle checkedChildren="开" unCheckedChildren="关"/>
              )}
            </FormItem>

            {
              getFieldValue('publicRegister') ?
                <div>
                  <FormItem label="公共注册默认角色" {...formItemLayout}>
                    {getFieldDecorator('pubDefaultRole', {
                      initialValue: pubDefaultRole
                    })(
                      roleList
                    )}
                  </FormItem>
                  <FormItem label="公共注册默认实验时间" {...formItemLayout}>
                    {getFieldDecorator('pubDefaultPeriod', {
                      initialValue: pubDefaultPeriod
                    })(
                      <InputNumber step={1} min={0} />
                    )}
                    <span>分钟</span>
                  </FormItem>

                </div>
              :
              null
            }

            <FormItem label="内部注册" {...formItemLayout}>
              {getFieldDecorator('internalRegister', {
                valuePropName: 'checked',
                initialValue: internalRegister
              })(
                <Toggle checkedChildren="开" unCheckedChildren="关"/>
              )}
            </FormItem>

            {
              getFieldValue('internalRegister') ?
              <div>
                <FormItem label="内部注册默认角色" {...formItemLayout}>
                  {getFieldDecorator('internalDefaultRole', {
                    initialValue: internalDefaultRole
                  })(
                    roleList
                  )}
                </FormItem>
                <FormItem label="内部注册默认实验时间" {...formItemLayout}>
                  {getFieldDecorator('internalDefaultPeriod', {
                    initialValue: internalDefaultPeriod
                  })(
                    <InputNumber step={1} min={0} />
                  )}
                  <span>小时</span>
                </FormItem>
                <FormItem
                  label="内部注册验证码"
                  help="由数字、字母或中文字符组成，建议设置为8位以上。"
                  {...formItemLayout}
                >
                  {getFieldDecorator('authCode', {
                    rules: [{
                      required: true
                    }],
                    validateTrigger: "onBlur",
                    initialValue: authCode,
                  })(
                    <Input />
                  )}
                </FormItem>
                <FormItem label="内部注册邮箱验证" {...formItemLayout}>
                  {getFieldDecorator('internalMailVerification', {
                    valuePropName: 'checked',
                    initialValue: internalMailVerification
                  })(
                    <Toggle checkedChildren="开" unCheckedChildren="关"/>
                  )}
                </FormItem>
              </div>
              :
              null
            }

            <FormItem label="实物实验" {...formItemLayout}>
              {getFieldDecorator('physicalExperiment', {
                valuePropName: 'checked',
                initialValue: physicalExperiment
              })(
                <Toggle checkedChildren="开" unCheckedChildren="关"/>
              )}
            </FormItem>
            <FormItem label="上传算法" {...formItemLayout}>
              {getFieldDecorator('uploadAlgorithm', {
                valuePropName: 'checked',
                initialValue: uploadAlgorithm
              })(
                <Toggle checkedChildren="开" unCheckedChildren="关"/>
              )}
            </FormItem>
            <FormItem label="在线编译生成算法" {...formItemLayout}>
              {getFieldDecorator('onlineCompiling', {
                valuePropName: 'checked',
                initialValue: onlineCompiling
              })(
                <Toggle checkedChildren="开" unCheckedChildren="关"/>
              )}
            </FormItem>
            <FormItem label="在线仿真" {...formItemLayout}>
              {getFieldDecorator('onlineSimulink', {
                valuePropName: 'checked',
                initialValue: onlineSimulink
              })(
                <Toggle checkedChildren="开" unCheckedChildren="关"/>
              )}
            </FormItem>

            <FormItem
              label="上传文件级别下限"
              help="用户上传文件可能会有潜在安全问题，建议设置为高级用户。"
              {...formItemLayout}
            >
              {getFieldDecorator('uploadLevel', {
                initialValue : uploadLevel
              })(
                roleList
              )}
            </FormItem>

            <FormItem
              label="重复申请设备控制权"
              help="允许用户重复申请同一设备控制权，可以延长用户的设备占用时间。但在设备使用紧张情况下会失去用户公平性。"
              {...formItemLayout}
            >
              {getFieldDecorator('duplicateClaim', {
                valuePropName: 'checked',
                initialValue: duplicateClaim
              })(
                <Toggle checkedChildren="开" unCheckedChildren="关"/>
              )}
            </FormItem>

            <FormItem label="设备状态检测间隔" {...formItemLayout}>
              {getFieldDecorator('inspectionInterval', {
                initialValue: inspectionInterval
              })(
                <InputNumber step={1} min={0}/>
              )}
              <span>分钟</span>
            </FormItem>

            <FormItem label="等待队列人数上限" {...formItemLayout}>
              {getFieldDecorator('maxQueueLength', {
                initialValue: maxQueueLength
              })(
                <InputNumber step={1} min={0} />
              )}
              <span>人</span>
            </FormItem>

            <FormItem label="排队时间优先度" {...formItemLayout}>
              {getFieldDecorator('queuePriority', {
                valuePropName: 'value',
                initialValue: queuePriority
              })(
                <InputNumber step={1} min={0} />
              )}
              <span>分钟</span>
            </FormItem>

            <FormItem label="单个用户占用设备上限" {...formItemLayout}>
              {getFieldDecorator('occupationLimit', {
                initialValue: occupationLimit
              })(
                <InputNumber step={1} min={0} />
              )}
              <span>台</span>
            </FormItem>

            <FormItem {...submitFormLayout} style={{ marginTop: 32 }}>
              <Button type="primary" htmlType="submit" >
                提交
              </Button>
            </FormItem>

          </Form>
        </Card>
      </div>
    )
  }
}

export default SystemConfig;
