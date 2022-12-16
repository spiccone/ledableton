<script lang="ts">
  import {onMount} from 'svelte';
  import type {DeviceMessageObject, OneOf, SavedDevice} from '$lib/device';
  import Modal from '../Modal.svelte';
  import Select from '../basic/Select.svelte';
  import Icon from '@iconify/svelte';
  import roundPlus from '@iconify/icons-ic/round-plus';
  import editOutlineRounded from '@iconify/icons-material-symbols/edit-outline-rounded';
  import roundCopyAll from '@iconify/icons-ic/round-copy-all';
  import deleteOutlineRounded from '@iconify/icons-material-symbols/delete-outline-rounded';
  import roundArrowBackIos from '@iconify/icons-ic/round-arrow-back-ios';
  import protobuf from 'protobufjs';
	import CreateDevice from './CreateDevice.svelte';
 
  let units : {key: string, label: string}[] = [];

  let deviceList : DeviceMessageObject[] = [];
  let savedDevices : SavedDevice[] = [];
  let createDeviceIndex = 0;
  let savedDeviceIndex = 0;

  let defaultDeviceList : DeviceMessageObject[] = [];

  let savedIndex = 0;

  let savedDeviceNames : {key: string, label: string}[] = [];

  let createDevice = true;

  let error = false;
  let deviceName = "";

  let edit = false;
  
  let deviceProto : protobuf.Root;

  function createObjectFromMessage(message : protobuf.Type) : DeviceMessageObject {
    const object : DeviceMessageObject = {};
    for (const [key, value] of Object.entries(message.fields)) {
      if (value.partOf) {
        if (!object[value.partOf.name]) {
          object[value.partOf.name] = {selectedIndex: 0, oneOf: []};
        }
        const x : DeviceMessageObject = {};
        x[key] = objectValueFromFieldValue(value);
        const oneOfObject = object[value.partOf.name] as OneOf;
        oneOfObject.oneOf.push(x);
      } else {
        object[key] = objectValueFromFieldValue(value);
      }
    }
    return object;
  }

  function objectValueFromFieldValue(value: protobuf.Field) {
    let field = getValueFromField(value);
    if (value.repeated) {
     return [field];
    } 
    return field;
  }

  function getValueFromField(value: protobuf.Field) {
    switch (value.type) {
      case "string":
        return '';
      case "boolean":
        return false;
      case "uint32":
      case "int32":
        return 0;
      case "float":
        return 0.1;
      case "Unit":
        return {selectedUnit: 0};
      case "Device":
        return "GENERATE_DEVICE";
      default:
        return createObjectFromMessage(deviceProto.lookupType("devicepackage." + value.type));
    }
  }

  onMount(() => {
    protobuf.load("src/protos/device.proto").then(function(root) {
      if (!root) {
        throw "Error loading device.proto in AddDevice.";
      }
      deviceProto = root;

      let unitMessage = root.lookupEnum("devicepackage.Unit");
      for (const [key, value] of Object.entries(unitMessage.valuesById)) {
        units.push({key: key, label: value});
      }

      let TypeMessage = root.lookupType("devicepackage.Device");
      for (const device of (createObjectFromMessage(TypeMessage).device as OneOf).oneOf) {
        defaultDeviceList.push(device);
      }
      deviceList = JSON.parse(JSON.stringify(defaultDeviceList));
    });
  });

  function updateSavedDeviceNames() {
    savedDeviceNames.length = 0;
    for (const device of savedDevices) {
      savedDeviceNames.push({
        key: "device_" + savedIndex++,
        label: device.name
      })
    }
  }

  function openCreateNewDevice() {
    deviceList.length = 0;
    deviceList = JSON.parse(JSON.stringify(defaultDeviceList));
    createDeviceIndex = 0;
    createDevice = true;
  }

  function openAddDevice() {
    createDevice = false;
    edit = false;
  }

  function editDevice() {
    deviceName = savedDevices[savedDeviceIndex].name;
    edit = true;
    copyDevice();
  }

  function copyDevice() {
    createDevice = true;
    createDevice = true;
  }

  function deleteDevice() {
    savedDevices.splice(savedDeviceIndex, 1);
    savedDevices = savedDevices;
    updateSavedDeviceNames();
    createDevice = savedDevices.length === 0;
  }

  function handleSave() {
    if (!edit) {
      savedDevices.push({
        name: deviceName,
        settings: deviceList[createDeviceIndex]});
    } else if(savedDeviceIndex < savedDevices.length) {
      savedDevices[savedDeviceIndex].name = deviceName;
      savedDevices[savedDeviceIndex].settings = deviceList[createDeviceIndex];
    } else {
      throw "Could not edit device";
    }
    console.log(savedDevices);
    updateSavedDeviceNames();
    deviceName = "";
    openAddDevice();
  }

  function handleAdd() {

	}

  function mouseOverSave() {
    if (deviceName === '') {
      error = true;
    }
  }
  function mouseLeaveSave() {
    error = false;
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
      {#if createDevice}
      <!-- createDevice should be true when savedDevices is empty -->
        <div class="device-name-container">
          <input class:error
                 type="text" 
                 class="device-name" 
                 bind:value={deviceName}
                 placeholder="New device" />
        </div>
        <CreateDevice bind:deviceTypes={deviceList} 
                      bind:selectedTypeIndex={createDeviceIndex}
                      units={units} />
      {:else}
        <div class="saved-device-container">
          <div class="saved-select">
            <Select items={savedDeviceNames} 
                    bind:selectedIndex={savedDeviceIndex} />
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
