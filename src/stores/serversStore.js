import Reflux from 'reflux';
import axios from 'utils/axios';
import { message } from 'antd';

//Actions
import AdminActions from 'actions/AdminActions';

class ServersStore extends Reflux.Store {
  constructor() {
    super();
    this.listenables = AdminActions;
    this.state = {
      serversList:[],
    }
  }

  onServersCreate(formData, callback){
    axios.post("/servers", formData)
      .then( (response) => {
        message.success("创建成功！",1);
        this.onServersRetrieve();
      })
      .catch( ()=>{
        message.error("创建失败！", 3);
      })
      .finally( ()=>{
        callback?.();
      })
  }

  onServersRetrieve(){
    axios.get("/servers")
      .then( (response) => {
        this.setState({ serversList: response.data });
      })
      .catch( ()=>{
        message.error("服务器列表获取失败！", 3);
      })
  }

  onServersUpdate(formData, serverid, callback){
    axios.put(`/servers/${serverid}`, formData)
      .then( (response) => {
        message.success("更新成功！",1);
        this.onServersRetrieve();
      })
      .catch( ()=>{
        message.error("更新失败！", 3);
      })
      .finally( ()=>{
        callback?.();
      })
  }

  onServersDelete(serverid, callback){
    axios.delete(`/servers/${serverid}`)
      .then( (response) => {
        message.success("删除成功！",1);
        this.onServersRetrieve();
      })
      .catch( ()=>{
        message.error("删除失败！", 3);
      })
      .finally( ()=>{
        callback?.();
      })
  }
}

export default ServersStore;
