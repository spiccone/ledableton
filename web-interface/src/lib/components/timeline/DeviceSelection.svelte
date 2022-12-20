<script lang="ts">

import type {DeviceDisplay} from "$lib/device";

export let devices: Array<DeviceDisplay> = [];

</script>

<div class="DeviceSelection">
  {#each devices as device, i (i)}
    <!-- TODO: Check if device supports the current effect. -->
    <div class="device-button" style="background: {device.color}"></div>
  {/each}
</div>

<style>
  .DeviceSelection {
    display: flex;
    flex-direction: row;
    padding: 20px 8px;
  }

  .device-button {
    border: 6px solid #222;
    border-radius: 50%;
    cursor: pointer;
    height: 32px;
    margin: 0 12px;
    width: 32px;
  }
  .device-button:hover {
    outline: 4px solid var(--color-border);
  }
</style>