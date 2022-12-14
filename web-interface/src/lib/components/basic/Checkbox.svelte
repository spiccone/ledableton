<script lang="ts">
  import {createEventDispatcher} from 'svelte';
  export let value: boolean;

  function toggleSelect() {
    value = !value;
  }
  
  const dispatch = createEventDispatcher();
  function onChange() {
    dispatch('change', {});
  }
</script>

<label class="checkbox">
  <input type="checkbox" 
          bind:checked={value}
          on:change={onChange}
          on:keypress={toggleSelect} />
  <slot></slot>
</label>

<style>
  .checkbox {
    align-items: baseline;
    cursor: pointer;
    display: grid;
    font-size: 12px;
    grid-template-columns: 1em auto;
    gap: 12px;
  }
</style>