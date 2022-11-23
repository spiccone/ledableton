<script lang="ts">
  export let color: string;

  let open: boolean = false;

  export const colorOptions: Array<string> = 
    ['#F44336', '#FF6900', '#FCB900', '#CDDC39', '#8BC34A',  
    '#2CCCE4','#64B5F6', '#9575CD', '#BA68C8', '#F06292'];

  function openPicker() {
    open = true;
  }

  function closePicker() {
    open = false;
  }

  function selectColor(colorIndex: number) {
    color = colorOptions[colorIndex];
  }
</script>

<div class="DeviceColorPicker {open ? 'picker-open' : ''}">
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <div class="color-icon" style="background: {color}" on:click={openPicker}></div>
  <div class="color-picker">
    <div class="pointer"></div>
    <div class="picker-content">
      {#each colorOptions as colorOption, i (colorOption)}
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <div 
          class="color-option {colorOption === color ? 'selected' : ''}" 
          style="color: {colorOption}" 
          on:click={() => selectColor(i)}>
        </div>
      {/each}
    </div>
  </div>
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <div class="cover" on:click={closePicker}></div>
</div>

<style>
  .color-icon {
    border-radius: 100%;
    border: none;
    flex: 0 0 auto;
    height: 14px;
    width: 14px;
    margin: 0 10px 10px 0;
    cursor: pointer;
    z-index: 0;
    position: relative;
  }
  .picker-open .color-icon {
    z-index: 1;
  }

  .color-picker {
    box-shadow: rgb(0 0 0 / 25%) 0px 1px 4px;
    display: none;
    margin: -28px 0 0 -4px;
  }
  .picker-open .color-picker {
    display: block;
  }

  .pointer {
    background: #fff;
    border-radius: 11px 11px 0 0;
    width: 22px;
    height: 24px;
  }
  
  .picker-content {
    background: #fff;
    border-radius: 0 6px 6px 6px;
    display: flex;
    flex-wrap: wrap;
    column-gap: 7px;
    row-gap: 7px;
    padding: 14px;
    position: absolute;
    width: 178px;
    z-index: 3;
  }

  .color-option {
    background: currentcolor;
    border-radius: 4px;
    cursor: pointer;
    height: 30px;
    width: 30px;
  }
  .color-option.selected {
    box-shadow: currentColor 0 0 4px 0px;
  }

  .cover {
    display: none;
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
  }
  .picker-open .cover {
    display: block;
    z-index: 2;
  }
</style>