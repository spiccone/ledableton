<script lang="ts">
  import {Device, LayoutDirection as Layout} from "../types";
	import DevicePreview from './DevicePreview.svelte';
  import GrabBar from './GrabBar.svelte';

  export let layoutDirection: Layout = Layout.row;
  export let devices: Array<Device> = [];

  const previewSizes: number[] = new Array(devices.length).fill(300);

  const layoutClassName = layoutDirection == Layout.row ? 'layout-row' : 'layout-column';
</script>

<div class="PreviewList {layoutClassName}">
  {#each devices as device, i (device.previewElementId)}
    {#if layoutDirection == Layout.row}
      <div class="device-preview-container" style="min-width: {previewSizes[i]}px">
        <DevicePreview device={device} />
      </div>
    {:else}
      <div class="device-preview-container" style="min-height: {previewSizes[i]}px">
        <DevicePreview device={device} />
      </div>
    {/if}
    <div class="grab-bar">
      <GrabBar bind:dimension={previewSizes[i]} layoutDirection={layoutDirection} />
    </div>
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