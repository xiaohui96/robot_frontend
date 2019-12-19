import Reflux from 'reflux';
import axios from 'utils/axios';

import { message } from 'antd';

import CORSAxios from 'utils/CORSAxios';
import history from 'utils/history';

//Actions
import AppActions from 'actions/AppActions';

class ChatroomStore extends Reflux.Store {
    constructor() {
        super();
        this.listenables = AppActions;

    }

    onGetInitialMessages=(msg,callback)=>{
        //console.log("onGetInitialMessages");


        axios.post(`/getMessages`, msg)
            .then( (response) => {
                callback?.(response.data);
                //console.log(response.data);
                /*
                this.setState({
                    messages:response.data
                });*/
            })
            .catch( ()=>{
                message.error("获取消息失败！", 3);
            })

    }

    onAddNewMessage=(msg,callback)=>{
        console.log(msg);

        axios.put(`/addNewMessage`, msg)
            .then( (response) => {
                callback?.();
                //message.success("添加消息成功！", 1);
            })
            .catch( ()=>{
                message.error("消息保存失败！", 3);
            })
    }
}

export default ChatroomStore;