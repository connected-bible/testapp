<script lang="ts">

function toggleMenu() {
	const mnu = e$('menu');
	const ol = e$('overlay');
	const newVisibility = mnu!.style.visibility == 'visible' ? 'hidden' : 'visible';
	mnu!.style.visibility = newVisibility;
	ol!.style.visibility = newVisibility;
}

function e$(name: string) {
	return document.getElementById(name);
}

</script>


<main>
    <div id="menuButton">
        <button on:click={toggleMenu}>Menu Button</button>
    </div>

    <div id="menu"></div>
    <div id="overlay">&nbsp;</div>

</main>
    
<style>
  :root {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
      Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  }

  :global(body) {
    margin: 0;
    padding: 0;
  }

  #menuButton {
    position: absolute;
    top: 0;
    cursor: pointer;
    z-index: 100;
  }

  #menu {
    position: absolute;
    top: 0;
    height: 100%;
    min-width: 120px;
    max-width: 480px;
    width: 95%;
    background-color: lightblue;
    box-shadow: 0 12px 12px -2px black;
    z-index: 99;
    visibility: hidden;
  }

  #overlay {
    position: absolute;
    top: 0;
    height: 100%;
    width: 100%;
    background-color: black;
    opacity: 50%;
    z-index: 98;
    visibility: hidden;
  }

  main {
    /* text-align: center;*/
    padding: 0;
    margin: 0;
    background-color: orange;
  }

</style>


