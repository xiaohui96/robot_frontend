import npm React from 'react';
import Reflux from 'reflux';

import { message, Button } from 'antd';

//ThreeJSh
import * as THREE from 'tree';

import './ModelComponent.less';

class BallBeamSystem extends Reflux.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.isCompnentMounted=true;
        this.init();
        this.findParams();
        this.loadModel(this.scene);
        this.animate();
    }

    componentWillUnmount() {
        console.log("unmount");
        this.isCompnentMounted=false;
    }

        findParams=(paraNames)=>{

        const {signalParaList}=this.props;

        console.log(signalParaList);
        var params=[];
        paraNames.forEach((paraName)=>{
            var param={};
            signalParaList.signals.forEach((sig)=>{
                if(sig.name==paraName){
                    param.sig=sig;
                    param.type=1;
                    param.pos='1_'+sig.position+'_0_0';
                }
            });
            signalParaList.paras.forEach((sig)=>{
                if(sig.name==paraName){
                    param.name=sig;
                    param.type=2;
                    param.pos='2_'+sig.position+'_0_0';
                }
            });
            params.push(param);
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

    loadBase=(scene)=>{
        const modelPath='BallBeamSystem';
        const baseLoader = new THREE.MTLLoader();
        baseLoader.setPath( `/3DModels/${modelPath}/` );
        baseLoader.load( `Base.mtl`, ( materials ) => {
            materials.preload();
            const objLoader = new THREE.OBJLoader();
            objLoader.setMaterials( materials );

            objLoader.setPath( `/3DModels/${modelPath}/` );
            objLoader.load( `Base.obj`,  ( object ) => {
                scene.add( object );

                //使得模型位于屏幕正中间
                const box3 = new THREE.Box3().setFromObject( object );
                const target = new THREE.Vector3();
                box3.getSize(target);
                object.position.y = -target.y/3;

                this.base = object;
                this.loadBeam(scene);
                this.loadLeverArm(scene);
                this.loadAxis01(scene);
                this.loadBall(scene);
            }, ( xhr ) => {
                if ( xhr.lengthComputable ) {
                    var percentComplete = xhr.loaded / xhr.total * 100;
                    console.log( Math.round(percentComplete, 2) + '% downloaded' );
                }
            }, ( xhr ) => {
                message.warning("模型资源加载失败");
            });
        });
    }

    loadBeam=(scene)=>{
        const modelPath='BallBeamSystem';
        const beamLoader = new THREE.MTLLoader();
        beamLoader.setPath( `/3DModels/${modelPath}/` );
        beamLoader.load( `Beam.mtl`, ( materials ) => {
            materials.preload();
            const objLoader = new THREE.OBJLoader();
            objLoader.setMaterials( materials );

            objLoader.setPath( `/3DModels/${modelPath}/` );
            objLoader.load( `Beam.obj`,  ( object ) => {
                /*
                this.base.add( object );

                //使得模型位于屏幕正中间
                const box3 = new THREE.Box3().setFromObject( object );
                const target = new THREE.Vector3();
                box3.getSize(target);
                //object.position.y = -target.y/3;

                this.beam = object;*/

                object.position.x=64.497;
                object.position.y=-43.811;
                this.beam=new THREE.Object3D();
                this.beam.add(object);
                this.beam.position.x=-64.497;
                this.beam.position.y=43.811;
                this.base.add( this.beam );
                //this.beam=beam;
            }, ( xhr ) => {
                if ( xhr.lengthComputable ) {
                    var percentComplete = xhr.loaded / xhr.total * 100;
                    console.log( Math.round(percentComplete, 2) + '% downloaded' );
                }
            }, ( xhr ) => {
                message.warning("模型资源加载失败");
            });
        });
    }

    loadLeverArm=(scene)=>{
        const modelPath='BallBeamSystem';
        const leverArmLoader = new THREE.MTLLoader();
        leverArmLoader.setPath( `/3DModels/${modelPath}/` );
        leverArmLoader.load( `LeverArm.mtl`, ( materials ) => {
            materials.preload();
            const objLoader = new THREE.OBJLoader();
            objLoader.setMaterials( materials );

            objLoader.setPath( `/3DModels/${modelPath}/` );
            objLoader.load( `LeverArm.obj`,  ( object ) => {
                //this.base.add( object );
                //this.leverArm = object;

                this.leverArm=new THREE.Object3D();
                this.leverArm.add(object);
                this.leverArm.arm=object;
                this.base.add( this.leverArm );
            }, ( xhr ) => {
                if ( xhr.lengthComputable ) {
                    var percentComplete = xhr.loaded / xhr.total * 100;
                    console.log( Math.round(percentComplete, 2) + '% downloaded' );
                }
            }, ( xhr ) => {
                message.warning("模型资源加载失败");
            });
        });
    }

    loadAxis01=(scene)=>{
        const modelPath='BallBeamSystem';
        const Axis01Loader = new THREE.MTLLoader();
        Axis01Loader.setPath( `/3DModels/${modelPath}/` );
        Axis01Loader.load( `Axis01.mtl`, ( materials ) => {
            materials.preload();
            const objLoader = new THREE.OBJLoader();
            objLoader.setMaterials( materials );

            objLoader.setPath( `/3DModels/${modelPath}/` );
            objLoader.load( `Axis01.obj`,  ( object ) => {
                object.position.x=-54.166;
                object.position.y=7.031;
                this.axis01=new THREE.Object3D();
                this.axis01.add(object);
                this.axis01.position.x=54.166;
                this.axis01.position.y=-7.031;
                //this.base.add( this.axis01 );
                this.base.add( this.axis01 );
            }, ( xhr ) => {
                if ( xhr.lengthComputable ) {
                    var percentComplete = xhr.loaded / xhr.total * 100;
                    console.log( Math.round(percentComplete, 2) + '% downloaded' );
                }
            }, ( xhr ) => {
                message.warning("模型资源加载失败");
            });
        });
    }

    loadBall=(scene)=>{
        const modelPath='BallBeamSystem';
        const ballLoader = new THREE.MTLLoader();
        ballLoader.setPath( `/3DModels/${modelPath}/` );
        ballLoader.load( `Ball.mtl`, ( materials ) => {
            materials.preload();
            const objLoader = new THREE.OBJLoader();
            objLoader.setMaterials( materials );

            objLoader.setPath( `/3DModels/${modelPath}/` );
            objLoader.load( `Ball.obj`,  ( object ) => {
                this.base.add( object );

                this.ball = object;
                this.ball.scale.x=1;
                this.ball.scale.y=1;
                this.ball.scale.z=1;
                this.ball.position.y=2;
            }, ( xhr ) => {
                if ( xhr.lengthComputable ) {
                    var percentComplete = xhr.loaded / xhr.total * 100;
                    console.log( Math.round(percentComplete, 2) + '% downloaded' );
                }
            }, ( xhr ) => {
                message.warning("模型资源加载失败");
            });
        });
    }

    loadModel = (scene)=>{
        this.loadBase(scene);
    }

    animate = () =>{
        const {params,dataPool,monitor}=this.props;

        if(this.isCompnentMounted==false){
            return;
        }

        requestAnimationFrame(this.animate);

        if(monitor){
            //console.log(dataPool);
            const data=dataPool.getAnimationData(params);
            //console.log(data);
            //this.info.innerHTML=""+data.data[0];
            if(data.data.length==4){
                this.setAnglePosition(data.data[1],data.data[0]);
            }

        }

        //

        this.controls.update();
        this.renderer.render(this.scene, this.camera);
    }

    setAnglePosition=(angle,pos)=>{
        this.info.innerHTML="Angle: "+Math.floor(angle*100)/100+"<br>";
        this.info.innerHTML+="Pos: "+Math.floor(pos*100)/100+"<br>";

        var l1=132.456;
        var l2=50.842;
        var S=118.663;
        var H=77.927;
        var h=27.085;
        var r=13.793;

        var a,b,c,d,apos;
        a=Math.atan((S+r*Math.cos(angle/180*3.1415926))/(H-h-r*Math.sin(angle/180*3.1415926)));

        d=(S+r*Math.cos(angle/180*3.1415926))/Math.sin(a);

        b=Math.acos((l1*l1+d*d-l2*l2)/(2*l1*d));
        c=Math.acos((l2*l2+d*d-l1*l1)/(2*l2*d));

        if(this.axis01&&this.beam&&this.leverArm&&this.ball){
            this.axis01.rotation.z=angle/180*3.1415926;

            this.beam.rotation.z=-(-(a+b)*180/3.1415926+90)/180*3.1415926;


            var leverArmX=-(r-r*Math.cos(angle/180*3.1415926));
            var leverArmY=r*Math.sin(angle/180*3.1415926);
            this.leverArm.position.x=(54.166+r)+leverArmX;
            this.leverArm.position.y=-7.031+leverArmY;
            this.leverArm.arm.position.x=-(54.166+r);
            this.leverArm.arm.position.y=7.031;
            this.leverArm.rotation.z=-(c-a);

            if (pos>0)
                apos=pos;
            if (pos<0)
                apos=0.000001;
            this.ball.position.x=apos*Math.cos((-(a+b)*180/3.1415926+90)/180*3.1415926);
            this.ball.position.y=-apos*Math.sin((-(a+b)*180/3.1415926+90)/180*3.1415926)+2;
        }

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

export default  BallBeamSystem;