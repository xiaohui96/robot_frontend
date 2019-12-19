import Reflux from 'reflux';
import { message } from 'antd';
import axios from 'utils/axios';

//Actions
import AdminActions from 'actions/AdminActions';

class CamerasStore extends Reflux.Store {
  constructor() {
    super();
    this.listenables = AdminActions;
    this.state = {
      camerasList:[],
      cameraFormData: {},
    }
  }

  onCamerasCreate(formData, callback){
    axios.post("/cameras", formData)
      .then( (response) => {
        message.success("创建成功！", 1);
        this.onCamerasRetrieve();
      })
      .catch( ()=>{
        message.error("创建失败！", 3);
      })
      .finally( ()=>{
        callback?.();
      })
  }

  onCamerasRetrieve(){
    axios.get("/cameras")
      .then( (response) => {
        this.setState({ camerasList: response.data });
      })
      .catch( ()=>{
        message.error("相机列表获取失败！", 3);
      })
  }

  onCamerasUpdate(formData, cameraid, callback){
    axios.put(`/cameras/${cameraid}`, formData)
      .then( (response) => {
        message.success("更新成功！", 1);
        this.onCamerasRetrieve();
      })
      .catch( ()=>{
        message.error("更新失败！", 3);
      })
      .finally( ()=>{
        callback?.();
      })
  }

  onCamerasDelete(cameraid, callback){
    axios.delete(`/cameras/${cameraid}`)
      .then( (response) => {
        message.success("删除成功！",1);
        this.onCamerasRetrieve();
      })
      .catch( ()=>{
        message.error("删除失败！", 3);
      })
      .finally( ()=>{
        callback?.();
      })
  }
}

export default CamerasStore;
