<script lang="ts">
 import { Wavey } from '$lib/scripts/wavey/wavey';
 import {afterUpdate, onMount} from 'svelte';

 let wavey: Wavey|null;
 onMount(() => {
  wavey = Wavey.create({containerId: "wavey-wrapper"});
  wavey.load('src/lib/static/bothOfUs.mp3');
 });

 function play() {
   if(wavey) {
     wavey.play();
   }
 }


</script>

<div class="Wavey">
  <div id="wavey-wrapper"></div>
  <button on:click={play}>Play</button>
</div>

<style>
#wavey-wrapper {
  width: 100%;
  overflow-x: scroll;
}
</style>