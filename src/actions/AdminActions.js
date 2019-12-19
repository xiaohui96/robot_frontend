import Reflux from 'reflux';

const AdminActions = Reflux.createActions({
  Cameras: {
    children:["create","retrieve","query","update","delete"]
  },
  Labs: {
    children:["create","retrieve","query","update","delete"]
  },
  TestRigs: {
    children:["create","retrieve","query","update","delete"]
  },
  Servers: {
    children:["create","retrieve","query","update","delete"]
  },
  System: {
    children:["retrieve","update"]
  },
  Users: {
    children:["retrieve","update","query","delete","lock"]
  }
})

export default AdminActions;
