<script lang="ts">
  import {onMount} from 'svelte';
  import {DeviceFieldValue as FieldValue, DeviceType, type SavedDevice} from '$lib/types';
  import Select from './Select.svelte';
  import Icon from '@iconify/svelte';
  import roundPlus from '@iconify/icons-ic/round-plus';
  import folderOpenOutlineRounded from '@iconify/icons-material-symbols/folder-open-outline-rounded';
	import { assign } from 'svelte/internal';
	import FieldInput from './FieldInput.svelte';

  export let savedDevices : SavedDevice[] = [];
  export let deviceTypes : DeviceType[] = [];
  export let selectedItem : SavedDevice|DeviceType|null;
  export let selectedItemOptions : FieldValue[]|null = null;
  export let units : {key: string, label: string}[] = [];
  export let savedDeviceLabel = "Saved device";
  export let deviceTypeLabel = "Device type";

  let typesOptions : FieldValue[][] = [];

  let newDevice = false;

  let selectedSavedIndex = 0;
  let selectedTypeIndex = 0;

  onMount(() => {
    for (let types of deviceTypes) {
      const options = [];
      for (let field of types.fields) {
        options.push(
          new FieldValue(field.key, 0, field.type === "Dimension" ? 0 : null, 0));
      }
      typesOptions.push(options);
    }
  });

  function addNewDevice() {
    newDevice = true;
    selectedItem = savedDevices.length > 0 ? savedDevices[selectedSavedIndex] : null;   
  }

  function backToDevices() {
    newDevice = false;
    selectedItem = deviceTypes.length > 0 ? deviceTypes[selectedTypeIndex] : null;
  }
</script>

<div class="DeviceSelect">
  {#if savedDevices.length > 0 && !newDevice}
    <label class="label" for="devices">{savedDeviceLabel}</label>
    <div class="device-select">
      <Select id="devices" 
              items={savedDevices} 
              bind:selectedIndex={selectedSavedIndex} />
      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <button class="add" on:click={addNewDevice}>
        <Icon icon={roundPlus} />
      </button>
    </div>
  {:else}
    <label class="label" for="deviceTypes">{deviceTypeLabel}</label>
    <div class="device-select" style="z-index: 2">
      <Select id="deviceTypes" 
              items={deviceTypes} 
              bind:selectedIndex={selectedTypeIndex}/>
      {#if savedDevices.length > 0}
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <button class="back" on:click={backToDevices}>
          <Icon icon={folderOpenOutlineRounded} />
        </button>
      {/if}
    </div>
    {#if selectedTypeIndex < deviceTypes.length}
      <div class="device-fields" style="z-index: 1">
        {#each deviceTypes[selectedTypeIndex].fields as field, i (field.key)}
          {#if field.type === "Type"}
            <slot name="type-field"/>
          {:else if field.oneofs.length > 0}
            <div class="field" style="z-index: {100-i}">
              <div class="label">
                <Select items={field.oneofs} 
                        bind:selectedIndex={typesOptions[selectedTypeIndex][i].oneofKey}
                        arrowRight={false} />
              </div>
              <div class="field-input-container">
                <FieldInput id={"field_" + selectedTypeIndex + "_" + field.key}
                            typeOption={typesOptions[selectedTypeIndex][i]}
                            units={units}
                            field={field.oneofs[typesOptions[selectedTypeIndex][i].oneofKey]} />
              </div>
            </div>
          {:else}
            <div class="field" style="z-index: {100-i}">
              <label class="label" for="{"field_" + selectedTypeIndex + "_" + field.key}">
                {field.label}
              </label>
              <div class="field-input-container">
                <FieldInput id={"field_" + selectedTypeIndex + "_" + field.key}
                            typeOption={typesOptions[selectedTypeIndex][i]}
                            units={units}
                            field={field} />
              </div>
            </div>
          {/if}
        {/each}
      </div>
    {/if}
  {/if}
</div>

<style>
  .DeviceSelect {
    display: flex;
    flex-direction: column;
  }

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

  .add,
  .back {
    box-sizing: border-box;
    flex: 0 0 auto;
    height: 36px;
    margin-left: 8px;
    padding: 6px;
    width: 36px;
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
