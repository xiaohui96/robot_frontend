import Reflux from 'reflux';
import axios from 'utils/axios';
import { message } from 'antd';

//Actions
import InfoActions from 'actions/InfoActions';

import intl from 'react-intl-universal';

class InfoStore extends Reflux.Store {
    constructor() {
        super();
        this.listenables = InfoActions;
        this.state = {
            userFormData: {},
        }
    }

    onInfoRetrieve(userFormData){
        axios.get("/verifyLogin",userFormData)
            .then( (response) => {
                this.setState({ userFormData: response.data });
                console.log("retrieve返回信息:");
                console.log(response.data);

            })

    }


    onInfoUpdate(userFormData, id){
        axios.put(`/users/${id}`, userFormData)
            .then( (response) => {
                message.success(intl.get('update success'),1);
                this.onInfoRetrieve(userFormData);
            })
            .catch( ()=>{
                message.error(intl.get('update fail'), 3);
            })
    }

}

export default InfoStore;
