import Reflux from 'reflux';
import axios from 'utils/axios';
import history from 'utils/history';
import { message } from 'antd';

//Actions
import AppActions from 'actions/AppActions';

class RobotInfoStore extends Reflux.Store {
    constructor() {
        super();
        this.listenables = AppActions;
    }

    onRobotInfoRetrieve(){
        axios.get("/robotInfo")
            .then( (response) => {
                this.setState({
                    RobotInfoList: response.data
                })
            })
    }
    onRobotInfoUpdate(formData,callback){
        const hideLoading = message.loading("配置更新中......",0)
        axios.put(`/robotInfo/${formData.id}`, formData)
            .then( (response) => {
                hideLoading();
                message.success("更新成功！",1)
                this.onRobotInfoRetrieve();
            })
            .catch( ()=>{
                hideLoading();
                message.error("更新失败！",1)
                this.onRobotInfoRetrieve();
            })
            .finally( ()=>{
                callback?.();
            })
    }
    onRobotInfoCreate(formData,callback){
        axios.post(`/robotInfo/${formData.id}`, formData)
            .then( (response) => {
                message.success("新增成功!",1);
                this.onRobotInfoRetrieve();
            })
            .catch( ()=>{
                message.error("新增失败!", 3);
            })
            .finally( ()=>{
                callback?.();
            })
    }
    onRobotInfoDelete(id,callback){
        axios.delete(`/robotInfo/${id}`)
            .then( (response) => {
                message.success("删除成功!",1);
                this.onRobotInfoRetrieve();
            })
            .catch( ()=>{
                message.error("删除失败!", 3);
            })
            .finally( ()=>{
                callback?.();
            })
    }
}

export default RobotInfoStore;