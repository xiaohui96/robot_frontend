//依赖类
import React from 'react';
import Reflux from 'reflux';
import { Table, Card, Modal, Form, Select, Switch, Input, InputNumber,Radio, Button,Progress, Badge, Tooltip, Upload,message, Icon as OldIcon} from 'antd';
import './RobotPatrol.less';

//数据流
import AppActions from 'actions/AppActions';
import mapStore from 'stores/mapStore';


//组件类
import _Icon from 'components/Icon';
import {formItemLayoutInModal} from 'components/layout';
import withModal from "HOC/withModal";

//语言
import intl from 'react-intl-universal';

const FormItem = Form.Item;
const Option = Select.Option;
const Column = Table.Column;
const confirm = Modal.confirm;
class MapSetting extends Reflux.Component {
    constructor(props) {
        super(props);
        this.stores =[
            mapStore
        ];
        this.storeKeys = ['mapList'];
        this.state = {
            mapList: [],
        }
    }
    componentDidMount() {
        AppActions.Map.retrieve(()=>{
        });

    }

    hideModal = () => {
        this.setState({
            ModalVisible: false
        })
    }


    render() {
        const {mapList} = this.state;
        //可以生成多级嵌套的树
        //let mapTree = [];
        let list = mapList.reduce(function(prev, item){
            prev[item.parentId]?prev[item.parentId].push(item):prev[item.parentId] = [item];
            return prev
        },{});


        for (let key in list) {
            list[key].forEach(function (item) {
                item.children = list[item.id] ? list[item.id] : [];
            });
        }
        const mapTree = list[0];
        //console.log(mapTree);
        return (
            <div>
                <Button type="primary" className="add-new" onClick={this.props.onAddMap}>新建地图点</Button>
                <Card >
                    <Table
                        showHeader={true}
                        dataSource={mapTree}
                        onRow={(record) => {
                            return {
                                //onDoubleClick: () => this.props.onEdit(record),
                            };
                        }}
                        rowKey="id"
                    >
                        <Column title={intl.get('title')} dataIndex="title"/>
                        <Column title={intl.get('id')} dataIndex="id"/>
                        <Column title={intl.get('parentId')} dataIndex="parentId"/>
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
                                        <a onClick={()=> this.props.onDelWithPara(record.title, record.id)}>
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
class MapModal extends React.Component {
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
                    AppActions.Map.update(formData, callback);
                } else {
                    AppActions.Map.create(formData, callback)
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
                title={modalFormData ?.id? "配置地图点" : "新建地图点"}
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

                                <FormItem    label="名称"  {...formItemLayoutInModal}>
                                    {/*<span className="ant-form-text">{modalFormData.account}</span>*/}
                                    {getFieldDecorator('title', {
                                        initialValue: modalFormData.title,
                                    })(
                                        <Input />
                                    )}
                                </FormItem>

                                <FormItem    label="层级"  {...formItemLayoutInModal}>
                                    {/*<span className="ant-form-text">{modalFormData.account}</span>*/}
                                    {getFieldDecorator('parentId', {
                                        initialValue: modalFormData.parentId,
                                    })(
                                        <Input />
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
export default withModal(AppActions.Map, MapModal)(MapSetting);