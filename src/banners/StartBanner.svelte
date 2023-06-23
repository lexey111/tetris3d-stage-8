<script>
  import Cube from "./Cube.svelte";

</script>

<div id="start-banner">
  <h1>TETRIS&middot;3D</h1>
  <h2>Welcome to Tetris WebGL Game</h2>
  <Cube/>
  <p>
    An even more advanced version is <a href="https://lexey111.github.io/tetris/">here</a>.
  </p>
  <p>press Space to start</p>
</div>

<style>
  #start-banner {
    position: absolute;
    top: 60px;
    left: 60px;
    right: 60px;
    bottom: 60px;
    border-radius: 20px;
    box-shadow: 0 10px 60px rgba(0, 0, 0, 0.8);
    border: 1px solid rgba(255, 255,255, .2);

    display: flex;
    flex-flow: column nowrap;
    align-items: center;
    justify-content: center;
    background: linear-gradient(to bottom right, #00bcff, #016ee2);
  }
  h1,
  h2 {
    margin: 0;
    font-weight: normal;
  }
</style>
