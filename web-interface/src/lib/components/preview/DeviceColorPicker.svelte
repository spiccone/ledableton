<script lang="ts">
  import {ColorLevel, getColorLevel} from "$lib/helper-functions";

  export let color: string;
  export let open = false;
  export let locked = false;

  let customColor: string = color.slice(1);
  let inputColor = color;
  let inputPrefixColor =  color;
  let colorLevel = getColorLevel(color);

  const colorRegEx = /^([0-9a-f]{3}){1,2}$/i;
  export const colorOptions: Array<string> = 
    ['#F44336', '#FF6900', '#FCB900', '#CDDC39', '#8BC34A',  
    '#2CCCE4','#8F7FD7', '#C579d2', '#F78DA7'];

  function openPicker(event: MouseEvent) {
    event.preventDefault();
    open = true;
  }

  function closePicker() {
    open = false;
  }

  function selectColor(colorIndex: number) {
    color = colorOptions[colorIndex];
    customColor = color.slice(1);
    inputColor = color;
    inputPrefixColor = color;
    colorLevel = getColorLevel(color);
  }

  function handleColorInput() {
    if (colorRegEx.test(customColor)) {
      color = '#' + customColor;
      inputColor = color;
      inputPrefixColor = color;
      colorLevel = getColorLevel(color);
    } else {
      inputColor = '#F00';
      inputPrefixColor = '#CCC';
    }
  }
</script>

<div class="DeviceColorPicker" class:open class:locked>
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <div class="color-icon" style="background: {color}" on:click={openPicker}></div>
  <div class="color-picker">
    <div class="pointer"></div>
    <div class="picker-content">
      {#each colorOptions as colorOption, i (colorOption)}
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <button 
          class="color-option {colorOption === color ? 'selected' : ''}" 
          style="color: {colorOption}" 
          on:click={() => selectColor(i)}>
        </button>
      {/each}
      <div class="custom-color" style="color: {inputColor}">
        <div 
          class="color-input-prefix"
          style="
            background-color: {inputPrefixColor};
            color: {
              colorLevel == ColorLevel.light ? '#000' : '#fff'}">#</div>
        <input 
          class="color-input" 
          bind:value="{customColor}"
          on:input={() => handleColorInput()}
          on:change={() => customColor = color.slice(1)}
          maxlength="6"/>
      </div>
    </div>
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <div class="cover" on:click={closePicker}></div>
  </div>
</div>

<style>
  .DeviceColorPicker {
    height: 14px;
    margin: -2px 8px 0 0;
    position: relative;
    width: 14px;
  }
  .DeviceColorPicker.locked {
    pointer-events: none;
  }
  .DeviceColorPicker.open {
    z-index: 10;
  }
  .color-icon {
    border-radius: 100%;
    border: none;
    flex: 0 0 auto;
    height: 14px;
    width: 14px;
    margin: 0 10px 10px 0;
    cursor: url("../../static/eye-dropper.cur") 0 16, pointer;
    position: relative;
    z-index: 3;
  }
  .open .color-icon {
    pointer-events: none;
  }

  .color-picker {
    margin: -28px 0 0 -4px;
    overflow:hidden;
    position: absolute;
    transition: width .19s ease-out;
    width: 0;
    z-index: 2;
  }
  .open .color-picker {
    transition: width .23s ease-out;
    width: 245px;
  }
  .pointer {
    background: #fff;
    border-radius: 11px 11px 0 0;
    cursor: default;
    height: 24px;
    position: relative;
    width: 22px;
    z-index: 2;
  }
  .picker-content {
    background: #fff;
    border-radius: 0 6px 6px 6px;
    display: flex;
    cursor: default;
    flex-wrap: wrap;
    column-gap: 7px;
    row-gap: 7px;
    padding: 14px;
    position: relative;
    width: 215px;
    z-index: 2;
  }

  .color-option {
    background: currentcolor;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    height: 30px;
    width: 30px;
    transition: border-radius .2s;
  }
  .color-option:hover,
  .color-option:focus {
    box-shadow: currentColor 0 0 4px 0px
  }
  .color-option.selected {
    border-radius: 50%;
    box-shadow: none;
    cursor: default;
  }

  .custom-color {
    border: 1px solid currentColor;
    border-radius: 4px;
    box-sizing: border-box;
    display: flex;
    height: 30px;
    width: 104px;
  }
  .custom-color:focus-within {
    box-shadow: currentColor 0 0 4px 0px
  }

  .color-input-prefix {
    background: #eee;
    border-radius: 3px 0 0 3px;
    box-sizing: border-box;
    color: #fff;
    flex: 0 0 auto;
    height: 100%;
    width: 28px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2px 1px 0 0;
  }
  .color-input {
    background: none;
    border: none;
    box-sizing: border-box;
    color: #333;
    flex: 0 1 auto;
    font-family: monospace;
    height: 100%;
    min-width: 30px;
    padding-left: 6px;
    text-transform: uppercase;
  }
  .color-input:focus{
    outline: none;
  }
  
  .cover {
    display: none;
    cursor: url('../../static/close-palette.png') 7 7, auto;
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
  }
  .open .cover {
    display: block;
    z-index: 1;
  }
</style>