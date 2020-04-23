//依赖类
import React from 'react';
import Reflux from 'reflux'
import { Route } from 'react-router-dom';
import { Table, Card, Modal, Form, Select, Switch, message,
  Input, InputNumber,Radio, Button, Progress, Badge, Tooltip} from 'antd';

//数据流
import AdminActions from 'actions/AdminActions';
import camerasStore from 'stores/camerasStore';
import labsStore from 'stores/labsStore';
import serversStore from 'stores/serversStore';

//组件类
import Icon from 'components/Icon';
import {formItemLayoutInModal} from 'components/layout';

//本地化
import intl from 'react-intl-universal';
import qs from "qs";
const languageType = qs.parse(window.location.search.slice(1)).lang;

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
        labsStore,
        serversStore];
    this.storeKeys = ['camerasList','testRigsList','serversList'];
    this.state = {
      camerasList:[],
      testRigsList:[],
      serversList:[],
      //cameraModalVisible:false,
      //cameraModalFormData: null//added 20190422
      progress:{
         status:null,
         percent:0,
         ok:false,
         visible:false,
         title:null,
         start:true,  //用这个状态位来区分启动还是停止
         okText:null
      },

      CamerasModalVisible: false,
      CamerasModalFormData: null,
      ws:null,
      streamURL:null,

    }
  }

  componentWillMount() {
    super.componentWillMount();
    AdminActions.Cameras.retrieve();
    //setTimeout(this.onCheckCameras, 500);
      // AdminActions.TestRigs.retrieve();
    console.log('componentMount');
  }

  constructWebsocketServer = () => {
    const {ws, serversList, progress} = this.state;
    //console.log(ws);
    //console.log(serversList);
    var that = this;
    if(ws == null && serversList.length > 0)
    {
      var that=this;

      var cameraServers = serversList.filter(item => {
        return item.name == "camera";
      });

      if(cameraServers == [])
      {
        message.error(intl.get('cameraWSServerNotFound'), 3);
        return;
      }
      var streamServer = cameraServers[0];

      //找到视频流的统一入口地址
      var streamURL= this.getProtocols(streamServer.host,1)+"://"+streamServer.webURL;
      console.log(streamURL);

      cameraServers = serversList.filter(item => {
        return item.name == "cameraserver";
      });

      if(cameraServers == [])
      {
        message.error(intl.get('cameraServerNotFound'),3);
        return;
      }
      var cameraServer = cameraServers[0];

      var cameraURL= this.getProtocols(cameraServer.host,0)+"://"+cameraServer.webURL;//通过rtlab的ServerURL，找到下载程序的Websocket服务入口
      console.log(cameraURL);

      var wsnew = null;
      //建立WebSocket的连接
      try{
        if ('WebSocket' in window)
          wsnew = new WebSocket(cameraURL);
        else if ('MozWebSocket' in window)
          wsnew = new MozWebSocket(cameraURL);
      }
      catch(e){
        console.log(e);
      }
      //当webscoket连接成功的时候的回调函数
      var onOpen=()=>{
          //连接成功后就查询摄像头的状态
          wsnew.send(JSON.stringify({
            cmd:'request'
          }));
      }

      //当连接关闭的时候执行的命令
      var onClose=()=>{
          progress.visible = false;
          that.setState({
              progress,
              ws: null
          });
          //console.log('onClose');
      }

      //当下载在不同的阶段的时候，服务器会发不同的消息，
      var onMessage=(msgEvent)=>{
          //var msgSplit=msg.data.split(':::');
          //console.log(msgEvent);
          var obj = JSON.parse(msgEvent.data);
          var com = obj.msg;
          var id = obj.id;
          var statusCode = obj.statusCode;
          if(com != null)
          {
            var msgSplit = com.split(':::');
            com = msgSplit[0];
            switch(com){
                //启动摄像头部分开始
                case "Terminating old servers...":
                    progress.status = <a>{intl.get('terminateOldServer')}</a>;
                    progress.percent = 5;
                    that.setState({
                        progress
                    });
                    break;
                case "Starting cameras...":
                    progress.status = <a>{intl.get('startCameraServer')}</a>;
                    progress.percent = 10;
                    that.setState({
                        progress
                    });
                    break;
                case "Started camera":
                    progress.status = <a>{intl.get('startedCamera')+'#'+(msgSplit[1])}</a>;
                    progress.percent = 10+parseInt(msgSplit[2])*80/100;
                    that.setState({
                        progress
                    });
                    break;
                case "Writing HTMLs...":
                    progress.status = <a>{intl.get('writeHTMLs')}</a>;
                    progress.percent = 90;
                    that.setState({
                        progress
                    });
                    break;
                case "Done"://这个只有在电脑卡顿时才会看到效果
                    progress.status = <a>{intl.get('operationFinish')}</a>;
                    progress.percent = 100;
                    progress.visible = false
                    that.setState({
                        progress
                    });
                    break;
                case "Waiting":
                    progress.status = <a>{intl.get('waitingForServer')}</a>;
                    that.setState({
                        progress
                    });
                    break;
                //启动摄像头部分结束
                //停止摄像头部分开始
                case "Stopped camera":
                    progress.status = <a>{intl.get('stoppedCamera')+(msgSplit[1])}</a>;
                    progress.percent =  parseInt(msgSplit[2]);
                    that.setState({
                        progress
                    });
                    break;
                //停止摄像头部分结束
                case "Error":
                    message.error(intl.get('cameraJsonError'));
                    progress.ok = true;
                    progress.visible = false
                    that.setState({
                        progress
                    })
                    break;
                default:
                    //回传一个json字符串,表示哪个设备启动成功，哪个启动失败
                    console.log(msg.data);
                    that.setState({
                        progress
                    });
                    break;
            }
          }
          else if(id!=null && statusCode != null)
          {
            this.updateCamerasStatus(id,statusCode);
          }
      }

      var onError=()=>{
          console.log("Error");
      }

      wsnew.onopen=onOpen;
      wsnew.onclose=onClose;
      wsnew.onmessage=onMessage;
      wsnew.onerror=onError;

      this.setState({
        ws:wsnew,
        streamURL:streamURL
      });
    }
  }

  componentDidMount() {
    AdminActions.TestRigs.retrieve();
    AdminActions.Servers.retrieve();
    console.log('componentDidMount');
    //this.constructWebsocketServer();
  }

  componentWillUnmount() {
    const {ws} = this.state;
    if(ws!=null){
      ws.close();
    }
    super.componentWillUnmount();
    console.log('componentUnmount');
  }

    hideModal = () => {
        this.setState({
            CamerasModalVisible: false
        })
        //由于采用异步操作，摄像头状态更新会早于获取摄像头信息，
        //故状态会被数据库里的默认值覆盖，这里采用延时的方法来保证状态更新滞后于获取摄像头信息
        setTimeout(this.onCheckCameras, 1000);
    }

    onAddCameras = () => {
        this.setState({
            CamerasModalVisible: true,
            CamerasModalFormData: null
        })
    }

    hideProgressModal = () => {
       const {progress} = this.state;
       progress.visible = false;
       this.setState({
         progress: progress
       });
    }

    //支持手动查询
    onCheckCameras = () => {
      const {ws} = this.state;
      if(ws!=null){
        ws.send(JSON.stringify({
          cmd:'request'
        }));
      }
    }

    onStartCameras = () => {
      const {progress} = this.state;

      progress.status = <a>{intl.get('readyToStart')}</a>;
      progress.percent = 0;
      progress.ok = false;
      progress.start = true,
      progress.visible = true;

      this.setState({
        progress
      });

    }

    onCameraProgressOK = () =>{
      const {camerasList, progress} = this.state;
      switch(progress.start)
      {
        //传输每个摄像头的信息平均需要100个字节，若需要运行数百个摄像头，则需要分组进行，每10个一组
        case true:
          this.sendCameras("start", camerasList);
        break;
        case false:
          this.sendCameras("stop", camerasList);
        break;
      }
      progress.ok = true;
      this.setState({
        progress
      });
    }

    onStartCamera = (record) => {
      this.sendCameras("startone", record);
    }

    //js传参时是以引用的方式传递，修改参数的同时会修改原对象
    sendCameras = (cmd, camerasList) => {
      const {ws, streamURL}= this.state;

      if(ws == null)
      {
        message.error(intl.get('cameraLinkFail'),3)
        return;
      }
      var cameras = new Array();

      if(Array.isArray(camerasList))
      {
        var cameraList_copy =  camerasList.map(item => {
          return {
            id: item.id,
            srcURL: item.srcURL,
            width: item.width,
            height: item.height
          }
        });

        while(cameraList_copy.length > 10)
        {
          cameras = cameraList_copy.splice(0,10);

          ws.send(JSON.stringify({
            cmd: 'store',
            //num: 10,
            wsURL:streamURL,
            cameras:cameras
          }));
        }
        cameras = [];
        if(cameraList_copy.length > 0)
        {
          cameras = cameraList_copy;
        }
      }
      else
      {
        var camera = {
            id: camerasList.id,
            srcURL: camerasList.srcURL,
            width: camerasList.width,
            height: camerasList.height
        };
        cameras.push(camera);
      }
      ws.send(JSON.stringify({
        cmd: cmd,
        //num: total,
        wsURL:streamURL,
        cameras:cameras
      }));
    }

    onStopCamera = (record) => {
      this.sendCameras("stopone", record);
    }

    onStopCameras = () => {
      const {progress} = this.state;
      progress.status = <a>{intl.get('readyToStop')}</a>;
      progress.percent = 0;
      progress.ok = false;
      progress.visible = true;
      progress.start = false;
      this.setState({
        progress
      });
    }

    onEditCameras = (record) => {
        this.setState({
            CamerasModalVisible: true,
            CamerasModalFormData: record
        });
    }

    onDelCameras = (record) => {
        var that = this;
        Modal.confirm({
          title: (languageType=="en-US"?
          `Ready to remove camera for ${record.testRigNameEN} ?`
          : `确定要删除 ${record.testRigNameCN} 的摄像头吗?`),
          okText: intl.get('ok'),
          cancelText: intl.get('cancel'),
          onOk() {
              setTimeout(that.onCheckCameras, 2000);
              return new Promise((resolve,reject)=>{
                  AdminActions.Cameras.delete(record.id, () => resolve());
              })
          }
        });
    }

    //获得websocket的协议，是http/ws 或者https/wss
    //0-http 1-ws
  getProtocols = (protocolString, pos) => {
      var protocols=protocolString.split('/');
      return protocols[pos];
  }

  updateCamerasStatus = (id,statusCode) => {
    const {camerasList} = this.state;

    for(var i=0;i<id.length;i++){
      for(var j=0;j<camerasList.length;j++){
        if(camerasList[j].id == id[i])
        {
          camerasList[j].statusCode = statusCode[i];
          break;
        }
      }
    }
    message.info(intl.get('cameraRequestOK'),3);
    this.setState({
      camerasList:camerasList
    });
  }

  render() {
    const {camerasList,testRigsList,serversList,
      progress, CamerasModalVisible, CamerasModalFormData} = this.state;

    this.constructWebsocketServer();
    return (
      <div>
      <Card >
        <Button type="primary" className="add-new" onClick={this.onAddCameras}>
        {intl.get('addCamera')}</Button>
        |
        <Button type="primary" className="startAll" onClick={this.onStartCameras}>
        {intl.get('startCameras')}</Button>
        |
        <Button type="primary" className="closeAll" onClick={this.onStopCameras}>
        {intl.get('stopCameras')}</Button>
        |
        <Button type="primary" className="requestAll" onClick={this.onCheckCameras}>
        {intl.get('requestCameras')}</Button>

        <Table
          showHeader={true}
          dataSource={camerasList}
          pagination={{
            showTotal: (total) =>  languageType=="en-US"?
            `${total} records`:
            `总共 ${total} 项记录`
          }}
          onRow={(record) => {
            return {
              onDoubleClick: () => this.onEditCameras(record),
            };
          }}
					rowKey="id"
        >
          <Column title={intl.get('cameraSourceAddr')} dataIndex="srcURL"/>
          <Column
            title={intl.get('cameraSize')}
            key="size"
            render={(record) => `${record.width} × ${record.height}`}
          />
          <Column title={intl.get('equipment')} dataIndex={
            languageType == 'en-US'? "testRigNameEN":"testRigNameCN"
          }
          />

          <Column
            title={intl.get('cameraStatus')}
            dataIndex="statusCode"
            filters={[
              { text: intl.get('cameraStatusStop'), value: 0},
              { text: intl.get('cameraStatusRunning'), value: 1},
              { text: intl.get('cameraStatusUnlink'), value: 2},
              { text: intl.get('cameraStatusLink'), value: 3},
              { text: intl.get('cameraStatusUnknown'), value: 4},
            ]}

            onFilter={(value, record) => record.statusCode == value}

            render={(statusCode) => {
              switch (statusCode) {
                case 0: return <Badge status={"default"} text={intl.get('cameraStatusStop')}/>
                case 1: return <Badge status={"success"} text={intl.get('cameraStatusRunning')}/>
                case 2: return <Badge status={"error"} text={intl.get('cameraStatusUnlink')}/>
                case 3: return <Badge status={"processing"} text={intl.get('cameraStatusLink')}/>
                default: return <Badge status={"warning"} text={intl.get('cameraStatusUnknown')}/>
              }
            }}
          />

          <Column
            title={intl.get('cameraOperations')}
            width={160}
            key="operation"
            render={(record) => (
              <div className="table-operate">
                {
                record.statusCode==1?
                  <Tooltip title={intl.get('stopCamera')}>
                    <a onClick={()=> this.onStopCamera(record)}>
                    <Icon iconid="pause"></Icon> </a>
                  </Tooltip>
                  :
                  <Tooltip title={intl.get('startCamera')}>
                    <a onClick={()=> this.onStartCamera(record)}>
                    <Icon iconid="start"></Icon> </a>
                  </Tooltip>
                }

                <Tooltip title={intl.get('previewCamera')}>
                  <a href={record.webURL+"/camera/camera"+record.id+".html"}
                  target="_blank">
                  <Icon iconid="preview"></Icon>
                  </a>
                </Tooltip>
                <Tooltip title={intl.get('editCamera')}>
                  <a onClick={()=> this.onEditCameras(record)}><Icon iconid="edit"></Icon> </a>
                </Tooltip>
                <Tooltip title={intl.get('deleteCamera')}>
                  <a onClick={()=> this.onDelCameras(record)}><Icon iconid="delete"></Icon> </a>
                </Tooltip>
              </div>
            )}
          />
        </Table>
        <CameraModal visible={CamerasModalVisible} hideModal={this.hideModal} modalFormData={CamerasModalFormData} testRigsList={testRigsList}/>
        {
        /*
        <ProgressModal visible={progressVisible} hideModal={this.hideProgressModal} status={progressStatus}/>
        */
        }
        <CameraProgressModal
        progress = {progress}
        onOK = {this.onCameraProgressOK}
        hideModal = {this.hideProgressModal}
        />
      </Card>
      {/*
      <p> tips:典型厂商摄像头的RTSP协议地址，如不匹配则无法正确打开，具体可参考
      <a href={"https://www.cnblogs.com/changyiqiang/p/11174051.html"} target="_blank">博客</a>
      </p>
      <p>四专安防: rtsp://[username]:[password]@[ip]:[port]/[codec]/[channel]/[subtype]/av_stream</p>
      <p>海康威视: rtsp://[username]:[password]@[ip]:[port]/[codec]/[channel]/[subtype]/av_stream</p>
      <p>火力牛: rtsp://[username]:[password]@[ip]:[port]/[codec]/[channel]/[subtype]/av_stream</p>
      */}
      </div>
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
        //console.log(testRigsList);
        if(testRigsList.length == 0)
          return;

        // 这里只显示实体设备的选项，根据type来进行判断 2019.12.04
        var realTestRigsList = testRigsList.filter((element)=>{
          return (element.type == 2);
        });

        return realTestRigsList.map(element => {

          if(languageType == 'en-US'){
            return <Option key={element.id} value={element.id}>
            {element.nameEN}
            </Option>
          }
          else{
            return <Option key={element.id} value={element.id}>
            {element.nameCN}
            </Option>
          }
        });

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

    {getFieldDecorator('statusCode', {
        initialValue: modalFormData?.statusCode ?
        modalFormData?.statusCode : 3
    })}

    return (
      <Modal
        visible={visible}
        title={modalFormData ? intl.get('configCamera') : intl.get('addCamera')}
        maskClosable={true}
        confirmLoading={confirmLoading}
        onOk={this.handleSubmit}
        onCancel={this.props.hideModal}
        afterClose={this.props.form.resetFields}
        okText={modalFormData ? intl.get('editCamera') : intl.get('createCamera')}
        cancelText={intl.get('cancel')}
      >
        <Form layout="horizontal" hideRequiredMark>

          <FormItem label={intl.get('cameraSourceAddr')} {...formItemLayoutInModal}>
            {getFieldDecorator('srcURL', {
              rules: [{
                required: true,
                message: intl.get('cameraSrcURLTip')
              }],
              validateTrigger: "onBlur",
              initialValue: modalFormData?.srcURL || ""
            })(
              <Input placeholder={intl.get('cameraSrcURLTip')}/>
            )}
          </FormItem>

          <FormItem label={intl.get('cameraWidth')} {...formItemLayoutInModal}>
            {getFieldDecorator('width', {
              rules: [{
                required: true,
                message: intl.get('cameraWidthTip')
              }],
              validateTrigger: "onBlur",
              initialValue: modalFormData?.width || 320
            })(
              <InputNumber step={10} min={120}/>
            )}
            <span>px</span>
          </FormItem>

          <FormItem label={intl.get('cameraHeight')}{...formItemLayoutInModal}>
            {getFieldDecorator('height', {
              rules: [{
                required: true,
                message: intl.get('cameraHeightTip')
              }],
              validateTrigger: "onBlur",
              initialValue: modalFormData?.height || 240
            })(
              <InputNumber step={10} min={120}/>
            )}
            <span>px</span>
          </FormItem>

          {

            /*
                *** 2019年4月22日
                ***此时并没有获取真正的设备ID，而是自定义了一个ID列表1-5，然后从中取，所以是错误的。

             */
          }
          <FormItem label={intl.get('equipment')} {...formItemLayoutInModal}>
            {getFieldDecorator('testRigid', {
              initialValue: ((modalFormData==null)? (languageType=="en-US"?"null":"无"): modalFormData.testRigid)
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

//显示摄像头启动进度条的Modal
class CameraProgressModal extends React.Component {
  constructor(props){
        super(props);
        this.state = {
        }
  }

  render() {
    const { progress } = this.props;
    // console.log('进度条弹窗渲染');
    return (
        <div >
            <Modal
                visible={progress.visible}
                title={intl.get('camerasOperations')}
                onOk={this.props.onOK}
                onCancel={this.props.hideModal}
                okText={intl.get('ok')}
                cancelText={intl.get('cancel')}
                cancelButtonProps={{ disabled: progress.ok}}
                okButtonProps={{ disabled: progress.ok}}
            >
                <div>
                    <Progress  percent={progress.percent} />
                    <span>{progress.status}</span>
                </div>
            </Modal>
        </div>
    )
  }
}

// export default withModal(AdminActions.Cameras, CameraModal)(CamerasConfig);
export default CamerasConfig;
