<script>
  import Cube from "./Cube.svelte";

  export let currentScore = 0;
  export let currentLevel = 0;
</script>

<div id="pause-banner">
  <h1>PAUSE</h1>
  <h3>Current score: {currentScore} on level {currentLevel}</h3>
  <Cube />
  <p>press "P" to continiue or "ESC" to quit</p>
</div>

<style>
  #pause-banner {
    position: absolute;
    top: 60px;
    left: 60px;
    right: 60px;
    bottom: 60px;
    border-radius: 20px;
    box-shadow: 0 10px 60px rgba(0, 0, 0, 0.8);
    opacity: 0.97;
    border: 1px solid rgba(255, 255, 255, 0.2);

    display: flex;
    flex-flow: column nowrap;
    align-items: center;
    justify-content: center;
    background: linear-gradient(to bottom right, #00b912, #1d8e01);
  }
  p {
    text-transform: uppercase;
  }
  h1,
  h3 {
    margin: 0;
    font-weight: normal;
    text-transform: uppercase;
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
