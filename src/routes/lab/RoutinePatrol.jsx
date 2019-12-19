//依赖类
import React from 'react';
import Reflux from 'reflux';
import { Route } from 'react-router-dom';
import { Row, Col, Table, Card, Modal, Form, Icon, Select, Input, InputNumber, Button, Badge, Tooltip, DatePicker } from 'antd';

//数据流
import AppActions from 'actions/AppActions';
import alarmStore from 'stores/alarmStore';


//组件类
import _Icon from 'components/Icon';
import {formItemLayoutInModal} from 'components/layout';
import intl from 'react-intl-universal';

import './OverallPatrol.less';
const FormItem = Form.Item;
const Option = Select.Option;
const Column = Table.Column;
//
class SpecialPatrol extends Reflux.Component {
    constructor(props) {
        super(props);
        this.store = alarmStore;
        this.storeKeys = ['PatrolParametersList'];
        this.state = {
            PatrolParametersList:[],
            filteredInfo: {},
            selectedRows:[],
        };
    }

    componentWillMount() {
        //console.log("test Reports");
        super.componentWillMount();
        AppActions.Alarm.retrieve();
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

    bulkDeletion = () => {
        const {selectedRows} = this.state;
        Modal.confirm({
            title: `确定批量删除 ${this.state.selectedRows.length} 个实验报告吗?`,
            okText: "确定",
            cancelText: "取消",
            onOk() {
                return new Promise((resolve,reject)=>{
                    AppActions.Score.retrieve(selectedRows, () => resolve());
                })
            }
        });
    }

    downloadExcel = () => {
        const data = this.state.scoreList ? this.state.scoreList : '';//表格数据
        var option={};
        let dataTable = [];
        if (data) {
            for (let i in data) {
                if(data){
                    let obj = {
                        '用户名': data[i].account,
                        '姓名': data[i].realname,
                        '成绩': data[i].report_score,
                        '实验报告名称': data[i].name,
                    }
                    dataTable.push(obj);
                }
            }
        }
        option.fileName = '学生成绩'
        option.datas=[
            {
                sheetData:dataTable,
                sheetName:'sheet',
                sheetFilter:['用户名','姓名','成绩', '实验报告名称'],
                sheetHeader:['用户名','姓名','成绩', '实验报告名称'],
            }
        ];

        var toExcel = new ExportJsonExcel(option);
        toExcel.saveExcel();
    }


    render() {
        const {PatrolParametersList, selectedRows} = this.state;
        return (
            <Card title={intl.get('routine patrol')}>
                {
                    selectedRows.length > 0 && (
                        <span className="tableListOperator">
                <Button onClick={this.downloadExcel}>成绩导出</Button>
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
                    dataSource={PatrolParametersList}
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
                            //onDoubleClick: () => this.props.onEdit(record),
                        };
                    }}
                >
                    <Column  title={intl.get('patrol type')} dataIndex="id"/>
                    <Column  dataIndex="patrolName" />
                    <Column  dataIndex="property" />
                </Table>
            </Card>
        )
    }
}
export default SpecialPatrol;
