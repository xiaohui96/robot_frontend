import Reflux from 'reflux';
import axios from 'utils/axios';
import history from 'utils/history';
import { message } from 'antd';

//Actions
import AppActions from 'actions/AppActions';

class AlarmStore extends Reflux.Store {
    constructor() {
        super();
        this.listenables = AppActions;
        this.state = {
            alarmList: [],
        }
    }

    onAlarmCreate(name,callback){
        axios.Store(`/alarmInformation`)
            .then( (response) => {
                message.success("删除成功!",1);
                this.onAlarmRetrieve();
            })
            .catch( ()=>{
                message.error("删除失败!", 3);
            })
            .finally( ()=>{
                callback?.();
            })
    }


    onAlarmRetrieve(callback){
        axios.get("/getAlarmInformation")
            .then( (response) => {
                //console.log(response.data);
                this.setState({ alarmList: response.data });
            })
            .catch( ()=>{
                message.error("报警信息列表获取失败！", 3);
            });
        axios.get("/getPatrolParameters")
            .then( (response) => {
                //console.log(response.data);
                this.setState({ PatrolParametersList: response.data});
            })
            .catch( ()=>{
                message.error("巡检参数列表获取失败！", 3);
            });
    }
    onAlarmTaskretrieve(callback){
        axios.get("/getTasks")
            .then( (response) => {
                //console.log(response.data);
                this.setState({ TasksList: response.data});
            })
            .catch( ()=>{
                message.error("任务列表获取失败！", 3);
            });
    }
    onAlarmTaskupdate(formData,callback){
        //console.log("test Update");
        //console.log(formData);
        //console.log(id);
        axios.put(`/task/${formData.id}`, formData)
            .then( (response) => {
                message.success("更新成功！", 1);
                this.onAlarmTaskretrieve();
            })
            .catch( ()=>{
                message.error("更新失败！", 3);
            })
            .finally( ()=>{
                callback?.();
            })
    }
    onAlarmUpdate(formData,callback){
        //console.log("test Update");
        //console.log(formData);
        //console.log(id);
        axios.put(`/alarmInformation/${formData.id}`, formData)
            .then( (response) => {
                message.success("更新成功！", 1);
                this.onAlarmRetrieve();
            })
            .catch( ()=>{
                message.error("更新失败！", 3);
            })
            .finally( ()=>{
                callback?.();
            })
    }

    onAlarmDelete(id,callback){
        axios.delete(`/alarmInformation/${id}`)
            .then( (response) => {
                message.success("删除成功!",1);
                this.onAlarmRetrieve();
            })
            .catch( ()=>{
                message.error("删除失败!", 3);
            })
            .finally( ()=>{
                callback?.();
            })
    }
    onAlarmTaskdelete(id,callback){
        axios.delete(`/task/${id}`)
            .then( (response) => {
                message.success("删除成功!",1);
                this.onAlarmTaskretrieve();
            })
            .catch( ()=>{
                message.error("删除失败!", 3);
            })
            .finally( ()=>{
                callback?.();
            })
    }

}

export default AlarmStore;