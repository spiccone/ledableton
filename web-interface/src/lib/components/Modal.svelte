<script context="module" lang="ts">
  // for passing focus on to the next Modal in the queue.
  // A module context level object is shared among all its component instances. 
  // [Read More Here](https://svelte.dev/tutorial/sharing-code)
  const modalList: HTMLElement[] = [];
</script>
<script lang="ts">
  import Icon from '@iconify/svelte';
  import roundClose from '@iconify/icons-ic/round-close';
  import {booleanStore} from '../stores';

  const store = booleanStore(false);
  const { isOpen, open, close } = store
  function keydown(e: KeyboardEvent) {
    e.stopPropagation()
    if (e.key === 'Escape') {
      close()
    }
  }
  function transitionend(e: Event) {
    const node = e.target as HTMLElement;
    node.focus();
  }

  function modalAction(node: HTMLElement) {
    const returnFn: {(): void}[] = []
    // for accessibility
    if (document.body.style.overflow !== 'hidden') {
      const original = document.body.style.overflow
      document.body.style.overflow = 'hidden'
      returnFn.push(() => {
        document.body.style.overflow = original
      })
    }
    node.addEventListener('keydown', keydown)
    node.addEventListener('transitionend', transitionend)
    node.focus()
    modalList.push(node)
    returnFn.push(() => {
      node.removeEventListener('keydown', keydown)
      node.removeEventListener('transitionend', transitionend)
      modalList.pop()
      // Optional chaining to guard against empty array.
      modalList[modalList.length - 1]?.focus()
    })
    return {
      destroy: () => returnFn.forEach((fn) => fn()),
    }
  }
</script>

<slot name="trigger" {open}>
  <button on:click={open}>Open</button>
</slot>
{#if $isOpen}
  <!-- svelte-ignore a11y-no-noninteractive-tabindex -->
  <div class="Modal" use:modalAction tabindex="0">
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <div class="backdrop" on:click={close} />
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <div class="content-wrapper">
      <div class="header">
        <slot name="header" {store}/>
        <div class="close" on:click={close}>
          <Icon icon={roundClose} />
        </div>
      </div>
      <div class="content">
        <slot name="content" {store}/>
      </div>
      <div class="footer">
        <slot name="footer" {store}/>
      </div>
    </div>
  </div>
{/if}

<style>
  .Modal {
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;

    align-items: center;
    display: flex;
    justify-content: center;
    z-index: 200;
  }

  .backdrop {
    background: #ccc;
    opacity: 50%;
    height: 100%;
    position: absolute;
    width: 100%;
  }
  .content-wrapper {
    background: #333;
    border-radius: 24px;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    height: 600px;
    padding: 6px 24px 20px;
    position: relative;
    width: 600px;
    z-index: 2;
  }
  .content {
    flex: 1 1 auto;
    height: 100%;
    margin-right: -12px;
    min-width: 300px;
    min-height: 300px;
    overflow: scroll;
    padding-right: 12px;
  }

  .header {
    align-items: center;
    display: flex;
    justify-content: space-between;
  }

  .footer {
    flex: 0 0 auto;
  }

  .close {
    color: var(--color-form-text);
    cursor: pointer;
    flex: 0 0 auto;
    height: 36px;
    width: 36px;
  }
  .close:hover {
    color: var(--color-form-text-hover);
  }
</style>