import Reflux from 'reflux';
import axios from 'utils/axios';
import history from 'utils/history';
import { message } from 'antd';

//Actions
import AppActions from 'actions/AppActions';

class AlarmSettingStore extends Reflux.Store {
    constructor() {
        super();
        this.listenables = AppActions;
        this.state = {
            alarmSettingList: [],
        }
    }

    onAlarmSettingRetrieve(callback){
        axios.get("/getAlarmSetting")
            .then( (response) => {
                this.setState({ alarmSettingList: response.data });
            })
            .catch( ()=>{
                message.error("报警信息列表获取失败！", 3);
            });
    }
    onAlarmSettingUpdate(formData, callback){
        axios.put(`/alarmSetting/${formData.id}`, formData)
            .then( (response) => {
                message.success("更新成功！", 1);
                this.onAlarmSettingRetrieve();
            })
            .catch( ()=>{
                message.error("更新失败！", 3);
            })
            .finally( ()=>{
                callback?.();
            })
    }
    onAlarmSettingCreate(formData,callback){
        axios.post(`/alarmSetting/${formData.id}`, formData)
            .then( (response) => {
                message.success("新增成功!",1);
                this.onAlarmSettingRetrieve();
            })
            .catch( ()=>{
                message.error("新增失败!", 3);
            })
            .finally( ()=>{
                callback?.();
            })
    }
    onAlarmSettingDelete(id,callback){
        axios.delete(`/alarmSetting/${id}`)
            .then( (response) => {
                message.success("删除成功!",1);
                this.onAlarmSettingRetrieve();
            })
            .catch( ()=>{
                message.error("删除失败!", 3);
            })
            .finally( ()=>{
                callback?.();
            })
    }
}

export default AlarmSettingStore;