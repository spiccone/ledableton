<script lang="ts">
  import {Device, LayoutDirection as Layout} from "../types";
	import DeviceTimeline from './DeviceTimeline.svelte';

  export let layoutDirection: Layout = Layout.column;
  export let devices: Array<Device> = [];
</script>

<div class="TimelineList {layoutDirection == Layout.column ? 'layout-column' : 'layout-row'}">
  {#each devices as device, i (device.previewElementId)}
    <DeviceTimeline device={device} />
  {/each}
</div>

<style>
  .TimelineList {
    display: flex;
    flex: 1 1 auto; 
    flex-direction: column;
    height:100%;
    overflow-y: scroll;
  }
</style>