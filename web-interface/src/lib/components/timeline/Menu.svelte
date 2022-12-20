<script lang="ts">
	import type { DeviceDisplay } from "$lib/device";
  import {LayoutDirection as Layout} from "$lib/types";
  import DeviceSelection from "./DeviceSelection.svelte";

  export let devices: DeviceDisplay[] = [];
  export let layoutDirection: Layout = Layout.column;
  export let minimapId: string|undefined;
  //export let CurrentEffect: Effect|null = null;

</script>

<div class="Menu {layoutDirection == Layout.column ? 'layout-column' : 'layout-row'}">
  <div class="controls"></div>
  <DeviceSelection bind:devices={devices} />
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
    border-top: 2px solid var(--color-border);
    flex: 0 0 20px;
  }
</style>