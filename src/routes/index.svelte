<script lang="ts">

function clickMe(msg: string) {
    alert(msg);
}

</script>
<div><button on:click={()=>clickMe('Hello World!')}>Click Me</button></div>

