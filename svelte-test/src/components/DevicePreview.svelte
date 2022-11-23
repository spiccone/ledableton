<script lang="ts">
    import type {Device} from "../types";
    import DeviceColorIndicator from './DeviceColorIndicator.svelte';

    export let device: Device;
</script>

<div class="DevicePreview">
    <div class="device-toolbar">
        <DeviceColorIndicator color={device.color} />
        <div class="device-label">{device.label}</div>
    </div>
</div>

<style>
  .DevicePreview {
      box-sizing: border-box;
      flex: 100 0 auto; /* grow is large to make AddDevice small */
  }
  .device-toolbar {
    align-content: center;
    box-sizing: border-box;
    display: flex;
    padding: 8px;
  }
  .device-label {
    font-size: 14px;
    flex: 1 1 auto;
  }
</style>