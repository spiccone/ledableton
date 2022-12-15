<script lang="ts">
  import {DeviceFieldValue, DeviceType, NestedRepeatedDeviceFieldValue, RepeatedDeviceFieldValue, type SavedDevice} from '$lib/types';
  import Select from '../basic/Select.svelte';
	import FieldDisplay from './FieldDisplay.svelte';
	import BucketedVariableColumns from './BucketedVariableColumns.svelte';

  export let deviceTypes : DeviceType[] = [];
  export let selectedItem : DeviceType|null;
  export let selectedItemOptions : DeviceFieldValue[]|null = null;
  export let units : {key: string, label: string}[] = [];
  export let deviceTypeLabel = "Device type";

  let typesOptions : DeviceFieldValue[][] = [];

  let selectedTypeIndex = 0;

  for (let i=0; i<deviceTypes.length; i++) {
    const types = deviceTypes[i];
    if (selectedItem === types && selectedItemOptions) {
     typesOptions.push(selectedItemOptions);
     selectedTypeIndex = i;
    } else {
      const options = [];
      for (let field of types.fields) {
        let fieldValue;
        if (field.type === "RepeatedNumber") {
          fieldValue = new NestedRepeatedDeviceFieldValue(field.key, field.type);
          fieldValue.addToValue([]);
        } else if (field.repeated) {
          fieldValue = new RepeatedDeviceFieldValue(field.key, field.type)
        }
        else {
          fieldValue = 
            new DeviceFieldValue(field.key, field.type, field.type === "Dimension" ? 0 : null);
        }
        for (const oneof of field.oneofs) {
          fieldValue.oneOfKeys.push(oneof.key);
        }
        options.push(fieldValue);
      }
      typesOptions.push(options);
    }
  }



  function handleDeviceSelect(e: CustomEvent) {
    selectedItemOptions = typesOptions[e.detail.selectedIndex];
  }
</script>

<div class="CreateDevice">
  {#if deviceTypes.length > 0}
    <label class="label" for="deviceTypes">{deviceTypeLabel}</label>
    <div class="device-select" style="z-index: 2">
      <Select items={deviceTypes} 
              bind:selectedItem={selectedItem}
              bind:selectedIndex={selectedTypeIndex}
              on:select={handleDeviceSelect}/>
    </div>
    {#if selectedTypeIndex < deviceTypes.length}
      <div class="device-fields" style="z-index: 1">
        {#if deviceTypes[selectedTypeIndex].key === "bucketedVariableColumns"} 
          <BucketedVariableColumns fields={deviceTypes[selectedTypeIndex].fields}
                                   fieldValues={typesOptions[selectedTypeIndex]}
                                   units={units}>
            <div class="device-select" slot="type-field">
              <slot name="type-field"/>
            </div>
          </BucketedVariableColumns>
        {:else}
          {#each deviceTypes[selectedTypeIndex].fields as field, i (field.key)}
            {#if field.type === "Device"}
              <slot name="type-field"/>
            {:else}
              <FieldDisplay inputId={"field_" + selectedTypeIndex + "_" + field.key}
                            field={field}
                            fieldValue={typesOptions[selectedTypeIndex][i]}
                            units={units}
                            zIndex={100-i} />
            {/if}
          {/each}
        {/if}
      </div>
    {/if}
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
