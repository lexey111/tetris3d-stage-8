<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import * as THREE from "three";
  import type { TThreeFrame } from "./types";
  import { createKey } from "./keys-utils";

  let Frame: TThreeFrame;
  let canvas;

  onMount(() => {
    initScene();
    createKeys();
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

    Frame.camera.zoom = 25;
    Frame.camera.position.set(0, 0, 100);
    Frame.camera.lookAt(0, 0, 0);
    Frame.camera.updateProjectionMatrix();

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.8);
    directionalLight.position.set(0, 1, 10);
    directionalLight.castShadow = true;
    Frame.scene.add(directionalLight);

    const pointLight1 = new THREE.PointLight(0xffffff, 0.8, 20);
    pointLight1.position.set(-5, 1, 2);
    pointLight1.castShadow = true;

    const pointLight2 = new THREE.PointLight(0x888888, 1, 20);
    pointLight2.position.set(7, 2, 2);
    pointLight2.castShadow = true;

    Frame.scene.add(pointLight1);
    Frame.scene.add(pointLight2);

    Frame.renderer.shadowMap.enabled = true;
    Frame.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    Frame.renderer.setSize(canvas.offsetWidth, canvas.offsetHeight);

    canvas.appendChild(Frame.renderer.domElement);

    Frame.renderer.render(Frame.scene, Frame.camera);
  }

  function createKeys() {
    const sizeL = 3; // 3x3 cells per key
    const sizePixel = 512; // base size of svg canvas
    const SVGScale = sizeL / sizePixel;

    const keyArrowLeft = createKey({ SVGScale });

    const keyArrowDown = keyArrowLeft.clone();
    keyArrowDown.rotateZ(Math.PI / 2);
    keyArrowDown.children[0].position.x -= 0.2;

    const keyArrowRight = keyArrowLeft.clone();
    keyArrowRight.rotateZ(Math.PI);

    const keyArrowUp = createKey({ symbol: "rotate", SVGScale });
    const keyEscape = createKey({
      symbol: "escape",
      SVGScale
    });
    const keyPause = createKey({ symbol: "pause", SVGScale });
    const keySound = createKey({ symbol: "sound", SVGScale });

    const keySpace = createKey({ symbol: "drop", SVGScale });
    keySpace.children[1].scale.x = 2;

    const keys = new THREE.Group();

    keys.add(keyArrowLeft);
    keys.add(keyArrowDown);
    keys.add(keyArrowRight);
    keys.add(keyArrowUp);
    keys.add(keyEscape);
    keys.add(keyPause);
    keys.add(keySound);
    keys.add(keySpace);

    keyEscape.position.x = -13.5;
    keyEscape.position.y = -1.5;

    keyArrowUp.position.y = 1.5;
    keyArrowUp.position.x = -5.5;

    keyArrowDown.position.y = -1.5;
    keyArrowDown.position.x = -5.5;

    keyArrowLeft.position.y = -1.5;
    keyArrowLeft.position.x = -8.5;

    keyArrowRight.position.y = -1.5;
    keyArrowRight.position.x = -2.5;

    keyPause.position.y = -1.5;
    keyPause.position.x = 2.5;

    keySound.position.y = -1.5;
    keySound.position.x = 5.5;

    keySpace.position.x = 12;
    keySpace.position.y = -1.5;

    keys.rotateX(-0.6);

    Frame.scene.add(keys);

    Frame.renderer.render(Frame.scene, Frame.camera);
  }
</script>

<div id="keys" bind:this={canvas} />

<style>
  #keys {
    width: 500px;
    height: 100px;
    transform: scale(0.75) translateX(-40px);
  }
</style>
