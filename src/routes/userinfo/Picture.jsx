//依赖类
import React from 'react';
import Reflux from 'reflux';
import { Table, Card, Modal, Form, Select, Switch, Input, InputNumber,Radio, Button,Progress, Badge, Tooltip, Upload,message, Icon as OldIcon} from 'antd';
import './Picture.less';

//数据流
import AppActions from 'actions/AppActions';
import appStore from 'stores/appStore';
//import algorithmsStore from 'stores/algorithmsStore';
import picturesStore from 'stores/picturesStore';


//组件类
import Icon from 'components/Icon';
import {formItemLayoutInModal} from 'components/layout';
import {camera} from './camera.js'
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

class Picture extends Reflux.Component {
    constructor(props) {
        super(props);
        this.stores =[
            appStore,
            picturesStore
        ];
        this.storeKeys = ['pictureList','result'];
        this.state = {
            pictureList: [],
        }
        //console.log(this.props)
    }
    componentDidMount() {
        //super.componentDidMount();
        const User=Reflux.GlobalState.authStore.User;
        const {plantInfo}=this.props;


        //console.log("Did mount");
        //先获得算法列表algorithmList，然后再获得当前算法activeAlgorithmId，存放在state中
        AppActions.Pictures.retrieve(User,plantInfo,()=>{
            //plantInfo.copyNum=parseInt(copyNum);
            //AppActions.GetCurrentAlgorithm(plantInfo,this.onAlgorithmChange);
        });

    }

    hideModal = () => {
        this.setState({
            progressVisible: false
        })
    }


    render() {
        const {pictureList} = this.state;
        const User=Reflux.GlobalState.authStore.User;
        const {plantInfo}=this.props;
        //console.log("test pictureList");
        //console.log(pictureList.privateList);
        return (
            <div>
                {/*个人照片的表格*/}
                <Card title={intl.get('my picture')}>
                    <Button type="primary" className="add-new" onClick={this.props.onAdd}>
                        {intl.get('picture uploading')}
                    </Button>
                    <Button type="primary" className="add-new" onClick={()=>  AppActions.Pictures.compare(pictureList.privateList[0],pictureList.privateList[1])}>
                        {intl.get('picture compare')}
                    </Button>
                    <Button type="primary" className="add-new" onClick={()=>camera.getMedia()  }>
                        {intl.get('open camera')}
                    </Button>
                    <Button type="primary" className="add-new" onClick={()=>camera.takePhoto()  }>
                        {intl.get('take photo')}
                    </Button>
                    <video id="video" width="300px" height="300px" autoPlay="autoplay">
                    </video>
                    <canvas id="canvas" width="600px" height="400px">
                    </canvas>
                    <Table
                        showHeader={true}
                        dataSource={pictureList.privateList}
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
                                    <Tooltip title={intl.get('view')}>
                                        <a onClick={()=>  window.open('https://www.powersim.whu.edu.cn/images2/'+record.name)}>
                                            <Icon iconid="preview"></Icon>
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
class PictureModal extends React.Component {
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
                    AppActions.Pictures.update(formData, modalFormData.id,{User:User,plantInfo:plantInfo}, callback);
                } else {
                    if(this.state.fileData==null) {
                        message.error(intl.get('report upload tip'));
                        this.setState({
                            confirmLoading: false
                        });
                    }else{
                        AppActions.Pictures.create(formData,User.id,this.state.fileData,callback);
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
            name: 'jpeg',
            multiple: false,
            action: '/api/putPictureBin/'+User.id,
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
                title={modalFormData ? intl.get('picture edit') : intl.get('picture uploading')}
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
                        label={intl.get('picture file')}

                        {...formItemLayoutInModal}
                    >
                        {getFieldDecorator('bin', {
                            rules: [{
                                required: true,
                                message: intl.get('input picture file')
                            }],
                            validateTrigger: "onBlur",
                            initialValue: {}
                        })(
                            <Upload {...uploadProps}><Button disabled={modalFormData?true:false}>{intl.get('upload')}</Button></Upload>
                        )}
                    </FormItem>


                    <FormItem
                        label={intl.get('picture name')} {...formItemLayoutInModal}>
                        {getFieldDecorator('name', {
                            rules: [{
                                required: true,
                                message: intl.get('picture name tip')
                            }],
                            validateTrigger: "onBlur",
                            initialValue: modalFormData?.name || ""
                        })(
                            <Input placeholder={intl.get('picture name tip')} />
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
export default withModal(AppActions.Pictures, PictureModal)(Picture);

