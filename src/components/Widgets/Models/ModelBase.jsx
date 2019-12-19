import React from 'react';
import Reflux from 'reflux';

//ThreeJS
//import * as THREE from 'three';

//import BallBeamSystem from 'components/Widgets/Models/BallBeamSystem';

import BallBeam from 'components/Widgets/Models/BallBeam';
import L1IP from 'components/Widgets/Models/L1IP';
import L2IP from 'components/Widgets/Models/L2IP';
import MagneticLevitationSystem from 'components/Widgets/Models/MagneticLevitationSystem';
import R1IP from 'components/Widgets/Models/R1IP';
import R2IP from 'components/Widgets/Models/R2IP';
import AsynchronousMotor from 'components/Widgets/Models/AsynchronousMotor';
import SteppingMotor from 'components/Widgets/Models/SteppingMotor';
import TorqueMotor from 'components/Widgets/Models/TorqueMotor';
import TripleTank from 'components/Widgets/Models/TripleTank';
import SingleTank from 'components/Widgets/Models/SingleTank';
import Fan from 'components/Widgets/Models/Fan';
import DoubleTank from 'components/Widgets/Models/DoubleTank';
import DCMotor from 'components/Widgets/Models/DCMotor';

class ModelBase extends React.Component {
    constructor(props) {
        super(props);
    }

    render(){
        const {plantInfo,signalParaList,dataPool,keyValue,params,monitor}=this.props;
        const {model}=plantInfo;
        //console.log(model);

        switch(model){
            case 'BallBeamSystem':
                return (<BallBeam params={params} monitor={monitor} plantInfo={plantInfo} signalParaList={signalParaList}dataPool={dataPool} keyValue={keyValue} onParamsConfig={this.props.onParamsConfig}/>);
                break;
            case 'BallPlateSystem':
                return (<BallPlate params={params} monitor={monitor} plantInfo={plantInfo} signalParaList={signalParaList}dataPool={dataPool} keyValue={keyValue} onParamsConfig={this.props.onParamsConfig}/>);
                break;
            case 'L1IP':
                return (<L1IP params={params} monitor={monitor} plantInfo={plantInfo} signalParaList={signalParaList}dataPool={dataPool} keyValue={keyValue} onParamsConfig={this.props.onParamsConfig}/>);
                break;
            case 'L2IP':
                return (<L2IP params={params} monitor={monitor} plantInfo={plantInfo} signalParaList={signalParaList}dataPool={dataPool} keyValue={keyValue} onParamsConfig={this.props.onParamsConfig}/>);
                break;
            case 'MagneticLevitationSystem':
                return (<MagneticLevitationSystem params={params} monitor={monitor} plantInfo={plantInfo} signalParaList={signalParaList}dataPool={dataPool} keyValue={keyValue} onParamsConfig={this.props.onParamsConfig}/>);
                break;
            case 'R1IP':
                return (<R1IP params={params} monitor={monitor} plantInfo={plantInfo} signalParaList={signalParaList}dataPool={dataPool} keyValue={keyValue} onParamsConfig={this.props.onParamsConfig}/>);
                break;
            case 'AsynchronousMotor':
                return (<AsynchronousMotor params={params} monitor={monitor} plantInfo={plantInfo} signalParaList={signalParaList}dataPool={dataPool} keyValue={keyValue} onParamsConfig={this.props.onParamsConfig}/>);
                break;
            case 'SteppingMotor':
                return (<SteppingMotor params={params} monitor={monitor} plantInfo={plantInfo} signalParaList={signalParaList}dataPool={dataPool} keyValue={keyValue} onParamsConfig={this.props.onParamsConfig}/>);
                break;
            case 'TorqueMotor':
                return (<TorqueMotor params={params} monitor={monitor} plantInfo={plantInfo} signalParaList={signalParaList}dataPool={dataPool} keyValue={keyValue} onParamsConfig={this.props.onParamsConfig}/>);
                break;
            case 'R2IP':
                return (<R2IP params={params} monitor={monitor} plantInfo={plantInfo} signalParaList={signalParaList}dataPool={dataPool} keyValue={keyValue} onParamsConfig={this.props.onParamsConfig}/>);
                break;
            case 'TripleTank':
                return (<TripleTank params={params} monitor={monitor} plantInfo={plantInfo} signalParaList={signalParaList}dataPool={dataPool} keyValue={keyValue} onParamsConfig={this.props.onParamsConfig}/>);
                break;
            case 'SingleTank':
                return (<SingleTank params={params} monitor={monitor} plantInfo={plantInfo} signalParaList={signalParaList}dataPool={dataPool} keyValue={keyValue} onParamsConfig={this.props.onParamsConfig}/>);
                break;
            case 'Fan':
                return (<Fan params={params} monitor={monitor} plantInfo={plantInfo} signalParaList={signalParaList}dataPool={dataPool} keyValue={keyValue} onParamsConfig={this.props.onParamsConfig}/>);
                break;
            case 'DoubleTank':
                return (<DoubleTank params={params} monitor={monitor} plantInfo={plantInfo} signalParaList={signalParaList}dataPool={dataPool} keyValue={keyValue} onParamsConfig={this.props.onParamsConfig}/>);
                break;
            case 'DCMotor':
                return (<DCMotor params={params} monitor={monitor} plantInfo={plantInfo} signalParaList={signalParaList}dataPool={dataPool} keyValue={keyValue} onParamsConfig={this.props.onParamsConfig}/>);
                break;
            default:
                return null;
        }
        return null;
    }
}

export default  ModelBase;