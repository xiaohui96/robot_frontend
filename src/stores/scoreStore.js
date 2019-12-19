import Reflux from 'reflux';
import axios from 'utils/axios';
import history from 'utils/history';
import { message } from 'antd';

//Actions
import AppActions from 'actions/AppActions';

class ScoreStore extends Reflux.Store {
    constructor() {
        super();
        this.listenables = AppActions;
        this.state = {
            scoreList: []
        }
    }



    onScoreRetrieve(callback){
        axios.get("/getScore")
            .then( (response) => {
                //console.log("嘿嘿");
                //console.log(response.data);
                this.setState({ scoreList: response.data });
                //console.log("ReportsRetrieve返回信息:");
                //console.log(response.data);
                callback?.();
            })
            .catch( ()=>{
                message.error("成绩列表获取失败！", 3);
            });
    }

    onScoreUpdate(formData, id, para,callback){
        //console.log("test Update");
        //console.log(formData);
        //console.log(id);
        axios.put(`/score/${id}`, formData)
        //axios.put(`/reports/${User.User.id}`, formData,User.User.id)
            .then( (response) => {
                message.success("更新成功！", 1);
                this.onScoreRetrieve();
            })
            .catch( ()=>{
                message.error("更新失败！", 3);
            })
            .finally( ()=>{
                callback?.();
            })
    }

    onScoreDelete(id, para,callback){
        //this.onReportsRetrieve(para.User,para.plantInfo);
        axios.delete(`/score/${id}`)
            .then( (response) => {
                message.success("删除成功!",1);
                this.onScoreRetrieve();
            })
            .catch( ()=>{
                message.error("删除失败!", 3);
            })
            .finally( ()=>{
                callback?.();
            })

        // add deletealgorithms actions

    }


}

export default ScoreStore;