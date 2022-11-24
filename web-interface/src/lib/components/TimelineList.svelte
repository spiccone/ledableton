<script lang="ts">
  import {Device, LayoutDirection as Layout} from "../types";
	import DeviceTimeline from './DeviceTimeline.svelte';

  export let layoutDirection: Layout = Layout.column;
  export let devices: Array<Device> = [];
</script>

<div class="TimelineList {layoutDirection == Layout.column ? 'layout-column' : 'layout-row'}">
  {#each devices as device, i (device.previewElementId)}
    <DeviceTimeline device={device} layoutDirection={layoutDirection} />
  {/each}
</div>

<style>
  .TimelineList {
    display: flex;
    flex: 1 1 auto; 
    height: 100%;
    width: 100%;
  }
  .layout-column {
    flex-direction: column;
    overflow-y: scroll;
  }
  .layout-row {
    flex-direction: row;
    overflow-x: scroll;
  }
</style>