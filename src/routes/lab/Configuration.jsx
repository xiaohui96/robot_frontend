//依赖类
import React from 'react';
import Reflux from 'reflux';
import { Table, Card, Modal, Form, Select, Switch, Input, InputNumber,Radio, Button, Badge, Tooltip} from 'antd';

//数据流
import AppActions from 'actions/AppActions';
import appStore from 'stores/appStore';
import ConfigurationsStore from 'stores/configurationsStore';

//组件类
import Icon from 'components/Icon';
import {formItemLayoutInModal} from 'components/layout';

//HOC
import withModal from 'HOC/withModal';

//语言
import intl from 'react-intl-universal';

// import './Configuration.less';

const FormItem = Form.Item;
const Option = Select.Option;
const Column = Table.Column;

class Configuration extends Reflux.Component {
  constructor(props) {
    super(props);

      this.stores =[
          appStore,
          ConfigurationsStore
      ];
      this.storeKeys = ['configurationList'];

    this.state = {
      configurationList: {}, /*组态文件列表，初始为空*/
      modalDisplay:false
    }
  }

  componentDidMount(){
    if(this.props.activeAlgorithmId!=0){
        this.getConfigurations(this.props.activeAlgorithmId,this.props.user.id);
    }
  }

  componentWillReceiveProps(nextProps) {
      if((nextProps.activeAlgorithmId!=0&&nextProps.activeAlgorithmId != this.props.activeAlgorithmId) //如果当前算法变化
          ||nextProps.updateCount!=this.props.updateCount){  //如果需要更新，来自Experiment.jsx调用的plantDetail.jsx里面的onConfigurationChange，说明当前组态文件有变化，需要更新
        this.getConfigurations(nextProps.activeAlgorithmId,nextProps.user.id);
      }
  }

  /*数据库中获得组态文件列表*/
  getConfigurations=(activeAlgorithmId,userId)=>{
      //console.log('getConfigurations');
      //const {activeAlgorithmId}=this.props;
      console.log(userId);
      AppActions.Configurations.retrieve(activeAlgorithmId,userId);
  }

  /*点击新建组态的时候调用的函数*/
  onAdd=()=>{

    /*将当前的组态文件id设为0，等同于清空组态文件*/
    this.props.switchToExperiment(0);
  }

  /*点击编辑组态文件的时候调用*/
  onEdit=(record)=>{
    //console.log("onEdit");
      //console.log(record);
      this.props.switchToExperiment(record.id);
  }

  render() {
    const {configurationList,modalDisplay} = this.state;
    const {activeAlgorithmId,configurationId,user}=this.props;
    if(activeAlgorithmId==0){
      return(
          <div className="no-widgets-tips">{intl.get('algorithm unavailable')}</div>
      );
    }
    //console.log(configurationList.privateList);
    return (
      <Card >
        <Button type="primary" className="add-new" onClick={this.onAdd}>{intl.get('create new monitor')}</Button>
        <Table
          showHeader={true}
          dataSource={configurationList.privateList}
          onRow={(record) => {
            //console.log(record);
            return {
              onDoubleClick: () => this.props.onEdit(record),
            };
          }}
          rowKey="id"
        >
          <Column title={intl.get('name')} dataIndex="name"/>
          <Column title={intl.get('last update')} dataIndex="lastUpdate"/>
          <Column
              title={intl.get('operation')}
              width={120}
              key="operation"
              render={(record) => (
                  <div className="table-operate">
                    <Tooltip title={intl.get('edit')}>
                      <a onClick={()=> this.onEdit(record)}><Icon iconid="edit"></Icon> </a>
                    </Tooltip>
                    {
                      configurationId==record.id?
                          (
                              <a>{intl.get('current monitor')}</a>
                          )
                          :(<Tooltip title={intl.get('delete')}>
                            <a onClick={()=> this.props.onDelWithPara(record.name, record.id,{algId:activeAlgorithmId,userId:user.id})}><Icon iconid="delete"></Icon> </a>
                          </Tooltip>)
                    }

                  </div>
              )}
          />

        </Table>
      </Card>
    )
  }
}

@Form.create()
class ConfigurationModal extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      confirmLoading: false,
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

        //数据交互完成后回调函数关闭Modal.
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
        title={modalFormData ? "编辑算法" : "新建算法"}
        maskClosable={true}
        confirmLoading={confirmLoading}
        onOk={this.handleSubmit}
        onCancel={this.props.hideModal}
        afterClose={this.props.form.resetFields}
        okText={modalFormData ? "修改" : "新建"}
        cancelText="取消"
      >
        <Form layout="horizontal" hideRequiredMark>
          <FormItem label="算法名称" {...formItemLayoutInModal}>
            {getFieldDecorator('nameCN', {
              rules: [{
                required: true,
                message: '请输入算法名称！'
              }],
              validateTrigger: "onBlur",
              initialValue: modalFormData?.name || ""
            })(
              <Input placeholder="请输入算法名称" />
            )}
          </FormItem>

          <FormItem label="算法步长" {...formItemLayoutInModal}>
            {getFieldDecorator('stepSize', {
              rules: [{
                required: true,
                message: '请输入算法步长！'
              }],
              validateTrigger: "onBlur",
              initialValue: modalFormData?.stepSize || 320
            })(
              <InputNumber min={0}/>
            )}
          </FormItem>

          <FormItem label="监控包大小" {...formItemLayoutInModal}>
            {getFieldDecorator('stepSize', {
              rules: [{
                required: true,
                message: '请输入算法步长！'
              }],
              validateTrigger: "onBlur",
              initialValue: modalFormData?.stepSize || 320
            })(
              <InputNumber min={0}/>
            )}
          </FormItem>

          <FormItem label="算法类别" {...formItemLayoutInModal}>
            {getFieldDecorator('algorithmType', {
              rules: [{
                required: true,
                message: '请选择算法类别！'
              }],
              initialValue: modalFormData?.algorithmType || 1
            })(
              <Select>
                <Option value={1}>本地仿真控制</Option>
                <Option value={2}>本地实物控制</Option>
                <Option value={3}>网络化仿真控制</Option>
                <Option value={4}>网络化实物控制</Option>
              </Select>
            )}
          </FormItem>

          <FormItem label="编译目标平台" {...formItemLayoutInModal}>
            {getFieldDecorator('targetPlatform', {
              rules: [{
                required: true,
                message: '请选择编译目标平台！'
              }],
              initialValue: modalFormData?.targetPlatform || 1
            })(
              <Select>
                <Option value={1}>ARM9</Option>
              </Select>
            )}
          </FormItem>

          <FormItem label="是否共享" {...formItemLayoutInModal}>
            {getFieldDecorator('public', {
              valuePropName: 'checked',
              initialValue: modalFormData?.public ? Boolean(modalFormData?.public) : true
            })(
              <Switch checkedChildren="是" unCheckedChildren="否"/>
            )}
          </FormItem>

        </Form>
      </Modal>
    )
  }
}

export default withModal(AppActions.Configurations, ConfigurationModal)(Configuration);
