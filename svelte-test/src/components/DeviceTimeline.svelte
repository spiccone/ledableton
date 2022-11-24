<script lang="ts">
  import {ColorLevel, getColorLevel} from "../helper-functions";
  import type {Device} from "../types";

  export let device: Device;
</script>

<div class="DeviceTimeline">
  <div class="device-label-container" style="background: {device.color}">
    <div 
      class="device-label" 
      style="color: {getColorLevel(device.color) == ColorLevel.light ? '#000' : '#fff'}">
      {device.label}
    </div>
  </div>
</div>

<style>
  .DeviceTimeline {
    border-bottom: 4px solid var(--border-color);
    flex: 1 0 auto;
    height: 80px;
    width: 100%;
  }

  .DeviceTimeline .device-label-container {
    align-items: center;
    border-right: 5px solid #fff;
    display: flex;
    height: 100%;
    justify-content: center;
    overflow: hidden;
    width: 24px;
  }

  .DeviceTimeline .device-label {
    color: #000;
    flex: 0 1 auto;
    font-size: 10px;
    height: 10px;
    transform: rotate(-90deg);
    white-space: nowrap;
}

</style>