<script lang="ts">
  import {onMount} from 'svelte';
  import type {Device} from "../types";
  import DeviceColorPicker from './DeviceColorPicker.svelte';

  export let device: Device;
  export let startLeft = 0;
  export let startTop = 0;
  export let dragging = false;
  export let locked: boolean;

  let element: HTMLElement;
  let hovering = false;
  let drag = false;
  let colorPickerOpen = false;

  let left: number;
  let top: number;

  onMount(() => {
    left = startLeft - element.getBoundingClientRect().left;
    top = startTop - element.getBoundingClientRect().top;
  });

  let xOffset = 0;
  let yOffset = 0;

  function enter() {
    hovering = true;
  }

  function leave() {
    hovering = false;
  }

  function startDragging(event: {clientX: number, 
                                 clientY:number, 
                                 target: HTMLInputElement;}) {
    if (locked) {
      return;
    }
    dragging = true;
    drag = true;
    xOffset = event.clientX;
    yOffset = event.clientY;
    addEventListener('mousemove', onMouseMove);
    addEventListener('mouseup', onMouseUp);
  }

  function onMouseMove(event: MouseEvent) {
    if(colorPickerOpen) {
      onMouseUp();
      return;
    }
    event.preventDefault();
    left += event.clientX - xOffset;
    top += event.clientY - yOffset;
    xOffset = event.clientX;
    yOffset = event.clientY;
    keepOnPage();
  }

  function onMouseUp() {
    removeEventListener('mousemove', onMouseMove);
    removeEventListener('mouseup', onMouseUp);
    const rect = element.getBoundingClientRect();
    startLeft = rect.x;
    startTop = rect.y;
    dragging = false;
    drag = false;
  }

  function keepOnPage() {
    const rect = element.getBoundingClientRect();
    if(rect.left < 0) {
      startLeft = 0;
      left -= rect.left;
    }
    if(rect.top < 0) {
      startTop = 0;
      top -= rect.top;
    }
  }

</script>

<div class="DraggablePreview {drag || (hovering && !locked) ? 'hovering' : ''}"
    bind:this={element}
    on:mouseenter={enter}
    on:mouseleave={leave}
    on:mousedown={startDragging}
    style="left: {left}px; top: {top}px;">
  <div class="device-toolbar">
    <DeviceColorPicker 
      bind:open={colorPickerOpen}
      bind:color={device.color} />
    <div class="device-label">{device.label}</div>
  </div>
</div>

<style>
  .DraggablePreview {
    cursor: move;
    border: 2px solid rgba(0,0,0,0);
    border-radius: 6px;
    height: 300px;
    padding: 6px;
    position: relative;
    width: 300px;
  }
  .DraggablePreview.hovering {
    border-color: var(--color-border);
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