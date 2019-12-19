//依赖类
import React from 'react';
import Reflux from 'reflux';
import { Route } from 'react-router-dom';
import { Table, Card, Modal, Form, Select, Switch, Input, InputNumber,Radio, Button, Badge, Tooltip} from 'antd';

//数据流
import AdminActions from 'actions/AdminActions';
import camerasStore from 'stores/camerasStore';
import labsStore from 'stores/labsStore';

//组件类
import Icon from 'components/Icon';
import {formItemLayoutInModal} from 'components/layout';

//HOC
import withModal from 'HOC/withModal';

// import './CamerasConfig.less';

const FormItem = Form.Item;
const Option = Select.Option;
const Column = Table.Column;

class CamerasConfig extends Reflux.Component {
  constructor(props) {
    super(props);
    this.stores = [
        camerasStore,
        labsStore];
    this.storeKeys = ['camerasList','testRigsList'];
    this.state = {
      camerasList:[],

      //cameraModalVisible:false,
      //cameraModalFormData: null//added 20190422

        testRigsList:[],
      CamerasModalVisible: false,
      CamerasModalFormData: null,

    }
  }

  componentWillMount() {
    super.componentWillMount();
    AdminActions.Cameras.retrieve();
      // AdminActions.TestRigs.retrieve();
  }
    componentDidMount() {
    AdminActions.TestRigs.retrieve();
    }

    hideModal = () => {
        this.setState({
            CamerasModalVisible: false
        })
    }

    onAddCameras = () => {
        this.setState({
            CamerasModalVisible: true,
            CamerasModalFormData: null

        })
    }

    onEditCameras = (record) => {
        this.setState({
            CamerasModalVisible: true,
            CamerasModalFormData: record
        });
        // console.log(record);
    }

    onDelCameras= (record) => {
        Modal.confirm({
            title: `确定要删除 ${record.nameCN} 吗?`,
            okText: "确定",
            cancelText: "取消",
            onOk() {
                return new Promise((resolve,reject)=>{
                    AdminActions.Cameras.delete(record.id, () => resolve());
                })
            }
        });
    }

  render() {
    const {camerasList,testRigsList,CamerasModalVisible, CamerasModalFormData} = this.state;
    console.log(testRigsList)
    return (
      <Card >
        <Button type="primary" className="add-new" onClick={this.onAddCameras}>新建摄像机</Button>
        <Table
          showHeader={true}
          dataSource={camerasList}
          pagination={{
            showTotal: (total) => `总共 ${total} 项记录`
          }}
          onRow={(record) => {
            return {
              onDoubleClick: () => this.onEditCameras(record),
            };
          }}
					rowKey="id"
        >
          <Column title="名称" dataIndex="nameCN"/>
          <Column
            title="视频尺寸 (宽 × 高)"
            key="size"
            render={(record) => `${record.width} × ${record.height}`}
          />
          <Column title="监视设备" dataIndex="testRigName" />
          <Column
            title="相机状态"
            dataIndex="statusCode"
            filters={[
              { text: "已停用", value: 0},
              { text: "已启用", value: 1},
              { text: "运行中", value: 2},
            ]}
            onFilter={(value, record) => record.statusCode == value}
            render={(statusCode) => {
              switch (statusCode) {
                case 0: return <Badge status={"default"} text={"已停用"}/>
                case 1: return <Badge status={"success"} text={"已启用"}/>
                case 2: return <Badge status={"processing"} text={"运行中"}/>
                default: return <Badge status={"warning"} text={"未知状态"}/>
              }
            }}
          />
          <Column
            title="操作"
            width={120}
            key="operation"
            render={(record) => (
              <div className="table-operate">
                <Tooltip title="预览">
                  <a href={record.webURL} target="_blank"><Icon iconid="preview"></Icon> </a>
                </Tooltip>
                <Tooltip title="编辑">
                  <a onClick={()=> this.onEditCameras(record)}><Icon iconid="edit"></Icon> </a>
                </Tooltip>
                <Tooltip title="删除">
                  <a onClick={()=> this.onDelCameras(record)}><Icon iconid="delete"></Icon> </a>
                </Tooltip>
              </div>
            )}
          />
        </Table>
        <CameraModal visible={CamerasModalVisible} hideModal={this.hideModal} modalFormData={CamerasModalFormData} testRigsList={testRigsList}/>
      </Card>
    )
  }
}

