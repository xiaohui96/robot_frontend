import Reflux from 'reflux';
import axios from 'utils/axios';
import history from 'utils/history';
import { message } from 'antd';

//Actions
import AppActions from 'actions/AppActions';

class AlgorithmsStore extends Reflux.Store {
    constructor() {
        super();
        this.listenables = AppActions;
        this.state = {
            algorithmList: []
        }
    }

    onAlgorithmsCreate(formData, userId, plantId,fileData,callback){
        console.log("哈哈哈");
        formData.userId=userId;
        formData.plantId=plantId;
        formData.fileName=fileData.fileName;
        //console.log(formData);
        axios.post("/algorithms", formData)
            .then( (response) => {
                message.success("创建成功！",1);
                this.onAlgorithmsRetrieve({id:userId},{id:plantId});
            })
            .catch( ()=>{
                message.error("创建失败！", 3);
            })
            .finally( ()=>{
                callback?.();
            });

        // add createalgorithms actions
        formData.action = "createalgorithm";
        // console.log(formData);
        const timestamp = Date.parse(new Date())/1000;
        formData.user_id = formData.userId;
        //formData.id_time = formData.userId +'-'+timestamp;
        axios.post("/getActionsCreateAlgorithm" ,formData)
            .then( (response) => {
            })
            .catch( ()=>{
                message.error('保存失败！');
            })
    }

    onAlgorithmsRetrieve(User,plantInfo,callback){
        //console.log(User);

        axios.get("/getAlgorithms/"+User.id+"/"+plantInfo.id)
            .then( (response) => {
                //console.log(response.data);
                this.setState({ algorithmList: response.data });
                callback?.();
            })
            .catch( ()=>{
                message.error("算法列表获取失败！", 3);
            });
    }

    onAlgorithmsUpdate(formData, id, para,callback){
        //console.log("test AlgorithmsUpdate");
        //console.log(id);
        axios.put(`/algorithms/${id}`, formData)
            .then( (response) => {
                message.success("更新成功！", 1);
                this.onAlgorithmsRetrieve(para.User,para.plantInfo);
            })
            .catch( ()=>{
                message.error("更新失败！", 3);
            })
            .finally( ()=>{
                callback?.();
            })
    }

    onAlgorithmsDelete(id, para,callback){
        //console.log(para);
        //console.log("哈哈哈");
        axios.delete(`/algorithms/${id}`)
            .then( (response) => {
                message.success("删除成功！",1);
                this.onAlgorithmsRetrieve(para.User,para.plantInfo);
            })
            .catch( ()=>{
                message.error("删除失败！", 3);
            })
            .finally( ()=>{
                callback?.();
            })

        // add deletealgorithms actions
        para.action = "deletealgorithm";
        // console.log(para);
        const timestamp = Date.parse(new Date())/1000;
        para.user_id = para.User.id;
        //para.id_time = para.User.id +'-'+timestamp;
        axios.post("/getActions" ,para)
            .then( (response) => {
            })
            .catch( ()=>{
                message.error('保存失败！');
            })
    }
}

export default AlgorithmsStore;
