//依赖类
import React from 'react';
import Reflux from 'reflux';
import { Table, Card, Modal, Form, Select, Switch, Input, InputNumber,Radio, Button,Progress, Badge, Tooltip, Upload,message, Icon as OldIcon} from 'antd';
import './Algorithm.less';

//数据流
import AppActions from 'actions/AppActions';
import appStore from 'stores/appStore';
import algorithmsStore from 'stores/algorithmsStore';

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

class Algorithm extends Reflux.Component {
  constructor(props) {
    super(props);
    this.stores =[
        appStore,
        algorithmsStore
    ];
    this.storeKeys = ['algorithmList','activeAlgorithmId'];
    this.state = {
        algorithmList: [],
        activeAlgorithmId:0,/*当前算法的id，如果为0表示当前没有算法运行*/
        downloadStatus:{
            isDownloading:false, /*是否有算法在下载*/
            id:0,
            status:<a>{intl.get('start downloading')}</a>,
            percent:0,
            ok:true,/*是否下载完成*/
        }
    }
}


    componentDidMount() {
        //super.componentDidMount();
        const User=Reflux.GlobalState.authStore.User;
        const {plantInfo}=this.props;


        //console.log("Did mount");
        //先获得算法列表algorithmList，然后再获得当前算法activeAlgorithmId，存放在state中
        AppActions.Algorithms.retrieve(User,plantInfo,()=>{
            //plantInfo.copyNum=parseInt(copyNum);
            AppActions.GetCurrentAlgorithm(plantInfo,this.onAlgorithmChange);
        });

    }



    componentWillReceiveProps(nextProps) {
        //console.log("Did mount");

        //如果当前设备变化，需要重新获得算法列表algorithmList，和当前算法activeAlgorithmId，
        if(nextProps.plantInfo.id != this.props.plantInfo.id){
            //console.log(this.props.onGetCurrentAlgorithm);
            const User=Reflux.GlobalState.authStore.User;
            const {plantInfo}=nextProps;
            AppActions.Algorithms.retrieve(User,plantInfo,()=>{
                //plantInfo.copyNum=parseInt(nextProps.copyNum);
                //AppActions.GetCurrentAlgorithm(plantInfo,this.onAlgorithmChange);
            });
        }
    }

    /*如果重新获得当前算法id,将当前算法变化通知父节点Plantdetail.jsx*/
    onAlgorithmChange=(activeAlgorithmId)=>{
        const {plantInfo,onActiveAlgorithmChange}=this.props;

        //console.log("alg"+activeAlgorithmId);
        onActiveAlgorithmChange(plantInfo.id,activeAlgorithmId); /*将当前算法变化通知父节点Plantdetail.jsx*/
    }

    //获得websocket的协议，是ws还是wss
    getWsProtocols=(protocolString)=>{
        var protocols=protocolString.split('/');
        if(protocols[1]){
            return protocols[1];
        }
        else{
            return "ws";
        }
    }


    hideModal = () => {
        this.setState({
            progressVisible: false
        })
    }

