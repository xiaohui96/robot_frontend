import Reflux from 'reflux';
import axios from 'utils/axios';
import history from 'utils/history';
import { message } from 'antd';

//Actions
import AdminActions from 'actions/AdminActions';

class RobotStore extends Reflux.Store {
    constructor() {
        super();
        this.listenables = AdminActions;
    }

    onRobotRetrieve(formData){
        axios.get("/robotConfig/robot", formData)
            .then( (response) => {
                this.setState({
                    robotParams: response.data
                })
            })
    }
    onRobotUpdate(formData){
        const hideLoading = message.loading("配置更新中......",0)

        axios.put("/robotConfig/robot", {params: formData})
            .then( (response) => {
                hideLoading();
                message.success("更新成功！",1)
            })
            .catch( ()=>{
                hideLoading();
                message.error("更新失败！",1)
            })
    }
}

export default RobotStore;