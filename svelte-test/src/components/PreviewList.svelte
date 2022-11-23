<script lang="ts">
  import {Device, LayoutDirection} from "../types";
	import DevicePreview from './DevicePreview.svelte';
  import GrabBar from './GrabBar.svelte';

  export let layoutDirection: LayoutDirection = LayoutDirection.row;
  export let devices: Array<Device> = [];

  const previewSizes: number[] = new Array(devices.length).fill(300);

  const layoutClassName = layoutDirection == LayoutDirection.row ? 'layout-row' : 'layout-column';
</script>

<div class="PreviewList {layoutClassName}">
  {#each devices as device, i (device.previewElementId)}
    <div class="device-preview-container" style="min-width: {previewSizes[i]}px">
      <DevicePreview device={device} />
    </div>
    <GrabBar bind:dimension={previewSizes[i]} layoutDirection={layoutDirection} />
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
</style>