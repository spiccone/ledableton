<script lang="ts">
	import { nameFormat } from "$lib/helper-functions";
	import type {Field,  FieldValue, OneOf } from "$lib/types";
	import Checkbox from "../basic/Checkbox.svelte";
	import Labeled from "../basic/Labeled.svelte";
	import Select from "../basic/Select.svelte";
	import FieldDisplayOneOf from "./FieldDisplayOneOf.svelte";
  import FieldInput from './FieldInput.svelte';
	import FieldInputObject from "./FieldInputObject.svelte";

  export let key: string;
  export let fieldValue: FieldValue;

  export let units: {key: string, label: string}[] = [];
  export let zIndex = 1;

  let fieldOneOf : OneOf | null = null;

  if((fieldValue as OneOf).oneOf) {
    fieldOneOf = fieldValue as OneOf;
  }

  let label = nameFormat(key);
  
</script>

<div class="field" style="z-index: {zIndex}">
  {#if fieldOneOf}
    <FieldDisplayOneOf bind:fieldValue={fieldOneOf} units={units} />
  {:else}
    <FieldInputObject bind:fieldValue={fieldValue} units={units}>
      <span slot="label">
        {label}
      <span>
    </FieldInputObject>
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