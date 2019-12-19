import React from 'react';
import Reflux from 'reflux';

import ModelComponent from './ModelComponent';

class R2IP extends Reflux.Component {
    constructor(props) {
        super(props);
    }

    paraNames=[
        'Horizontal_Angle',
        'Short_Pole_Angle',
        'Long_Pole_Angle'
    ];

    loadBase=(scene)=>{
        const modelPath='R2IP';
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
        const modelPath='R2IP';
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
        const modelPath='R2IP';
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
        const modelPath='R2IP';
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

    setAnglePosition=(horizontalAngle,uprightAngle1,uprightAngle2,info)=>{
        info.innerHTML="horizontalAngle: "+Math.floor(horizontalAngle*100)/100+"<br>";
        info.innerHTML+="uprightAngle1: "+Math.floor(uprightAngle1*100)/100+"<br>";
        info.innerHTML+="uprightAngle2: "+Math.floor(uprightAngle2*100)/100+"<br>";

        this.block.rotation.y=horizontalAngle/360*2*3.1415926;


        this.shortpole.rotation.y=horizontalAngle/360*2*3.1415926;
        this.shortpole.rotation.z=uprightAngle1/360*2*3.1415926;


        this.longpole.rotation.y=horizontalAngle/360*2*3.1415926;
        this.longpole.rotation.z=uprightAngle2/360*2*3.1415926;
        this.longpole.position.x=-35.871*Math.sin(uprightAngle1/180*3.1415926)*Math.cos(horizontalAngle/180*3.1415926);
        this.longpole.position.y=-(35.871-35.871*Math.cos(uprightAngle1/180*3.1415926));
        this.longpole.position.z=35.871*Math.sin(uprightAngle1/180*3.1415926)*Math.sin(horizontalAngle/180*3.1415926);

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

export default R2IP;