<script lang="ts">
  import {onMount} from 'svelte';

  export let items : {key : string, label : string}[] = [];
  export let selectedItem : {key : string, label : string} | undefined;
  export let id = "";

  let open = false;
  let selectedLabel = selectedItem ? selectedItem.label : "";

  let selectedListItemElement : HTMLElement;

  function toggleSelect() {
    open = !open;
  }

  function closeSelect() {
    open = false;
  }

  function selectItem(key : string, label : string) {
    selectedListItemElement.innerHTML = label;
    selectedItem = items.find(o => o.key === key);
    selectedLabel = label;
    open = false;
  }
</script>

<div id={id} class="Select {open ? 'open' : 'closed'}">
  <div class="item-spacer"></div>
  <div class="select-list">
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <div class="selected-list-item" bind:this={selectedListItemElement} on:click={toggleSelect}>{selectedLabel}</div>
    {#each items as item}
      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <div class="select-list-item" on:click={() => selectItem(item.key, item.label)}>
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
    font-size: 14px;
    width: 100%;
  }

  .item-spacer {
    height: 36px;
  }

  .select-list {
    border: 1px solid var(--color-form-bg-hover);
    border-radius: 12px;
    box-sizing: border-box;
    overflow: hidden;
    position: absolute;
    max-height: 36px;
    top: 0;
    width: 100%;
    transition: max-height 0.15s ease-out;
    z-index: 2;
  }
  .open .select-list {
    max-height: 400px;
    overflow-y: scroll;
    transition: max-height 0.25s ease-in;
  }

  .select-list-item,
  .selected-list-item {
    align-items: center;
    background: var(--color-form-bg);
    box-sizing: border-box;
    display: flex;
    height: 36px;
    padding: 0 12px;
    cursor: pointer;
  }

  .select-list-item {
    color: #ccc;
  }
  .select-list-item:hover {
    background: var(--color-form-bg-hover);
  }

  .selected-list-item {
    color: var(--color-form-text);
  }
  .closed .selected-list-item:hover {
    color: var(--color-form-text-hover);
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

  .selected-list-item::after {
    border: 2px solid #999;;
    border-radius: 1px;
    border-right: 0;
    border-top: 0;
    content: " ";
    display: block;
    height: 6px;
    pointer-events: none;
    position: absolute;
    right: 1em;
    top: 11px;
    transform: rotate(-45deg);
    transform-origin: 3px 6px;
    transition: transform 0.5s ease;
    width: 6px;
  }
  .selected-list-item:hover::after {
    border-color: #ccc;
  }
  .open .selected-list-item::after {
    -webkit-transform: rotate(135deg);
    transform: rotate(135deg);
  }
</style>
