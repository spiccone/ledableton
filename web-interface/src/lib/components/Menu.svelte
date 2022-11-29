<script lang="ts">
  import {Device, LayoutDirection as Layout} from "../types";
	import DeviceTimeline from './DeviceTimeline.svelte';
  import AudioDisplay from './AudioDisplay.svelte';

  export let layoutDirection: Layout = Layout.column;
  export let minimapId: string|undefined;

</script>

<div class="Menu {layoutDirection == Layout.column ? 'layout-column' : 'layout-row'}">
  <div class="controls"></div>
  <div id="{minimapId}" class="audio-minimap"></div>
</div>

<style>
  .Menu {
    display: flex;
    flex-direction: column;
    height: 100%;
  }
  .controls {
    flex: 1 1 auto;
  }
  .audio-minimap {
    flex: 0 0 20px;
  }
</style>