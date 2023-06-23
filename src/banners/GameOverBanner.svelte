<script>
  import Cube from "./Cube.svelte";

  export let finalScore = 0;
  export let finalLevel = 0;
</script>

<div id="gameover-banner">
  <h1>GAME OVER</h1>
  <h2>Final score: {finalScore} on level {finalLevel}</h2>
  <Cube />
  <p>press Space to continue</p>
</div>

<style>
  #gameover-banner {
    position: absolute;
    top: 60px;
    left: 60px;
    right: 60px;
    bottom: 60px;
    border-radius: 20px;
    box-shadow: 0 10px 60px rgba(0, 0, 0, 0.8);
    opacity: .97;
    border: 1px solid rgba(255, 255,255, .2);

    display: flex;
    flex-flow: column nowrap;
    align-items: center;
    justify-content: center;
    background: linear-gradient(to bottom right, #ffc900, #ff8500);
    color: #63212f;
  }
  p {
    text-transform: uppercase;
  }
  h1,
  h2 {
    margin: 0;
    font-weight: normal;
  }
  h1{
    width: 100%;
    text-align: center;
    border-top: 1px dashed rgba(200, 255, 200, 0.6);
    border-bottom: 1px dashed rgba(200, 255, 200, 0.6);
    background-color: rgba(200, 255, 200, 0.2);
    margin-bottom: 1rem;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.2);
  }
</style>
