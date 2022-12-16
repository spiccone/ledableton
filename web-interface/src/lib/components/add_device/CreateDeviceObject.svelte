<script lang="ts">
  import Select from '../basic/Select.svelte';
	import BucketedVariableColumns from './BucketedVariableColumns.svelte';
	import type { DeviceMessageObject, FieldValue,} from '$lib/types';
	import { nameFormat } from '$lib/helper-functions';
	import FieldDisplayObject from './FieldDisplayObject.svelte';
  import Bucket from './Bucket.svelte';

  export let deviceTypes : DeviceMessageObject[];
  export let selectedTypeIndex = 0;
  export let units : {key: string, label: string}[] = [];
  export let allowableBuckets = 3;

  let deviceTypeList : {key : string, label : string}[] = [];
  let deviceFieldList : DeviceMessageObject[] = [];
  for (const deviceType of deviceTypes) {
    const key = Object.keys(deviceType)[0];
    deviceTypeList.push({key: key, label: nameFormat(key)});
    deviceFieldList.push(Object.values(deviceType)[0] as DeviceMessageObject);
  }

  function handleDeviceSelect() {

  }

</script>

<div class="CreateDevice">
  {#if deviceTypes.length > 0}
    <label class="label" for="deviceTypes">Device type</label>
    <div class="device-select" style="z-index: {allowableBuckets * 3}">
      <Select items={deviceTypeList} 
              bind:selectedIndex={selectedTypeIndex}
              on:select={handleDeviceSelect}/>
    </div>
  {/if}
  {#if selectedTypeIndex < deviceTypes.length}
    <div class="device-fields" style="z-index: {allowableBuckets * 3 - 1}">
      {#if deviceTypeList[selectedTypeIndex].key === "bucketedVariableColumns"}
        <BucketedVariableColumns fields={deviceFieldList[selectedTypeIndex]}
                                 deviceTypes={deviceTypes}
                                 units={units}
                                 allowableBuckets={allowableBuckets-1} />
      {:else}
        {#each Object.entries(deviceFieldList[selectedTypeIndex]) as [key, value], i (key)}
          {#if key === "bucket"}   
            <Bucket deviceTypes={deviceTypes}
                    key={key}
                    fields={deviceFieldList[selectedTypeIndex]}
                    units={units} 
                    allowableBuckets={allowableBuckets-1} />
          {:else}
            <FieldDisplayObject key={key} 
                                bind:fields={deviceFieldList[selectedTypeIndex]}
                                units={units}
                                zIndex={10-i} />
          {/if}
        {/each}
      {/if}
    </div>
  {/if}
</div>

<style>
  .CreateDevice {
    display: flex;
    flex-direction: column;
    position: relative;
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
