<script lang="ts">
  import {Device, LayoutDirection as Layout} from "../types";
	import DevicePreview from './DevicePreview.svelte';
  import GrabBar from './GrabBar.svelte';

  export let layoutDirection: Layout = Layout.row;
  export let devices: Array<Device> = [];
  export let locked: boolean = false;

  const previewWidths: number[] = new Array(devices.length).fill(300);
  const previewHeights: number[] = new Array(devices.length).fill(300);

</script>

<div class="PreviewList {layoutDirection == Layout.row ? 'layout-row' : 'layout-column'}">
  {#each devices as device, i (device.previewElementId)}
    {#if layoutDirection == Layout.row}
      <div class="device-preview-container" style="min-width: {previewWidths[i]}px">
        <DevicePreview device={device} />
      </div>
      <div class="grab-bar">
        <GrabBar
          bind:dimension={previewWidths[i]}
          layoutDirection={layoutDirection}
          locked={locked}/>
      </div>
    {:else}
      <div class="device-preview-container" style="min-height: {previewHeights[i]}px">
        <DevicePreview device={device} />
      </div>
      <div class="grab-bar">
        <GrabBar
          bind:dimension={previewHeights[i]}
          layoutDirection={layoutDirection}
          locked={locked}/>
      </div>
    {/if}
  {/each}
</div>

<style>
  .PreviewList {
    display: flex;
    height: 100%;
  }
  .layout-row {
    flex-direction: row;
    overflow-x: scroll;
  }
  .layout-column {
    flex-direction: column;
    width: 100%;
    overflow-y: scroll;
  }

  .layout-row .device-preview-container {
    height: 100%;
  }
  .layout-column .device-preview-container {
    width: 100%;
  }

  .grab-bar {
    background-color: var(--border-color);
    flex: 0 0 auto;
  }
  .layout-row .grab-bar {
    height: 100%;
    width: 4px;
  }
  .layout-column .grab-bar {
    height: 4px;
    width: 100%;
  }
</style>