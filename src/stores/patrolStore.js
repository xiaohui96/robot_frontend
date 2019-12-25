import Reflux from 'reflux';
import axios from 'utils/axios';
import history from 'utils/history';
import { message } from 'antd';

//Actions
import AppActions from 'actions/AppActions';

class PatrolStore extends Reflux.Store {
    constructor() {
        super();
        this.listenables = AppActions;
        this.state = {
            patrolList: [],
        }
    }

    onPatrolRetrieve(callback){
        axios.get("/getPatrolResult")
            .then( (response) => {
                //console.log(response.data);
                this.setState({ patrolList: response.data });
            })
            .catch( ()=>{
                message.error("巡检结果列表获取失败！", 3);
            });
    }
    onPatrolUpdate(formData, callback){
        axios.put(`/patrol/${formData.id}`, formData)
            .then( (response) => {
                message.success("更新成功！", 1);
                this.onPatrolRetrieve();
            })
            .catch( ()=>{
                message.error("更新失败！", 3);
            })
            .finally( ()=>{
                callback?.();
            })
    }
    onPatrolDelete(id, callback){
        axios.delete(`/patrol/${id}`)
            .then( (response) => {
                message.success("删除成功!",1);
                this.onPatrolRetrieve();
            })
            .catch( ()=>{
                message.error("删除失败!", 3);
            })
            .finally( ()=>{
                callback?.();
            })
    }
}

export default PatrolStore;