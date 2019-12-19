//依赖类
import React from 'react';
import Reflux from 'reflux';
import { Spin, Card, Col,Row, InputNumber, Form, Select, Divider, Icon, Button, Modal, Input } from 'antd';

//组件类
import {formItemLayoutInModal} from 'components/layout';

//样式类
import './Widget.less'
import intl from 'react-intl-universal';
import qs from "qs";

const languageType = qs.parse(window.location.search.slice(1)).lang;


const FormItem = Form.Item;
const Option = Select.Option;
const InputGroup = Input.Group;

class WidgetCamera extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      modalVisible: false,
    }
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

  render(){
    const { modalVisible } = this.state;
    const { params, keyValue, monitor,plantInfo } = this.props;




    const {cameras}=plantInfo;
    var camera=undefined;

    if(cameras?.length>0){
          camera=cameras[0];
      }
      //console.log(camera);
    let title;
    if(languageType === 'en-US' ) title = monitor ? camera?.name_en : intl.get('camera');
    else title = monitor ? camera?.name_cn : intl.get('camera');


    return (
      <Card title={title || " "} onDoubleClick={this.onEdit} bodyStyle={{ padding: '0px' }}>
          {
            monitor&&camera?
              <iframe style={{border:0,width:"100%",height:"100%"}} src={camera.web_url}></iframe>
              :<Icon type="video-camera" style={{fontSize:"64"}}/>
          }

      </Card>

    )
  }
}

export default WidgetCamera;
