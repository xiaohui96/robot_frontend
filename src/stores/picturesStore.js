import Reflux from 'reflux';
import axios from 'utils/axios';
import history from 'utils/history';
import { message } from 'antd';

//Actions
import AppActions from 'actions/AppActions';

class PicturesStore extends Reflux.Store {
    constructor() {
        super();
        this.listenables = AppActions;
        this.state = {
            pictureList: []
        }
    }

    onPicturesCreate(formData, userId,fileData,callback){
        //console.log("哈哈哈");
        console.log(formData);
        formData.userId=userId;
        formData.fileName=fileData.fileName;
        //console.log(typeof (formData));
        console.log(formData);
        axios.post("/pictures", formData)
            .then( (response) => {
                message.success("创建成功！",1);
                this.onPicturesRetrieve({id:userId});
            })
            .catch( ()=>{
                message.error("创建失败！", 3);
            })
            .finally( ()=>{
                callback?.();
            });

        // add createalgorithms actions

    }

    onPicturesCompare(pictureList0,pictureList1,callback){
        console.log("哈哈哈");
        pictureList0.name1=pictureList1.name;
        console.log(pictureList0);
        //console.log(typeof (pictureList0));
        //formData.name2=pictureList1.name;
        axios.get("/picturesCompare/"+pictureList0.account+"/"+pictureList0.name+"/"+pictureList0.name1 )
            .then( (response) => {
                //this.setState({ result: response.data });
                //console.log("ReportsRetrieve返回信息:");
                message.success("人脸对比成功！",1);
            })
            .catch( ()=> {
                message.error("人脸对比失败！", 3);
            })
            .finally( ()=>{
                    callback?.();
                })
    }

    onPicturesRetrieve(User,callback){
        axios.get("/getPictures/"+User.id)
            .then( (response) => {
                //console.log(response.data);
                this.setState({ pictureList: response.data });
                //console.log("ReportsRetrieve返回信息:");
                console.log(response.data);
                callback?.();
            })
            .catch( ()=>{
                message.error("个人图片获取失败！", 3);
            });
    }
    onPicturesAllretrieve(){
        axios.get("/getAllpictures")
            .then( (response) => {
                //console.log(response.data);
                this.setState({ reportList: response.data });
                //console.log("ReportsRetrieve返回信息:");
                console.log(response.data);
            })
            .catch( ()=>{
                message.error("个人图片获取失败！", 3);
            });
    }

    onPicturesUpdate(formData, id, para,callback){
        //console.log("test Update");
        //console.log(formData);
        //console.log(id);
        axios.put(`/pictures/${id}`, formData)
        //axios.put(`/reports/${User.User.id}`, formData,User.User.id)
            .then( (response) => {
                message.success("更新成功！", 1);
                this.onPicturesRetrieve(para.User);
            })
            .catch( ()=>{
                message.error("更新失败！", 3);
            })
            .finally( ()=>{
                callback?.();
            })
    }

    onPicturesDelete(id, para,callback){
        //console.log(para);
        //console.log("哈哈哈");
        //console.log(id);
        axios.delete(`/pictures/${id}`)
            .then( (response) => {
                message.success("删除成功！",1);
                this.onPicturesRetrieve(para.User,para.plantInfo);
            })
            .catch( ()=>{
                message.error("删除失败！", 3);
            })
            .finally( ()=>{
                callback?.();
            })

        // add deletealgorithms actions

    }
}

export default PicturesStore;