@Form.create()
class CameraModal extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      confirmLoading: false,
    }
  }
    renderOptions = () =>{
        const { testRigsList } = this.props;
        console.log(testRigsList);

        // console.log(list);
        return testRigsList.map(element =>
            <Option key={element.id} value={element.id}> {element.nameCN}</Option>)
    }

//added 20190422
   getRigId = (record) => {
    this.setState({
      cameraModalVisible: true,
      cameraModalFormData: {
        rigid: record.id
      }
    })
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

        if (modalFormData) {
          AdminActions.Cameras.update(formData, modalFormData.id, callback);
        } else {
          AdminActions.Cameras.create(formData, callback)
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
        title={modalFormData ? "配置摄像机" : "新建摄像机"}
        maskClosable={true}
        confirmLoading={confirmLoading}
        onOk={this.handleSubmit}
        onCancel={this.props.hideModal}
        afterClose={this.props.form.resetFields}
        okText={modalFormData ? "修改" : "新建"}
        cancelText="取消"
      >
        <Form layout="horizontal" hideRequiredMark>
          <FormItem label="摄像机名称" {...formItemLayoutInModal}>
            {getFieldDecorator('nameCN', {
              rules: [{
                required: true,
                message: '请输入摄像机名称！'
              }],
              validateTrigger: "onBlur",
              initialValue: modalFormData?.nameCN || ""
            })(
              <Input placeholder="请输入摄像机中文名称" />
            )}
          </FormItem>

          <FormItem label="英文名称" {...formItemLayoutInModal}>
            {getFieldDecorator('nameEN', {
              rules: [{
                required: true,
                message: '请输入摄像机英文名称！'
              }],
              validateTrigger: "onBlur",
              initialValue: modalFormData?.nameEN || ""
            })(
              <Input placeholder="请输入摄像机英文名称" />
            )}
          </FormItem>

          <FormItem label="相机启停" {...formItemLayoutInModal}>
            {getFieldDecorator('statusCode', {
              valuePropName: 'checked',
              initialValue: modalFormData?.statusCode ? Boolean(modalFormData?.statusCode) : true
            })(
              <Switch checkedChildren="开" unCheckedChildren="关"/>
            )}
          </FormItem>

          <FormItem label="监控网址" {...formItemLayoutInModal}>
            {getFieldDecorator('webURL', {
              rules: [{
                required: true,
                message: '请输入监控网址！'
              }],
              validateTrigger: "onBlur",
              initialValue: modalFormData?.webURL || ""
            })(
              <Input placeholder="请输入监控网址" />
            )}
          </FormItem>

          <FormItem label="视频宽度" {...formItemLayoutInModal}>
            {getFieldDecorator('width', {
              rules: [{
                required: true,
                message: '请输入视频宽度！'
              }],
              validateTrigger: "onBlur",
              initialValue: modalFormData?.width || 320
            })(
              <InputNumber step={10} min={1}/>
            )}
            <span>px</span>
          </FormItem>

          <FormItem label="视频高度" {...formItemLayoutInModal}>
            {getFieldDecorator('height', {
              rules: [{
                required: true,
                message: '请输入视频高度！'
              }],
              validateTrigger: "onBlur",
              initialValue: modalFormData?.height || 240
            })(
              <InputNumber step={10} min={1}/>
            )}
            <span>px</span>
          </FormItem>

          {

            /*
                *** 2019年4月22日
                ***此时并没有获取真正的设备ID，而是自定义了一个ID列表1-5，然后从中取，所以是错误的。

             */
          }
          <FormItem label="监控设备" {...formItemLayoutInModal}>
            {getFieldDecorator('testRigid', {
              rules: [{
                required: true,
                message: '请选择监控设备！'
              }],
              initialValue: modalFormData?.testRigid || 1
            })(
              <Select>

                {this.renderOptions()}

              </Select>
            )}
          </FormItem>

        </Form>
      </Modal>
    )
  }
}

// export default withModal(AdminActions.Cameras, CameraModal)(CamerasConfig);
export default CamerasConfig;
