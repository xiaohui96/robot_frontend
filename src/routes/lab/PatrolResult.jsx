//依赖类
import React from 'react';
import Reflux from 'reflux';
import { Route } from 'react-router-dom';
import { Row, Col, Table, Card, Modal, Form, Icon, Select, Input, InputNumber, Button, Badge, Tooltip, DatePicker } from 'antd';
import ExportJsonExcel from 'js-export-excel';
//数据流
import AppActions from 'actions/AppActions';
import alarmStore from 'stores/patrolStore';


//组件类
import _Icon from 'components/Icon';
import {formItemLayoutInModal} from 'components/layout';
import intl from 'react-intl-universal';

import './OverallPatrol.less';
import withModal from "HOC/withModal";
const FormItem = Form.Item;
const Option = Select.Option;
const Column = Table.Column;
//
class PatrolResult extends Reflux.Component {
    constructor(props) {
        super(props);
        this.store = alarmStore;
        this.storeKeys = ['patrolList'];
        this.state = {
            patrolList:[],
            filteredInfo: {},
            selectedRows:[],
        };
    }

    componentWillMount() {
        //console.log("test Reports");
        super.componentWillMount();
        AppActions.Patrol.retrieve();
    }

    handleFormChange = (formData) => {
        if (formData === null) {
            this.setState({
                filteredInfo:{},
                selectedRows:[],
            })
        } else {
            this.setState( prevState=>({
                filteredInfo: {...prevState.filteredInfo, ...formData},
                selectedRows:[],
            }));
        }
    }

    handleSelectRows = (rows) => {
        this.setState({
            selectedRows: rows,
        });
    }

    downloadExcel = () => {
        const data = this.state.patrolList ? this.state.patrolList : '';//表格数据
        var option={};
        let dataTable = [];
        if (data) {
            for (let i in data) {
                if(data){
                    let obj = {
                        '序号': data[i].id,
                        '识别类型': data[i].recognitionType,
                        '点位名称': data[i].location,
                        '识别结果': data[i].recognitionValue,
                        '告警等级': data[i].alarmType,
                        '识别时间': data[i].recognitionTime,
                        '采集信息': data[i].collectInformation,


                    }
                    dataTable.push(obj);
                }
            }
        }
        option.fileName = '巡检结果报告'
        option.datas=[
            {
                sheetData:dataTable,
                sheetName:'sheet',
                sheetFilter:['序号','识别类型','点位名称', '识别结果', '告警等级', '识别时间', '采集信息'],
                sheetHeader:['序号','识别类型','点位名称', '识别结果', '告警等级', '识别时间', '采集信息'],
            }
        ];

        var toExcel = new ExportJsonExcel(option);
        toExcel.saveExcel();
    }


