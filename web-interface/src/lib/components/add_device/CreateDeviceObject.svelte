<script lang="ts">
  import Select from '../basic/Select.svelte';
	import FieldObjectDisplay from './FieldDisplay.svelte';
	import BucketedVariableColumns from './BucketedVariableColumns.svelte';
	import type { DeviceMessageObject, FieldValue, oneOf } from '$lib/types';
	import { nameFormat } from '$lib/helper-functions';
	import FieldDisplayObject from './FieldDisplayObject.svelte';

  export let deviceTypes : DeviceMessageObject[];
  export let units : {key: string, label: string}[] = [];

  let deviceTypeList : {key : string, label : string}[] = [];
  let deviceFieldList : FieldValue[] = [];
  for (const deviceType of deviceTypes) {
    const key = Object.keys(deviceType)[0];
    deviceTypeList.push({key: key, label: nameFormat(key)});
    deviceFieldList.push(Object.values(deviceType)[0]);
  }
  let selectedTypeIndex = 0;

  function handleDeviceSelect() {

  }

</script>

<div class="CreateDevice">
  {#if deviceTypes.length > 0}
    <label class="label" for="deviceTypes">Device type</label>
    <div class="device-select" style="z-index: 2">
      <Select items={deviceTypeList} 
              bind:selectedIndex={selectedTypeIndex}
              on:select={handleDeviceSelect}/>
    </div>
  {/if}
  {#if selectedTypeIndex < deviceTypes.length}
    <div class="device-fields" style="z-index: 1">
      {#each Object.entries(deviceFieldList[selectedTypeIndex]) as [key, value], i (key)}
        <FieldDisplayObject key={key} bind:fieldValue={value} units={units} />
      {/each}
    </div>
  {/if}
</div>

<style>
  .CreateDevice {
    display: flex;
    flex-direction: column;
  }

  .label {
    font-size: 12px;
    margin: 0 0 4px 4px;
  }

  .device-select {
    --select-width: 100%;
    --select-color-bg: var(--color-input-bg);
    display: flex;
    flex-direction: row;
    width: 100%;
  }

  .device-fields {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    gap: var(--grid-gap, 12px 8px);
    margin-top: 12px;
  }
</style>
