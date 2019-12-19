import Reflux from 'reflux';

const AppActions = Reflux.createActions([
  "GetLabMenu",
    "GetLabMenuN",
  "GetPlantInfo",
   "GetCurrentAlgorithm",
   "GetSignalParas",
   "SetParam",
   //"startExperiment",
    "GetFullControl",
    "GetFullControlStatus",
    "WithdrawFullControl",
    "CancelFullControl",
    "GetInitialMessages",
    "AddNewMessage",
    "SetPlantStatus",
  {
    Algorithms:{
      children:["create","retrieve","query","update","delete"]
    },
  },
  {
    Configurations:{
      children:["create","retrieve","query","update","delete"]
    },
  },
  {
    Reports:{
      children:["create","retrieve","query","update","delete","allretrieve","score","alldelete"]
    },
  },
  {
     Pictures:{
     children:["create","retrieve","query","update","delete","compare"]
     },
   },
   {
     Score:{
      children:["retrieve","query","update","delete"]
     },
  },
   {
     Alarm:{
       children:["retrieve","query","update","delete","taskretrieve","taskupdate",'taskdelete']
      },
   },
])

export default AppActions;
