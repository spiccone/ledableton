<script lang="ts">
  import {onMount} from 'svelte';
  import {DeviceFieldValue as FieldValue, DeviceType, type SavedDevice} from '$lib/types';
  import Select from '../Select.svelte';
  import Icon from '@iconify/svelte';
  import roundPlus from '@iconify/icons-ic/round-plus';
  import folderOpenOutlineRounded from '@iconify/icons-material-symbols/folder-open-outline-rounded';
	import FieldDisplay from './FieldDisplay.svelte';
	import BucketedVariableColumns from './BucketedVariableColumns.svelte';

  export let deviceTypes : DeviceType[] = [];
  export let selectedItem : DeviceType|null;
  export let selectedItemOptions : FieldValue[]|null = null;
  export let units : {key: string, label: string}[] = [];
  export let deviceTypeLabel = "Device type";

  let typesOptions : FieldValue[][] = [];

  let selectedTypeIndex = 0;

  for (let i=0; i<deviceTypes.length; i++) {
    const types = deviceTypes[i];
    if (selectedItem === types && selectedItemOptions) {
     typesOptions.push(selectedItemOptions);
     selectedTypeIndex = i;
    } else {
      const options = [];
      for (let field of types.fields) {
        const fieldValue = new FieldValue(field.key, field.type === "Dimension" ? 0 : null);
        if (field.type === "VariableColumn") {
          fieldValue.addToRepeatedValue([]);
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
      <Select id="deviceTypes" 
              items={deviceTypes} 
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
            {#if field.type === "Type"}
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
    --select-color-bg: var(--color-form-bg);
    display: flex;
    flex-direction: row;
    width: 100%;
  }

  .device-fields {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    gap: 12px 8px;
    margin-top: 10px;
  }
</style>
