<script lang="ts">
	import type {Field,  DeviceFieldValue as FieldValue, SimpleField } from "$lib/types";
	import Select from "../Select.svelte";
  import FieldInput from './FieldInput.svelte';
	import BucketedVariableColumn from './BucketedVariableColumn.svelte';

  export let field: Field;
  export let fieldValue: FieldValue;
  export let inputId: string;
  export let units: {key: string, label: string}[] = [];
  export let zIndex: number;

</script>

{#if field.type === "Type"}
<slot name="type-field"/>
{:else if field.type === "VariableColumn"}
  <BucketedVariableColumn columnField={fieldValue} />
{:else if field.oneofs.length > 0}
  <div class="field" style="z-index: {zIndex}">
    <div class="label">
      <Select items={field.oneofs} 
              bind:selectedIndex={fieldValue.oneofKey}
              arrowRight={false} />
    </div>
    <div class="field-input-container">
      <FieldInput id={inputId}
                  typeOption={fieldValue}
                  units={units}
                  field={field.oneofs[fieldValue.oneofKey]} />
    </div>
  </div>
{:else if field.type === "Unit"}
  <div class="field" style="z-index: {zIndex}">
    <label class="label" for={inputId}>
      {field.label}
    </label>
    <Select id={inputId}
            items={units}
            bind:selectedIndex={fieldValue.oneofKey} />
  </div>
{:else if field.repeated === false}
  <div class="field" style="z-index: {zIndex}">
    <label class="label" for="{inputId}">
      {field.label}
    </label>
    <div class="field-input-container">
      <FieldInput id={inputId}
                  typeOption={fieldValue}
                  units={units}
                  field={field} />
    </div>
  </div>
{/if}

<style>
  .label {
    --select-arrow-size: 4px;
    --select-arrow-gap: 36px;
    --select-arrow-margin: -2px 10px 0;
    --select-border-width: 0;
    --select-color: var(--color-text);
    --select-color-hover: #fff;
    --select-color-bg: var(--color-bg-main);
    --select-font-size: 12px;
    --select-height: 20px;
    --select-margin: -3px 0 -3px -10px;
    font-size: 12px;
    margin: 0 0 4px 4px;
  }

  .field {
    display: flex;
    flex: 1 0 40px;
    flex-direction: column;
    max-width: 127px;
  }

  .field-input-container {
    display: flex;
    flex-direction: row;
  }
</style>