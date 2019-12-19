import React from 'react';
import Reflux from 'reflux';

import ModelComponent from './ModelComponent';

class Fan extends Reflux.Component {

    constructor(props) {
        super(props);
    }

    paraNames=[
        'speed',
        'angle'
    ];

    loadStator=(scene)=>{
        const modelPath='Fan';
        const baseLoader = new THREE.MTLLoader();
        baseLoader.setPath( `/3DModels/${modelPath}/` );
        baseLoader.load( `Stator.mtl`, ( materials ) => {
            materials.preload();
            const objLoader = new THREE.OBJLoader();
            objLoader.setMaterials( materials );

            objLoader.setPath( `/3DModels/${modelPath}/` );
            objLoader.load( `Stator.obj`,  ( object ) => {
                scene.add( object );

                //使得模型位于屏幕正中间
                const box3 = new THREE.Box3().setFromObject( object );
                const target = new THREE.Vector3();
                box3.getSize(target);
                object.position.y = -target.y/3;

                this.stator = object;


                this.loadRotor(scene);
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

    loadRotor=(scene)=>{
        const modelPath='Fan';
        const beamLoader = new THREE.MTLLoader();
        beamLoader.setPath( `/3DModels/${modelPath}/` );
        beamLoader.load( `Rotor.mtl`, ( materials ) => {
            materials.preload();
            const objLoader = new THREE.OBJLoader();
            objLoader.setMaterials( materials );

            objLoader.setPath( `/3DModels/${modelPath}/` );
            objLoader.load( `Rotor.obj`,  ( object ) => {

                this.rotor = new THREE.Object3D();
                this.rotor.add(object);
                console.log(this.rotor);
                this.stator.add( this.rotor);
                this.rotor.position.x = 0;
                this.rotor.position.y = 0;

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
        this.loadStator(scene);
    }

    setSpeed=(speed,angle,info)=> {
        info.innerHTML = "Speed: " + Math.floor(speed * 100) / 100 + "<br>";
        info.innerHTML += "Angle: " + Math.floor(angle * 100) / 100 + "<br>";
        this.rotor.rotation.z =angle/360*2*3.1415926 ;
    }

    updateValues=(data,info)=>{

        this.setSpeed(data.data[0],data.data[1],info);
        //console.log(data);
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

export default Fan;
