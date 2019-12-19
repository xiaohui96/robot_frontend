import React from 'react';
import Reflux from 'reflux';

import ModelComponent from './ModelComponent';

class DoubleTank extends Reflux.Component {

    constructor(props) {
        super(props);
    };

    paraNames=[
        'Water_Level_1',
        'Water_Level_2',
        'Water_Valve_1',
        'Water_Valve_2',
    ];

    loadDoubleTank=(scene)=>{
        const modelPath='DoubleTank';
        const doubletankLoader = new THREE.MTLLoader();
        doubletankLoader.setPath(`/3DModels/${modelPath}/`);
        doubletankLoader.load( `DoubleTank.mtl`, ( materials ) => {
            materials.preload();
            const objLoader = new THREE.OBJLoader();
            objLoader.setMaterials( materials );

            objLoader.setPath( `/3DModels/${modelPath}/` );
            objLoader.load( `DoubleTank.obj`,  ( object ) => {
                scene.add( object );

                //使得模型位于屏幕正中间
                const box3 = new THREE.Box3().setFromObject( object );
                const target = new THREE.Vector3();
                box3.getSize(target);
                object.position.y = -target.y/3;

                this.doubletank = object;
                //this.watertubesleft=this.BallCursor();
               // this.doubletank.add(this.watertubesleft);
                //this.watertubesright=this.BallCursor();
               // this.doubletank.add(this.watertubesright);
                this.loadValve1(scene);
                this.loadValve2(scene);
            }, ( xhr ) => {
                if ( xhr.lengthComputable ) {
                    var percentComplete = xhr.loaded / xhr.total * 100;
                    console.log( Math.round(percentComplete, 2) + '% downloaded' );
                }
            }, ( xhr ) => {
                message.warning("模型资源加载失败");
            },
                    //console.log( Math.round(percentComplete, 2) + '% downloaded' );
                    //info.innerHTML="Loading ... "+Math.round(percentComplete, 2)+"% complete";

            (water)=>{
                info.innerHTML="Parsing ... "+Math.round(water.current/water.total*100, 2)+"% complete";
                console.log(Math.round(water.current/water.total*100, 2)+"% complete");
                var ob=createWaterTubes();
                var tubes=ob;
                scene.add(tubes.left);
                scene.add(tubes.right);
                //dataStream.startComm();
            });
        });
    };

    loadValve1=(scene)=>{
        const modelPath = 'Valve';
        const valve1loader = new  THREE.MTLLoader();
        valve1loader.setPath( `/3DModels/${modelPath}/` );
        valve1loader.load( `Valve.mtl`, ( materials ) => {
            materials.preload();
            const objLoader = new THREE.OBJLoader();
            objLoader.setMaterials( materials );
            objLoader.setPath( `/3DModels/${modelPath}/` );
            objLoader.load( `Valve.obj`,  ( object ) => {

                object.rotation.z = -Math.PI;
                this.valve1 = new THREE.Object3D();
                this.valve1.add(object);
                this.valve1.position.x = 37.9;
                this.valve1.position.y = -17.5;
                this.valve1.position.z = 2.5;
                this.valve1.valveId = 1;
                this.doubletank.add(this.valve1);
            },( xhr ) => {
                if ( xhr.lengthComputable ) {
                    var percentComplete = xhr.loaded / xhr.total * 100;
                    console.log( Math.round(percentComplete, 2) + '% downloaded' );
                }
            }, ( xhr ) => {
                message.warning("模型资源加载失败");
            });
        });

    };

    loadValve2=(scene)=>{
        const modelPath = 'Valve';
        const valve2loader = new  THREE.MTLLoader();
        valve2loader.setPath( `/3DModels/${modelPath}/` );
        valve2loader.load( `Valve.mtl`, ( materials ) => {
            materials.preload();
            const objLoader = new THREE.OBJLoader();
            objLoader.setMaterials( materials );
            objLoader.setPath( `/3DModels/${modelPath}/` );
            objLoader.load( `Valve.obj`,  ( object ) => {

                object.rotation.z = -Math.PI;
                this.valve2 = new THREE.Object3D();
                this.valve2.add(object);
                this.valve2.position.x = 65.9;
                this.valve2.position.y = -31.2;
                this.valve2.position.z = 2.5;
                this.valve2.valveId = 2;
                this.doubletank.add(this.valve2);
            },( xhr ) => {
                if ( xhr.lengthComputable ) {
                    var percentComplete = xhr.loaded / xhr.total * 100;
                    console.log( Math.round(percentComplete, 2) + '% downloaded' );
                }
            }, ( xhr ) => {
                message.warning("模型资源加载失败");
            });
        });
    };

    createWaterTubes=()=>{
        var geometry = new THREE.CylinderGeometry( 9.5, 9.5, 70);
        var material = new THREE.MeshBasicMaterial( {color: 0x00BFFF} );
        //material.transparent=1;
        var left = new THREE.Mesh( geometry, material );

        left.position.y=40;
        left.position.x=11.0;
        left.position.z=-0.05;

        var right = new THREE.Mesh( geometry, material );
        right.position.y=40;
        right.position.x=65.5;
        right.position.z=-0.05;

        return {left:left,right:right};
    };

    loadModel = (scene)=>{
        this.loadDoubleTank(scene);
    };

    setWaterLevels=(leftLevel,rightLevel,Valve1,Valve2,info)=>{
        info.innerHTML="Left: "+Math.floor(leftLevel*100)/100+"<br>";
        info.innerHTML+="Right: "+Math.floor(rightLevel*100)/100+"<br>";
        info.innerHTML+="Valve1: "+Math.floor(Valve1*100)/100+"<br>";
        info.innerHTML+="Valve2: "+Math.floor(Valve2*100)/100+"<br>";

        this.leftLevel=leftLevel*70/70;
        this.rightLevel=rightLevel*70/70;

        this.tubes.left.scale.y=leftLevel/70;
        this.tubes.left.position.y=-(70-leftLevel)/2+20.5;

        this.tubes.right.scale.y=rightLevel/70;
        this.tubes.right.position.y=-(70-rightLevel)/2+20.5;

        this.valve1.rotation.z=Valve1*Math.PI/2;
        this.valve2.rotation.z=(1-Valve2)*Math.PI/2;

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

    };

    updateValues=(data,info)=>{

        this.setWaterLevels(data.data[3],data.data[2],data.data[1],data.data[0],info);
        //this.cursor.setPos(data.data[2]);
        //console.log(data);
    };

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

export default DoubleTank;