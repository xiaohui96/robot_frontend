import Reflux from 'reflux';
import axios from 'utils/axios';
import history from 'utils/history';
import { message } from 'antd';

//Actions
import AppActions from 'actions/AppActions';

class ConfigurationsStore extends Reflux.Store {
    constructor() {
        super();
        this.listenables = AppActions;
        this.state = {
            configurationList: {}
        }
    }

    onConfigurationsRetrieve(algorithmId,userId){
        console.log(algorithmId);


        axios.get(`/getConfigurations/${algorithmId}/${userId}`)
            .then( (response) => {
                //console.log(response.data);
                this.setState({ configurationList: response.data });
            })
            .catch( ()=>{
                message.error("算法配置获取失败！", 3);
            });
    }

    onConfigurationsDelete(id, para,callback){
        console.log(para);
        //console.log(test_delete_widegetslist);

        axios.delete(`/widgetslist/${id}`)
            .then( (response) => {
                message.success("删除成功！",1);
                this.onConfigurationsRetrieve(para.algId,para.userId);
            })
            .catch( ()=>{
                message.error("删除失败！", 3);
            })
            .finally( ()=>{
                callback?.();
            })
    }
}

export default ConfigurationsStore;