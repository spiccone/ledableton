<script lang="ts">
	import { nameFormat } from "$lib/helper-functions";
  import type {FieldValue, OneOf } from "$lib/types";
	import Select from "../basic/Select.svelte";
  import FieldInputObject from './FieldInputObject.svelte';

  export let fieldValue: OneOf;

  export let units: {key: string, label: string}[] = [];
  export let zIndex = 1;

  let selectedIndex = 0;

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

<FieldInputObject bind:fieldValue={fieldValueEntries[selectedIndex]} units={units}>
  <span slot="label">
    <Select items={oneOfList} 
    bind:selectedIndex={selectedIndex}
    arrowRight={false}
    on:select={handleSelect} />
  </span>
</FieldInputObject>