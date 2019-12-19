//依赖类
import React from 'react';
import Reflux from 'reflux';
import { Route } from 'react-router-dom';
import { Row, Col, Table, Card, Modal, Form, Icon, Select, Input, InputNumber, Button, Badge, Tooltip, DatePicker } from 'antd';
import moment from 'moment';
import XLSX from 'xlsx';

//数据流
import appStore from 'stores/appStore';
import AppActions from 'actions/AppActions';
import scoreStore from 'stores/scoreStore';
import ExportJsonExcel from 'js-export-excel';

//组件类
import _Icon from 'components/Icon';
import {formItemLayoutInModal} from 'components/layout';

//HOC
import withModal from 'HOC/withModal';

import './StudentsResult.less';
var tmpDown;
const FormItem = Form.Item;
const Option = Select.Option;
const Column = Table.Column;
const { MonthPicker, RangePicker, WeekPicker } = DatePicker;
//
class StudentsResult extends Reflux.Component {
    constructor(props) {
        super(props);
        this.store = scoreStore;
        this.storeKeys = ['scoreList'];
        this.state = {
            scoreList:[],
            filteredInfo: {},
            selectedRows:[],
            //href: ''
        };
    }




    componentWillMount() {
        //console.log("test Reports");
        super.componentWillMount();
        AppActions.Score.retrieve();
    }

    onLock = (record) => {
        Modal.confirm({
            title: `确定要锁定 ${record.account} 吗?`,
            okText: "确定",
            cancelText: "取消",
            onOk() {
                return new Promise((resolve,reject)=>{
                    AppActions.Score.retrieve(record.id, () => resolve());
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


    render() {
        const {scoreList, filteredInfo, selectedRows } = this.state;
        console.log(scoreList);

        return (
            <Card id="score-config">
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
                    dataSource={scoreList}
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
                    <Column
                        title="用户名"
                        dataIndex="account"
                        width={300}
                        fixed="left"
                        filteredValue= {filteredInfo.account ? [filteredInfo.account] : null}
                        onFilter= {(value, record) => record.account.includes(value)}
                    />
                    <Column
                        title="姓名"
                        dataIndex="realname"
                        width={300}
                        fixed="left"
                        filteredValue= {filteredInfo.realname ? [filteredInfo.realname] : null}
                        onFilter= {(value, record) => record.realname.includes(value)}
                    />
                    <Column
                        title="实验报告名称"
                        dataIndex="name"
                        width={300}
                        filteredValue= {filteredInfo.name ? [filteredInfo.name] : null}
                        onFilter= {(value, record) => record.name.includes(value)}
                    />
                    <Column
                        title="实验报告成绩"
                        dataIndex="report_score"
                        width={310}
                        filteredValue= {filteredInfo.report_score ? [filteredInfo.report_score] : null}
                        onFilter= {(value, record) => record.report_score.includes(value)}
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

    //下载模版：
    downloadExl = (json,type) =>{
        var tmpdata = json[0];
        json.unshift({});
        var keyMap = []; //获取keys
        for (var k in tmpdata) {
            keyMap.push(k);
            json[0][k] = k;
        }
        var tmpdata = [];//用来保存转换好的json
        json.map((v, i) => keyMap.map((k, j) => Object.assign({}, {
            v: v[k],
            position: (j > 25 ? this.getCharCol(j) : String.fromCharCode(65 + j)) + (i + 1)
        }))).reduce((prev, next) => prev.concat(next)).forEach((v, i) => tmpdata[v.position] = {
            v: v.v
        });
        var outputPos = Object.keys(tmpdata); //设置区域,比如表格从A1到D10
        var tmpWB = {
            SheetNames: ['mySheet'], //保存的表标题
            Sheets: {
                'mySheet': Object.assign({},
                    tmpdata, //内容
                    {
                        '!ref': outputPos[0] + ':' + outputPos[outputPos.length - 1] //设置填充区域
                    })
            }
        };
        tmpDown = new Blob([this.s2ab(XLSX.write(tmpWB,
            {bookType: (type == undefined ? 'xlsx':type),bookSST: false, type: 'binary'}//这里的数据是用来定义导出的格式类型
        ))], {
            type: ""
        }); //创建二进制对象写入转换好的字节流
        var href = URL.createObjectURL(tmpDown); //创建对象超链接
        this.state.href=href;
        setTimeout(function() { //延时释放
            URL.revokeObjectURL(tmpDown); //用URL.revokeObjectURL()来释放这个object URL
        }, 100);
    }

    s2ab=(s)=> { //字符串转字符流
        var buf = new ArrayBuffer(s.length);
        var view = new Uint8Array(buf);
        for (var i = 0; i != s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
        return buf;
    }
    // 将指定的自然数转换为26进制表示。映射关系：[0-25] -> [A-Z]。
    getCharCol=(n)=> {
        let temCol = '',
            s = '',
            m = 0
        while (n > 0) {
            m = n % 26 + 1
            s = String.fromCharCode(m + 64) + s
            n = (n - m) / 26
        }
        return s
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
        const {formSimple,href,scoreList} = this.state;
        const {getFieldDecorator} = this.props.form;
        const obj = [{
            "活动开始时间": "1/2/19",
            "活动结束时间": "1/2/19",
            "活动地点": "123",
        }];
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
                        <FormItem label=" 用户名">
                            {getFieldDecorator('account')(
                                <Input placeholder="请输入要查询的用户名" />
                            )}
                        </FormItem>
                    </Col>
                    <a href={href} download={'学生成绩.xlsx'}>成绩下载</a>
                    {this.downloadExl(obj)}
                    { formSimple ? null :
                        <Col lg={8} md={12} sm={24}>
                            <FormItem label="姓名">
                                {getFieldDecorator('realname')(
                                    <Input placeholder="请输入要查询的姓名" />
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
class StudentsResultModal extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            confirmLoading: false
        }
    }

    handleSubmit = (e) => {
        e.preventDefault();
        const User=Reflux.GlobalState.authStore.User;
        const {plantInfo}=this.props;

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

                var timestamp=new Date().getTime();
                formData.time =timestampToTime(timestamp);

                if (modalFormData.id) {
                    AppActions.Score.update(formData, modalFormData.id,{User:User,plantInfo:plantInfo}, callback);
                    console.log("传递数据:");
                    console.log(formData);
                } else {
                    AppActions.Score.update(formData, this.props.selectedRows, callback)
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
                    title={modalFormData ? "用户成绩编辑" : "用户成绩批量编辑"}
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

                                    <FormItem   label="成绩"  {...formItemLayoutInModal} >
                                        {/*<span className="ant-form-text">{modalFormData.realName}</span>*/}
                                        {getFieldDecorator('report_score', {
                                            initialValue: modalFormData.report_score,
                                        })(
                                            (
                                                <Input />
                                            )
                                            //<span>{ modalFormData.report_score}</span>
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

export default withModal(AppActions.Score, StudentsResultModal)(StudentsResult);