    render() {
        const {patrolList,  filteredInfo, selectedRows} = this.state;
        return (
            <Card title={intl.get('patrol result')}>
                <FilterForm handleFormChange={this.handleFormChange}/>
                {
                    selectedRows.length > 0 && (
                        <span className="tableListOperator">
              <Button onClick={this.downloadExcel}>生成巡检结果报告</Button>
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
                    dataSource={patrolList}
                    //pagination显示分页
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
                    <Column  title={intl.get('id')} dataIndex="id"
                             sorter={(a, b) => a.id - b.id }
                    />
                    <Column  title={intl.get('recognition type')}
                             dataIndex="recognitionType"
                        //搜索
                             filteredValue= {filteredInfo.recognitionType ? [filteredInfo.recognitionType] : null}
                             onFilter= {(value, record) => record.recognitionType.includes(value)}
                    />
                    <Column  title={intl.get('location')}
                             dataIndex="location"
                        //搜索
                             filteredValue= {filteredInfo.location ? [filteredInfo.location] : null}
                             onFilter= {(value, record) => record.location.includes(value)}
                    />
                    <Column  title={intl.get('verified')}
                             dataIndex="verify"
                        //搜索
                             filteredValue= {filteredInfo.verify ? [filteredInfo.verify] : null}
                             onFilter= {(value, record) => record.verify.includes(value)}
                    />
                    <Column  title={intl.get('recognition Value')}
                             dataIndex="recognitionValue"
                        //搜索
                             filteredValue= {filteredInfo.recognitionValue ? [filteredInfo.recognitionValue] : null}
                             onFilter= {(value, record) => record.recognitionValue.includes(value)}
                    />
                    <Column  title={intl.get('alarm Type')}
                             dataIndex="alarmType"
                        //搜索
                             filteredValue= {filteredInfo.alarmType ? [filteredInfo.alarmType] : null}
                             onFilter= {(value, record) => record.alarmType.includes(value)}
                    />
                    <Column  title={intl.get('recognition Time')}
                             dataIndex="recognitionTime"
                        //搜索                             filteredValue= {filteredInfo.recognitionTime ? [filteredInfo.recognitionTime] : null}
                             onFilter= {(value, record) => record.recognitionTime.includes(value)}
                    />
                    <Column  title={intl.get('collect Information')}
                             dataIndex="collectInformation"
                        //搜索
                             filteredValue= {filteredInfo.collectInformation ? [filteredInfo.collectInformation] : null}
                             onFilter= {(value, record) => record.collectInformation.includes(value)}
                    />
                    <Column
                        title="操作"
                        width={100}
                        fixed='right'
                        key="operation"
                        render={(record) => (
                            <div className="table-operate">
                                <Tooltip title="编辑">
                                    <a onClick={()=> this.props.onEdit(record)}>
                                        <_Icon iconid="edit"></_Icon>
                                    </a>
                                </Tooltip>
                                <Tooltip title="删除">
                                    <a onClick={()=> this.props.onDelWithPara(record.location, record.id)}>
                                        <_Icon iconid="delete"></_Icon> </a>
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
            href: ''
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
                        <FormItem label=" 识别类型">
                            {getFieldDecorator('recognitionType')(
                                <Input placeholder="请输入要查询的识别类型" />
                            )}
                        </FormItem>
                    </Col>
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
class PatrolResultModal extends React.Component {
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

                var timestamp=new Date().getTime();
                formData.time =timestampToTime(timestamp);

                if (modalFormData.id) {
                    AppActions.Patrol.update(formData, callback);
                } else {
                    AppActions.Patrol.update(formData, this.props.selectedRows, callback)
                }
            }
        });
    }



    render() {
        const { getFieldDecorator} = this.props.form;
        const { visible, modalFormData  } = this.props;
        const { confirmLoading} = this.state;

        return (
            <div>

                <Modal
                    visible={visible}
                    title={modalFormData ? "巡检参数编辑" : "巡检参数批量编辑"}
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

                                    <FormItem    label="识别类型"  {...formItemLayoutInModal}>
                                        {/*<span className="ant-form-text">{modalFormData.account}</span>*/}
                                        {getFieldDecorator('recognitionType', {
                                            initialValue: modalFormData.recognitionType,
                                        })(
                                            <span>{ modalFormData.recognitionType}</span>
                                        )}
                                    </FormItem>

                                    <FormItem   label="点位名称"  {...formItemLayoutInModal} >
                                        {/*<span className="ant-form-text">{modalFormData.realName}</span>*/}
                                        {getFieldDecorator('location', {
                                            initialValue: modalFormData.location,
                                        })(
                                            <span>{ modalFormData.location}</span>
                                        )}
                                    </FormItem>
                                    <FormItem   label="识别结果"  {...formItemLayoutInModal} >
                                        {/*<span className="ant-form-text">{modalFormData.realName}</span>*/}
                                        {getFieldDecorator('recognitionValue', {
                                            initialValue: modalFormData.recognitionValue,
                                        })(
                                                <Input />
                                        )}
                                    </FormItem>

                                </>
                            )
                        }
                    </Form>
                </Modal>
            </div>
        )
    }
}
export default withModal(AppActions.Patrol, PatrolResultModal)(PatrolResult);