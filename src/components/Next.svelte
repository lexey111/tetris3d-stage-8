<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import * as THREE from "three";
  import type { TThreeFrame } from "./types";
  import { createFigure } from "../figures/builder";
  import type { TFigureType } from "../figures/figures";

  export let figure: TFigureType = "#"; // initial figure to display

  let Frame: TThreeFrame;
  let canvas;

  onMount(() => {
    initScene();
  });

  onDestroy(() => {
    if (!Frame) {
      return;
    }

    Frame.renderer.dispose();
    Frame.renderer.forceContextLoss();
    Frame.renderer.domElement = null;
    Frame.renderer = null;
  });

  $: if (Frame && figure) {
    placeFigure(figure);
  }

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
    Frame.camera.position.set(10, 0, 10);
    Frame.camera.lookAt(0, 0, 0);
    Frame.camera.updateProjectionMatrix();

    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(0, 4, 30);
    light.castShadow = true;

    const pointLight1 = new THREE.PointLight(0x88aaff, 0.8, 20);
    pointLight1.position.set(8, 4, -4);
    pointLight1.castShadow = true;

    const pointLight2 = new THREE.PointLight(0xffaa88, 0.8, 60);
    pointLight2.position.set(4, -3, -6);

    Frame.scene.add(light);
    Frame.scene.add(pointLight1);
    Frame.scene.add(pointLight2);

    Frame.renderer.shadowMap.enabled = true;
    Frame.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    Frame.renderer.setSize(canvas.offsetWidth, canvas.offsetHeight);

    canvas.appendChild(Frame.renderer.domElement);

    Frame.renderer.render(Frame.scene, Frame.camera);
  }

  function cleanup() {
    const objectsToRemove = [];
    Frame.scene.traverse(function (node) {
      if (node instanceof THREE.Mesh) {
        objectsToRemove.push(node);
      }
    });

    objectsToRemove.forEach((node) => {
      node.parent.remove(node);
    });
  }

  function placeFigure(type) {
    cleanup();

    const figure = createFigure(type);
    const obj = figure.object.clone();

    Frame.scene.add(obj);

    obj.position.y = -0.5 - figure.height / 2;
    obj.position.x = 0.5 - figure.width / 2;

    Frame.renderer.render(Frame.scene, Frame.camera);
  }
</script>

<div id="next" bind:this={canvas} />

<style>
  #next {
    width: 120px;
    height: 120px;
  }
</style>
