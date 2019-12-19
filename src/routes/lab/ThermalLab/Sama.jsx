import React from 'react';
import ReactDom from 'react-dom';
import Reflux from 'reflux';

import SamaDiagram from './SamaDiagram';

class Sama extends Reflux.Component {
    constructor(props) {
        super(props);

        this.valuePoints = [];
    }

    componentDidMount() {
        //const result=this.props.init(this.mount);
        //this.valuePoints=result.valuePoints;
        //this.findParams();
    }



    render() {
        const {isRunning,signalParas,plantInfo} = this.props;
        //console.log(signalParas);

        if(!isRunning||signalParas==undefined){
            return(
                <div className="no-widgets-tips">当前没有正在运行的算法</div>
            );
        }

        return (
            <>


            <SamaDiagram plantInfo={plantInfo} signalParaList={this.props.signalParas} paraNames={this.props.paraNames} init={this.props.init} setAction={this.props.setAction} />

            </>
        );
    }

}

export default Sama;