    //下载算法的代码
    startExpeirment=(algorithm)=>{
        const {plantInfo,onGetSignalParas,isFullControl} = this.props;
        const {algorithmList,downloadStatus,progressVisible} = this.state;
        var that=this;
        //console.log(record);
        //console.log(plantInfo);
        //this.setState({downloadStatus:true});

        //如果没有系统控制权，就提示用户
        if(isFullControl!=true){
            confirm({
                title: intl.get('control right tip'),
                content: intl.get('control right tip'),

                onOk() {
                    console.log('OK');
                    //okText=intl.get('ok');
                },
                onCancel() {
                    console.log('Cancel');
                },
            });
            return;
        }

        algorithm.errorCode=undefined;

        var ws = null;
        var url=this.getWsProtocols(plantInfo.protocols)+"://"+plantInfo.serverUrl+"/websocket/download";//通过rtlab的ServerURL，找到下载程序的Websocket服务入口

        //建立WebSocket的连接
        if ('WebSocket' in window)
            ws = new WebSocket(url);
        else if ('MozWebSocket' in window)
            ws = new MozWebSocket(url);

        //当webscoket连接建议成功的时候的回调函数，向服务器发送下载算法的指令
        var onOpen=()=>{
            console.log("onopen");

            //首先是转台更新
            downloadStatus.status=<a>{intl.get('connected')}</a>;
            downloadStatus.ok=true;
            that.setState({
                downloadStatus,
                progressVisible: true
            });
            //然后是向rtlab服务器发送下载算法的命令
            ws.send(JSON.stringify({
                id:algorithm.id,
                packageSize:algorithm.packageSize,
                stepSize:algorithm.stepSize,
                plantId:plantInfo.id,
                plantType:plantInfo.type,
                copyNum:plantInfo.copyNum,
                serverUrl:plantInfo.serverUrl,
                downloadPort:plantInfo.downloadPort+(plantInfo.copyNum?parseInt(plantInfo.copyNum):0),
                monitorPort:plantInfo.monitorPort+(plantInfo.copyNum?parseInt(plantInfo.copyNum):0),
                ip:plantInfo.ip
            }));

        }
        // add downloadalgorithm action
        console.log("downloadalgorithm");
        // console.log(plantInfo);
        // console.log(JSON.parse(plantInfo.currentUsers)[plantInfo.currentUser]);
        plantInfo.action = "downloadalgorithm";
        plantInfo.algorithmId = algorithm.id;
        const timestamp = Date.parse(new Date())/1000;
        // json对象反转换获取userid
        // 判断设备是实体还是虚拟，userid不同获取方法
        if(plantInfo.type==1){
            //plantInfo.userid = JSON.parse(plantInfo.currentUsers)[plantInfo.currentUser];
            //plantInfo.id_time =JSON.parse(plantInfo.currentUsers)[plantInfo.currentUser] +'-'+timestamp;
            plantInfo.user_id =JSON.parse(plantInfo.currentUsers)[plantInfo.currentUser];
        }
        else if(plantInfo.type==2){
            //plantInfo.userid = JSON.parse(plantInfo.currentUser);
            //plantInfo.id_time =JSON.parse(plantInfo.currentUser)+'-'+timestamp;
            plantInfo.user_id =JSON.parse(plantInfo.currentUser);
        }
        axios.post("/getActionsLoadAlgorithm" ,plantInfo)
            .then( (response) => {
                if( response.code == 100 ) {

                    callback?.();

                }
            })


        //当连接关闭的时候执行的命令，查询当前的算法（不管成功与否，都要查询一遍）
        var onClose=()=>{
            AppActions.GetCurrentAlgorithm(plantInfo,that.onAlgorithmChange);
        }

        //当下载在不同的阶段的时候，服务器rtlab会发不同的消息，根据不同的消息，改变state中关于下载的状态
        var onMessage=(msg)=>{
            var msgSplit=msg.data.split(':::');
            var com=msgSplit[0];
            console.log('com = '+com);//Stopping old algorithm...;GetAlg;DownloadAlg;Downloaded;Connecting monitor;Getting signal list;Done
            switch(com){
                case "Stopping old algorithm...":
                    downloadStatus.status=<a>{intl.get('stop old alg')}</a>;
                    that.setState({
                        downloadStatus
                    });
                    break;
                case "GetAlg":
                    downloadStatus.status=<a>{intl.get('get alg')}</a>;
                    downloadStatus.percent=25;
                    that.setState({
                        downloadStatus
                    });
                    break;
                case "DownloadAlg":
                    downloadStatus.status=<a>{intl.get('download alg')}</a>;
                    downloadStatus.percent=50;
                    that.setState({
                        downloadStatus
                    });
                    break;

                case "Downloaded":
                    downloadStatus.status=<a>{intl.get('download complete')}</a>;
                    downloadStatus.percent=75;
                    that.setState({
                        downloadStatus
                    });
                    break;
                case "Connecting monitor...":
                    downloadStatus.status=<a>{intl.get('connecting monitor')}</a>;
                    that.setState({
                        downloadStatus
                    });
                    break;
                case "Getting signal list...":
                    downloadStatus.status=<a>{intl.get('getting signal list')}</a>;
                    that.setState({
                        downloadStatus
                    });
                    break;
                case "Done":
                    downloadStatus.isDownloading=false;
                    downloadStatus.percent=100;
                    that.setState({
                        downloadStatus,
                        progressVisible: false
                    });
                    var data=JSON.parse(msgSplit[1]);
                    //console.log(data);
                    onGetSignalParas(data);
                    AppActions.SetPlantStatus(plantInfo,0);
                    that.props.setLastErrorAlgorithmId(0);
                    break;
                case "Error":
                    algorithm.errorCode=1;
                    downloadStatus.isDownloading=false;
                    downloadStatus.status=<a style={{'color':'red'}}>{intl.get('download fail')}</a>;
                    downloadStatus.ok=false;
                    that.setState({
                        algorithmList,downloadStatus,
                    });
                    AppActions.SetPlantStatus(plantInfo,1);
                    //console.log(algorithmList);
                    break;
                default:
                    downloadStatus.status=<a>{msg.data}</a>;
                    that.setState({
                        downloadStatus
                    });
                    break;
            }
        }

        var onError=()=>{
            console.log("Error");
        }

        ws.onopen=onOpen;
        ws.onclose=onClose;
        ws.onmessage=onMessage;
        ws.onerror=onError;

        /*var callbacks={
            onOpen:onOpen,
            onClose:onClose,
            onMessage:onMessage,
            onError:onError
        }*/

        downloadStatus.isDownloading = true;
        downloadStatus.id = algorithm.id;

        this.setState({
            downloadStatus:downloadStatus,
            activeAlgorithmId:0
        });
        //AppActions.startExperiment(algorithm, plantInfo,callbacks);
    }

