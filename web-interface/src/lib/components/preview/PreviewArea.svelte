<script lang="ts">
  import type {DeviceDisplay, DeviceEffectDisplay, SavedRoom} from "$lib/device";
	import { onMount } from "svelte";
  import AddDevice from "../add_device/AddDevice.svelte";
	import DraggablePreview from './DraggablePreview.svelte';

  export let locked: boolean = false;
  export let socket: WebSocket;
  export let deviceEffectDisplays: DeviceEffectDisplay[];

  onMount(() => {
    updateDisplays();
  });

  function updateDisplays(){

  }


  function play() {
    socket.send("run-effects");
  }

  function pause() {
    socket.send("stop-effects");
  }
  

  let dragging= false;
</script>

<div class="PreviewArea {locked ? 'locked' : ''}">
    {#each deviceEffectDisplays as device, i (i)}
      <DraggablePreview bind:device={device} 
                        bind:dragging={dragging}
                        locked={locked} />
    {/each}
</div>

<style>
  .PreviewArea {
    height: 100%;
    overflow: scroll;
    position:static;
    width: 100%;
  }
</style>