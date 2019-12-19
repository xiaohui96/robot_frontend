import React from 'react';
import ReactDom from 'react-dom';
import Reflux from 'reflux';

import Sama from './Sama';

import joint from 'jointjs';

class DrumSama extends Reflux.Component {
    constructor(props) {
        super(props);
    }


    paraNames = [
        'Gain4',
        'Sum2'
    ];

    init = (mount) => {
        const {clientWidth, clientHeight} = mount;
        //console.log(clientWidth,clientHeight);
        var graph = new joint.dia.Graph();


        var paper = new joint.dia.Paper({
            el: ReactDom.findDOMNode(mount),
            model: graph,
            width: clientWidth,
            height: clientHeight,
            gridSize: 1
        });

        var rect3 = new joint.shapes.standard.Rectangle();
        rect3.position(20, 480);
        rect3.resize(100, 40);
        rect3.attr({
            body: {
                fill: '#E74C3C',
                rx: 20,
                ry: 20,
                strokeWidth: 0
            },
            label: {
                text: '给水流量W',
                fill: '#ECF0F1',
                fontSize: 11,
                fontVariant: 'small-caps'
            }
        });
        rect3.addTo(graph);

        var rect4 = new joint.shapes.standard.Rectangle();
        rect4.position(50, 400);
        rect4.resize(40, 40);
        rect4.attr({
            body: {
                fill: '#2a1433',
                strokeWidth: 0
            },
            label: {
                text: 'X',
                fill: 'white',
                fontSize: 23
            }
        });
        rect4.addTo(graph);

        var rect5 = new joint.shapes.standard.Rectangle();
        rect5.position(50, 200);
        rect5.resize(40, 100);
        rect5.attr({
            body: {
                fill: '#2a1433',
                strokeWidth: 0
            },
            label: {
                text: '省煤器',
                fill: 'white',
                fontSize: 13
            }
        });
        rect5.addTo(graph);

        var rect6 = new joint.shapes.standard.Circle();
        rect6.position(20, 100);
        rect6.resize(100, 40);
        rect6.attr({
            body: {
                fill: '#2a1433',
                strokeWidth: 50
            },
            label: {
                text: '汽包',
                fill: 'white',
                fontSize: 13
            }
        });
        rect6.addTo(graph);

        var rect7 = new joint.shapes.standard.Rectangle();
        rect7.position(150, 75);
        rect7.resize(40, 40);
        rect7.attr({
            body: {
                fill: '#2a1433',
                strokeWidth: 0
            },
            label: {
                text: ' ',
                fill: 'white',
                fontSize: 13
            }
        });
        rect7.addTo(graph);

        var rect8 = new joint.shapes.standard.Rectangle();
        rect8.position(150, 20);
        rect8.resize(100, 40);
        rect8.attr({
            body: {
                fill: '#2a1433',
                strokeWidth: 0
            },
            label: {
                text: '过热器',
                fill: 'white',
                fontSize: 13
            }
        });
        rect8.addTo(graph);

        var rect9 = new joint.shapes.standard.Rectangle();
        rect9.position(200, 200);
        rect9.resize(100, 40);
        rect9.attr({
            body: {
                fill: '#2a1433',
                strokeWidth: 0
            },
            label: {
                text: '△p',
                fill: 'white',
                fontSize: 13
            }
        });
        rect9.addTo(graph);

        var rect10 = new joint.shapes.standard.Rectangle();
        rect10.position(350, 20);
        rect10.resize(100, 40);
        rect10.attr({
            body: {
                fill: '#E74C3C',
                rx: 20,
                ry: 20,
                strokeWidth: 0
            },
            label: {
                text: '蒸汽流量D',
                fill: '#ECF0F1',
                fontSize: 11,
                fontVariant: 'small-caps'
            }
        });
        rect10.addTo(graph);

        var rect11 = new joint.shapes.standard.Rectangle();
        rect11.position(350, 80);
        rect11.resize(100, 40);
        rect11.attr({
            body: {
                fill: '#2a1433',
                strokeWidth: 0
            },
            label: {
                text: '△p',
                fill: 'white',
                fontSize: 13
            }
        });
        rect11.addTo(graph);

        var rect12 = new joint.shapes.standard.Rectangle();
        rect12.position(350, 140);
        rect12.resize(100, 40);
        rect12.attr({
            body: {
                fill: '#2a1433',
                strokeWidth: 0
            },
            label: {
                text: '',
                fill: 'white',
                fontSize: 13
            }
        });
        rect12.addTo(graph);

        var rect13 = new joint.shapes.standard.Rectangle();
        rect13.position(350, 200);
        rect13.resize(100, 40);
        rect13.attr({
            body: {
                fill: '#2a1433',
                strokeWidth: 0
            },
            label: {
                text: 'αD',
                fill: 'white',
                fontSize: 13
            }
        });
        rect13.addTo(graph);

        var rect14 = new joint.shapes.standard.Rectangle();
        rect14.position(200, 260);
        rect14.resize(100, 40);
        rect14.attr({
            body: {
                fill: '#2a1433',
                strokeWidth: 0
            },
            label: {
                text: 'PID1',
                fill: 'white',
                fontSize: 13
            }
        });
        rect14.addTo(graph);

        var rect15 = new joint.shapes.standard.Rectangle();
        rect15.position(200, 330);
        rect15.resize(100, 40);
        rect15.attr({
            body: {
                fill: '#2a1433',
                strokeWidth: 0
            },
            label: {
                text: 'PID2',
                fill: 'white',
                fontSize: 13
            }
        });
        rect15.addTo(graph);

        var rect16 = new joint.shapes.standard.Rectangle();
        rect16.position(400, 330);
        rect16.resize(100, 40);
        rect16.attr({
            body: {
                fill: '#2a1433',
                strokeWidth: 0
            },
            label: {
                text: 'αw',
                fill: 'white',
                fontSize: 13
            }
        });
        rect16.addTo(graph);

        var rect17 = new joint.shapes.standard.Rectangle();
        rect17.position(200, 400);
        rect17.resize(100, 40);
        rect17.attr({
            body: {
                fill: '#2a1433',
                strokeWidth: 0
            },
            label: {
                text: 'Kz',
                fill: 'white',
                fontSize: 13
            }
        });
        rect17.addTo(graph);

        var rect18 = new joint.shapes.standard.Rectangle();
        rect18.position(220, 480);
        rect18.resize(100, 40);
        rect18.attr({
            body: {
                fill: '#2a1433',
                strokeWidth: 0
            },
            label: {
                text: '△p',
                fill: 'white',
                fontSize: 13
            }
        });
        rect18.addTo(graph);

        var rect19 = new joint.shapes.standard.Rectangle();
        rect19.position(400, 480);
        rect19.resize(100, 40);
        rect19.attr({
            body: {
                fill: '#2a1433',
                strokeWidth: 0
            },
            label: {
                text: ' ',
                fill: 'white',
                fontSize: 13
            }
        });
        rect19.addTo(graph);

        var rect20 = new joint.shapes.standard.Rectangle();
        rect20.position(250, 95);
        rect20.resize(1, 1);
        rect20.attr({
            body: {
                fill: '#2a1433',
                strokeWidth: 0
            },
            label: {
                text: '',
                fill: 'white',
                fontSize: 13
            }
        });
        rect20.addTo(graph);

        var rect21 = new joint.shapes.standard.Rectangle();
        rect21.position(70, 40);
        rect21.resize(1, 1);
        rect21.attr({
            body: {
                fill: '#2a1433',
                strokeWidth: 0
            },
            label: {
                text: '',
                fill: 'white',
                fontSize: 13
            }
        });
        rect21.addTo(graph);

        var rect22 = new joint.shapes.standard.Rectangle();
        rect22.position(400, 310);
        rect22.resize(1, 1);
        rect22.attr({
            body: {
                fill: '#2a1433',
                strokeWidth: 0
            },
            label: {
                text: '',
                fill: 'white',
                fontSize: 13
            }
        });
        rect22.addTo(graph);

        var rect23 = new joint.shapes.standard.Rectangle();
        rect23.position(275, 310);
        rect23.resize(1, 1);
        rect23.attr({
            body: {
                fill: '#2a1433',
                strokeWidth: 0
            },
            label: {
                text: '',
                fill: 'white',
                fontSize: 13
            }
        });
        rect23.addTo(graph);

        var rect24 = new joint.shapes.standard.Rectangle();
        rect24.position(150, 115);
        rect24.resize(40, 40);
        rect24.attr({
            body: {
                fill: '#2a1433',
                strokeWidth: 0
            },
            label: {
                text: ' ',
                fill: 'white',
                fontSize: 13
            }
        });
        rect24.addTo(graph);

        var link2 = new joint.shapes.standard.Link();
        link2.source(rect3);
        link2.target(rect4);
        link2.addTo(graph);

        var link3 = new joint.shapes.standard.Link();
        link3.source(rect4);
        link3.target(rect5);
        link3.addTo(graph);

        var link4 = new joint.shapes.standard.Link();
        link4.source(rect17);
        link4.target(rect4);
        link4.addTo(graph);

        var link5 = new joint.shapes.standard.Link();
        link5.source(rect5);
        link5.target(rect6);
        link5.addTo(graph);

        var link6 = new joint.shapes.standard.Link();
        link6.source(rect6);
        link6.target(rect21);
        link6.addTo(graph);

        var link7 = new joint.shapes.standard.Link();
        link7.source(rect8);
        link7.target(rect10);
        link7.addTo(graph);

        var link8 = new joint.shapes.standard.Link();
        link8.source(rect10);
        link8.target(rect11);
        link8.addTo(graph);

        var link9 = new joint.shapes.standard.Link();
        link9.source(rect11);
        link9.target(rect12);
        link9.addTo(graph);

        var link10 = new joint.shapes.standard.Link();
        link10.source(rect12);
        link10.target(rect13);
        link10.addTo(graph);

        var link11 = new joint.shapes.standard.Link();
        link11.source(rect6);
        link11.target(rect7);
        link11.addTo(graph);

        var link12 = new joint.shapes.standard.Link();
        link12.source(rect7);
        link12.target(rect20);
        link12.addTo(graph);

        var link13 = new joint.shapes.standard.Link();
        link13.source(rect9);
        link13.target(rect14);
        link13.addTo(graph);

        var link14 = new joint.shapes.standard.Link();
        link14.source(rect14);
        link14.target(rect15);
        link14.addTo(graph);

        var link15 = new joint.shapes.standard.Link();
        link15.source(rect13);
        link15.target(rect22);
        link15.addTo(graph);

        var link16 = new joint.shapes.standard.Link();
        link16.source(rect16);
        link16.target(rect15);
        link16.addTo(graph);

        var link17 = new joint.shapes.standard.Link();
        link17.source(rect19);
        link17.target(rect16);
        link17.addTo(graph);

        var link18 = new joint.shapes.standard.Link();
        link18.source(rect18);
        link18.target(rect19);
        link18.addTo(graph);

        var link19 = new joint.shapes.standard.Link();
        link19.source(rect3);
        link19.target(rect18);
        link19.addTo(graph);

        var link20 = new joint.shapes.standard.Link();
        link20.source(rect15);
        link20.target(rect17);
        link20.addTo(graph);

        var link21 = new joint.shapes.standard.Link();
        link21.source(rect20);
        link21.target(rect9);
        link21.addTo(graph);

        var link22 = new joint.shapes.standard.Link();
        link22.source(rect21);
        link22.target(rect8);
        link22.addTo(graph);

        var link23 = new joint.shapes.standard.Link();
        link23.source(rect22);
        link23.target(rect23);
        link23.addTo(graph);

        var link24 = new joint.shapes.standard.Link();
        link24.source(rect23);
        link24.target(rect15);
        link24.addTo(graph);

        var link25 = new joint.shapes.standard.Link();
        link25.source(rect6);
        link25.target(rect24);
        link25.addTo(graph);

        const valuePoints = [link2, link3];

        const blocks=[
            {
                block:rect3,
                paras:[
                    {
                        path:"Step/Before",
                        disp:"Before"
                    },
                    {
                        path:"Step/After",
                        disp:"After"
                    }
                ]
            }
        ];

        return {
            valuePoints:valuePoints,
            blocks:blocks,
            paper:paper
        };
    }

