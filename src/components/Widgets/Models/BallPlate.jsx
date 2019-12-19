import React from 'react';
import Reflux from 'reflux';

import Model from './Model';

class BallPlate extends Reflux.Component {

    constructor(props) {
        super(props);
    }

    paraNames=[
        'Angle01',
        'Angle02',
        'BallPosX_',
        'BallPosY'

    ];

    loadBase=(scene)=>{
        const modelPath='BallPlateSystem';
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
                this.loadBall(scene);
                this.loadAxis01(scene);
                this.loadAxis02(scene);
                this.loadPlate(scene);
                this.loadPole01(scene);
                this.loadPole02(scene);

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
        const modelPath='BallPlateSystem';
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
                    console.log(99);
                }
            }, ( xhr ) => {
                message.warning("模型资源加载失败");
            });
        });
    }
    loadAxis01=(scene)=>{
        const modelPath='BallPlateSystem';
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
    loadAxis02=(scene)=>{
        const modelPath='BallPlateSystem';
        const Axis01Loader = new THREE.MTLLoader();
        Axis01Loader.setPath( `/3DModels/${modelPath}/` );
        Axis01Loader.load( `Axis02.mtl`, ( materials ) => {
            materials.preload();
            const objLoader = new THREE.OBJLoader();
            objLoader.setMaterials( materials );

            objLoader.setPath( `/3DModels/${modelPath}/` );
            objLoader.load( `Axis02.obj`,  ( object ) => {
                object.position.x=-54.166;
                object.position.y=7.031;
                this.axis02=new THREE.Object3D();
                this.axis02.add(object);
                this.axis02.position.x=54.166;
                this.axis02.position.y=-7.031;
                //this.base.add( this.axis01 );
                this.base.add( this.axis02 );
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
    loadPlate=(scene)=>{
        const modelPath='BallPlateSystem';
        const beamLoader = new THREE.MTLLoader();
        beamLoader.setPath( `/3DModels/${modelPath}/` );
        beamLoader.load( `Plate.mtl`, ( materials ) => {
            materials.preload();
            const objLoader = new THREE.OBJLoader();
            objLoader.setMaterials( materials );

            objLoader.setPath( `/3DModels/${modelPath}/` );
            objLoader.load( `Plate.obj`,  ( object ) => {
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
                this.plate=new THREE.Object3D();
                this.plate.add(object);
                this.plate.position.x=-64.497;
                this.plate.position.y=43.811;
                this.base.add( this.plate );
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

    loadPole01=(scene)=>{
        const modelPath='BallPlateSystem';
        const leverArmLoader = new THREE.MTLLoader();
        leverArmLoader.setPath( `/3DModels/${modelPath}/` );
        leverArmLoader.load( `Pole01.mtl`, ( materials ) => {
            materials.preload();
            const objLoader = new THREE.OBJLoader();
            objLoader.setMaterials( materials );

            objLoader.setPath( `/3DModels/${modelPath}/` );
            objLoader.load( `Pole01.obj`,  ( object ) => {
                //this.base.add( object );
                //this.leverArm = object;

                this.pole01=new THREE.Object3D();
                this.pole01.add(object);
                //this.pole01.arm=object;
                this.base.add( this.pole01 );
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
    loadPole02=(scene)=>{
        const modelPath='BallPlateSystem';
        const leverArmLoader = new THREE.MTLLoader();
        leverArmLoader.setPath( `/3DModels/${modelPath}/` );
        leverArmLoader.load( `Pole02.mtl`, ( materials ) => {
            materials.preload();
            const objLoader = new THREE.OBJLoader();
            objLoader.setMaterials( materials );

            objLoader.setPath( `/3DModels/${modelPath}/` );
            objLoader.load( `Pole02.obj`,  ( object ) => {
                //this.base.add( object );
                //this.leverArm = object;

                this.pole02=new THREE.Object3D();
                this.pole02.add(object);
                //this.Pole02.arm=object;
                this.base.add( this.pole02 );
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

    setAnglePosition=(angle01,angle02,xpos,ypos,info)=> {
        info.innerHTML = "Angle01: " + Math.floor(angle01 * 100) / 100 + "<br>";
        info.innerHTML += "Angle02: " + Math.floor(angle02 * 100) / 100 + "<br>";
        info.innerHTML += "XPos: " + Math.floor(xpos * 100) / 100 + "<br>";
        info.innerHTML += "YPos: " + Math.floor(ypos * 100) / 100 + "<br>";

        var l1 = 26.5165;
        var l2 = 29.848;
        var S = 21.5795;
        var H = 42.561;
        var h = 12.713;
        var r = 4.937;

        var a, b, c, d, apos;

        a = Math.atan((S + r * Math.cos(angle01 / 180 * 3.1415926)) / (H - h - r * Math.sin(angle01 / 180 * 3.1415926)));
        d = (S + r * Math.cos(angle01 / 180 * 3.1415926)) / Math.sin(a);
        b = Math.acos((l1 * l1 + d * d - l2 * l2) / (2 * l1 * d));
        c = Math.acos((l2 * l2 + d * d - l1 * l1) / (2 * l2 * d));

        if(this.axis01&&this.axis02&&this.pole01&&this.pole02&&this.plate) {
        this.axis01.x = -(r - r * Math.cos(angle01 / 180 * 3.1415926)) * 1.414;
        this.axis01.y = -r * Math.sin(angle01 / 180 * 3.1415926);
        this.axis01.z = -(r - r * Math.cos(angle01 / 180 * 3.1415926)) * 1.414;
        //this.axis01=(-(r-r*Math.cos(angle01/180*3.1415926))*1.414,-r*Math.sin(angle01/180*3.1415926),-(r-r*Math.cos(angle01/180*3.1415926))*1.414);

        this.axis02.x = (r - r * Math.cos(-angle02 / 180 * 3.1415926)) * 1.414;
        this.axis02.y = -r * Math.sin(-angle02 / 180 * 3.1415926);
        this.axis02.z = -(r - r * Math.cos(-angle02 / 180 * 3.1415926)) * 1.414;
        //this.axis02=((r-r*Math.cos(-angle02/180*3.1415926))*1.414,-r*Math.sin(-angle02/180*3.1415926),-(r-r*Math.cos(-angle02/180*3.1415926))*1.414);

        this.pole01.x = -(r - r * Math.cos(angle01 / 180 * 3.1415926)) * 1.414;
        this.pole01.y = -r * Math.sin(angle01 / 180 * 3.1415926);
        this.pole01.z = -(r - r * Math.cos(angle01 / 180 * 3.1415926)) * 1.414;
        //this.pole01=(-(r-r*Math.cos(angle01/180*3.1415926))*1.414,-r*Math.sin(angle01/180*3.1415926),-(r-r*Math.cos(angle01/180*3.1415926))*1.414);
        //this.pole01.rotation.x=0;
        //pole01.transform.prependRotation(-(c-a)*180/3.1415926,new Vector3D(-1,0,1),new Vector3D(l1,-14.874,l1));
        this.pole01.rotation.x = (c - a) * 180 / 3.1415926 / 360 * 2 * 3.1415926;
        //this.pole01.rotation.y=0;
        this.pole01.rotation.z = -(c - a) * 180 / 3.1415926 / 360 * 2 * 3.1415926;

        this.pole02.x = (r - r * Math.cos(-angle02 / 180 * 3.1415926)) * 1.414;
        this.pole02.y = -r * Math.sin(-angle02 / 180 * 3.1415926);
        this.pole02.z = -(r - r * Math.cos(-angle02 / 180 * 3.1415926)) * 1.414;
        //this.pole02=((r-r*Math.cos(-angle02/180*3.1415926))*1.414,-r*Math.sin(-angle02/180*3.1415926),-(r-r*Math.cos(-angle02/180*3.1415926))*1.414);
        this.pole02.rotation.x = -(c - a) * 180 / 3.1415926 / 360 * 2 * 3.1415926;
        this.pole02.rotation.z = -(c - a) * 180 / 3.1415926 / 360 * 2 * 3.1415926;

        //this.plate.rotation.x=0;
        this.plate.rotation.x = ((a + b) * 180 / 3.1415926 + 90) / 360 * 2 * 3.1415926;
        //this.plate.rotation.z=0;
        this.plate.rotation.z = (-(a + b) * 180 / 3.1415926 + 90) / 360 * 2 * 3.1415926;

        this.plate.rotation.x = (-(a + b) * 180 / 3.1415926 + 90) / 360 * 2 * 3.1415926;
        this.plate.rotation.z = (-(a + b) * 180 / 3.1415926 + 90) / 360 * 2 * 3.1415926;


        if (xpos > 24.75)
            xpos = 24.75;
        if (xpos < 24.75)
            xpos = -24.75;

        if (ypos > 24.75)
            ypos = 24.75;
        if (ypos < -24.75)
            ypos = -24.75;
        this.ball.position.x = xpos * Math.cos((-(a + b) * 180 / 3.1415926 + 90) / 180 * 3.1415926) / 2;
        this.ball.position.y = xpos * Math.sin((-(a + b) * 180 / 3.1415926 + 90) / 180 * 3.1415926);
        this.ball.position.z = xpos * Math.cos((-(a + b) * 180 / 3.1415926 + 90) / 180 * 3.1415926) / 2;
        //this.ball.position.x=(xpos*Math.cos((-(a+b)*180/3.1415926+90)/180*3.1415926)/2,xpos*Math.sin((-(a+b)*180/3.1415926+90)/180*3.1415926),xpos*Math.cos((-(a+b)*180/3.1415926+90)/180*3.1415926)/2);
        this.ball.position.x = ypos * Math.cos((-(a + b) * 180 / 3.1415926 + 90) / 180 * 3.1415926) / 2;
        this.ball.position.y = ypos * Math.sin((-(a + b) * 180 / 3.1415926 + 90) / 180 * 3.1415926);
        this.ball.position.z = -ypos * Math.cos((-(a + b) * 180 / 3.1415926 + 90) / 180 * 3.1415926) / 2;
        //this.ball.position.y=(ypos*Math.cos((-(a+b)*180/3.1415926+90)/180*3.1415926)/2,ypos*Math.sin((-(a+b)*180/3.1415926+90)/180*3.1415926),-ypos*Math.cos((-(a+b)*180/3.1415926+90)/180*3.1415926)/2);

    }

    }

    updateValues=(data,info)=>{

            console.log(777);
            this.setAnglePosition(data.data[0], data.data[1], data.data[2], data.data[3], info);

    }



    render(){
        const {plantInfo,signalParaList,dataPool,keyValue,params,monitor}=this.props;
        console.log(params);
        return (
            <Model
                params={params}
                monitor={monitor}
                plantInfo={plantInfo}
                signalParaList={signalParaList}
                dataPool={dataPool}
                keyValue={keyValue}
                onParamsConfig={this.props.onParamsConfig}
                paraNames={this.paraNames}
                loadModel={this.loadModel}
                updateValues={this.updateValues}
            />
        );
    }

}

export default BallPlate;