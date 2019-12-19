import Reflux from 'reflux';
import axios from 'utils/axios';

import CORSAxios from 'utils/CORSAxios';
import history from 'utils/history';

//Actions
import AppActions from 'actions/AppActions';

class AppStore extends Reflux.Store {
  constructor() {
    super();
    this.listenables = AppActions;
    this.state = {
      labMenu: undefined,
        activeAlgorithmId:0
    }
  }

  //与后端通讯，读后端APP.php的数据
  onGetLabMenu() {
    axios.get("/labmenu")
      .then( (response) => {
        if( response.code == 100 ) {
          this.setState({
            labMenu: response.data
          })
        }
      })
  }

    onGetLabMenuN() {
        axios.get("/labmenuN")
            .then( (response) => {
                if( response.code == 100 ) {
                    this.setState({
                        labMenu: response.data
                    })
                }
            })
    }

  onGetPlantInfo(path, callback) {
    // this.setState({
    //   plantInfo: null
    // })
      //console.log("哈哈哈");
      //console.log(path);
    axios.get("/plantinfo/"+path)
      .then( (response) => {
        if( response.code == 100 ) {
          this.setState({
            plantInfo: response.data
          })
          callback?.();
            //console.log("PlantInfof");
        }
      })
  }

  getHttpProtocols=(protocolString)=>{
      var protocols=protocolString.split('/');
      if(protocols[0]){
          return protocols[0];
      }
      else{
          return "http";
      }
  }

  onGetCurrentAlgorithm(plantInfo,callback){
      //console.log("onGetCurrentAlgorithm");
      //console.log(plantInfo);


      CORSAxios.get(this.getHttpProtocols(plantInfo.protocols)+"://"+plantInfo.serverUrl+'/ExperimentServlet?method=getCurrentAlgorithm&plantId='+plantInfo.id+'&plantType='+plantInfo.type+"&copyNum="+plantInfo.copyNum)
          .then( (response) => {
              if( response.code == 100 ) {
                  this.setState({
                      activeAlgorithmId: response.activeAlgorithmId
                  })
                  callback?.(response.activeAlgorithmId);
                  //console.log("Hello"+response.activeAlgorithmId);
              }
          });
  }

  onSetParam(plantInfo,value,pos){
      //console.log("onSetParam");
      console.log(plantInfo,value+pos);

      CORSAxios.get(this.getHttpProtocols(plantInfo.protocols)+"://"+plantInfo.serverUrl+'/ExperimentServlet?method=setParam&plantId='+plantInfo.id+"&pos="+pos+"&value="+value+'&plantType='+plantInfo.type+"&copyNum="+plantInfo.copyNum)
          .then( (response) => {
              if( response.code == 100 ) {

                  //console.log("Hello"+response.activeAlgorithmId);
              }
          });
  }

  onGetSignalParas(plantInfo,callback){
      console.log("onGetSigParas");
      console.log(plantInfo);
      //console.log(plantInfo.copyNum);

      CORSAxios.get(this.getHttpProtocols(plantInfo.protocols)+"://"+plantInfo.serverUrl+'/ExperimentServlet?method=getSignalParas&plantId='+plantInfo.id+'&plantType='+plantInfo.type+"&copyNum="+plantInfo.copyNum)
          .then( (response) => {
              //console.log(response);
              if( response.code == 100 ) {

                  this.setState({
                      signalParas: response.signalParas
                  })
                  callback?.(response.signalParas);
                  //console.log(response.signalParas);
              }
          });
  }

  onGetFullControl(plantInfo,user,callback){
      console.log("onGetFullControl");
      console.log('test onGetFullControl');
      console.log(plantInfo,user);

      const para={
          plantInfo : plantInfo,
          User: user,
      };
      console.log(para);


      para.action = "GetFullControl";
      const timestamp = Date.parse(new Date())/1000;
      para.user_id = para.User.id;
      //para.id_time = para.User.id +'-'+timestamp;
      //console.log(para.id);
      //console.log(timestamp2);
      axios.get("/requestFullControl/"+user.id+"/"+plantInfo.id)
          .then( (response) => {
              if( response.code == 100 ) {
                  callback?.();
              }
          });
      // add GetFullControl actions
      axios.post("/getActions" ,para)
          .then( (response) => {
          });
  }

  onGetFullControlStatus(plantInfo,user,callback,failedCallback){
      console.log('get full control status');
      console.log('test full control status');
      console.log(plantInfo);

      var timeSlice=0;
      if(plantInfo.timeSlice!=undefined){
          timeSlice=plantInfo.timeSlice;
      }

      axios.get("/getFullControlStatus/"+user.id+"/"+plantInfo.id+"/"+timeSlice)
          .then( (response) => {
              if( response.code == 100 ) {

                  this.setState({
                      queueInfo: response.queueInfo
                  })
                  //console.log(response);
                  callback?.();
              }
              else{
                  failedCallback?.();
              }
          })
          .catch(function (error) {
              failedCallback?.();
          });
  }

  onWithdrawFullControl(plantInfo,user,callback){
      console.log('withdraw full control');
      axios.get("/withdrawFullControl/"+user.id+"/"+plantInfo.id)
          .then( (response) => {
              if( response.code == 100 ) {

                  callback?.();
                  console.log(response);
              }
          })
      const para={
          plantInfo : plantInfo,
          User: user,
      };
      //console.log(para);

      // add CancelFullControl actions
      para.action = "CancelFullControl";
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

    onCancelFullControl(plantInfo,user,callback) {
        console.log('Cancel full control');
        axios.get("/cancelFullControl/"+user.id+"/"+plantInfo.id)
            .then( (response) => {
                if( response.code == 100 ) {

                    callback?.();
                    console.log(response);
                }
            });

    }



    onSetPlantStatus(plantInfo,status,callback){
      console.log("onSetPlantStatus");
      console.log(plantInfo);

        axios.post("/setPlantStatus/"+plantInfo.id+"/"+status)
            .then( (response) => {
                if( response.code == 100 ) {

                    callback?.();
                    //console.log(response);
                }
            });


    }
}

export default AppStore;
