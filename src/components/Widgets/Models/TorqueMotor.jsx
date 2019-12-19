import React from 'react';
import Reflux from 'reflux';

import Model from './Model';

class TorqueMotor extends Reflux.Component {
    constructor(props) {
        super(props);
    }

    paraNames=[
        'Expectation'
    ];

    loadBase=(scene)=>{
        const modelPath='TorqueMotor';
        const baseLoader = new THREE.MTLLoader();
        baseLoader.setPath( `/3DModels/${modelPath}/` );
        baseLoader.load('Motor.mtl',(materials) => {
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
        const modelPath='TorqueMotor';
        const baseLoader = new THREE.MTLLoader();
        baseLoader.setPath( `/3DModels/${modelPath}/` );
        baseLoader.load( `Hand.mtl`, ( materials ) => {
            materials.preload();
            const objLoader = new THREE.OBJLoader();
            objLoader.setMaterials( materials );

            objLoader.setPath( `/3DModels/${modelPath}/` );
            objLoader.load( `Hand.obj`,  ( object ) => {
                object.position.x=26.145;
                object.position.y=-12.132;
                object.position.z=0;
                this.Hand=new THREE.Object3D();
                this.Hand.add(object);
                this.Hand.position.x=-26.145;
                this.Hand.position.y=12.132;
                this.Hand.position.z=0;
                //this.base.add( this.axis01 );
                this.base.add( this.Hand );

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

    setAnglePosition=(rotation_rate,info)=>{
        {
        info.innerHTML="RPM: "+Math.floor(rotation_rate*100)/100+"<br>";
        const time=new Date().getTime()/1000;
        this.Hand.rotation.z=rotation_rate/60* 2 * 3.1415926*time;

        }

    }

    updateValues=(data,info)=>{
        console.log(333);
        this.setAnglePosition(data.data[0],info);

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

export default TorqueMotor;