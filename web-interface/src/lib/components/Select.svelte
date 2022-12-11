<script lang="ts">
  import {onMount} from 'svelte';

  export let items : {value : string, label : string}[] = [];
  export let selectedValue : string;

  let open = false;
  let selectedLabel = items.find(o => o.value === selectedValue)?.label;

  let selectedItemElement : HTMLElement;
  let selectedListItemElement : HTMLElement;

  function openSelect() {
    open = true;
  }

  function closeSelect() {
    open = false;
  }

  function selectItem(value : string, label : string) {
    selectedItemElement.innerHTML = label;
    selectedListItemElement.innerHTML = label;
    selectedValue = value;
    selectedLabel = label;
    open = false;
  }
</script>

<div class="Select {open ? 'open' : 'closed'}">
  <select class="select" bind:value={selectedValue}>
    {#each items as item}
      <option value={item.value}>
        {item.label}
      </option>
    {/each}
  </select>
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <div class="selected-item" bind:this={selectedItemElement} on:click={openSelect}>{selectedLabel}</div>
  <div class="select-list">
    <div class="selected-list-item" bind:this={selectedListItemElement}>{selectedLabel}</div>
    {#each items as item}
      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <div class="select-list-item" on:click={() => selectItem(item.value, item.label)}>
        {item.label}
      </div>
    {/each}
  </div>
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <div class="cover" on:click={closeSelect}></div>
</div>

<style>
  .Select {
    position: relative;
    width: 100%;
  }

  .select {
    display: none;
  }

  .selected-item {
    background: #f00;
    border: 1px solid #444;
    border-radius: 6px;
    box-sizing: border-box;
    color: #aaa;
    cursor: pointer;
    height: 36px;
    padding: 8px 12px;
    position: relative;
  }

  .select-list {
    border: 1px solid #444;
    border-radius: 6px;
    box-sizing: border-box;
    overflow: hidden;
    position: absolute;
    pointer-events: none;
    max-height: 36px;
    top: 0;
    width: 100%;
    transition: max-height 0.15s ease-out;
    z-index: 2;
  }
  .open .select-list {
    max-height: 400px;
    overflow-y: scroll;
    pointer-events: all;
    transition: max-height 0.25s ease-in;
  }

  .select-list-item,
  .selected-list-item {
    background: #222;
    padding: 8px 12px;
  }

  .select-list-item {
    cursor: pointer;
  }
  .select-list-item:hover {
    background: #444;
  }

  .selected-list-item {
    color: #aaa;
  }

  .cover {
    display: none;
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 1;
  }
  .open .cover {
    display: block;
  }
</style>
