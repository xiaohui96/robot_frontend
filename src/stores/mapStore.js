import Reflux from 'reflux';
import axios from 'utils/axios';
import history from 'utils/history';
import { message } from 'antd';

//Actions
import AppActions from 'actions/AppActions';

class MapStore extends Reflux.Store {
    constructor() {
        super();
        this.listenables = AppActions;
        this.state = {
            mapList: [],
        }
    }

    onMapRetrieve(callback){
        axios.get("/getMap")
            .then( (response) => {
                //console.log(response.data);
                this.setState({ mapList: response.data });
            })
            .catch( ()=>{
                message.error("地图信息列表获取失败！", 3);
            });
    }
    onMapUpdate(formData, callback){
        axios.put(`/map/${formData.id}`, formData)
            .then( (response) => {
                message.success("更新成功！", 1);
                this.onMapRetrieve();
            })
            .catch( ()=>{
                message.error("更新失败！", 3);
            })
            .finally( ()=>{
                callback?.();
            })
    }
    onMapCreate(formData,callback){
        axios.post(`/map/${formData.id}`, formData)
            .then( (response) => {
                message.success("新增成功!",1);
                this.onMapRetrieve();
            })
            .catch( ()=>{
                message.error("新增失败!", 3);
            })
            .finally( ()=>{
                callback?.();
            })
    }
    onMapDelete(id,callback){
        axios.delete(`/map/${id}`)
            .then( (response) => {
                message.success("删除成功!",1);
                this.onMapRetrieve();
            })
            .catch( ()=>{
                message.error("删除失败!", 3);
            })
            .finally( ()=>{
                callback?.();
            })
    }
}

export default MapStore;