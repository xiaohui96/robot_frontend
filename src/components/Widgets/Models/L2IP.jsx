import React from 'react';
import Reflux from 'reflux';

import Model from './Model';

class L2IP extends Reflux.Component {
    constructor(props) {
        super(props);
    }

    paraNames=[
        'Angle1',
        'Angle2',
        'Position'
    ];

    loadBase=(scene)=>{
        const modelPath='L2IP';
        const baseLoader = new THREE.MTLLoader();
        baseLoader.setPath( `/3DModels/${modelPath}/` );
        baseLoader.load( `Pendulum.mtl`, ( materials ) => {
            materials.preload();
            const objLoader = new THREE.OBJLoader();
            objLoader.setMaterials( materials );

            objLoader.setPath( `/3DModels/${modelPath}/` );
            objLoader.load( `Pendulum.obj`,  ( object ) => {
                scene.add( object );

                //使得模型位于屏幕正中间
                const box3 = new THREE.Box3().setFromObject( object );
                const target = new THREE.Vector3();
                box3.getSize(target);
                object.position.y = -target.y/3;

                this.base = object;

                this.loadBlock();
                this.loadShortPole();
                this.loadLongPole();
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
        const modelPath='L2IP';
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


    loadShortPole=(scene)=>{
        const modelPath='L2IP';
        const baseLoader = new THREE.MTLLoader();
        baseLoader.setPath( `/3DModels/${modelPath}/` );
        baseLoader.load( `Shortpole.mtl`, ( materials ) => {
            materials.preload();
            const objLoader = new THREE.OBJLoader();
            objLoader.setMaterials( materials );

            objLoader.setPath( `/3DModels/${modelPath}/` );
            objLoader.load( `Shortpole.obj`,  ( object ) => {
                this.base.add( object );



                this.shortpole = object;
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


    loadLongPole=(scene)=>{
        const modelPath='L2IP';
        const baseLoader = new THREE.MTLLoader();
        baseLoader.setPath( `/3DModels/${modelPath}/` );
        baseLoader.load( `Longpole.mtl`, ( materials ) => {
            materials.preload();
            const objLoader = new THREE.OBJLoader();
            objLoader.setMaterials( materials );

            objLoader.setPath( `/3DModels/${modelPath}/` );
            objLoader.load( `Longpole.obj`,  ( object ) => {
                this.base.add( object );



                this.longpole = object;
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

    setAnglePosition=(angle1,angle2,pos,info)=>{
        info.innerHTML="Angle1: "+Math.floor(angle1*100)/100+"<br>";
        info.innerHTML+="Angle2: "+Math.floor(angle2*100)/100+"<br>";
        info.innerHTML+="Pos: "+Math.floor(pos*100)/100+"<br>";

        if(pos>40){
            pos=40;
        }

        if(pos<-40){
            pos=-40;
        }

        this.block.position.x=pos;

        this.shortpole.position.x=pos;
        this.shortpole.rotation.z=angle1/360*2*3.1415926;

        this.longpole.position.x=pos-21.348*Math.sin(angle1/180*3.1415926);
        this.longpole.position.y=-(21.348-21.348*Math.cos(angle1/180*3.1415926));
        this.longpole.rotation.z=-angle2/360*2*3.1415926;
        // console.log(angle1);
        // console.log(angle2);


        // shortpole.transform.recompose(poleV3d);
        // apos=pos*40;
        // block.move(apos,0,0);
        // block.move(apos-block.position.x,0,0);
        // shortpole.move(apos,0,0);
        // shortpole.transform.prependRotation(angle1,new Vector3D(0,0,1),new Vector3D(0,-16.1,0));
        //
        // longpole.transform.recompose(longPoleV3d);
        // longpole.move(apos-21.348*Math.sin(angle1/180*3.1415926),-(21.348-21.348*Math.cos(angle1/180*3.1415926)),0);
        // longpole.transform.prependRotation(-angle2,new Vector3D(0,0,1),new Vector3D(0,5.248,0));
        // longpole.dirtyTransform();
    }

    updateValues=(data,info)=>{

        if(this.block&&this.shortpole&&this.longpole){
            this.setAnglePosition(data.data[0],data.data[1],data.data[2],info);
        }


    }

    render(){
        const {plantInfo,signalParaList,dataPool,keyValue,params,monitor}=this.props;
        //console.log(params);
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

export default L2IP;