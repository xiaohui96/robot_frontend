//依赖类
import React from 'react';
import ReactDom from 'react-dom';
import Reflux from 'reflux';
import {Router, Route, Switch} from 'react-router-dom';
import {withRouter} from 'react-router'
import {LocaleProvider, Spin, Icon} from 'antd';
import zhCN from 'antd/lib/locale-provider/zh_CN';
import history from 'utils/history';
import RGL, {WidthProvider} from "react-grid-layout";
import queryString from "query-string";

import joint from 'jointjs';

//数据流
import ExperimentActions from 'actions/ExperimentActions';
import AppActions from 'actions/AppActions';
import experimentStore from 'stores/experimentStore';

//组件类
import WidgetButton from 'components/WidgetButton';
import WIDGETS from 'components/WidgetsList';

//样式类
import './experiment.less';
import './joint.css';

const ReactGridLayout = WidthProvider(RGL);

class Experiment extends Reflux.Component {
    constructor(props) {
        super(props);

    }

    componentDidMount() {
        this.init();
    }

    init=()=>{
        var graph = new joint.dia.Graph;
        var paper = new joint.dia.Paper({ el: ReactDom.findDOMNode(this.mount), width: 650, height: 200, gridSize: 1, model: graph });

        var shape = new joint.shapes.devs.Model({
            position: {
                x: 100,
                y: 100
            },
            inPorts: ['in1', 'in2'],
            outPorts: ['out1', 'out2']
        });

        shape.addTo(graph);

// adding/removing ports dynamically
        shape.addInPort('in3');
        shape.removeOutPort('out1').addOutPort('out3');

        var link = new joint.shapes.devs.Link({
            source: {
                id: shape.id,
                port: 'out3'
            },
            target: {
                x: 200,
                y: 300
            }
        });
        link.addTo(graph);

// moving the input ports from `left` to `top`
        shape.changeInGroup({ position: 'top' });
// moving the output ports 'right' to 'bottom'
        shape.changeOutGroup({ position: 'bottom' });

    }


    render() {
        return (
            <>
            <div className="widget-list">

                <WidgetButton text="导入" iconid="upload"/>
                <WidgetButton text="导出" iconid="download"/>

            </div>
            <div
                className="three-js-container"
                ref={(mount) => {
                    this.mount = mount;
                }}
            />
            </>
        )
    }
}

Experiment = withRouter(Experiment);

ReactDom.render(
    <LocaleProvider locale={zhCN}>
        <Router history={history}>
            <Experiment/>
        </Router>
    </LocaleProvider>
    , document.querySelector("#root"));
