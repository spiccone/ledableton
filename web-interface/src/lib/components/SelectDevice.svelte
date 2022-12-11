<script lang="ts">
  import {onMount} from 'svelte';
  import {FieldValue, DeviceType, type SavedDevice} from '$lib/types';
  import Select from './Select.svelte';
  import Icon from '@iconify/svelte';
  import roundPlus from '@iconify/icons-ic/round-plus';
  import folderOpenOutlineRounded from '@iconify/icons-material-symbols/folder-open-outline-rounded';

  export let savedDevices : SavedDevice[] = [];
  export let deviceTypes : DeviceType[] = [];
  export let selectedItem : SavedDevice|DeviceType|null;
  export let selectedItemOptions : FieldValue[]|null = null;
  export let units : {key: string, label: string}[] = [];
  export let savedDeviceLabel = "Saved device:";
  export let deviceTypeLabel = "Device type:";

  let typesOptions : FieldValue[][] = [];

  let newDevice = false;

  let selectedSavedIndex = 0;
  let selectedTypeIndex = 0;

  onMount(() => {
    for (let types of deviceTypes) {
      const options = [];
      for (let field of types.fields) {
        options.push(
          new FieldValue(field.key, 0, field.type === "Dimension" ? 0 : null));
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
    <div class="device-select">
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
      <div class="device-fields">
        {#each deviceTypes[selectedTypeIndex].fields as field, i (field.key)}
          {#if field.type === "Type"}
            <slot name="type-field"/>
          {:else if field.oneofs.length > 0}
            <Select items={field.oneofs} selectedItem={field.oneofs[0]} />
          {:else}
            <div class="field">
              <label class="label" for="{"field_" + i + "_" + field.key}">{field.label}:</label>
              <div class="field-input">
              <input id="{"field_" + i + "_" + field.key}" 
                     type="number"
                     bind:value= {typesOptions[selectedTypeIndex][i].value}/>
                {#if field.type === "Dimension"}
                  <Select id={"field_" + i + "_" + field.key + "_units"} 
                          items={units} 
                          bind:selectedIndex={typesOptions[selectedTypeIndex][i].unitKey}
                          showArrow={false} />
                {/if}
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
    display: flex;
    flex-direction: row;
    width: 100%;
  }

  .device-fields {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    gap: 8px;
    margin-top: 10px;
  }

  .field {
    display: flex;
    flex: 1 0 40px;
    flex-direction: column;
  }

  .field-input {
    display: flex;
    flex-direction: row;
  }
</style>
