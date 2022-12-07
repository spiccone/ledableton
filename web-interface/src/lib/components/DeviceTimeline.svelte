<script lang="ts">
  import {ColorLevel, getColorLevel} from "../helper-functions";
  import {LayoutDirection as Layout, type Device} from "../types";

  export let device: Device;
  export let layoutDirection: Layout;
</script>

<div class="DeviceTimeline {layoutDirection === Layout.column ? 'horizontal' : 'vertical'}">
  <div class="device-label-container" style="background: {device.color}">
    <div 
      class="device-label" 
      style="color: {getColorLevel(device.color) === ColorLevel.light ? '#000' : '#fff'}">
        {device.label}
    </div>
  </div>
</div>

<style>
  .DeviceTimeline {
    box-sizing: border-box;
    display: flex;
    flex: 1 0 auto;
    flex-direction: row;
    height: 30px;
    width: 100%;
  }
  .horizontal {
    border-bottom: 2px solid var(--color-border);
    height: 30px;
    width: 100%;
  }
  .vertical {
    border-right: 2px solid var(--color-border);
    width: 80px;
    height: 100%;
  }
  .DeviceTimeline .device-label-container {
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
  }
  .horizontal .device-label-container {
    height: 100%;
    width: 60px;
    border-right: 5px solid #fff;
  }
  .vertical .device-label-container {
    width: 100%;
    height: 24px;
    border-bottom: 5px solid #fff;
  }

  .DeviceTimeline .device-label {
    color: #000;
    font-size: 10px;
    flex: 0 1 auto;
    max-width: 100%;
    overflow: hidden;
    padding: 0 4px;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .vertical .device-label {
    transform: rotate(-90deg);
    height: 10px;
  }

  .waveform {
    height: 60px;
    width: 100%;
  }

</style>