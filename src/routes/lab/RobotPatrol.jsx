//依赖类
import React from 'react';
import Reflux from 'reflux';
import { Table, Card, Modal, Form, Select, Switch, Input, InputNumber,Radio, Button,Progress, Badge, Tooltip, Upload,message, Icon as OldIcon} from 'antd';
import './RobotPatrol.less';

//数据流
import AppActions from 'actions/AppActions';
import appStore from 'stores/appStore';
//import algorithmsStore from 'stores/algorithmsStore';
import alarmStore from 'stores/alarmStore';


//组件类
import _Icon from 'components/Icon';
import {formItemLayoutInModal} from 'components/layout';

//HOC
import withModal from 'HOC/withModal';

//语言
import intl from 'react-intl-universal';
import axios from "utils/axios";
import {camera} from "routes/userinfo/camera";

// import './Algorithm.less';

const FormItem = Form.Item;
const Option = Select.Option;
const Column = Table.Column;
const confirm = Modal.confirm;
const review = (
    <Select>
        <Option value={"审核通过"}>审核通过</Option>
        <Option value={"审核不通过"}>审核不通过</Option>
        <Option value={"审核待定"}>待定</Option>
    </Select>
);
class RobotPatrol extends Reflux.Component {
    constructor(props) {
        super(props);
        this.stores =[
            appStore,
            alarmStore
        ];
        this.storeKeys = ['alarmList'];
        this.state = {
           alarmList: [],
        }
        //console.log(this.props)
    }
    componentDidMount() {
        AppActions.Alarm.retrieve(()=>{
        });

    }

    hideModal = () => {
        this.setState({
            progressVisible: false
        })
    }


    render() {
        const {alarmList} = this.state;
        //console.log(lastErrorAlgorithmId);
        return (
            <div>
                {/*实验报告的表格*/}
                <Card title={intl.get('device alarm information')}>
                    <Button type="primary" className="add-new" onClick={()=>camera.getMedia()  }>
                        {intl.get('open map')}
                    </Button>
                    <Button type="primary" className="add-new" onClick={()=>camera.takePhoto()  }>
                        {intl.get('open video')}
                    </Button>
                    <video id="video" width="300px" height="300px" autoPlay="autoplay">
                    </video>
                    <canvas id="canvas" width="600px" height="400px">
                    </canvas>
                    <Table
                        showHeader={true}
                        dataSource={alarmList}
                        onRow={(record) => {
                            return {
                                //onDoubleClick: () => this.props.onEdit(record),
                            };
                        }}
                        rowKey="id"
                    >
                        <Column title={intl.get('id')} dataIndex="id"/>
                        <Column title={intl.get('stationId')} dataIndex="stationId" />
                        <Column title={intl.get('deviceId')} dataIndex="deviceId" />
                        <Column title={intl.get('robotName')} dataIndex="robotName" />
                        <Column title={intl.get('alarmType')} dataIndex="alarmType" />
                        <Column title={intl.get('alarmLevel')} dataIndex="alarmLevel" />
                        <Column title={intl.get('alarmTime')} dataIndex="alarmTime" />
                        <Column title={intl.get('alarmDescription')} dataIndex="alarmDescription" />
                        <Column title={intl.get('verified')} dataIndex="verified" review/>
                        <Column
                            title="操作"
                            width={300}
                            fixed='right'
                            key="operation"
                            render={(record) => (
                                <div className="table-operate">
                                    <Tooltip title="审核">
                                        <a onClick={()=> this.props.onEdit(record)}>
                                            <_Icon iconid="edit"></_Icon>
                                        </a>
                                    </Tooltip>
                                    <Tooltip title="删除">
                                        <a onClick={()=> this.props.onDelWithPara(record.alarmDescription, record.id)}>
                                            <_Icon iconid="delete"></_Icon> </a>
                                    </Tooltip>
                                </div>
                            )}
                        />
                    </Table>
                </Card>

            </div>
        )
    }
}
@Form.create()
class RobotPatrolModal extends React.Component {
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

                if ( modalFormData.id ) {
                    AppActions.Alarm.patrolupdate(formData, callback);
                } else {
                    AppActions.Alarm.create(formData, callback)
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
                title={ "审核" }
                maskClosable={true}
                confirmLoading={confirmLoading}
                onOk={this.handleSubmit}
                onCancel={this.props.hideModal}
                afterClose={this.props.form.resetFields}
                okText={"修改"}
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
                                        <Input />
                                    )}

                                </FormItem>
                                <FormItem    label="审核"  {...formItemLayoutInModal}>
                                    {/*<span className="ant-form-text">{modalFormData.account}</span>*/}
                                    {getFieldDecorator('verified', {
                                        initialValue: modalFormData.verified,
                                    })(
                                        review
                                    )}
                                </FormItem>
                            </>
                        )
                    }
                </Form>
            </Modal>
        )
    }
}
export default withModal(AppActions.Alarm, RobotPatrolModal)(RobotPatrol);

