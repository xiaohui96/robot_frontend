import Reflux from 'reflux';

const InfoActions = Reflux.createActions({
    Info: {
        children:["retrieve","update","query","delete","lock"]
    }
})

export default InfoActions;
