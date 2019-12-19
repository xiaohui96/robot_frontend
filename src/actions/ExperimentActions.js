import Reflux from 'reflux';

const ExperimentActions = Reflux.createActions([
  {
    WidgetsList:{
      children:["create","retrieve","query","update","delete"]
    },
  },
])

export default ExperimentActions;
