import Reflux from 'reflux';
import axios from 'utils/axios';
import { message } from 'antd';

//Actions
import AdminActions from 'actions/AdminActions';

class LabsStore extends Reflux.Store {
  constructor() {
    super();
    this.listenables = AdminActions;
    this.state = {
      labsList:[],
      testRigsList:[],
      expandedRowKeys:[],
      labFormData: {},
      testRigFormData: {}
    }
  }

  onLabsCreate(formData, callback){
    axios.post("/labs", formData)
      .then( (response) => {
        message.success("创建成功！",1);
        this.onLabsRetrieve();
      })
      .catch( ()=>{
        message.error("创建失败！", 3);
      })
      .finally( ()=>{
        callback?.();
      })
  }

  onLabsRetrieve(){
    axios.get("/labs")
      .then( (response) => {
        this.setState({ labsList: response.data });
          console.log(response);
      })
      .catch( ()=>{
        message.error("实验室列表获取失败！", 3);
      })
  }

  onLabsUpdate(formData, labid, callback){
    axios.put(`/labs/${labid}`, formData)
      .then( (response) => {
        message.success("更新成功！",1);
        this.onLabsRetrieve();
      })
      .catch( ()=>{
        message.error("更新失败！", 3);
      })
      .finally( ()=>{
        callback?.();
      })
  }

  onLabsDelete(labid, callback){
    axios.delete(`/labs/${labid}`)
      .then( (response) => {
        message.success("删除成功！",1);
        this.onLabsRetrieve();
      })
      .catch( ()=>{
        message.error("删除失败！", 3);
      })
      .finally( ()=>{
        callback?.();
      })
  }

  onTestRigsCreate(formData, callback){
    axios.post("/testrigs", formData)
      .then( (response) => {
        message.success("创建成功！",1);
        this.onLabsRetrieve();
        this.onTestRigsRetrieve();
      })
      .catch( ()=>{
        message.error("创建失败！", 3);
      })
      .finally( ()=>{
        callback?.();
      })
  }

    onTestRigsRetrieve(){
        axios.get("/testrigs")
            .then( (response) => {
                this.setState({  testRigsList: response.data });
                // console.log(response);
            })
            .catch( ()=>{
                message.error("试验台信息获取失败！", 3);
            })
    }

  onTestRigsUpdate(formData, testRigid, callback){
    axios.put(`/testrigs/${testRigid}`, formData)
      .then( (response) => {
        message.success("更新成功！",1);
        this.onLabsRetrieve();
        this.onTestRigsRetrieve();
          // console.log(formData);
      })
      .catch( ()=>{
        message.error("更新失败！", 3);
      })
      .finally( ()=>{
        callback?.();
      })
  }

  onTestRigsDelete(testRigid, callback){
    axios.delete(`/testrigs/${testRigid}`)
      .then( (response) => {
        message.success("删除成功！",1);
          this.onLabsRetrieve();
        this.onTestRigsRetrieve();
      })
      .catch( ()=>{
        message.error("删除失败！", 3);
      })
      .finally( ()=>{
        callback?.();
      })
  }
}

export default LabsStore;
