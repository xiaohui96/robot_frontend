import Reflux from 'reflux';
import axios from 'utils/axios';
import history from 'utils/history';
import { message } from 'antd';

//Actions
import AppActions from 'actions/AppActions';

class ReportsStore extends Reflux.Store {
    constructor() {
        super();
        this.listenables = AppActions;
        this.state = {
            reportList: [],
            reportAllList: []
        }
    }

    onReportsCreate(formData, userId,fileData,callback){
        //console.log("哈哈哈");
        console.log(formData);
        formData.userId=userId;
        formData.fileName=fileData.fileName;
        //console.log(formData);
        axios.post("/reports", formData)
            .then( (response) => {
                message.success("创建成功！",1);
                this.onReportsRetrieve({id:userId});
            })
            .catch( ()=>{
                message.error("创建失败！", 3);
            })
            .finally( ()=>{
                callback?.();
            });

        // add createalgorithms actions

    }

    onReportsScore(formData, callback){
        console.log("哈哈哈");
        console.log(formData);
        //formData.userId=userId;
        //formData.report_score=report_score;
        //formData.fileName=fileData.fileName;
        axios.post("/score", formData)
            .then( (response) => {
                message.success("创建成功！",1);
                //this.onReportsRetrieve({id:userId});
            })
            .catch( ()=>{
                message.error("创建失败！", 3);
            })
            .finally( ()=>{
                callback?.();
            });

        // add createalgorithms actions

    }

    onReportsRetrieve(User,callback){
        axios.get("/getReports/"+User.id)
            .then( (response) => {
                //console.log("嘿嘿");
                this.setState({ reportList: response.data });
                //console.log("ReportsRetrieve返回信息:");
                //console.log(response.data);
                callback?.();
            })
            .catch( ()=>{
                message.error("实验报告列表获取失败！", 3);
            });
    }
    onReportsAllretrieve(){
        axios.get("/getAllreports")
            .then( (response) => {
                //console.log(response.data);
                this.setState({ reportAllList: response.data });
                //console.log("ReportsAllretrieve返回信息:");
                //console.log(response.data);
            })
            .catch( ()=>{
                message.error("实验报告列表获取失败！", 3);
            });
    }

    onReportsUpdate(formData, id, para,callback){
        //console.log("test Update");
        //console.log(formData);
        //console.log(id);
        axios.put(`/reports/${id}`, formData)
        //axios.put(`/reports/${User.User.id}`, formData,User.User.id)
            .then( (response) => {
                message.success("更新成功！", 1);
                this.onReportsRetrieve(para.User);
            })
            .catch( ()=>{
                message.error("更新失败！", 3);
            })
            .finally( ()=>{
                callback?.();
            })
    }

    onReportsDelete(id, para,callback){
        //this.onReportsRetrieve(para.User,para.plantInfo);
        axios.delete(`/reports/${id}`)
            .then( (response) => {
                message.success("删除成功!",1);
                this.onReportsRetrieve(para.User);
            })
            .catch( ()=>{
                message.error("删除失败!", 3);
            })
            .finally( ()=>{
                callback?.();
            })

        // add deletealgorithms actions

    }

    onReportsAlldelete(id, para,callback){
        //this.onReportsRetrieve(para.User,para.plantInfo);
        axios.delete(`/reports/${id}`)
            .then( (response) => {
                message.success("删除成功!",1);
                this.onReportsAllretrieve();
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

export default ReportsStore;