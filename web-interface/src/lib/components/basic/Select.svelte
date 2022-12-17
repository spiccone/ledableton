<script lang="ts">
  import {onMount, createEventDispatcher} from 'svelte';

  export let items : {key : string, label : string}[] = [];
  export let selectedItem : {key : string, label : string} | undefined | null = undefined;
  export let selectedIndex : number | null = 0;
  export let showArrow = true;
  export let arrowRight = true;

  let open = false;
  let activeIndex : number | null = null;

  let focusedElements: boolean[] = Array(items.length);

  const dispatch = createEventDispatcher();

  onMount(() => {
    if (!selectedIndex && !selectedItem && items.length > 0) {
      selectedIndex = 0;
      selectItem(0);
    } else if (selectedIndex && selectedIndex < items.length) {
      selectItem(selectedIndex);
    }
  });

  function toggleSelect() {
    if (open) {
      closeSelect();
    } else {
      openSelect();
    }
  }

  function openSelect() {
    open = true;
  }

  function handleWindowClick(e : MouseEvent) {
    if (open) {
      closeSelect();
    }
  }

  function closeSelect() {
    if (activeIndex !== null) {
      focusedElements[activeIndex] = false;
      activeIndex = null;
    }
    open = false;
  }

  function selectItem(index : number) {
    selectedIndex = index;
    selectedItem = items[index];
    closeSelect();
    dispatch('select', {
			selectedIndex: selectedIndex
		});
  }

  function keydown(e : KeyboardEvent) {
    if (open || e.key !== "Tab") {
      e.preventDefault();
      e.stopPropagation();
    }
    if (items.length == 0) {
      return;
    }

    if (e.shiftKey && e.key === "Tab" && activeIndex != null) {
      onArrowUp(false);
      return;
    }
    switch (e.key) {
      case ("ArrowDown"):
        onArrowDown(true);
        break;
      case ("Tab"):
        onArrowDown(false);
        break;
      case ("ArrowUp"):
        onArrowUp(true);
        break;
      case ("Enter"):
        onEnter();
        break;
      case ("Escape"):
        closeSelect();
        break;
      case (" "):
        if (open === false) {
          onArrowDown(true);
        }
    }
  }

  function onEnter() {
    if (!open) {
      onArrowDown(true);
    } else if (activeIndex != null) {
      selectItem(activeIndex);
    }
  }

  function onArrowDown(open : boolean) {
    if (open) {
      openSelect();
    }
    if (activeIndex === null) {
      activeIndex = 0;
    } else {
      focusedElements[activeIndex] = false;
      if (++activeIndex >= items.length) {
        activeIndex = items.length - 1;
      }
    }
    focusedElements[activeIndex] = true;
  }

  function onArrowUp(open : boolean) {
    if (open) {
      openSelect();
    }
    if (activeIndex === null) {
      activeIndex = items.length - 1;
    } else {
      focusedElements[activeIndex] = false;
      if (--activeIndex < 0) {
        activeIndex = 0;
      }
    }
    focusedElements[activeIndex] = true;
  }
</script>

<svelte:window on:mousedown={handleWindowClick} />

<div class="Select {open ? 'open' : 'closed'}
                   {showArrow ? 'has-arrow' : ''}
                   {arrowRight ? 'arrow-right' : ''}">
  <div class="select-box">
    <div class="item-spacer-list">
      {#each items as item, i ("spacer_" + i)}
        <div class="item-spacer">
          <div class="item-label">
            {item.label}
          </div>
        </div>
      {/each}
    </div>
    <div class="select-list-container"
         role="button"
         on:keydown={keydown}
         tabindex=0>
      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <div class="selected-list-item"
           on:click={toggleSelect}>
        <div class="item-label">
          {selectedItem?.label}
        </div>
      </div>
      <div class="select-list">
        {#each items as item, i (item.key)}
          <div class="select-list-item" 
               class:focused={focusedElements[i]}
               on:mousedown={() => selectItem(i)}>
            <div class="item-label">
              {item.label}
            </div>
          </div>
        {/each}
      </div>
    </div>
  </div>
</div>

<style>
  .Select {
    position: relative;
    font-size: var(--select-font-size, 14px);
    margin: var(--select-margin, 0);
    width: 100%;
  }
  .Select:focus-within {
    z-index: 20;
  }
  
  .select-box {
    position: relative;
  }

  .select-list-container,
  .item-spacer-list {
    border-style: solid;
    border-width: var(--select-border-width, 1px);
    border-radius: var(--select-border-radius, 12px);
    box-sizing: border-box;
    width: var(--select-width, 100%);
  }
  .select-list-container {
    border-color: var(--select-border-color, var(--color-input-bg-hover));
    display: flex;
    flex-direction: column;
    overflow: hidden;
    position: absolute;
    max-height: var(--select-height, 36px);
    top: 0;
    transition: max-height 0.15s ease-out, border-radius 0.5s ease-out;
    z-index: 1;
  }
  .item-spacer-list {
    display: flex;
    flex-direction: column;
    height: var(--select-height, 36px); 
    visibility: hidden;
  }
  .open .select-list-container {
    border-radius: var(--select-border-radius-open, 12px);
    max-height: 400px;
    transition: max-height 0.25s ease-in;
    z-index: 40;
  }

  .select-list {
    height: 100%;
    overflow-y: scroll;
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
    padding: var(--select-padding, 0 12px);
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .has-arrow .selected-list-item,
  .has-arrow .item-spacer {
    padding-right: var(--select-arrow-gap, 34px);
  }

  .open .selected-list-item {
    pointer-events: none;
  }

  .select-list-item {
    color: #ccc;
  }

  .selected-list-item:hover,
  .select-list-item:hover,
  .select-list-item.focused {
    background: var(--select-color-bg-hover, var(--color-input-bg-hover));
  }

  .selected-list-item:active,
  .select-list-item:active {
    background: var(--select-color-bg-active, var(--color-input-bg-active));
  }

  .selected-list-item {
    color: var(--select-color, var(--color-input-text));
  }
  .closed .selected-list-item:hover {
    color: var(--select-color-hover, var(--color-input-text-hover));
  }

  .item-label {
    display: block;
    overflow: hidden;
    text-overflow: ellipsis;
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
