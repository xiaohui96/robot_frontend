import React from 'react';
import ReactDom from 'react-dom';
import Reflux from 'reflux';

import {Tabs} from 'antd';

import Algorithm from 'routes/lab/Algorithm';

import DrumSama from './DrumSama';

const TabPane = Tabs.TabPane;

class ThermalPlant extends Reflux.Component {
    constructor(props) {
        super(props);
        this.state={
        };
    }

    render(){
        const {plantInfo,isFullControl,user,activeAlgorithmId,signalParas}=this.props;

        const isRunning=(activeAlgorithmId!=0);

        return (
            <Tabs>
                <TabPane tab="设备信息" key="1"></TabPane>
                <TabPane tab="控制算法" key="2"><Algorithm isFullControl={isFullControl}
                                                                                   user={user}
                                                                                   onGetSignalParas={this.props.onGetSignalParas}
                                                                                   plantInfo={plantInfo}
                                                                                   onActiveAlgorithmChange={this.props.onActiveAlgorithmChange}/></TabPane>
                <TabPane tab="SAMA图" key="3"><DrumSama plantInfo={plantInfo} isRunning={isRunning} isFullControl={isFullControl} signalParas={signalParas} /></TabPane>
            </Tabs>
        );
    }
}

export default ThermalPlant;