  render() {
    const {algorithmList,downloadStatus,activeAlgorithmId,progressVisible} = this.state;
      const User=Reflux.GlobalState.authStore.User;
      const {plantInfo,isFullControl,lastErrorAlgorithmId}=this.props;
      //console.log(lastErrorAlgorithmId);
    return (
        <div>
            {/*公共算法的表格，那些共享的算法*/}
            <Card title={intl.get('shared algorithm')}>

                <Table
                    showHeader={true}
                    dataSource={algorithmList.publicList}
                    onRow={(record) => {
                        return {
                            //onDoubleClick: () => this.props.onEdit(record),
                        };
                    }}
                    rowKey="id"
                >
                    <Column title={intl.get('name')} dataIndex="name"/>
                    <Column title={intl.get('alg stepsize')} dataIndex="stepSize"/>
                    <Column title={intl.get('alg packagesize')} dataIndex="packageSize" />
                    <Column title={intl.get('alg target platform')} dataIndex="targetPlatform" />
                    <Column title={intl.get('alg designer')} dataIndex="author" />
                    <Column title={intl.get('last update')} dataIndex="lastUpdate" />
                    <Column
                        title={intl.get('operation')}
                        width={120}
                        key="operation"
                        render={(record) => (
                            <div className="table-operate">
                                <Tooltip title={intl.get('conduct an experiment')}>
                                    {
                                        record.errorCode==undefined?null
                                            :<a>{intl.get('alg download error')}</a>

                                    }
                                    {
                                        record.id==activeAlgorithmId?
                                            (record.id==lastErrorAlgorithmId?<a>{intl.get('alg error')}</a>:<a>{intl.get('alg running')}</a>)
                                            :null
                                    }
                                    {(downloadStatus.isDownloading==false)?<a onClick={()=>this.startExpeirment(record)}><OldIcon type="play-circle" width="20px" height="20px"></OldIcon> </a>
                                        :(downloadStatus.id!=record.id?
                                            <a><OldIcon type="play-circle" width="20px" height="20px"></OldIcon> </a>
                                            :downloadStatus.status
                                        )
                                    }

                                </Tooltip>
                            </div>
                        )}
                    />
                </Table>
                <ProgressModal visible={progressVisible} hideModal={this.hideModal} downloadStatus={downloadStatus} />
            </Card>

            {/*私有算法的表格*/}
      <Card title={intl.get('my algorithm')}>
          <Button type="primary" className="add-new" onClick={this.props.onAdd}>
              {intl.get('alg uploading')}
              {console.log(this.props)}
              </Button>
        <Table
          showHeader={true}
          dataSource={algorithmList.privateList}
          onRow={(record) => {
            return {
              //onDoubleClick: () => this.props.onEdit(record),
            };
          }}
          rowKey="id"
        >
          <Column title={intl.get('name')} dataIndex="name"/>
          <Column title={intl.get('alg stepsize')} dataIndex="stepSize"/>
          <Column title={intl.get('alg packagesize')} dataIndex="packageSize" />
          <Column title={intl.get('alg target platform')} dataIndex="targetPlatform" />
          <Column title={intl.get('alg designer')} dataIndex="author" />
          <Column title={intl.get('last update')} dataIndex="lastUpdate" />
          <Column
            title={intl.get('operation')}
            width={160}
            key="operation"
            render={(record) => (
              <div className="table-operate">
                <Tooltip title={intl.get('edit')}>
                  <a onClick={()=> this.props.onEdit(record)}><Icon iconid="edit" ></Icon> </a>
                </Tooltip>
                <Tooltip title={intl.get('delete')}>
                  <a onClick={()=> this.props.onDelWithPara(record.name, record.id,{User:User,plantInfo:plantInfo})}><Icon iconid="delete"></Icon> </a>
                </Tooltip>
                  <Tooltip title={intl.get('conduct an experiment')}>
                      {
                          record.errorCode==undefined?null
                              :<a>{intl.get('alg download error')}</a>

                      }
                      {
                          record.id==activeAlgorithmId?<a>{intl.get('alg running')}</a>:null
                      }
                      {downloadStatus.isDownloading==false?<a onClick={()=>this.startExpeirment(record)}><OldIcon type="play-circle" width="20px" height="20px"></OldIcon> </a>
                          :(downloadStatus.id!=record.id?
                                  <a><OldIcon type="play-circle" width="20px" height="20px"></OldIcon> </a>
                                  :downloadStatus.status
                          )
                      }
                  </Tooltip>
              </div>
            )}
          />
        </Table>
          <ProgressModal visible={progressVisible} hideModal={this.hideModal} downloadStatus={downloadStatus} />
      </Card>
            {/*实验报告的表格*/}
            <Card title={intl.get('my report')}>
                <Button type="primary" className="add-new" onClick={this.props.onAdd}>
                    {intl.get('report uploading')}
                    {console.log(this.props)}
                </Button>
                <Table
                    showHeader={true}
                    dataSource={algorithmList.privateList}
                    onRow={(record) => {
                        return {
                            //onDoubleClick: () => this.props.onEdit(record),
                        };
                    }}
                    rowKey="id"
                >
                    <Column title={intl.get('name')} dataIndex="name"/>
                    <Column title={intl.get('alg designer')} dataIndex="author" />
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

//显示算法下载进度条的Modal
class ProgressModal extends React.Component {
    constructor(props){
        super(props);
        this.state = {
        }
    }

render() {
    const { visible,downloadStatus } = this.props;
    // console.log('进度条弹窗渲染');
    //console.log(downloadStatus);
    return (
        <div >
            <Modal
                visible={visible}
                title={intl.get('alg downloading')}
                onOk={this.props.hideModal}
                onCancel={this.props.hideModal}
                // onCancel={this.props.hideModal}
                okText={intl.get('ok')}
                cancelButtonProps={{ disabled: downloadStatus.ok}}
                okButtonProps={{ disabled: downloadStatus.ok}}
                closable={false}
                maskClosable={false}
            >
                <div>
                    <Progress  percent={downloadStatus.percent} />
                    <span>
                        {downloadStatus.status}
                    </span>
                </div>
            </Modal>
        </div>
    )
}
}



@Form.create()
class AlgorithmModal extends React.Component {
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

        //数据交互完成后回调函数关闭Modal
        const callback = ()=> {
          this.setState({
            confirmLoading: false
          });
          this.props.hideModal();
        };

        if (modalFormData) {
          AppActions.Algorithms.update(formData, modalFormData.id,{User:User,plantInfo:plantInfo}, callback);
        } else {
          if(this.state.fileData==null) {
                message.error(intl.get('alg upload tip'));
              this.setState({
                  confirmLoading: false
              });
          }else{
              AppActions.Algorithms.create(formData, User.id,plantInfo.id,this.state.fileData,callback);
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

    //console.log(modalFormData);

      const uploadProps = {
          name: 'source',
          multiple: false,
          action: '/api/putAlgorithmBin/'+User.id,
          headers: {
              authorization: 'authorization-text',
          },
          fileList:this.state.fileList,
          onChange(info) {
              //console.log(info);
              if (info.file.status !== 'uploading') {
                  if(info.fileList.length>1){
                      info.fileList.shift();
                  }
                  console.log(info.file, info.fileList);
              }
              if (info.file.status === 'done') {
                  console.log(info.file);
                  console.log(form);
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
        title={modalFormData ? intl.get('alg edit') : intl.get('alg create')}
        maskClosable={true}
        confirmLoading={confirmLoading}
        onOk={this.handleSubmit}
        onCancel={this.props.hideModal}
        afterClose={this.resetFields}
        okText={modalFormData ? intl.get('modify') : intl.get('new')}
        cancelText= {intl.get('cancel')}
      >
        <Form layout="horizontal" hideRequiredMark>
          <FormItem
              label={intl.get('alg file')}

              {...formItemLayoutInModal}
          >
              {getFieldDecorator('bin', {
                  rules: [{
                      required: true,
                      message: intl.get('input alg file')
                  }],
                  validateTrigger: "onBlur",
                  initialValue: {}
              })(
                  <Upload {...uploadProps}><Button disabled={modalFormData?true:false}>{intl.get('upload')}</Button></Upload>
                  )}
          </FormItem>


          <FormItem label={intl.get('alg name')} {...formItemLayoutInModal}>
            {getFieldDecorator('name', {
              rules: [{
                required: true,
                message: intl.get('alg name tip')
              }],
              validateTrigger: "onBlur",
              initialValue: modalFormData?.name || ""
            })(
              <Input placeholder={intl.get('alg name tip')} />
            )}
          </FormItem>

          <FormItem label={intl.get('alg stepsize')} {...formItemLayoutInModal}>
            {getFieldDecorator('stepSize', {
              rules: [{
                required: true,
                message: intl.get('alg stepsize tip')
              }],
              validateTrigger: "onBlur",
              initialValue: modalFormData?.stepSize || 0.04
            })(
              <InputNumber min={0}/>
            )}
          </FormItem>

          <FormItem label={intl.get('alg packagesize')} {...formItemLayoutInModal}>
            {getFieldDecorator('packageSize', {
              rules: [{
                required: true,
                message: intl.get('alg packagesize tip')
              }],
              validateTrigger: "onBlur",
              initialValue: modalFormData?.packageSize || 10
            })(
              <InputNumber min={0}/>
            )}
          </FormItem>

          <FormItem label={intl.get('alg type')} {...formItemLayoutInModal}>
            {getFieldDecorator('algorithmType', {
              rules: [{
                required: true,
                message: intl.get('alg type tip')
              }],
              initialValue: modalFormData?.algorithmType || 1
            })(
              <Select>
                <Option value={1}>{intl.get('alg type 1')}</Option>
                <Option value={2}>{intl.get('alg type 2')}</Option>
                <Option value={3}>{intl.get('alg type 3')}</Option>
                <Option value={4}>{intl.get('alg type 4')}</Option>
              </Select>
            )}
          </FormItem>

          <FormItem label={intl.get('alg complie plat')} {...formItemLayoutInModal}>
            {getFieldDecorator('targetPlatform', {
              rules: [{
                required: true,
                message: intl.get('alg complie plat tip')
              }],
              initialValue: modalFormData?.targetPlatform || 1
            })(
              <Select>
                <Option value={1}>ARM9</Option>
              </Select>
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


export default withModal(AppActions.Algorithms, AlgorithmModal)(Algorithm);
