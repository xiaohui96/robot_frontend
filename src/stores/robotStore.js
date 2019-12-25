import Reflux from 'reflux';
import axios from 'utils/axios';
import history from 'utils/history';
import { message } from 'antd';

//Actions
import AppActions from 'actions/AppActions';

class RobotStore extends Reflux.Store {
    constructor() {
        super();
        this.listenables = AppActions;
        this.state = {
            robotList: [],
        }
    }

    onRobotRetrieve(callback){
        axios.get("/getMapInformation")
            .then( (response) => {
                console.log(response.data);
                this.setState({ robotList: response.data });
            })
            .catch( ()=>{
                message.error("地图信息列表获取失败！", 3);
            });
    }
}

export default RobotStore;