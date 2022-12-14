<script lang="ts">
  import {onMount} from 'svelte';
  import {DeviceType, Field, DeviceFieldValue as FieldValue, SavedDevice} from '$lib/types';
  import Modal from '../Modal.svelte';
  import Select from '../basic/Select.svelte';
  import Icon from '@iconify/svelte';
  import roundPlus from '@iconify/icons-ic/round-plus';
  import editOutlineRounded from '@iconify/icons-material-symbols/edit-outline-rounded';
  import roundCopyAll from '@iconify/icons-ic/round-copy-all';
  import deleteOutlineRounded from '@iconify/icons-material-symbols/delete-outline-rounded';
  import roundArrowBackIos from '@iconify/icons-ic/round-arrow-back-ios';
  import protobuf from 'protobufjs';
  import {nameFormat} from "../../helper-functions";
	import CreateDevice from './CreateDevice.svelte';

  let savedDevices : SavedDevice[] = [];
  let deviceTypes : DeviceType[] = [];
  let deviceTypesNoBuckets : DeviceType[] = [];
  let units : {key: string, label: string}[] = [];

  let selectedSavedDevice : SavedDevice;

  let selectedDeviceType : DeviceType | null;
  let selectedTypeFields : FieldValue[] | null;
  let selectedDeviceBucket : DeviceType | null;
  let selectedDeviceBucketFields : FieldValue[] | null;

  let createDevice = savedDevices.length == 0;

  let error = false;
  let deviceName = "";
  let deviceKeyIndex = 0;

  let edit = false;

  onMount(() => {
    protobuf.load("src/protos/device.proto").then(function(root) {
      if (!root) {
        throw "Error loading device.proto in AddDevice.";
      }

      let unitMessage = root.lookupEnum("devicepackage.Unit");
      for (const [key, value] of Object.entries(unitMessage.valuesById)) {
        units.push({key: key, label: value});
      }

      let TypeMessage = root.lookupType("devicepackage.Type");
      for (const [key, value] of Object.entries(TypeMessage.fields)) {
        const valueTypeMessage = root.lookupType("devicepackage." + value.type);
        const fieldMessage =  valueTypeMessage.fields;
        const fields = [];
        let isBucket = false;
        for (const [key, value] of Object.entries(fieldMessage)) {
          if (!value.partOf) {
            fields.push(new Field(key, nameFormat(key), value.type, value.repeated));
            isBucket = isBucket || value.type == "Type";
          }
        }
        const oneofs = valueTypeMessage.oneofs;
        if (oneofs) {
          for (const [name, oneof] of Object.entries(oneofs)) {
            const oneofFields : Field[] = [];
            for (const [key, value] of Object.entries(oneof.fieldsArray)) {
              oneofFields.push(
                new Field(value.name, nameFormat(value.name), value.type, value.repeated));
            }
            const newField = new Field(name, nameFormat(key), value.type, value.repeated);
            newField.addOneofList(oneofFields);
            fields.push(newField);
          }
        }
        
        if (!isBucket) {
          deviceTypesNoBuckets.push(new DeviceType(key, nameFormat(key), fields));
        }
        deviceTypes.push(new DeviceType(key, nameFormat(key), fields));
      }
    });
    deviceKeyIndex = savedDevices.length;
  });

  function openCreateNewDevice() {
    selectedDeviceType = null;
    selectedTypeFields = null;
    selectedDeviceBucket = null;
    selectedDeviceBucketFields = null;
    createDevice = true;
  }

  function openAddDevice() {
    if (savedDevices.length > 0) { // should always be true
      createDevice = false;
      selectedSavedDevice = savedDevices[0];
    }
    edit = false;
  }

  function editDevice() {
    edit = true;
    deviceName = selectedSavedDevice.label;
    copyDevice();
  }

  function copyDevice() {
    if (!selectedSavedDevice || !selectedSavedDevice.type) {
      return;
    }
    selectedDeviceType = selectedSavedDevice.type;
    selectedTypeFields = selectedSavedDevice.fields;
    selectedDeviceBucket = selectedSavedDevice.bucketType;
    selectedDeviceBucketFields = selectedSavedDevice.bucketFields;
    createDevice = true;
  }

  function deleteDevice() {
    const index = savedDevices.indexOf(selectedSavedDevice);
    if (index > -1) {
      savedDevices.splice(index, 1);
    }
    if (savedDevices.length == 0) {
      createDevice = true;
    } else if (index == 0) {
      selectedSavedDevice = savedDevices[0]
    } else {
      selectedSavedDevice = savedDevices[index - 1];
    }
    savedDevices = savedDevices;
    deviceName = "";
  }

  function mouseOverSave() {
    error = true;
  }

  function mouseLeaveSave() {
    error = false;
  }

  function handleSave() {
    const deviceKey = selectedDeviceType?.key + '_' + deviceKeyIndex++;
    const device = edit ?
        selectedSavedDevice :
        new SavedDevice(deviceKey, deviceName);
    device.type = selectedDeviceType;
    device.label = deviceName;
    device.fields = selectedTypeFields;
    if (selectedDeviceBucket) {
      device.bucketType = selectedDeviceBucket;
      device.bucketFields = selectedDeviceBucketFields;
    }
    if (!edit) {
      savedDevices.push(device);
    }
    deviceName = "";
    openAddDevice();
  }

  function handleAdd() {
    console.log(selectedSavedDevice);
	}
