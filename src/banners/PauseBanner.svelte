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
    opacity: .97;
    border: 1px solid rgba(255, 255,255, .2);

    display: flex;
    flex-flow: column nowrap;
    align-items: center;
    justify-content: center;
    background: linear-gradient(to bottom right, #00b912, #1d8e01);
  }
  h1,
  h3 {
    margin: 0;
    font-weight: normal;
  }
</style>
