import React from 'react';
import Reflux from 'reflux';

//import Model from './Model'; old
import ModelComponent from './ModelComponent';

class MagneticLevitationSystem extends Reflux.Component {
    constructor(props) {
        super(props);
    }

    //这里的名称要与simulink里模型的信号名称一致
    paraNames=[
        //'Expectation_position',
        'Ball_Position'
    ];



    loadBase=(scene)=>{
        const modelPath='MagneticLevitationSystem';
        const baseLoader = new THREE.MTLLoader();
        baseLoader.setPath( `/3DModels/${modelPath}/` );
        baseLoader.load( `base.mtl`, ( materials ) => {
            materials.preload();
            const objLoader = new THREE.OBJLoader();
            objLoader.setMaterials( materials );
            console.log('load base for MLS')
            objLoader.setPath( `/3DModels/${modelPath}/` );
            objLoader.load( `base.obj`,  ( object ) => {
                scene.add( object );

                //使得模型位于屏幕正中间
                const box3 = new THREE.Box3().setFromObject( object );
                const target = new THREE.Vector3();
                box3.getSize(target);
                object.position.y = -target.y/3;

                this.base = object;

                //this.loadMLS(scene);
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

    loadMLS=(scene)=>{
        const modelPath='MagneticLevitationSystem';
        const baseLoader = new THREE.MTLLoader();
        baseLoader.setPath( `/3DModels/${modelPath}/` );
        baseLoader.load( `MagneticLevitationSystem.mtl`, ( materials ) => {
            materials.preload();
            const objLoader = new THREE.OBJLoader();
            objLoader.setMaterials( materials );

            objLoader.setPath( `/3DModels/${modelPath}/` );
            objLoader.load( `MagneticLevitationSystem.obj`,  ( object ) => {


                this.MLS = object;
                this.base.add(this.MLS);
                console.log('MLS');
                console.log(this.MLS);
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
        const modelPath='MagneticLevitationSystem';
        const baseLoader = new THREE.MTLLoader();
        baseLoader.setPath( `/3DModels/${modelPath}/` );
        baseLoader.load( `ball.mtl`, ( materials ) => {
            materials.preload();
            const objLoader = new THREE.OBJLoader();
            objLoader.setMaterials( materials );

            objLoader.setPath( `/3DModels/${modelPath}/` );
            objLoader.load( `ball.obj`,  ( object ) => {


                this.ball = object;

                this.ball.scale.x=1;
                this.ball.scale.y=1;
                this.ball.scale.z=1;

                //this.ball.position.x=0;
                //this.ball.position.y=0;
                //this.ball.position.z=0; //缩放

                this.base.add(this.ball);

                console.log('Ball');
                console.log(this.ball);
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

    setPosition=(pos,info)=>{
        info.innerHTML="Position: "+Math.floor(pos*100)/100+"<br>";
        //info.innerHTML+="Pos: "+Math.floor(pos*100)/100+"<br>";

        if(pos>10){
            pos=10;
        }

        if(pos<-10){
            pos=-10;
        }

        if(this.ball){
            this.ball.position.y = pos;
        }
    }

    updateValues=(data,info)=>{
        console.log('MLS updateValues');

        this.setPosition(data.data[0],info);
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

export default MagneticLevitationSystem;
