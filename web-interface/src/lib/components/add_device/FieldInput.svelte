<script lang="ts">
	import type {Dimension, FieldValue, UnitValue, Value} from "$lib/device";
	import Labeled from "../basic/Labeled.svelte";
	import Select from "../basic/Select.svelte";

  export let id = "";
  export let fieldValue : FieldValue;
  export let units : {key: string, label: string}[] = [];

  let dimension : Dimension | null = null;
  let unit : UnitValue | null = null;
  let value : Value | null = null;

  checkTypes();
  
  $: fieldValue, checkTypes();

  function checkTypes() {
    if (typeof (fieldValue) === "object") {
      dimension = fieldValue as Dimension;
      if (dimension?.dimension?.value !== undefined && dimension.unit?.value !== undefined) {
        unit = dimension.unit;
        return;
      }
      dimension = null;
      unit = fieldValue as UnitValue;
      if (unit?.type !== undefined && unit.type === "Unit" && unit.value !== undefined) {
        return;
      }
      unit = null;
      value = fieldValue as Value;
      if (value.type === undefined || value.value === undefined) {
        throw "FieldValue invalid";
      }
    } else {
      throw "FieldValue should be object";
    }
  }

</script>

<Labeled inputId={id}>
  <span slot="label"><slot name="label"></slot></span>
  <span class="field-input-container" slot="content">
    {#if dimension && unit}
      <input id={id} 
          class="field-input has-select"
          type="number"
          bind:value={dimension.dimension.value}
          size=10 />
      <div class="dimension-select">
        <Select items={units} 
                bind:selectedIndex={unit.value}
                showArrow={false} />
      </div>
    {:else if unit}
      <Select items={units} 
              bind:selectedIndex={unit.value} />
    {:else if value}
     <input id={id} 
          class="field-input"
          type="number"
          bind:value={value.value}
          size=10 />
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
    border-radius: var(--corner-input-single, 12px) 0 0 var(--corner-input-single, 12px);
    border-right: none;
  }

  .field-input:focus-visible {
    z-index: 2;
  }

  .dimension-select {
    --select-border-radius: 0 var(--corner-input-single, 12px) var(--corner-input-single, 12px) 0;
    --select-border-radius-open: 0 
                                 var(--corner-input-single, 12px)
                                 var(--corner-input-single, 12px)
                                 var(--corner-input-single, 12px);
    --select-font-size: 10px;
    width: fit-content;
  }
</style>