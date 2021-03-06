import React from 'react';
import Reflux from 'reflux';
import { Select} from 'antd';

//数据流
import AdminActions from 'actions/AdminActions';
import labsStore from 'stores/labsStore';

const Option = Select.Option;

export default class SelectLabs extends Reflux.Component {
  constructor(props) {
    super(props);
    this.store = labsStore;
    this.storeKeys = ['labsList'];
    this.state = {
      labsList: null,
    }
  }

  componentDidMount() {
    if(this.state.labsList == null){
      AdminActions.Labs.retrieve();
    }
  }

  renderOptions = ()=>{
    return this.state.labsList.map( item => (
      <Option value={item.id} key={item.id}>{item.nameCN}</Option>

    ))
    console.log('nameCN= '+nameEN);
  }

  render(){
    return (
      <Select {...this.props}>
        {
          this.state.labsList && this.renderOptions()
        }
      </Select>
    )
  }
}
