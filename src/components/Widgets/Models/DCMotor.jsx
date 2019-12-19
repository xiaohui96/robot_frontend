import React from 'react';
import Reflux from 'reflux';

import ModelComponent from './ModelComponent';

class  DCMotor extends Reflux.Component {

    constructor(props) {
        super(props);
    }

    paraNames=[
        'Speed',
    ];

    loadBase=(scene)=>{
        const modelPath='DCMotor';
        const baseLoader = new THREE.MTLLoader();
        baseLoader.setPath( `/3DModels/${modelPath}/` );
        baseLoader.load( `Motor.mtl`, ( materials ) => {
            materials.preload();
            const objLoader = new THREE.OBJLoader();
            objLoader.setMaterials( materials );

            objLoader.setPath( `/3DModels/${modelPath}/` );
            objLoader.load( `Motor.obj`,  ( object ) => {
                scene.add( object );

                //使得模型位于屏幕正中间
                const box3 = new THREE.Box3().setFromObject( object );
                const target = new THREE.Vector3();
                box3.getSize(target);
                object.position.y = -target.y/3;

                this.base = object;
                this.loadHand(scene);
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

    loadHand=(scene)=>{
        const modelPath='DCMotor';
        const ballLoader = new THREE.MTLLoader();
        ballLoader.setPath( `/3DModels/${modelPath}/` );
        ballLoader.load( `Hand.mtl`, ( materials ) => {
            materials.preload();
            const objLoader = new THREE.OBJLoader();
            objLoader.setMaterials( materials );

            objLoader.setPath( `/3DModels/${modelPath}/` );
            objLoader.load( `Hand.obj`,  ( object ) => {
                object.position.x=33.902;
                object.position.y=5.776;
                //object.position.z=10;
                this.hand=new THREE.Object3D();
                this.hand.add( object );
                this.hand.position.x=-33.902;
                this.hand.position.y=-5.776;
                this.hand.position.z=20;
                //this.hand = object;
                this.base.add( this.hand );
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

    setRperS=(rpers,info)=>{
        info.innerHTML="RPM:"+Math.floor(rpers*100)/100/60+"<br>";
        //const time=new Date().getTime()/1000;
        const time=new Date().getTime();
        //var time_sec = Math.floor(time/1000)
        const rotation_Omega=rpers/60*time;
        //console.log(rpers);
        //console.log(time_sec);

        this.hand.rotation.z=rotation_Omega*2*3.1415926/1000;
        //hand.transform.recompose(handV3d);
        // hand.transform.prependRotation(rpers*360,new Vector3D(0,0,1),new Vector3D(-26.145,12.132,0));
        //
        // hand.dirtyTransform();
    }

    updateValues=(data,info)=>{
        if(this.hand){
            this.setRperS(data.data[0],info);
        }
    }


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

export default DCMotor;