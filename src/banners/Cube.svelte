<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import * as THREE from "three";
  import type { TThreeFrame } from "../components/types";
  import { AnimationManager } from "./animation-manager";
  import { CubeRotateXAnimations } from "./cube-rotate-x-animation";
  import { CubeRotateYAnimations } from "./cube-rotate-y-animation";
  import { CubeRotateZAnimations } from "./cube-rotate-z-animation";
  import { CubeScaleAnimations } from "./cube-scale-animation";
  import { CubeColorAnimations } from "./cube-color-animation";

  let Frame: TThreeFrame;
  let canvas;
  let cube;
  let animationReq;

  const animationManager = new AnimationManager();

  onMount(() => {
    initScene();
    animationManager.add(new CubeRotateXAnimations(cube).getAnimation());
    animationManager.add(new CubeRotateYAnimations(cube).getAnimation());
    animationManager.add(new CubeRotateZAnimations(cube).getAnimation());
    animationManager.add(new CubeScaleAnimations(cube).getAnimation());
    animationManager.add(new CubeColorAnimations(cube).getAnimation());

    animate();
  });

  onDestroy(() => {
    cancelAnimationFrame(animationReq);

    if (!Frame) {
      return;
    }
    animationManager.dispose();

    Frame.renderer.dispose();
    Frame.renderer.forceContextLoss();
    Frame.renderer.domElement = null;
    Frame.renderer = null;
  });

  function initScene() {
    Frame = {
      scene: new THREE.Scene(),
      renderer: new THREE.WebGLRenderer({ alpha: true, antialias: true }),
      camera: new THREE.PerspectiveCamera(
        75,
        canvas.offsetWidth / canvas.offsetHeight,
        0.1,
        500
      ),
    };

    Frame.camera.zoom = 5;
    Frame.camera.position.set(0, 0, 10);
    Frame.camera.updateProjectionMatrix();

    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(0, 14, 30);
    light.castShadow = true;

    const pointLight1 = new THREE.PointLight(0x888888ff, 0.8, 10);
    pointLight1.position.set(-4, -4, -4);
    pointLight1.castShadow = true;

    const pointLight2 = new THREE.PointLight(0xff0088, 0.8, 20);
    pointLight2.position.set(4, -3, -6);
    pointLight2.castShadow = true;

    Frame.scene.add(light);
    Frame.scene.add(pointLight1);
    Frame.scene.add(pointLight2);

    cube = new THREE.Group();

    const innerCube = new THREE.Mesh(
      new THREE.BoxGeometry(0.7, 0.7, 0.7),
      new THREE.MeshStandardMaterial({ color: 0xffa600 })
    );
    innerCube.castShadow = true;
    innerCube.receiveShadow = true;

    const outerCube = new THREE.Mesh(
      new THREE.BoxGeometry(1, 1, 1),
      new THREE.MeshStandardMaterial({
        color: 0xa2de96,
        transparent: true,
        opacity: 0.5,
      })
    );
    outerCube.castShadow = true;
    outerCube.receiveShadow = true;

    cube.add(innerCube);
    cube.add(outerCube);

    Frame.scene.add(cube);

    Frame.renderer.shadowMap.enabled = true;
    Frame.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    Frame.renderer.setSize(canvas.offsetWidth, canvas.offsetHeight);

    canvas.appendChild(Frame.renderer.domElement);

    Frame.renderer.render(Frame.scene, Frame.camera);
  }

  function animate() {
    animationManager.play();
    Frame.renderer?.render(Frame.scene, Frame.camera);

    requestAnimationFrame(animate);
  }
</script>

<div id="cube" bind:this={canvas} />

<style>
  #cube {
    width: 200px;
    height: 200px;
  }
</style>
