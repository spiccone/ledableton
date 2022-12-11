<script lang="ts">
  import {onMount} from 'svelte';
  import type {DeviceType, SavedDevice} from '$lib/types';
  import Select from './Select.svelte';
  import Icon from '@iconify/svelte';
  import roundPlus from '@iconify/icons-ic/round-plus';
  import arrowBackRounded from '@iconify/icons-material-symbols/arrow-back-rounded';

  export let savedDevices : SavedDevice[] = [];
  export let deviceTypes : DeviceType[] = [];
  export let selectedItem : SavedDevice | DeviceType | undefined;
  export let savedDeviceLabel = "Saved device:";
  export let deviceTypeLabel = "Device type:";

  let selectedSaved : SavedDevice;
  let selectedType : DeviceType;

  let newDevice = false;

  onMount(() => {
    selectedSaved = savedDevices[0];
    selectedType = deviceTypes[0];
  });

  function addNewDevice() {
    newDevice = true;
    selectedItem = selectedSaved;
  }

  function backToDevices() {
    newDevice = false;
    selectedItem = selectedType;
  }
</script>

<div class="DeviceSelect">
  {#if savedDevices.length > 0 && !newDevice}
    <label class="label" for="devices">{savedDeviceLabel}</label>
    <div class="device-select">
      <Select id="devices" items={savedDevices} bind:selectedItem={selectedSaved} />
      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <button class="add" on:click={addNewDevice}>
        <Icon icon={roundPlus} />
      </button>
    </div>
  {:else}
    <label class="label" for="deviceTypes">{deviceTypeLabel}</label>
    <div class="device-select">
      <Select id="deviceTypes" items={deviceTypes} bind:selectedItem={selectedType}/>
      {#if savedDevices.length > 0}
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <button class="back" on:click={backToDevices}>
          <Icon icon={arrowBackRounded} />
        </button>
      {/if}
    </div>
    {#if selectedType}
      <div class="device-fields">
        {#each selectedType.fields as field}
          {#if field.type === "Type"}
            <slot name="type-field"/>
          {:else if field.oneofs}
            <Select items={field.oneofs}  />
          {:else}
            <div class="device-field">
              {field.key}
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
</style>
