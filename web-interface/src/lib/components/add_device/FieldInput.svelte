<script lang="ts">
	import type {Field,  DeviceFieldValue as FieldValue, SimpleField } from "$lib/types";
	import Select from "../Select.svelte";


  export let id = "";
  export let typeOption : FieldValue;
  export let units : {key: string, label: string}[] = [];
  export let field : SimpleField;

</script>

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

<style>
  .field-input {
    flex: 1 1 0;
    min-width: 40px;
    width: 0;
  }

  .field-input.has-select {
    border-radius: 12px 0 0 12px;
    border-right: none;
  }

  .dimension-select {
    --select-border-radius: 0 12px 12px 0;
    --select-border-radius-open: 0 12px 12px 12px;
    --select-font-size: 10px;
    width: fit-content;
  }
</style>