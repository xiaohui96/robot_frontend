//依赖类
import React from 'react';
import Reflux from 'reflux';
import { message, Button } from 'antd';

//ThreeJS
import * as THREE from 'three';

import './Model.less';

class Model extends Reflux.Component {
  constructor(props) {
    super(props);
    this.state = {
    }
  }

  componentDidMount() {
    this.init();
    this.loadModel(this.scene, this.props.modelPath);
    this.animate();
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.modelPath != this.props.modelPath){
			this.scene.remove( this.object );
      this.loadModel(this.scene, nextProps.modelPath);
    }
  }

  init = () => {
    const {clientWidth, clientHeight} = this.mount;

  	// scene
  	this.scene = new THREE.Scene();

    // camera
    this.camera = new THREE.PerspectiveCamera( 90, clientWidth / clientHeight, 1, 2000 );
    this.camera.position.z = 150;
    this.scene.add( this.camera );

    // light
  	const ambientLight = new THREE.AmbientLight( 0xcccccc, 0.4 );
  	this.scene.add( ambientLight );
  	const pointLight = new THREE.PointLight( 0xffffff, 0.8 );
  	this.camera.add( pointLight );

    // controls 支持鼠标拖拽模型及滑轮缩放
    this.controls = new THREE.OrbitControls( this.camera, this.mount );
    this.controls.minDistance = 100;
		this.controls.maxDistance = 1000

  	// renderer
  	this.renderer = new THREE.WebGLRenderer();
		this.renderer.setClearColor( 0x08979c );
  	this.renderer.setPixelRatio( window.devicePixelRatio );
  	this.renderer.setSize( clientWidth, clientHeight );

  	this.mount.appendChild( this.renderer.domElement );

    window.addEventListener( 'resize', this.onWindowResize, false );
  }

  loadModel = (scene, modelPath)=>{
    const mtlLoader = new THREE.MTLLoader();
    mtlLoader.setPath( `/3DModels/${modelPath}/` );
    mtlLoader.load( `${modelPath}.mtl`, ( materials ) => {
      materials.preload();
      const objLoader = new THREE.OBJLoader();
      objLoader.setMaterials( materials );

      objLoader.setPath( `/3DModels/${modelPath}/` );
      objLoader.load( `${modelPath}.obj`,  ( object ) => {
        scene.add( object );

        //使得模型位于屏幕正中间
        const box3 = new THREE.Box3().setFromObject( object );
        const target = new THREE.Vector3();
        box3.getSize(target);
        object.position.y = -target.y/3;

        this.object = object;
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

  animate = () =>{
    requestAnimationFrame(this.animate);

    this.controls.update();
    this.renderer.render(this.scene, this.camera);
  }

  onWindowResize = () => {
    const {clientWidth, clientHeight} = this.mount;
  	this.camera.aspect = clientWidth / clientHeight;
  	this.camera.updateProjectionMatrix();
  	this.renderer.setSize( clientWidth, clientHeight );
  }

  render() {
    return (
      <div
        className="three-js-container"
        ref={(mount) => { this.mount = mount }}
      />
    )
  }
}


export default Model;
