import Reflux from 'reflux';

const AdminActions = Reflux.createActions({
    Cameras: {
        children:["create","retrieve","query","update","delete"]
    },
  Labs: {
    children:["create","retrieve","query","update","delete"]
  },
  Robot: {
    children:["retrieve","update"]
  },
  Users: {
    children:["retrieve","update","query","delete","lock"]
  },
    TestRigs: {
        children:["create","retrieve","query","update","delete"]
    },
    Servers: {
        children:["create","retrieve","query","update","delete"]
    },
})

export default AdminActions;
