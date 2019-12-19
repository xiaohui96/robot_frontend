import React from 'react';
import Reflux from 'reflux';

import ModelComponent from './ModelComponent';

class SingleTank extends Reflux.Component {

    constructor(props) {
        super(props);
    }

    paraNames=[
        'Water_Level'
    ];

    loadSingleTank=(scene)=>{
        const modelPath='SingleTank';
        const baseLoader = new THREE.MTLLoader();
        baseLoader.setPath( `/3DModels/${modelPath}/` );
        baseLoader.load( `SingleTank.mtl`, ( materials ) => {
            materials.preload();
            const objLoader = new THREE.OBJLoader();
            objLoader.setMaterials( materials );

            objLoader.setPath( `/3DModels/${modelPath}/` );
            objLoader.load( `SingleTank.obj`,  ( object ) => {
                scene.add( object );

                //使得模型位于屏幕正中间
                const box3 = new THREE.Box3().setFromObject( object );
                const target = new THREE.Vector3();
                box3.getSize(target);
                object.position.y = -target.y/3;

                this.singletank = object;
                this.watertube=this.creatWaterTube();
                this.watertube.position.x=23;
                this.watertube.position.y=12;
                this.watertube.position.z=0;
                this.singletank.add(this.watertube);

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
        this.loadSingleTank(scene);
    }

    creatWaterTube=(scene)=>{
        var geometry = new THREE.CylinderGeometry( 10, 10, 10);
        var material = new THREE.MeshBasicMaterial( {color: 0xffff00} );
        var watertube = new THREE.Mesh( geometry, material );
        var OFFSETX=-60;
        var isMoving=false;
        watertube.position.x=OFFSETX;
        watertube.position.y=45;
        watertube.position.z=0;
        return watertube;
    }

    setWaterLevel=(level,info)=> {
        //if(level >)

        info.innerHTML="Level: "+Math.floor(level*100)/100+"<br>";
        if(this.level)
            this.watertube.position.y= 12+level;
    }

    updateValues=(data,info)=>{
        //console.log('singletank updateValues');
        this.setWaterLevel(data.data[0],info);
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

export default SingleTank;
