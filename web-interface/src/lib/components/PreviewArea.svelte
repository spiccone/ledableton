<script lang="ts">
  import type {Device} from "$lib/types";
  import AddDevice from "./add_device/AddDevice.svelte";
	import DraggablePreview from './DraggablePreview.svelte';

  export let devices: Array<Device> = [];
  export let locked: boolean = false;

  let dragging= false;
</script>

<div class="PreviewArea {locked ? 'locked' : ''}">
  <div class='room-button'>Room name</div>
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

  .room-button {
    border: 2px solid rgba(0,0,0,0);
    border-radius: 8px;
    cursor: pointer;
    padding: 6px 9px;
    position: absolute;
    font-size: 18px;
    margin: 7px 40px;
    z-index: 10;
  }
  .room-button:hover {
    border: 2px solid var(--color-border);
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