<script lang="ts">
	import type {DeviceFieldValue as FieldValue, SimpleField } from "$lib/types";
	import Labeled from "../basic/Labeled.svelte";
	import Select from "../basic/Select.svelte";


  export let id = "";
  export let typeOption : FieldValue;
  export let units : {key: string, label: string}[] = [];
  export let field : SimpleField;

</script>

<Labeled inputId={id}>
  <span slot="label"><slot name="label"></slot></span>
  <span class="field-input-container" slot="content">
    <input id={id} 
            class="field-input{field.type === 'Dimension' ? ' has-select' : ''}"
            type="number"
            bind:value= {typeOption.value}
            size=10 />
    {#if field.type === "Dimension"}
      <div class="dimension-select">
        <Select id={id + "_units"} 
                items={units} 
                bind:selectedIndex={typeOption.unitKey}
                showArrow={false} />
      </div>
    {/if}
  </span>
</Labeled>

<style>
  .field-input-container {
    display: flex;
    flex-direction: row;
  }
  .field-input {
    flex: 1 1 0;
    min-width: 40px;
    width: 0;
  }

  .field-input.has-select {
    border-radius: var(--corner-input, 12px) 0 0 var(--corner-input, 12px);
    border-right: none;
  }

  .field-input:focus-visible {
    z-index: 2;
  }

  .dimension-select {
    --select-border-radius: 0 var(--corner-input, 12px) var(--corner-input, 12px) 0;
    --select-border-radius-open: 0 var(--corner-input, 12px) var(--corner-input, 12px) var(--corner-input, 12px);
    --select-font-size: 10px;
    width: fit-content;
  }
</style>