</script>

<Modal>
  <div slot="trigger" let:open>
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <div class="add-device" on:click={open}>
      <Icon icon={roundPlus} />
    </div>
  </div>
  <div class="header" slot="header">
    {#if createDevice}
      {#if savedDevices.length > 0}
        <button class="back-button" on:click={openAddDevice}>
          <Icon icon={roundArrowBackIos} />
        </button>
      {/if}
      <h1>{edit ? "Edit" : "Create"} Device</h1>
    {:else}
      <h1>Add Device</h1>
    {/if}
  </div>
  <div class="content" slot="content">
    <div class="outer-section">
      {#if createDevice || savedDevices.length == 0}
      <!-- createDevice should be true when savedDevices is empty -->
        <div class="device-name-container">
          <input class:error
                 type="text" 
                 class="device-name" 
                 bind:value={deviceName}
                 placeholder="New device" />
        </div>
        <CreateDevice bind:selectedItem={selectedDeviceType} 
                      bind:selectedItemOptions={selectedTypeFields}
                      deviceTypes={deviceTypes}
                      units={units}>
          <div class="inner-section" slot="type-field">
            <CreateDevice bind:selectedItem={selectedDeviceBucket} 
                          bind:selectedItemOptions={selectedDeviceBucketFields}
                          deviceTypes={deviceTypesNoBuckets}
                          units={units} />
          </div>
        </CreateDevice>
      {:else}
        <div class="saved-device-container">
          <div class="saved-select">
            <Select id="devices" 
                    items={savedDevices} 
                    bind:selectedItem={selectedSavedDevice} />
          </div>
          <button class="icon-button" on:click={editDevice}>
            <Icon icon={editOutlineRounded} />
          </button>
          <button class="icon-button" on:click={copyDevice}>
            <Icon icon={roundCopyAll} />
          </button>
          <button class="icon-button" on:click={deleteDevice}>
            <Icon icon={deleteOutlineRounded} />
          </button>
          <button class="add-button" on:click={openCreateNewDevice}>
            New
            <div class="add-button-icon"><Icon icon={roundPlus} /></div>
          </button>
        </div>
      {/if}
    </div>
  </div>
  <div class="footer" slot="footer">
    <!-- svelte-ignore a11y-mouse-events-have-key-events -->
    <div class="submit-container"
         on:mouseover={mouseOverSave}
         on:mouseleave={mouseLeaveSave}>
      {#if createDevice}
        <button on:click={handleSave}
                disabled={deviceName === ''}>
          Save Device
        </button>
      {:else}
        <button on:click={handleAdd}>Add Device</button>
      {/if}
    </div>
  </div>
</Modal>

<style>
  .add-device {
    background: #777;
    border-radius: 8px;
    color: #fff;
    cursor: pointer;
    height: 38px;
    opacity: 30%;
    padding: 0;
    position: absolute;
    right: 10px;
    bottom: 10px;
    width: 38px;
  }
  .locked .add-device {
    display: none;
  }
  .add-device:hover {
    opacity: 50%;
  }
  .add-device:active,
  .add-device:focus {
    opacity: 60%;
  }

  .header {
    align-items: center;
    display: flex;
    flex-direction: row;
    font-size: 26px;
  }
  .header h1 {
    margin-top: 18px;
    margin-left: 8px;
  }

  .back-button {
    background: none;
    border: none;
    box-sizing: content-box;
    height: 1em;
    padding: 6px;
    width: 1em;
  }

  .content {
    position: relative;
    height: 100%;
    width: 100%;
  }

  .saved-device-container {
    display: flex;
    gap: 8px;
  }

  .saved-select {
    --select-width: 100%;
    flex: 1 1 auto;
    gap: 8px;
    min-width: 60px;
  }

  .add-button {
    align-items: center;
    display: flex;
    flex: 0 0 auto;
    font-size: 12px;
    padding: 9px 12px 7px;
  }
  .add-button-icon {
    display: inline-block;
    height: 24px;
    margin: -5px -3px -3px 6px;
    width: 18px;
  }

  .icon-button {
    height: 36px;
    flex: 0 0 auto;
    padding: 7px;
    width: 36px;
  }
  
  .outer-section,
  .inner-section {
    border: 1px dashed var(--color-border);
  }
  .outer-section {
    border-radius: 18px;
    display: flex;
    flex-direction: column;
    padding: 8px;
  }
  .inner-section {
    border-radius: 12px;
    padding: 8px;
    width: 100%;
  }

  .device-name-container {
    /* This is so the text is aligned instead of the focus border. */
    margin: -4px -4px 12px -4px;
    display: flex;
  }

  .device-name {
    background: none;
    border: 0 solid var(--color-border);
    border-radius: var(--corner-input);
    box-sizing: content-box;
    color: var(--color-text, #ccc);
    font-size: 18px;
    height: fit-content;
    margin: 2px;
    padding: 7px 6px 6px;
    width: 100%;
  }
  .device-name:hover {
    border-width: 1px;
    margin: 1px;
  }
  .device-name:focus {
    border-width: 2px;
    margin: 0;
  }
  .device-name.error {
    border-width: 2px;
    border-color: var(--color-error);
    margin: 0;
  }

  .footer {
    display: flex;
    justify-content: flex-end;
    margin-top: 6px;
  }
</style>