    /*
    init = (mount) => {
        const {clientWidth, clientHeight} = mount;
        //console.log(clientWidth,clientHeight);
        var graph = new joint.dia.Graph();


        var paper = new joint.dia.Paper({
            el: ReactDom.findDOMNode(mount),
            model: graph,
            width: clientWidth,
            height: clientHeight,
            gridSize: 1
        });

        var rect3 = new joint.shapes.standard.Rectangle();
        rect3.position(100, 130);
        rect3.resize(100, 40);
        rect3.attr({
            body: {
                fill: '#E74C3C',
                rx: 20,
                ry: 20,
                strokeWidth: 0
            },
            label: {
                text: 'Hello',
                fill: '#ECF0F1',
                fontSize: 11,
                fontVariant: 'small-caps'
            }
        });
        rect3.addTo(graph);

        var rect4 = new joint.shapes.standard.Rectangle();
        rect4.position(400, 130);
        rect4.resize(100, 40);
        rect4.attr({
            body: {
                fill: '#8E44AD',
                strokeWidth: 0
            },
            label: {
                text: 'World!',
                fill: 'white',
                fontSize: 13
            }
        });
        rect4.addTo(graph);

        var rect5 = new joint.shapes.standard.Rectangle();
        rect5.position(600, 130);
        rect5.resize(100, 40);
        rect5.attr({
            body: {
                fill: '#8E44AD',
                strokeWidth: 0
            },
            label: {
                text: 'World!',
                fill: 'white',
                fontSize: 13
            }
        });
        rect5.addTo(graph);

        var link2 = new joint.shapes.standard.Link();
        link2.source(rect3);
        link2.target(rect4);
        link2.addTo(graph);

        var link3 = new joint.shapes.standard.Link();
        link3.source(rect4);
        link3.target(rect5);
        link3.addTo(graph);

        const valuePoints = [link2, link3];

        const blocks=[
            {
                block:rect3,
                paras:[
                    {
                        path:"Step/Before",
                        disp:"Before"
                    },
                    {
                        path:"Step/After",
                        disp:"After"
                    }
                ]
            }
        ];

        return {
            valuePoints:valuePoints,
            blocks:blocks,
            paper:paper
        };
    }*/

    setAction=(values)=>{
        //console.log(values);
    }

    render(){
        const {isRunning,isFullControl,signalParas,plantInfo}=this.props;
        return (<Sama plantInfo={plantInfo} paraNames={this.paraNames} isRunning={isRunning} isFullControl={isFullControl} signalParas={signalParas} init={this.init} setAction={this.setAction}/>);
    }
}

export default DrumSama;