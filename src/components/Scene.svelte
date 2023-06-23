<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import * as THREE from "three";
  import type { TGameField, TThreeFrame } from "./types";
  import { createSpaceItems, createWalls } from "./scene-objects";
  import { createCube } from "../figures/builder";

  export let GameField: TGameField;
  export let tick;
  let renderField; // 3D representation of GameField

  let Frame: TThreeFrame;
  let canvas;

  $: if (GameField && Frame && tick) {
    drawField();
    Frame.renderer.render(Frame.scene, Frame.camera);
  }

  onMount(() => {
    initScene();
    drawField();
    Frame.renderer.render(Frame.scene, Frame.camera);
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

    Frame.camera.zoom = 1;

    const light = new THREE.DirectionalLight(0xffffff, 15);
    light.position.set(3, 40, 2);
    light.castShadow = true;
    light.rotateX(5);

    Frame.scene.add(light);

    const plight = new THREE.PointLight(0xddffff, 0.7, 20);
    plight.position.set(4.5, 0, 4);
    plight.castShadow = true; // default false

    Frame.scene.add(plight);

    const semiLight = new THREE.HemisphereLight(0x8080a0, 0x222222, 0.64);

    Frame.scene.add(semiLight);

    Frame.renderer.shadowMap.enabled = true;
    Frame.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    Frame.renderer.setSize(canvas.offsetWidth, canvas.offsetHeight);

    canvas.appendChild(Frame.renderer.domElement);

    Frame.scene.add(createWalls());
    Frame.scene.add(createSpaceItems());

    adjustPerspectiveCamera(Frame.camera, 0.8);

    Frame.renderer.render(Frame.scene, Frame.camera);
  }

  function adjustPerspectiveCamera(camera, offset) {
    // https://wejn.org/2020/12/cracking-the-threejs-object-fitting-nut/
    offset = offset || 1.5;

    const boundingBox = new THREE.Box3(
      new THREE.Vector3(-6, -12, -6),
      new THREE.Vector3(6, 12, 6)
    );
    const size = new THREE.Vector3();
    boundingBox.getSize(size);
    const center = new THREE.Vector3();
    boundingBox.getCenter(center);

    camera.position.set(0, 0, 100);

    const fov = camera.fov * (Math.PI / 180);
    const fovh = 2 * Math.atan(Math.tan(fov / 2) * camera.aspect);
    let dx = size.z / 2 + Math.abs(size.x / 2 / Math.tan(fovh / 2));
    let dy = size.z / 2 + Math.abs(size.y / 2 / Math.tan(fov / 2));
    let cameraZ = Math.max(dx, dy);

    if (offset !== undefined && offset !== 0) cameraZ *= offset;

    camera.position.set(0, 0, cameraZ);

    const minZ = boundingBox.min.z;
    const cameraToFarEdge = minZ < 0 ? -minZ + cameraZ : cameraZ - minZ;

    camera.far = cameraToFarEdge * 3;

    camera.lookAt(center);
    camera.updateProjectionMatrix();
  }

  const fallingMaterial = new THREE.MeshStandardMaterial({
    color: 0xffa600,
    transparent: true,
    opacity: 0.9,
    side: THREE.DoubleSide
  });

  const solidMaterial = new THREE.MeshStandardMaterial({
    color: 0x808080,
    // transparent: true,
    // opacity: 0.98,
    // side: THREE.DoubleSide
  });

  const deletingMaterial = new THREE.MeshStandardMaterial({
    color: 0xff0000,
    transparent: true,
    opacity: 0.2,
    side: THREE.DoubleSide,
  });

  function drawField() {
    if (!Frame) {
      return;
    }

    if (renderField) {
      const objectsToRemove = [];

      renderField.traverse((node) => {
        if (node instanceof THREE.Mesh) {
          objectsToRemove.push(node);
        }
      });

      objectsToRemove.forEach((node) => {
        node.parent.remove(node);
      });

      Frame.scene.remove(renderField);
      renderField = null;
    }

    renderField = new THREE.Group();

    for (let row = 0; row < 24; row++) {
      // vertical
      for (let col = 0; col < GameField[row].length; col++) {
        // horizontal
        if (GameField[row][col]) {
          let cube;

          if (GameField[row][col] === 3) {
            cube = createCube(deletingMaterial);
          }

          if (GameField[row][col] === 1) {
            if (!cube) {
              cube = createCube(fallingMaterial);
            }
          }

          if (!cube) {
            cube = createCube(solidMaterial); // 2, solid
          }

          cube.position.x = col;
          cube.position.y = row;

          renderField.add(cube);
        }
      }
    }

    renderField.position.x = -5 + 0.5;
    renderField.position.y = -10 + 0.5;
    renderField.position.z = 0;

    Frame.scene.add(renderField);
  }
</script>

<div id="scene" bind:this={canvas} />

<style>
  #scene {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
  }
</style>
