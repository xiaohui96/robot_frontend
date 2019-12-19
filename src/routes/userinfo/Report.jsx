//依赖类
import React from 'react';
import Reflux from 'reflux';
import { Table, Card, Modal, Form, Select, Switch, Input, InputNumber,Radio, Button,Progress, Badge, Tooltip, Upload,message, Icon as OldIcon} from 'antd';
import './Report.less';

//数据流
import AppActions from 'actions/AppActions';
import appStore from 'stores/appStore';
//import algorithmsStore from 'stores/algorithmsStore';
import reportsStore from 'stores/reportsStore';


//组件类
import Icon from 'components/Icon';
import {formItemLayoutInModal} from 'components/layout';

//HOC
import withModal from 'HOC/withModal';

//语言
import intl from 'react-intl-universal';
import axios from "utils/axios";

// import './Algorithm.less';

const FormItem = Form.Item;
const Option = Select.Option;
const Column = Table.Column;
const confirm = Modal.confirm;

class Report extends Reflux.Component {
    constructor(props) {
        super(props);
        this.stores =[
            appStore,
            reportsStore
        ];
        this.storeKeys = ['reportList'];
        this.state = {
            reportList: [],
        }
        //console.log(this.props)
    }
    componentDidMount() {
        const User=Reflux.GlobalState.authStore.User;
        const {plantInfo}=this.props;
        AppActions.Reports.retrieve(User,plantInfo,()=>{

        });

    }

    hideModal = () => {
        this.setState({
            progressVisible: false
        })
    }


