<script lang="ts">
	import type { DeviceEffectDisplay } from "$lib/device";
  import {LayoutDirection as Layout} from "$lib/types";
	import DeviceTimeline from './DeviceTimeline.svelte';
  //import AudioDisplay from './AudioDisplay.svelte';

  export let layoutDirection: Layout = Layout.column;
  export let devices: DeviceEffectDisplay[] = [];
  export let audioMinimapId: string|undefined;
  export let verticalAudio: boolean = false;

</script>

<div class="TimelineList {layoutDirection == Layout.column ? 'layout-column' : 'layout-row'}">
  <div class="list">
    {#each devices as device, i (i)}
      <DeviceTimeline device={device} layoutDirection={layoutDirection} />
    {/each}
  </div>
  <div class="audio-area">
    <!-- <Waveform /> -->
   <!-- <AudioDisplay minimapId={audioMinimapId} vertical={verticalAudio} /> -->
  </div>
</div>

<style>
  .TimelineList {
    display: flex;
    height: 100%;
    width: 100%;
  }
  .layout-column {
    flex-direction: column;
  }
  .layout-row {
    flex-direction: row;
  }
  
  .list {
    display: flex;
    flex: 1 1 auto; 
  }
  .layout-column .list {
    flex-direction: column;
    overflow-y: scroll;
  }
  .layout-row .list {
    flex-direction: row;
    overflow-x: scroll;
  }

  .audio-area {
    flex: 0 0 60px;
  }
</style>