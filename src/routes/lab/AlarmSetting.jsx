//依赖类
import React from 'react';
import Reflux from 'reflux';
import { Route } from 'react-router-dom';
import { Row, Col, Table, Card, Modal, Form, Icon, Select, Input, InputNumber, Button, Badge, Tooltip, DatePicker } from 'antd';
//数据流
import AppActions from 'actions/AppActions';
import alarmSettingStore from 'stores/alarmSettingStore';


//组件类
import _Icon from 'components/Icon';
import {formItemLayoutInModal} from 'components/layout';
import intl from 'react-intl-universal';

import './OverallPatrol.less';
import withModal from "HOC/withModal";
import ExportJsonExcel from "js-export-excel";
const FormItem = Form.Item;
const Option = Select.Option;
const Column = Table.Column;
//
class AlarmSetting extends Reflux.Component {
    constructor(props) {
        super(props);
        this.store = alarmSettingStore;
        this.storeKeys = ['alarmSettingList'];
        this.state = {
            alarmSettingList:[],
            filteredInfo: {},
            selectedRows:[],
        };
    }

    componentWillMount() {
        super.componentWillMount();
        AppActions.AlarmSetting.retrieve();
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
        const data = this.state.alarmSettingList ? this.state.alarmSettingList : '';//表格数据
        var option={};
        let dataTable = [];
        if (data) {
            for (let i in data) {
                if(data){
                    let obj = {
                        '序号': data[i].id,
                        '名称': data[i].name,
                        '上阈值': data[i].upValue,
                        '下阈值': data[i].downValue,

                    }
                    dataTable.push(obj);
                }
            }
        }
        option.fileName = '阈值报告'
        option.datas=[
            {
                sheetData:dataTable,
                sheetName:'sheet',
                sheetFilter:['序号','名称','上阈值', '下阈值'],
                sheetHeader:['序号','名称','上阈值', '下阈值'],
            }
        ];

        var toExcel = new ExportJsonExcel(option);
        toExcel.saveExcel();
    }

    render() {
        const {alarmSettingList,  filteredInfo, selectedRows} = this.state;
        return (
            <Card title={intl.get('Alarm Threshold')}>
                <FilterForm handleFormChange={this.handleFormChange}/>
                {
                    selectedRows.length > 0 && (
                        <span className="tableListOperator">
              <Button onClick={this.downloadExcel}>生成报警阈值报表</Button>
            </span>
                    )
                }
                <Button type="primary" className="add-new" onClick={this.props.onAddMap}>新建报警阈值</Button>
                <Table
                showHeader={true}
                rowSelection={{
                    selectedRowKeys:selectedRows,
                    onChange:this.handleSelectRows,
                    fixed:true,
                }}
                dataSource={alarmSettingList}
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
                    <Column  title={intl.get('name')}
                             dataIndex="name"
                             filteredValue= {filteredInfo.name ? [filteredInfo.name] : null}
                             onFilter= {(value, record) => record.name.includes(value)}
                    />
                    <Column  title={intl.get('upValue')}
                             dataIndex="upValue"
                             filteredValue= {filteredInfo.upValue ? [filteredInfo.upValue] : null}
                             onFilter= {(value, record) => record.upValue.includes(value)}
                    />
                    <Column  title={intl.get('downValue')}
                             dataIndex="downValue"
                             filteredValue= {filteredInfo.downValue ? [filteredInfo.downValue] : null}
                             onFilter= {(value, record) => record.downValue.includes(value)}
                    />
                    <Column
                    title="操作"
                    width={300}
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
                                <a onClick={()=> this.props.onDelWithPara(record.name, record.id)}>
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
                        <FormItem label=" 名称">
                            {getFieldDecorator('name')(
                                <Input placeholder="请输入要查询的阈值名称" />
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
class AlarmSettingModal extends React.Component {
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
                if (modalFormData.id) {
                    AppActions.AlarmSetting.update(formData, callback);
                } else {
                    AppActions.AlarmSetting.create(formData, callback)
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
                    title={modalFormData ?.id? "阈值编辑" : "新建报警阈值"}
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
                                        })
                                        (
                                            <Input />
                                        )}

                                    </FormItem>
                                    <FormItem    label="名称"  {...formItemLayoutInModal}>
                                        {/*<span className="ant-form-text">{modalFormData.account}</span>*/}
                                        {getFieldDecorator('name', {
                                            initialValue: modalFormData.name,
                                        })(
                                            <Input />
                                        )}
                                    </FormItem>
                                    <FormItem    label="阈值上限"  {...formItemLayoutInModal}>
                                        {getFieldDecorator('upValue', {
                                            initialValue: modalFormData.upValue,
                                        })(
                                            <InputNumber step={0.1}  />
                                        )}
                                    </FormItem>
                                    <FormItem    label="阈值下限"  {...formItemLayoutInModal}>
                                        {getFieldDecorator('downValue', {
                                            initialValue: modalFormData.downValue,
                                        })(
                                            <InputNumber step={0.1}  />
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
export default withModal(AppActions.AlarmSetting, AlarmSettingModal)(AlarmSetting);
