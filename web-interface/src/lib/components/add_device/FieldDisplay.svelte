<script lang="ts">
	import type {Field,  DeviceFieldValue as FieldValue } from "$lib/types";
	import Checkbox from "../basic/Checkbox.svelte";
	import Labeled from "../basic/Labeled.svelte";
	import Select from "../basic/Select.svelte";
  import FieldInput from './FieldInput.svelte';

  export let field: Field;
  export let fieldValue: FieldValue;
  export let inputId: string;
  export let units: {key: string, label: string}[] = [];
  export let zIndex = 1;
</script>

<div class="field" style="z-index: {zIndex}">
  {#if field.oneofs.length > 0}
    <FieldInput id={inputId}
                typeOption={fieldValue}
                units={units}
                field={field.oneofs[fieldValue.oneofKey]}>
      <span slot="label">
        <Select items={field.oneofs} 
            bind:selectedIndex={fieldValue.oneofKey}
            arrowRight={false} />
      </span>
    </FieldInput>
  {:else if field.type === "Unit"}
    <Labeled inputId={inputId}>
      <span slot="label">{field.label}</span>
      <span slot="content">
        <Select id={inputId}
                items={units}
                bind:selectedIndex={fieldValue.oneofKey} />
      </span>
    </Labeled>
  {:else if field.type === "bool"}
    <Checkbox bind:value={fieldValue.booleanValue}>
      {field.label}
    </Checkbox>
  {:else if field.repeated === false}
     <FieldInput id={inputId}
                typeOption={fieldValue}
                units={units}
                field={field}>
      <span slot="label">
        {field.label}
      </span>
    </FieldInput>
  {/if}
</div>

<style>
  .field {
    display: flex;
    flex: 1 0 40px;
    flex-direction: column;
    max-width: 127px;
  }
</style>