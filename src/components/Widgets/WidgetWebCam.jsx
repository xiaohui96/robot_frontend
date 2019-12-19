//依赖类
import React from 'react';
import Reflux from 'reflux';
import { Spin, Card, Col,Row, InputNumber, Form, Select, Divider, Icon, Button, Modal, Input } from 'antd';

//组件类
import {formItemLayoutInModal} from 'components/layout';
//
//import Webcam from "react-webcam";
//样式类
import './Widget.less'
import {WebGL2Renderer} from "../../../three/src/renderers/WebGL2Renderer";

//语言
import intl from 'react-intl-universal';

const FormItem = Form.Item;
const Option = Select.Option;
const InputGroup = Input.Group;
const Camera = () => ( <video  style={{border:0,width:"100%",height:"100%"}} ></video>);

class WidgetWebCam extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      modalVisible: false,
      constraints: { audio: false, video:{ 'facingMode': "user" } }
    }
    //this.handleStartClick = this.handleStartClick.bind(this);
  }

  onEdit = (e)=>{
    if(this.props.monitor == false){
      this.setState({
        modalVisible: true
      })
    }
  }

  hideModal = () => {
    this.setState({
      modalVisible: false
    })
  }

// 组件渲染后调用
  componentDidMount(){
    const constraints = this.state.constraints;
    const {monitor} = this.props;
    //const video = document.querySelector('video');
    //开始监控才申请摄像头控制权
    if (monitor){
      // 老的浏览器可能根本没有实现 mediaDevices，所以我们可以先设置一个空的对象
      if (navigator.mediaDevices === undefined) {
        navigator.mediaDevices = {};
      }

  // 一些浏览器部分支持 mediaDevices。我们不能直接给对象设置 getUserMedia
  // 因为这样可能会覆盖已有的属性。这里我们只会在没有getUserMedia属性的时候添加它。
      if (navigator.mediaDevices.getUserMedia === undefined) {
        navigator.mediaDevices.getUserMedia = function(constraints) {

          // 首先，检测浏览器，如果有getUserMedia的话，就获得它
          var getUserMedia = navigator.getUserMedia || navigator.mediaDevices.webkitGetUserMedia ||
              navigator.mozGetUserMedia || navigator.msGetUserMedia;

          // 一些浏览器根本没实现它 - 那么就返回一个error到promise的reject来保持一个统一的接口
          if (!getUserMedia) {
            return Promise.reject(new Error('getUserMedia is not implemented in this browser'));
          }

          // 否则，为老的navigator.getUserMedia方法包裹一个Promise
          return new Promise(function(resolve, reject) {
            getUserMedia.call(navigator, constraints, resolve, reject);
          });
        }
      }

    navigator.mediaDevices.getUserMedia(constraints)
        .then(function(stream) {
          var video = document.querySelector('video');
          // 旧的浏览器可能没有srcObject
          if ("srcObject" in video) {
            video.srcObject = stream;
          } else {
            // 防止在新的浏览器里使用它，应为它已经不再支持了
            video.src = window.URL.createObjectURL(stream);
          }
          video.onloadedmetadata = function(e) {
            video.play();

          };
        })
        .catch(function(err) {
          console.log(err.name + ": " + err.message);
        });

      //为了解决安全性限制，保证浏览器能够支持
      <iframe src="http://192.168.46.139:8080" allow="camera; microphone;"/>
    }


  }
  render(){
    const { modalVisible } = this.state;
    const { params, keyValue, monitor,plantInfo } = this.props;
    const title = monitor ? params?.name_cn : intl.get('user webcam');

    return (
      <Card title={title || intl.get('user webcam')} onDoubleClick={this.onEdit} bodyStyle={{ padding: '0px' }}>
          {
            //开始监控才有摄像头数据
            monitor?
                <Camera  />

                :<Icon type="camera" size="small"/>
          }

      </Card>
    )
  }
}

export default WidgetWebCam;
