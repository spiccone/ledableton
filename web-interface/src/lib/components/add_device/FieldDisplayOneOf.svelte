<script lang="ts">
	import {nameFormat} from "$lib/helper-functions";
  import type {FieldValue, OneOf} from "$lib/device";
	import Select from "../basic/Select.svelte";
  import FieldInput from './FieldInput.svelte';

  export let fieldValue: OneOf;

  export let units: {key: string, label: string}[] = [];
  export let zIndex = 1;

  let fieldValueEntries: FieldValue[] = [];
  let oneOfList : {key: string, label: string}[]  = [];

  for (const field of fieldValue.oneOf) {
    for (const [key, value] of Object.entries(field)) {
      oneOfList.push({key: key, label: nameFormat(key)});
      fieldValueEntries.push(value);
    }
  }
  function handleSelect() {
    fieldValue = fieldValue;
    fieldValueEntries = fieldValueEntries;
  }
</script>

<FieldInput bind:fieldValue={fieldValueEntries[fieldValue.selectedIndex]} units={units}>
  <span slot="label" style="z-index: {zIndex}">
    <Select items={oneOfList} 
    bind:selectedIndex={fieldValue.selectedIndex}
    arrowRight={false}
    on:select={handleSelect} />
  </span>
</FieldInput>