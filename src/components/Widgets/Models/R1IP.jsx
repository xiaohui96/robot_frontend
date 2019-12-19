import React from 'react';
import Reflux from 'reflux';

import ModelComponent from './ModelComponent';

class R1IP extends Reflux.Component {
    constructor(props) {
        super(props);
    }

    paraNames=[
        'Horizontal_Angle',
        'Pole_angle'
    ];

    loadBase=(scene)=>{
        const modelPath='R1IP';
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

                this.loadBlock();
                this.loadPole();
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

    loadBlock=(scene)=>{
        const modelPath='R1IP';
        const baseLoader = new THREE.MTLLoader();
        baseLoader.setPath( `/3DModels/${modelPath}/` );
        baseLoader.load( `Block.mtl`, ( materials ) => {
            materials.preload();
            const objLoader = new THREE.OBJLoader();
            objLoader.setMaterials( materials );

            objLoader.setPath( `/3DModels/${modelPath}/` );
            objLoader.load( `Block.obj`,  ( object ) => {
                this.base.add( object );


                this.block = object;
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

    loadPole=(scene)=>{
        const modelPath='R1IP';
        const baseLoader = new THREE.MTLLoader();
        baseLoader.setPath( `/3DModels/${modelPath}/` );
        baseLoader.load( `Pole.mtl`, ( materials ) => {
            materials.preload();
            const objLoader = new THREE.OBJLoader();
            objLoader.setMaterials( materials );

            objLoader.setPath( `/3DModels/${modelPath}/` );
            objLoader.load( `Pole.obj`,  ( object ) => {
                this.base.add( object );



                this.pole = object;
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

    setAnglePosition=(angle1,angle2,info)=>{

        info.innerHTML="Angle1: "+Math.floor(angle1*100)/100+"<br>";
        info.innerHTML+="Angle2: "+Math.floor(angle2*100)/100+"<br>";



        //this.block.position.x=pos;
        //this.pole.position.x=pos;
        this.block.rotation.y = angle1/360*2*3.1415926;
        this.pole.rotation.y=angle1/360*2*3.1415926;
        this.pole.rotation.z=angle2/360*2*3.1415926;

    }

/*
    setAnglePosition=(angle,pos,info)=>{
        info.innerHTML="Angle: "+Math.floor(angle*100)/100+"<br>";
        info.innerHTML+="Pos: "+Math.floor(pos*100)/100+"<br>";

        if(pos>40){
            pos=40;
        }

        if(pos<-40){
            pos=-40;
        }

        this.block.position.x=pos;
        this.pole.position.x=pos;
        this.pole.rotation.z=angle/360*2*3.1415926;
    }
    */
    updateValues=(data,info)=>{

        if(this.block&&this.pole){
            this.setAnglePosition(data.data[0],data.data[1],info);
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

export default R1IP;