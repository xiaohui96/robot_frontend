import React from 'react';
import Reflux from 'reflux';

import ModelComponent from './ModelComponent';

class TripleTank extends Reflux.Component {
    constructor(props) {
        super(props);
    }

    paraNames=[
        'Water_Level_1',
        'Water_Level_2',
        'Water_Level_3'
    ];

    loadBase=(scene)=>{
        const modelPath='TripleTank';
        const baseLoader = new THREE.MTLLoader();
        baseLoader.setPath( `/3DModels/${modelPath}/` );
        baseLoader.load( `TripleTank.mtl`, ( materials ) => {
            materials.preload();
            const objLoader = new THREE.OBJLoader();
            objLoader.setMaterials( materials );

            objLoader.setPath( `/3DModels/${modelPath}/` );
            objLoader.load( `TripleTank.obj`,  ( object ) => {
                scene.add( object );

                //使得模型位于屏幕正中间
                const box3 = new THREE.Box3().setFromObject( object );
                const target = new THREE.Vector3();
                box3.getSize(target);
                object.position.y = -target.y/3;

                this.base = object;
                this.Level_Left = this.WaterLevel_left();
                this.base.add(this.Level_Left);
                this.Level_Middle = this.WaterLevel_middle();
                this.base.add(this.Level_Middle);
                this.Level_Right = this.WaterLevel_right();
                this.base.add(this.Level_Right);
                console.log(object);

                //this.loadBlock();
                //this.loadPole();
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



    WaterLevel_left=()=>{
        var geometry = new THREE.CylinderGeometry(8, 8, 60);
        var material = new THREE.MeshBasicMaterial({color: 0x8888ff});
        var label = new THREE.Mesh(geometry, material);

        label.position.y = 35;
        label.position.x = -5;
        label.position.z = 3;

        return label;
    };

    WaterLevel_middle=()=>{
        var geometry = new THREE.CylinderGeometry(8, 8, 60);
        var material = new THREE.MeshBasicMaterial({color: 0x8888ff});
        var label = new THREE.Mesh(geometry, material);

        label.position.y = 35;
        label.position.x = 39;
        label.position.z = 3;

        return label;
    };

    WaterLevel_right=()=>{
        var geometry = new THREE.CylinderGeometry(8, 8, 60);
        var material = new THREE.MeshBasicMaterial({color: 0x8888ff});
        var label = new THREE.Mesh(geometry, material);

        label.position.y = 35;
        label.position.x = 82;
        label.position.z = 3;

        return label;
    };


    setAnglePosition=(h1,h2,h3,info)=>{


        info.innerHTML="h1: "+Math.floor(h1*100)/100+"<br>";
        info.innerHTML+="h2: "+Math.floor(h2*100)/100+"<br>";
        info.innerHTML+="h3: "+Math.floor(h3*100)/100+"<br>";

        // h1 = h1*73/70;
        // h2 = h2*73/70;
        // h3 = h3*73/70;

        if(h1>60)
            h1 = 60;
        else if(h1<0)
            h1 = 0;
        if(h2>60)
            h2 = 60;
        else if(h2<0)
            h2 = 0;
        if(h3>60)
            h3 = 60;
        else if(h3<0)
            h3 = 0;

        this.Level_Left.scale.y=h1/60;
        this.Level_Left.position.y= -(60-h1)/2+35;;   //-(60-h1)/2+30;
        this.Level_Middle.scale.y=h2/60;
        this.Level_Middle.position.y=-(60-h2)/2+35;
        this.Level_Right.scale.y=h3/60;
        this.Level_Right.position.y=-(60-h3)/2+35;


        //this.block.position.x=pos;
        //this.pole.position.x=pos;
        // this.block.rotation.y = h1;
        // this.pole.rotation.y= h2;
        // this.pole.rotation.z= h3;

    }
    updateValues=(data,info)=>{
            this.setAnglePosition(data.data[0],data.data[1],data.data[2],info);
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

export default TripleTank;