    render() {
        const {reportList} = this.state;
        const User=Reflux.GlobalState.authStore.User;
        const {plantInfo}=this.props;
        //console.log(lastErrorAlgorithmId);
        return (
            <div>
                {/*实验报告的表格*/}
                <Card title={intl.get('my report')}>
                    <Button type="primary" className="add-new" onClick={this.props.onAdd}>
                        {intl.get('report uploading')}
                    </Button>
                    <Table
                        showHeader={true}
                        dataSource={reportList.privateList}
                        onRow={(record) => {
                            return {
                                //onDoubleClick: () => this.props.onEdit(record),
                            };
                        }}
                        rowKey="id"
                    >
                        <Column title={intl.get('name')} dataIndex="name"/>
                        <Column title={intl.get('account')} dataIndex="account" />
                        <Column title={intl.get('realname')} dataIndex="realname" />
                        <Column title={intl.get('last update')} dataIndex="lastUpdate" />
                        <Column
                            title={intl.get('operation')}
                            width={160}
                            key="operation"
                            render={(record) => (
                                <div className="table-operate">
                                    <Tooltip title={intl.get('edit')}>
                                        <a onClick={()=> this.props.onEdit(record)}>
                                            <Icon iconid="edit" ></Icon>
                                        </a>
                                    </Tooltip>
                                    <Tooltip title={intl.get('delete')}>
                                        <a onClick={()=> this.props.onDelWithPara(record.name, record.id,{User:User,plantInfo:plantInfo})}>
                                            <Icon iconid="delete"></Icon>
                                        </a>
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
class ReportModal extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            confirmLoading: false,
            fileList:[],
            fileData:null
        }
    }

    handleSubmit = (e) => {
        e.preventDefault();
        const User=Reflux.GlobalState.authStore.User;
        const {plantInfo}=this.props;


        this.props.form.validateFields((err, formData) => {
            if (!err) {
                const { modalFormData } = this.props;
                this.setState({
                    confirmLoading: true
                })
                //console.log(this.state);
                //数据交互完成后回调函数关闭Modal
                const callback = ()=> {
                    this.setState({
                        confirmLoading: false
                    });
                    this.props.hideModal();
                };

                if (modalFormData) {
                    AppActions.Reports.update(formData, modalFormData.id,{User:User,plantInfo:plantInfo}, callback);
                } else {
                    if(this.state.fileData==null) {
                        message.error(intl.get('report upload tip'));
                        this.setState({
                            confirmLoading: false
                        });
                    }else{
                        AppActions.Reports.create(formData,User.id,this.state.fileData,callback);
                    }

                }
            }
        });
    }

    resetFields=()=>{
        this.props.form.resetFields();
        this.setState({
            fileList:[],
            fileData:null
        });
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        const { visible, modalFormData,form } = this.props;
        const { confirmLoading } = this.state;
        const User=Reflux.GlobalState.authStore.User;

        const that=this;

        //console.log(this.props);

        const uploadProps = {
            name: 'pdf',
            multiple: false,
            action: '/api/putReportBin/'+User.id,
            headers: {
                authorization: 'authorization-text',
            },
            fileList:this.state.fileList,
            onChange(info) {
                //console.log("test info");
                //console.log(info);
                if (info.file.status !== 'uploading') {
                    if(info.fileList.length>1){
                        info.fileList.shift();
                    }
                    //console.log("哈哈哈");
                    //console.log(info.file, info.fileList);
                }
                if (info.file.status === 'done') {
                    //console.log("嘿嘿嘿");
                    //console.log(info.file);
                    //console.log(form);
                    if(info.file.response.data){
                        message.success(`${info.file.name} file uploaded successfully`);
                        form.setFieldsValue({
                            "name": info.file.response.data.originalName
                        });
                        that.setState({
                            fileData:info.file.response.data
                        });
                    }

                    //如果没有data对象，说明上传错误，或者上传文件非法
                    else{
                        message.error(`${info.file.name} file upload failed.`);
                        form.setFieldsValue({
                            "name": null
                        });
                        that.setState({
                            fileData:null
                        });
                        info.fileList=[];
                    }

                } else if (info.file.status === 'error') {
                    message.error(`${info.file.name} file upload failed.`);
                }
                that.setState({
                    fileList:info.fileList
                });
            },
        };

        return (
            <Modal
                visible={visible}
                title={modalFormData ? intl.get('report edit') : intl.get('report uploading')}
                maskClosable={true}
                confirmLoading={confirmLoading}
                onOk={this.handleSubmit}
                onCancel={this.props.hideModal}
                afterClose={this.resetFields}
                okText={modalFormData ? intl.get('modify') : intl.get('upload')}
                cancelText= {intl.get('cancel')}
            >
                <Form layout="horizontal" hideRequiredMark>
                    <FormItem
                        label={intl.get('report file')}

                        {...formItemLayoutInModal}
                    >
                        {getFieldDecorator('bin', {
                            rules: [{
                                required: true,
                                message: intl.get('input report file')
                            }],
                            validateTrigger: "onBlur",
                            initialValue: {}
                        })(
                            <Upload {...uploadProps}><Button disabled={modalFormData?true:false}>{intl.get('upload')}</Button></Upload>
                        )}
                    </FormItem>


                    <FormItem
                        label={intl.get('report name')} {...formItemLayoutInModal}>
                        {getFieldDecorator('name', {
                            rules: [{
                                required: true,
                                message: intl.get('report name tip')
                            }],
                            validateTrigger: "onBlur",
                            initialValue: modalFormData?.name || ""
                        })(
                            <Input placeholder={intl.get('report name tip')} />
                        )}
                    </FormItem>


                    <FormItem label={intl.get('share or not')} {...formItemLayoutInModal}>
                        {getFieldDecorator('public', {
                            valuePropName: 'checked',
                            initialValue: modalFormData?.public ?(modalFormData.public==0?false:true):false
                        })(
                            <Switch checkedChildren={intl.get('yes')} unCheckedChildren={intl.get('no')}/>
                        )}
                    </FormItem>

                </Form>
            </Modal>
        )
    }
}

//export default Report;
export default withModal(AppActions.Reports, ReportModal)(Report);

