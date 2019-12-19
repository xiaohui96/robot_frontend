import Reflux from 'reflux';
import axios from 'utils/axios';
import { message } from 'antd';

//Actions
import AdminActions from 'actions/AdminActions';

class SystemStore extends Reflux.Store {
  constructor() {
    super();
    this.listenables = AdminActions;
  }

  onSystemRetrieve(formData){
    axios.get("/sysconfig/system", formData)
      .then( (response) => {
        this.setState({
          systemParams: response.data
        })
      })
  }

  onSystemUpdate(formData){
    const hideLoading = message.loading("配置更新中......",0)

    axios.put("/sysconfig/system", {params: formData})
      .then( (response) => {
        hideLoading();
        message.success("更新成功！",1)
      })
      .catch( ()=>{
        hideLoading();
        message.error("更新失败！",1)
      })
  }
}

export default SystemStore;
