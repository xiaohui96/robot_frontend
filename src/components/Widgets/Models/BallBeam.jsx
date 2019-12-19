import React from 'react';
import Reflux from 'reflux';

import ModelComponent from './ModelComponent';

class BallBeam extends Reflux.Component {

    constructor(props) {
        super(props);
    }

    paraNames=[
        'Ball_Position',
        'Angle',
        'Set_Point'
    ];

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
                this.cursor=this.BallCursor();
                this.base.add(this.cursor);
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

    setAnglePosition=(angle,pos,info)=>{
        info.innerHTML="Angle: "+Math.floor(angle*100)/100+"<br>";
        info.innerHTML+="Pos: "+Math.floor(pos*100)/100+"<br>";

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

    updateValues=(data,info)=>{

        this.setAnglePosition(data.data[1],data.data[0],info);
        this.cursor.setPos(data.data[2]);
        //console.log(data);
    }

    BallCursor=()=>{
        var geometry = new THREE.CylinderGeometry( 0, 4, 8);
        var material = new THREE.MeshBasicMaterial( {color: 0xffff00} );
        var cursor = new THREE.Mesh( geometry, material );
        var OFFSETX=-60;
        var isMoving=false;
        cursor.position.x=OFFSETX;
        cursor.position.y=45;
        cursor.position.z=0;

        cursor.setPosX=function(x){
            if(x<OFFSETX){
                x=OFFSETX;
            }
            if(x>OFFSETX+120){
                x=OFFSETX+120;
            }
            this.position.x=x;

            isMoving=true;
        };

        cursor.stopMoving=function(){
            isMoving=false;
        };

        cursor.setBallSetURL=function(url){
            this.ballSetURL=url;
        };

        cursor.setBallGetURL=function(url){
            this.ballGetURL=url;
        };

        cursor.setPos=function(v){
            cursor.position.x=OFFSETX+v;
        };

        cursor.updateParameter=function(){
            var ballSetURL=this.ballSetURL+(this.position.x-OFFSETX);
            console.log(ballSetURL);

            var callBack={
                success: function(o){
                },
                failure: function(o){
                }
            };
            var request=YAHOO.util.Connect.asyncRequest('POST',ballSetURL,callBack);
        };

        cursor.startAction=function(){
            console.log(this.ballSetURL);
            console.log(this.ballGetURL);

            var ballGetURL=this.ballGetURL;

            function getNewPos(){

                var callBack={
                    success: function(o){
                        //console.log(o.responseText);

                        var valueString=o.responseText;
                        if(valueString!=null&&valueString.length>2&&valueString.charAt(0)=='['){
                            valueString=valueString.substring(1,valueString.length-1);
                            var v=parseFloat(valueString);
                            //console.log(v);
                            if(isMoving==false){
                                cursor.setPos(v);
                            }
                        }
                        setTimeout(requestData,1000);
                    },
                    failure: function(o){
                    }
                };

                var requestData=function(){
                    var request=YAHOO.util.Connect.asyncRequest('POST',ballGetURL,callBack);
                }

                requestData();
            }

            getNewPos();
        };

        return cursor;
    };

    render(){
        const {plantInfo,signalParaList,dataPool,keyValue,params,monitor}=this.props;
        //console.log(params);
        return (
            <ModelComponent
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

export default BallBeam;