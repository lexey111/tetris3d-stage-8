<script>
  import Cube from "./Cube.svelte";
</script>

<div id="start-banner">
  <h1>TETRIS&middot;3D</h1>
  <h2>Welcome to Tetris WebGL Game</h2>
  <Cube />
  <p class="link-to-big">
    An even more advanced version is <a
      href="https://lexey111.github.io/tetris/">here</a
    >.
  </p>
  <p>PRESS SPACE TO START</p>
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
    border: 1px solid rgba(255, 255, 255, 0.2);

    display: flex;
    flex-flow: column nowrap;
    align-items: center;
    justify-content: center;
    background: linear-gradient(to bottom right, #00bcff, #016ee2);
  }
  .link-to-big {
    background-color: rgba(255, 255, 255, 0.1);
    color: rgba(255, 255, 255, 0.5);
    border-radius: 16px;
    padding: 4px 20px;
  }
  a,
  a:visited {
    color: rgba(255, 255, 255, 0.7);
    transition: all 0.2s ease;
  }
  a:hover {
    color: rgba(255, 255, 255, 1);
  }
  h1,
  h2 {
    margin: 0;
    font-weight: normal;
  }
  h1 {
    width: 100%;
    text-align: center;
    border-top: 1px dashed rgba(200, 255, 200, 0.6);
    border-bottom: 1px dashed rgba(200, 255, 200, 0.6);
    background-color: rgba(200, 255, 200, 0.2);
    margin-bottom: 1rem;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.2);
  }
</style>
