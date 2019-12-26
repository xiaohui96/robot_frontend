import Reflux from 'reflux';

const AdminActions = Reflux.createActions({
  Labs: {
    children:["create","retrieve","query","update","delete"]
  },
  Robot: {
    children:["retrieve","update"]
  },
  Users: {
    children:["retrieve","update","query","delete","lock"]
  }
})

export default AdminActions;
