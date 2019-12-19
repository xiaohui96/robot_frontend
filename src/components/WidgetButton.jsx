import React from 'react';
import { Button } from 'antd';

//组件类
import _Icon from 'components/Icon';

//样式类
import './WidgetButton.less'

class WidgetButton extends React.Component {
  constructor(props){
    super(props);
    this.state = {
    }
  }

  render(){
    const {iconid, text, monitor, widgetsId} = this.props;
    return (
      <Button disabled={monitor} className="widget-button" onClick={(e) => this.props.onClick(widgetsId)}> 
        <_Icon iconid={iconid}/>
        <span>{text}</span>
      </Button>
    )
  }
}

export default WidgetButton;
