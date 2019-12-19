import Reflux from 'reflux';
import axios from 'utils/axios';

import history from 'utils/history';

//Actions
import DocActions from 'actions/DocActions';

class DocStore extends Reflux.Store {
    constructor() {
        super();
        this.listenables = DocActions;
        this.state = {
        };
    }

    onGetDocList(plantInfo,callback){
        console.log("getDocList");

        axios.get("/getDocList/"+plantInfo.id)
            .then( (response) => {
                //console.log(response.data);
                this.setState({ docList: response.data });
                callback?.();
            })
            .catch( ()=>{
                message.error("文档列表获取失败！", 3);
            });
    }
}

export default DocStore;