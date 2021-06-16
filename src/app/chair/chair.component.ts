import { Component, OnInit } from '@angular/core';
import * as THREE from 'three';
import { Group } from 'three';
// import {GLTFLoader} from ‘three/examples/jsm/loaders/GLTFLoader’
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

@Component({
  selector: 'app-chair',
  templateUrl: './chair.component.html',
  styleUrls: ['./chair.component.css'],
})
export class ChairComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {
    this.chairDemo();
  }

  chairDemo(): void {
    const TRAY = document.getElementById('js-tray-slide')!;

    var activeOption = 'legs';
    var loaded = false;

    var cameraFar = 5;
    const BACKGROUND_COLOR = 0xf1f1f1;
    var theModel: Group;
    const MODEL_PATH =
      'https://s3-us-west-2.amazonaws.com/s.cdpn.io/1376484/chair.glb';

    var woodTexture =
      'https://previews.123rf.com/images/maturos1979/maturos19791207/maturos1979120700018/14585093-rattan-chair-pattern-and-texture.jpg';

    var chairTexture =
      'https://thumbs.dreamstime.com/b/leather-texture-chair-back-pattern-pink-color-43585965.jpg';
    var fancyTexture =
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT9mMeQ1DWXx6A_dSXV8KaSJ7oxh-DXSugvgg&usqp=CAU';

    const colors = [
      {
        texture: woodTexture,
        size: [2, 2, 2],
        shininess: 60,
      },
      {
        texture: chairTexture,
        size: [3, 3, 3],
        shininess: 0,
      },
      {
        texture: fancyTexture,
        size: [3, 3, 3],
        shininess: 0,
      },
      {
        color: '66533C',
      },
      {
        color: '173A2F',
      },
      {
        color: '153944',
      },
      {
        color: '27548D',
      },
      {
        color: '438AAC',
      },
    ];

    // Init the scene
    const scene = new THREE.Scene();
    // Set background
    scene.background = new THREE.Color(BACKGROUND_COLOR);
    scene.fog = new THREE.Fog(BACKGROUND_COLOR, 20, 100);

    const LOADER = document.getElementById('js-loader');

    const canvas = document.querySelector('#c') as HTMLCanvasElement;
    // console.log('Printing canvas element');
    // console.log(canvas);
    // const canvasTemp = this.canvas;

    // Init the renderer
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    renderer.shadowMap.enabled = true;
    renderer.setPixelRatio(window.devicePixelRatio);

    document.body.appendChild(renderer.domElement);

    // Add a camera
    var camera = new THREE.PerspectiveCamera(
      50,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = cameraFar;
    camera.position.x = 0;

    // Init the object loader
    var loader = new GLTFLoader();

    // Initial material
    const INITIAL_MTL = new THREE.MeshPhongMaterial({
      color: 0xf1f1f1,
      shininess: 10,
    });

    const INITIAL_MAP = [
      { childID: 'back', mtl: INITIAL_MTL },
      { childID: 'base', mtl: INITIAL_MTL },
      { childID: 'cushions', mtl: INITIAL_MTL },
      { childID: 'legs', mtl: INITIAL_MTL },
      { childID: 'supports', mtl: INITIAL_MTL },
    ];

    // Function - Add the textures to the models
    function initColor(
      parent: Group,
      type: string,
      mtl: THREE.MeshPhongMaterial
    ) {
      // console.log(parent);

      // console.log('Before Init Color...!!! ');
      parent.traverse((o) => {
        if ((<any>o).isMesh) {
          // console.log(o);
          if (o.name.includes(type)) {
            (<THREE.Mesh>o).material = mtl;
            (<any>o).nameID = type; // Set a new property to identify this object
          }
        }
      });
      // console.log('After Init Color...!!! ');
    }

    loader.load(
      MODEL_PATH,
      function (gltf) {
        theModel = gltf.scene;

        theModel.traverse((o) => {
          // console.log(o);
          if ((<THREE.Mesh>o).isMesh) {
            o.castShadow = true;
            o.receiveShadow = true;
          }
        });

        // Set the models initial scale
        theModel.scale.set(2, 2, 2);
        theModel.rotation.y = Math.PI;

        // Offset the y position a bit
        theModel.position.y = -1;

        // Set initial textures
        for (let object of INITIAL_MAP) {
          initColor(theModel, object.childID, object.mtl);
        }

        // Add the model to the scene
        scene.add(theModel);

        // Remove the loader
        LOADER!.remove();
      },
      undefined,
      function (error) {
        console.error(error);
      }
    );

    // Add lights
    var hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.61);
    hemiLight.position.set(0, 50, 0);
    // Add hemisphere light to scene
    scene.add(hemiLight);

    var dirLight = new THREE.DirectionalLight(0xffffff, 0.54);
    dirLight.position.set(-8, 12, 8);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize = new THREE.Vector2(1024, 1024);
    // Add directional Light to scene
    scene.add(dirLight);

    // Floor
    var floorGeometry = new THREE.PlaneGeometry(5000, 5000, 1, 1);
    var floorMaterial = new THREE.MeshPhongMaterial({
      color: 0xeeeeee,
      shininess: 0,
    });

    var floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -0.5 * Math.PI;
    floor.receiveShadow = true;
    floor.position.y = -1;
    scene.add(floor);

    // Add controls
    var controls = new OrbitControls(camera, renderer.domElement);
    controls.maxPolarAngle = Math.PI / 2;
    controls.minPolarAngle = Math.PI / 3;
    controls.enableDamping = true;
    controls.enablePan = false;
    controls.dampingFactor = 0.1;
    controls.autoRotate = false; // Toggle this if you'd like the chair to automatically rotate
    controls.autoRotateSpeed = 0.2; // 30

    // Function - Opening rotate
    let initRotate = 0;

    function initialRotation() {
      initRotate++;
      if (initRotate <= 120) {
        theModel.rotation.y += Math.PI / 60;
      } else {
        loaded = true;
      }
    }

    function animate() {
      controls.update();
      renderer.render(scene, camera);
      requestAnimationFrame(animate);

      if (resizeRendererToDisplaySize(renderer)) {
        const canvas = renderer.domElement;
        camera.aspect = canvas.clientWidth / canvas.clientHeight;
        camera.updateProjectionMatrix();
      }

      if (theModel != null && loaded == false) {
        initialRotation();
      }
    }
    animate();

    function resizeRendererToDisplaySize(renderer: THREE.WebGLRenderer) {
      const canvas = renderer.domElement;
      var width = window.innerWidth;
      var height = window.innerHeight;
      var canvasPixelWidth = canvas.width / window.devicePixelRatio;
      var canvasPixelHeight = canvas.height / window.devicePixelRatio;

      const needResize =
        canvasPixelWidth !== width || canvasPixelHeight !== height;
      if (needResize) {
        renderer.setSize(width, height, false);
      }
      return needResize;
    }

    // // Function - Build Colors
    // function buildColors(
    //   colors: {
    //     texture?: string;
    //     size?: number[];
    //     shininess?: number;
    //     color?: string;
    //   }[]
    // ) {
    //   for (let [i, color] of colors.entries()) {
    //     console.log('Index :' + i + ' Color: ' + color.color);

    //     let swatch = document.createElement('div');
    //     swatch.classList.add('tray__swatch');

    //     // swatch.style.background = '#' + color.color;
    //     if (color.texture) {
    //       swatch.style.backgroundImage = 'url(' + color.texture + ')';
    //     } else {
    //       swatch.style.background = '#' + color.color;
    //     }

    //     // TODO:
    //     swatch.setAttribute('data-key', i.toString());
    //     // console.log(swatch);

    //     TRAY.append(swatch);
    //   }
    // }

    // buildColors(colors);

    // Select Option
    const options = document.querySelectorAll('.option');
    for (var i = 0, option; (option = options[i]); i++) {
      option.addEventListener('click', selectOption);
    }
    // for (const option of options) {
    //   option.addEventListener('click', selectOption);
    // }

    function selectOption(e: any) {
      let option = e.target;
      activeOption = e.target.dataset.option;
      for (var i = 0, otherOption; (otherOption = options[i]); i++) {
        otherOption.classList.remove('--is-active');
      }
      // for (const otherOption of options) {
      //   otherOption.classList.remove('--is-active');
      // }
      option.classList.add('--is-active');
    }

    // Swatches
    const swatches = document.querySelectorAll('.tray__swatch');

    for (var i = 0, element; (element = swatches[i]); i++) {
      element.addEventListener('click', selectSwatch);
    }
    // for (const swatch of swatches) {
    //   swatch.addEventListener('click', selectSwatch);
    // }

    function selectSwatch(e: any) {
      let color = colors[parseInt(e.target.dataset.key)];
      let new_mtl;

      if (color.texture) {
        let txt = new THREE.TextureLoader().load(color.texture);

        // txt.repeat.set(color.size[0], color.size[1], color.size[2]);
        txt.repeat.set(color.size[0], color.size[1]);
        txt.wrapS = THREE.RepeatWrapping;
        txt.wrapT = THREE.RepeatWrapping;

        new_mtl = new THREE.MeshPhongMaterial({
          map: txt,
          shininess: color.shininess ? color.shininess : 10,
        });
      } else {
        new_mtl = new THREE.MeshPhongMaterial({
          color: parseInt('0x' + color.color),
          shininess: color.shininess ? color.shininess : 10,
        });
      }

      setMaterial(theModel, activeOption, new_mtl);
    }

    function setMaterial(
      parent: Group,
      type: string,
      mtl: THREE.MeshPhongMaterial
    ) {
      parent.traverse((o: any | THREE.Mesh) => {
        if (o.isMesh && o.nameID != null) {
          if (o.nameID == type) {
            o.material = mtl;
          }
        }
      });
    }
  }
}
