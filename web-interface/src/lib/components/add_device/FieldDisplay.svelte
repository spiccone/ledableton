<script lang="ts">
	import {nameFormat} from "$lib/helper-functions";
	import type {DeviceMessageObject, OneOf} from "$lib/device";
	import FieldDisplayOneOf from "./FieldDisplayOneOf.svelte";
	import FieldInput from "./FieldInput.svelte";

  export let key: string;
  export let fields: DeviceMessageObject;

  export let units: {key: string, label: string}[] = [];
  export let zIndex = 1;

  let fieldOneOf : OneOf | null = null;

  checkType();

  $: fields, checkType(); // checkTop when fields changes

  function checkType() {
    if(typeof fields[key] === "object" && (fields[key] as OneOf)?.oneOf) {
      fieldOneOf = fields[key] as OneOf;
    } else {
      fieldOneOf === null;
    }
  }


  let label = nameFormat(key);
  
</script>

<div class="field" style="z-index: zIndex">
  {#if fieldOneOf}
    <FieldDisplayOneOf bind:fieldValue={fieldOneOf} units={units} />
  {:else}
    <FieldInput bind:fieldValue={fields[key]} units={units}>
      <span slot="label">
        {label}
      <span>
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