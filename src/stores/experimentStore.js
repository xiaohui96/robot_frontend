import Reflux from 'reflux';
import axios from 'utils/axios';
import { message } from 'antd';
import history from 'utils/history';

//Actions
import ExperimentActions from 'actions/ExperimentActions';

class ExperimentStore extends Reflux.Store {
  constructor() {
    super();
    this.listenables = ExperimentActions;
  }

  onWidgetsListQuery(id) {
    this.setState({
      loading: true
    })
    if(id==0){
        this.setState({
            widgetsList: [],
            loading: false
        });
    }
    axios.get(`/widgetslist/`+id)
      .then( (response) => {
        if( response.code == 100 ) {
          //console.log(JSON.parse(response.data));
           const algInfo={
               packageSize:response.data.packageSize,
               stepSize:response.data.stepSize
           };

            // console.log(algInfo);
          this.setState({
            widgetsList: JSON.parse(response.data.data),
            widgetsListId:response.data.id,
            widgetsListName:response.data.name,
            algInfo:algInfo,
            loading: false
          });
        }
      })
      .catch( ()=>{
        this.setState({
          loading: false
        })
      })
  }

  onWidgetsListUpdate(id, widgetsList,callback) {
    this.setState({
      loading: true
    })
     // console.log("test widgetsList");


    axios.post(`/widgetslist/${id}`, widgetsList)
      .then( (response) => {
        if( response.code == 100 ) {
          message.success('保存成功！');
          if(id==0){
              this.setState({
                  widgetsListId:response.target.id,
                  loading: false
              })
          }
          else{
              this.setState({
                  loading: false
              })
          }
            callback?.();
        }
      })

      // add saveWidgetsList actions
      // console.log("test saveWidgetList");
      widgetsList.action = "saveWidgetsList";
      // console.log(widgetsList);
      const timestamp = Date.parse(new Date())/1000;
      widgetsList.user_id = widgetsList.userId;
      //widgetsList.id_time = widgetsList.userId +'-'+timestamp;
      axios.post("/getActionsWidgetList" ,widgetsList)
          .then( (response) => {
          })
          .catch( ()=>{
            message.error('保存失败！');
          })


  }
}

export default ExperimentStore;
