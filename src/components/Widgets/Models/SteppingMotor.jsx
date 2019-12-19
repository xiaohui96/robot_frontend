import React from 'react';
import Reflux from 'reflux';

import ModelComponent from './ModelComponent';

class SteppingMotor extends Reflux.Component {
    constructor(props) {
        super(props);
    }
    paraNames=[
        'Angle',
        'Rotation_Rate'
    ];

    loadBase=(scene)=>{
        const modelPath='SteppingMotor';
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
                //this.loadBeam(scene);
                //this.loadLeverArm(scene);
                //this.loadAxis01(scene);
                //this.loadBall(scene);
            }, ( xhr ) => {
                if ( xhr.lengthComputable ) {
                    var percentComplete = xhr.loaded / xhr.total * 100;
                    console.log( Math.round(percentComplete, 2) + '% downloaded' );
                }
            }, ( xhr ) => {
                message.warning("模型资源加载失败");
            });
        });
    };

    loadHand=(scene)=>{
        const modelPath='SteppingMotor';
        const baseLoader = new THREE.MTLLoader();
        baseLoader.setPath( `/3DModels/${modelPath}/` );
        baseLoader.load( `Hand.mtl`, ( materials ) => {
            materials.preload();
            const objLoader = new THREE.OBJLoader();
            objLoader.setMaterials( materials );

            objLoader.setPath( `/3DModels/${modelPath}/` );
            objLoader.load( `Hand.obj`,  ( object ) => {


                // object.position.set(5,0,0);
                // this.hand = new THREE.Object3D();
                // // this.hand.position.set(50,0,0);
                // this.hand.add(object);
                // this.hand.position.set(-10,0,0);
                // this.base.add(this.hand);
                console.log(object.position);
                object.position.x=28.574;
                object.position.y=-7.244;
                object.position.z=0;
                this.hand=new THREE.Object3D();
                this.hand.add(object);
                this.hand.position.x=-28.574;
                this.hand.position.y=7.244;
                this.hand.position.z=0;
                //this.base.add( this.axis01 );
                this.base.add( this.hand );
                //this.hand=new THREE.Object3D();
                //this.hand.position.x=30;
                //this.hand.add(object);
               // object.position.x=-30;
              
                //this.base.add(this.hand);

                console.log('hand');
                console.log(this.hand);
            }, ( xhr ) => {
                if ( xhr.lengthComputable ) {
                    var percentComplete = xhr.loaded / xhr.total * 100;
                    console.log( Math.round(percentComplete, 2) + '% downloaded' );
                }
            }, ( xhr ) => {
                message.warning("模型资源加载失败");
            });
        });
    };
   

    loadModel = (scene)=>{
        this.loadBase(scene);
    };

    setAngleRotionRate(angle,rotation_rate,info){
        info.innerHTML="Angle: "+Math.floor(angle*100)/100+"<br>";
        info.innerHTML+="Rotation_Rate: "+Math.floor(rotation_rate*100)/100+"<br>";
        
        //this.hand.position.x=pos;
        //this.hand.
        //this.hand.position.x=pos;
        //this.hand.position=pos;
        //this.hand.position.x = 0;
        this.hand.rotation.z = angle/360*2*3.1415926;
        // this.hand.rotation.z += 0.01;
        // this.hand.angle=angle/360*2*3.1415926;

    }

    updateValues=(data,info)=>{
        
        if(this.hand){
            this.setAngleRotionRate(data.data[0],data.data[1],info);
        }


    };

    render(){
        const {plantInfo,signalParaList,dataPool,keyValue,params,monitor}=this.props;
        // console.log(params);
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

export default  SteppingMotor;