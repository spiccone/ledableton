<script lang="ts">
  import type {Device} from "$lib/types";
  import AddDevice from "./AddDevice.svelte";
	import DraggablePreview from './DraggablePreview.svelte';

  export let devices: Array<Device> = [];
  export let locked: boolean = false;

  let dragging= false;
</script>

<div class="PreviewArea {locked ? 'locked' : ''}">
  <div class="device-preview-container">
    {#each devices as device, i (device.previewElementId)}
      <div class="device-wrapper">
        <DraggablePreview bind:device={device} 
                          bind:dragging={dragging}
                          locked={locked || dragging} />
      </div>
    {/each}
  </div>
  {#if !locked}
    <AddDevice />
  {/if}
</div>

<style>
  .PreviewArea {
    height: 100%;
    position: relative;
    width: 100%;
  }

  .device-preview-container {
    height: 100%;
    overflow: scroll;
    position:static;
    width: 100%;
  }

  .device-wrapper {
    height: 0;
    overflow: visible;
    width: 0;
  }
</style>