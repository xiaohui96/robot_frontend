//依赖类
import React from 'react';
import ReactDom from 'react-dom';
import Reflux from 'reflux';
import { Router, Route, Switch } from 'react-router-dom';
import { withRouter } from 'react-router'
import { LocaleProvider, Spin, Icon } from 'antd';
import zhCN from 'antd/lib/locale-provider/zh_CN';
import history from 'utils/history';
import RGL, { WidthProvider } from "react-grid-layout";
import queryString from "query-string";

//数据流
import ExperimentActions from 'actions/ExperimentActions';
import AppActions from 'actions/AppActions';
import experimentStore from 'stores/experimentStore';

//组件类
import WidgetButton from 'components/WidgetButton';
import WIDGETS from 'components/WidgetsList';

//样式类
import './experiment.less'

const ReactGridLayout = WidthProvider(RGL);

class Experiment extends Reflux.Component {
  constructor(props){
    super(props);
    this.store = experimentStore;
    this.state = {
      widgetsList: undefined,
      monitor: false
    }
    this.queryParams = queryString.parse(props.location.search);
  }

  componentWillMount() {
    super.componentWillMount();
    ExperimentActions.WidgetsList.query(this.queryParams.configid);
  }

  onSave = () => {
    const widgetsList = JSON.parse(JSON.stringify(this.state.widgetsList));
    if( this.gridLayout != undefined ){
      widgetsList.forEach((item, index) => {
        const {i, w, h, x, y} = this.gridLayout[index];
        item.layout = {w, h, x ,y};
      })
    }
    ExperimentActions.WidgetsList.update(this.queryParams.configid, widgetsList);
  }

  onAddWidgets = (id) => {
    const {widgetsList} = this.state;
    const item = {
      widgetsId:id,
      key: Math.random().toString(36).substr(2)
    };
    const newWidgetsList = widgetsList ? [...widgetsList,item] : [item];
    this.setState({widgetsList: newWidgetsList});
  }

  onLayoutChange = (layout)=>{
    // console.table(layout);
    this.gridLayout = layout;
  }

  onDelete = (key) => {
    this.setState(prevState=>({
      widgetsList: prevState.widgetsList.filter(item => item.key != key)
    }))
  }

  onParamsConfig = ({key, params}) => {
    console.log(params);
    const widgetsList = JSON.parse(JSON.stringify(this.state.widgetsList));
    const widget = widgetsList.find(item=>item.key == key);
    if( widget ){
      widget.params = params;
    }
    this.setState({widgetsList});
  }

  renderWidgets = (widgetsList) => {
    const {monitor} = this.state;
    const widgetsGrid = widgetsList.map(( item , index)=>{
      const {widgetsId, layout, key, params} = item;
      const dataGrid = {...WIDGETS()[widgetsId].defaultLayout, ...layout};
      return (
        <div key={key} data-grid={dataGrid}>
          {WIDGETS(key, params, this.onParamsConfig, monitor)[widgetsId].widget}
          {
            !monitor ?
              <Icon
                className="grid-close-icon"
                type="close-circle"
                onClick={(e)=> this.onDelete(key)}
              />
              : null
          }
        </div>
      )
    })

    return (
      <ReactGridLayout
        onLayoutChange={this.onLayoutChange}
        className={monitor ? "widgets-container static" : "widgets-container"}
        cols={24}
        rowHeight={50}
        containerPadding={[10,10]}
        isDraggable={!this.state.monitor}
        isResizable={!this.state.monitor}
      >
        {widgetsGrid}
      </ReactGridLayout>
    )
  }

  onPauseMonitor = () => {
    this.setState({
      monitor: false
    })
  }

  onBeginMonitor = () => {
    this.setState({
      monitor: true
    })
  }

  renderWidgetButton = () => {
    const { monitor} = this.state;
    return WIDGETS().map( (item, index) => {
      return <WidgetButton
        key={index}
        monitor={monitor}
        text={item.name}
        iconid={item.iconid}
        widgetsId={index}
        onClick={this.onAddWidgets}
      />
    })
  }

  render(){
    const {loading, widgetsList, monitor} = this.state;
    return (
      <>
        <div className="widget-list">
          {
            this.renderWidgetButton()
          }
          <WidgetButton monitor={monitor} text="导入" iconid="upload" />
          <WidgetButton monitor={monitor} text="导出" iconid="download" />
          <WidgetButton monitor={monitor} text="保存" iconid="save2" onClick={this.onSave}/>
          {
            monitor ?
              <WidgetButton text="暂停监控" iconid="pause" onClick={this.onPauseMonitor}/>
              :
              <WidgetButton text="开始监控" iconid="start" onClick={this.onBeginMonitor}/>
          }
        </div>
        <Spin spinning={loading}>
          {
            widgetsList ?
              this.renderWidgets(widgetsList)
              :
              <div className="no-widgets-tips">组态尚未添加任何组件</div>
          }
        </Spin>
      </>
    )
  }
}

Experiment = withRouter(Experiment);

ReactDom.render(
  <LocaleProvider locale={zhCN}>
    <Router history={history}>
      <Experiment />
    </Router>
  </LocaleProvider>
, document.querySelector("#root"));
