import Reflux from 'reflux';
import axios from 'utils/axios';
import { message } from 'antd';

//Actions
import AdminActions from 'actions/AdminActions';

import intl from 'react-intl-universal';

class UsersStore extends Reflux.Store {
  constructor() {
    super();
    this.listenables = AdminActions;
    this.state = {
      usersList:[],
      userFormData: {},
    }
  }

  onUsersRetrieve(){
    axios.get("/users")
      .then( (response) => {
        this.setState({ usersList: response.data });
          console.log("UserRetrieve返回信息:");
          console.log(response.data);
      })
      .catch( ()=>{
        message.error("用户列表获取失败！", 3);
      })
  }

  onUsersUpdate(formData, userid, callback){
    axios.put(`/users/${userid}`, formData)
      .then( (response) => {
        message.success(intl.get('update success'),1);
        this.onUsersRetrieve();

      })
      .catch( ()=>{
        message.error(intl.get('update fail'), 3);
          console.log("update信息:");
          console.log(formData);
      })
      .finally( ()=>{
        callback?.();
      })
  }

  onUsersDelete(userid, callback){
    axios.delete(`/users/${userid}`)
      .then( (response) => {
        message.success("删除成功！",1);
        this.onUsersRetrieve();
      })
      .catch( ()=>{
        message.error("删除失败！", 3);
      })
      .finally( ()=>{
        callback?.();
      })
  }

  onUsersLock(userid, callback){
  }
}

export default UsersStore;
