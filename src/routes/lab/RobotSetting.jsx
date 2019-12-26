//依赖类
import React from 'react';
import Reflux from 'reflux';
import { Route, Switch } from 'react-router-dom';
import { Menu, Card, Form, Select, Input, InputNumber, Switch as Toggle, Radio, Button} from 'antd';

//数据流
import AdminActions from 'actions/AdminActions';
import robotStore from 'stores/robotStore';

import './RobotConfig.less';

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

const actionMode = (
    <Select>
    <Option value={0}>原地待命</Option>
    <Option value={1}>继续执行</Option>
    </Select>
);

@Form.create()
class RobotSetting extends Reflux.Component {
    constructor(props) {
        super(props);
        this.store = robotStore;
        this.state = {
            robotParams : {
                alertMode: 0,
                breakMode: 0,
                robotTravelSpeed: 0.3,
                radarWarningRange: 0.6,
                batteryCapacityAlarm: 20,
                X: 0.00,
                Y: 0.00,
                horizontalOffset: 0.00,
                verticalOffset: 0.00,
                infraredFunction: true,
                visibleLightFunction: true,
                wiperStatus: true,
                obstacleAvoidanceFunction: true,
                antiFallFunction: true,
                headlightStatus: true,
                chargingRoom: true,
                robotStatus: true
            }
        }
    }

    componentWillMount() {
        super.componentWillMount();
        AdminActions.Robot.retrieve();
    }

    handleSubmit = (e) => {
        e.preventDefault();

        this.props.form.validateFields((err, formData) => {
            if (!err) {
                console.log("表单信息：");
                console.log(formData);
                AdminActions.Robot.update(formData);
            }
        });
    }

    render() {
        const { getFieldDecorator, getFieldValue } = this.props.form;

        const {
            alertMode,
            breakMode,
            robotTravelSpeed,
            radarWarningRange,
            batteryCapacityAlarm,
            X,
            Y,
            horizontalOffset,
            verticalOffset,
            infraredFunction,
            visibleLightFunction,
            wiperStatus,
            obstacleAvoidanceFunction,
            antiFallFunction,
            headlightStatus,
            chargingRoom,
            robotStatus
        } = this.state.robotParams;

        return (
            <div id="robot-config">
            <Card >
            <Form
        hideRequiredMark
        onSubmit={this.handleSubmit}
    >
                <FormItem label="告警后执行机制" {...formItemLayout}>
                    {getFieldDecorator('alertMode', {
                        initialValue : alertMode
                    })(
                        actionMode
                    )}
                </FormItem>
                <FormItem label="中断后执行机制" {...formItemLayout}>
                    {getFieldDecorator('breakMode', {
                        initialValue : breakMode
                    })(
                        actionMode
                    )}
                </FormItem>
                <FormItem label="机器人行进速度" {...formItemLayout}>
                    {getFieldDecorator('robotTravelSpeed', {
                        initialValue: robotTravelSpeed
                    })(
                        <InputNumber step={0.1} min={0} />
                    )}
                    <span>m/s</span>
                </FormItem>
                <FormItem label="雷达报警距离" {...formItemLayout}>
                    {getFieldDecorator('radarWarningRange', {
                        initialValue: radarWarningRange
                    })(
                        <InputNumber step={0.1} min={0} />
                    )}
                    <span>m</span>
                </FormItem>
                <FormItem label="电池容量报警" {...formItemLayout}>
                    {getFieldDecorator('batteryCapacityAlarm', {
                        initialValue: batteryCapacityAlarm
                    })(
                        <InputNumber step={1} min={0} />
                    )}
                    <span>%</span>
                </FormItem>
                <FormItem label="云台初始位置X" {...formItemLayout}>
                    {getFieldDecorator('X', {
                        initialValue: X
                    })(
                        <InputNumber step={0.01} min={0} />
                    )}
                </FormItem>
                <FormItem label="云台初始位置Y" {...formItemLayout}>
                    {getFieldDecorator('Y', {
                        initialValue: Y
                    })(
                        <InputNumber step={0.01} min={0} />
                    )}
                </FormItem>
                <FormItem label="云台水平偏移量" {...formItemLayout}>
                    {getFieldDecorator('horizontalOffset', {
                        initialValue: horizontalOffset
                    })(
                        <InputNumber step={0.01} min={0} />
                    )}
                </FormItem>
                <FormItem label="云台垂直偏移量" {...formItemLayout}>
                    {getFieldDecorator('verticalOffset', {
                        initialValue: verticalOffset
                    })(
                        <InputNumber step={0.01} min={0} />
                    )}
                </FormItem>
                <FormItem label="红外功能" {...formItemLayout}>
                    {getFieldDecorator('infraredFunction', {
                        valuePropName: 'checked',
                        initialValue: infraredFunction
                    })(
                        <Toggle checkedChildren="开" unCheckedChildren="关"/>
                    )}
                </FormItem>
                <FormItem label="可见光功能" {...formItemLayout}>
                    {getFieldDecorator('visibleLightFunction', {
                        valuePropName: 'checked',
                        initialValue: visibleLightFunction
                    })(
                        <Toggle checkedChildren="开" unCheckedChildren="关"/>
                    )}
                </FormItem>
                <FormItem label="雨刷状态" {...formItemLayout}>
                    {getFieldDecorator('wiperStatus', {
                        valuePropName: 'checked',
                        initialValue: wiperStatus
                    })(
                        <Toggle checkedChildren="开" unCheckedChildren="关"/>
                    )}
                </FormItem>
                <FormItem label="避障功能" {...formItemLayout}>
                    {getFieldDecorator('obstacleAvoidanceFunction', {
                        valuePropName: 'checked',
                        initialValue: obstacleAvoidanceFunction
                    })(
                        <Toggle checkedChildren="开" unCheckedChildren="关"/>
                    )}
                </FormItem>
                <FormItem label="防跌落功能" {...formItemLayout}>
                    {getFieldDecorator('antiFallFunction', {
                        valuePropName: 'checked',
                        initialValue: antiFallFunction
                    })(
                        <Toggle checkedChildren="开" unCheckedChildren="关"/>
                    )}
                </FormItem>
                <FormItem label="车灯状态" {...formItemLayout}>
                    {getFieldDecorator('headlightStatus', {
                        valuePropName: 'checked',
                        initialValue: headlightStatus
                    })(
                        <Toggle checkedChildren="开" unCheckedChildren="关"/>
                    )}
                </FormItem>
                <FormItem label="充电房" {...formItemLayout}>
                    {getFieldDecorator('chargingRoom', {
                        valuePropName: 'checked',
                        initialValue: chargingRoom
                    })(
                        <Toggle checkedChildren="开" unCheckedChildren="关"/>
                    )}
                </FormItem>
                <FormItem label="机器人状态" {...formItemLayout}>
                    {getFieldDecorator('robotStatus', {
                        valuePropName: 'checked',
                        initialValue: robotStatus
                    })(
                        <Toggle checkedChildren="开" unCheckedChildren="关"/>
                    )}
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

export default RobotSetting;