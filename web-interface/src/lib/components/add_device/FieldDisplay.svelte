<script lang="ts">
	import type {Field,  DeviceFieldValue as FieldValue } from "$lib/types";
	import Checkbox from "../basic/Checkbox.svelte";
	import Select from "../Select.svelte";
  import FieldInput from './FieldInput.svelte';

  export let field: Field;
  export let fieldValue: FieldValue;
  export let inputId: string;
  export let units: {key: string, label: string}[] = [];
  export let zIndex = 1;
</script>

<div class="field" style="z-index: {zIndex}">
  {#if field.oneofs.length > 0}
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
  {:else if field.type === "Unit"}
    <Select id={inputId}
            label={field.label}
            items={units}
            bind:selectedIndex={fieldValue.oneofKey} />
  {:else if field.type === "bool"}
    <Checkbox bind:value={fieldValue.booleanValue}>
      {field.label}
    </Checkbox>
  {:else if field.repeated === false}
    <label class="label" for="{inputId}">
      {field.label}
    </label>
    <div class="field-input-container">
      <FieldInput id={inputId}
                  typeOption={fieldValue}
                  units={units}
                  field={field} />
    </div>
  {/if}
</div>

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