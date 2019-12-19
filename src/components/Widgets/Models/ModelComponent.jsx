import React from 'react';
import Reflux from 'reflux';

import { message, Button } from 'antd';

//ThreeJS
import * as THREE from 'three';

import './ModelComponent.less';

class ModelComponent extends Reflux.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.isCompnentMounted=true;
        this.init();
        this.findParams();
        this.props.loadModel(this.scene);
        this.animate();
    }

    componentWillUnmount() {
        console.log("unmount");
        this.isCompnentMounted=false;
    }

    findParams=()=>{

        const {signalParaList,paraNames}=this.props;

        console.log(signalParaList);
        var params=[];
        paraNames.forEach((paraName)=>{
            var param={};
            if(param.pos==undefined){
                signalParaList.signals.forEach((sig)=>{
                    if(sig.name==paraName){
                        param.sig=sig;
                        param.type=1;
                        param.pos='1_'+sig.position+'_0_0';
                    }
                });
            }

            if(param.pos==undefined){
                signalParaList.paras.forEach((sig)=>{
                    if(sig.name==paraName){
                        param.name=sig;
                        param.type=2;
                        param.pos='2_'+sig.position+'_0_0';
                    }
                });
            }

            if(param.pos){
                params.push(param);
            }

        });

        this.props.onParamsConfig({
            key: this.props.keyValue,
            params: {params:params}
        });
        console.log(params);
    }

    /*
    componentWillReceiveProps(nextProps) {
        if(nextProps.modelPath != this.props.modelPath){
            this.scene.remove( this.object );
            this.loadModel(this.scene, nextProps.modelPath);
        }
    }*/

    init = () => {
        const {clientWidth, clientHeight} = this.mount;

        // scene
        this.scene = new THREE.Scene();

        // camera
        this.camera = new THREE.PerspectiveCamera( 90, clientWidth / clientHeight, 1, 2000 );
        this.camera.position.z = 50;
        this.scene.add( this.camera );

        // light
        const ambientLight = new THREE.AmbientLight( 0xcccccc, 0.4 );
        this.scene.add( ambientLight );
        const pointLight = new THREE.PointLight( 0xffffff, 0.8 );
        this.camera.add( pointLight );

        // controls 支持鼠标拖拽模型及滑轮缩放
        this.controls = new THREE.OrbitControls( this.camera, this.mount );
        this.controls.minDistance = 100;
        this.controls.maxDistance = 1000

        // renderer
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setClearColor( 0x08979c );
        this.renderer.setPixelRatio( window.devicePixelRatio );
        this.renderer.setSize( clientWidth, clientHeight );

        this.info = document.createElement("div");
        //this.info.innerHTML="Hello";
        this.info.style='position:absolute;top: 50px; width: 100%;font-family: Monospace;font-size:14px;color:#ffffff';
        this.mount.appendChild(this.info);
        this.mount.appendChild( this.renderer.domElement );


        window.addEventListener( 'resize', this.onWindowResize, false );
    }



    animate = () =>{

        const {params,dataPool,monitor,paraNames}=this.props;

        if(this.isCompnentMounted==false){
            return;
        }

        requestAnimationFrame(this.animate);

        if(monitor){
            //console.log(dataPool);
            const data=dataPool.getAnimationData(params);
            //console.log(data);
            //this.info.innerHTML=""+data.data[0];

            /*
            if(data.data.length==4){
                this.setAnglePosition(data.data[1],data.data[0]);
            }*/

            //console.log(params);

            if(data.data.length==paraNames.length){
                this.props.updateValues(data,this.info);
            }


        }

        //

        this.controls.update();
        this.renderer.render(this.scene, this.camera);
    }



    onWindowResize = () => {
        const {clientWidth, clientHeight} = this.mount;
        this.camera.aspect = clientWidth / clientHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize( clientWidth, clientHeight );
    }

    render(){
        const {plantInfo,signalParaList,dataPool,params}=this.props;
        //console.log(params);
        return (

            <div
                className="three-js-container"
                ref={(mount) => { this.mount = mount }}
            >
            </div>

        )
    }
}

export default  ModelComponent;