<script lang="ts">
  import {onMount, createEventDispatcher} from 'svelte';

  export let items : {key : string, label : string}[] = [];
  export let selectedItem : {key : string, label : string} | undefined | null = undefined;
  export let selectedIndex : number | null = 0;
  export let label : string | null = null;
  export let id = "";
  export let showArrow = true;
  export let arrowRight = true;

  let open = false;

  onMount(() => {
    if (!selectedIndex && !selectedItem && items.length > 0) {
      selectedIndex = 0;
      selectItem(0);
    } else if (selectedIndex && selectedIndex < items.length) {
      selectItem(selectedIndex);
    }
  });

  function toggleSelect() {
    open = !open;
  }

  function closeSelect() {
    open = false;
  }
  
  const dispatch = createEventDispatcher();

  function selectItem(index : number) {
    selectedIndex = index;
    selectedItem = items[index];
    open = false;
    dispatch('select', {
			selectedIndex: selectedIndex
		});
  }
</script>

<div class="Select">
  {#if label}
    <div class="label">
      {label}
    </div>
  {/if}
  <div id={id} class="select-box {open ? 'open' : 'closed'}
                    {showArrow ? 'has-arrow' : ''}
                    {arrowRight ? 'arrow-right' : ''}">
    <div class="item-spacer-list">
      {#each items as item, i (id + "_spacer_" + i)}
        <div class="item-spacer">
          {item.label}
        </div>
      {/each}
    </div>
    <div class="select-list">
      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <div class="selected-list-item {id}" 
          on:click={toggleSelect}>
        {selectedItem?.label}
      </div>
      {#each items as item, i (id + "_select_" + i)}
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <div class="select-list-item" on:click={() => selectItem(i)}>
          {item.label}
        </div>
      {/each}
    </div>
  </div>
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <div class="cover" on:click={closeSelect}></div>
</div>

<style>
  .Select {
    position: relative;
    font-size: var(--select-font-size, 14px);
    margin: var(--select-margin, 0);
    width: 100%;
  }
  
  .select-box {
    position: relative;
  }

  .label {
    font-size: 12px;
    margin: 0 0 4px 4px;
  }

  .select-list {
    border-color: var(--select-border-color, var(--color-form-bg-hover));
    border-style: solid;
    border-width: var(--select-border-width, 1px);
    border-radius: var(--select-border-radius, 12px);
    box-sizing: border-box;
    overflow: hidden;
    position: absolute;
    max-height: var(--select-height, 36px);
    top: 0;
    transition: max-height 0.15s ease-out, border-radius 0.5s ease-out;
    width: var(--select-width, auto);
    z-index: 1;
  }
  .open .select-list {
    border-radius: var(--select-border-radius-open, 12px);
    max-height: 400px;
    overflow-y: scroll;
    transition: max-height 0.25s ease-in;
    z-index: 3;
  }
  .select-list-item,
  .selected-list-item,
  .item-spacer {
    align-items: center;
    background: var(--select-color-bg, #222);
    box-sizing: border-box;
    cursor: pointer;
    display: flex;
    min-height: var(--select-height, 36px);
    overflow: hidden;
    padding: 0 12px;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .has-arrow .select-list-item,
  .has-arrow .selected-list-item,
  .has-arrow .item-spacer {
    padding-right: var(--select-arrow-gap, 34px);
  }
  .item-spacer-list {
    border-style: solid;
    border-width: var(--select-border-width, 1px);
    border-radius: var(--select-border-radius, 12px);
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    width: var(--select-width, auto);
    height: var(--select-height, 36px); 
    visibility: hidden;
  }

  .select-list-item {
    color: #ccc;
  }
  .select-list-item:hover {
    background: var(--color-form-bg-hover);
  }

  .selected-list-item {
    color: var(--select-color, var(--color-form-text));
  }
  .closed .selected-list-item:hover {
    color: var(--select-color-hover, var(--color-form-text-hover));
  }

  .cover {
    display: none;
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 2;
  }
  .open .cover {
    display: block;
  }

  .has-arrow .selected-list-item::after {
    border: 2px solid #999;;
    border-radius: 1px;
    border-right: 0;
    border-top: 0;
    content: " ";
    display: block;
    height: var(--select-arrow-size, 6px);
    margin: var(--select-arrow-margin, 0 0 0 10px);
    pointer-events: none;
    position: relative;
    transform: rotate(-45deg);
    transform-origin: 40% 60%;
    transition: transform 0.5s ease;
    width: var(--select-arrow-size, 6px);
  }
  .has-arrow.arrow-right .selected-list-item::after {
    content: " ";
    position: absolute;
    right: 1em;
    top: 12px;
  }
  .has-arrow .selected-list-item:hover::after {
    border-color: #ccc;
  }
  .has-arrow.open .selected-list-item::after {
    -webkit-transform: rotate(135deg);
    transform: rotate(135deg);
  }
</style>
