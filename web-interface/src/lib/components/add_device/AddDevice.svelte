<script lang="ts">
  import {onMount} from 'svelte';
  import {DeviceDisplay, SavedDevice, type DeviceMessageObject, type OneOf, type Position, type Value} from '$lib/device';
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
	import DevicePreview from './DevicePreview.svelte';

  export let deviceDisplays: DeviceDisplay[];

  export let socket: WebSocket;
 
  let units : {key: string, label: string}[] = [];

  let deviceList : DeviceMessageObject[] = [];
  let savedDevices : SavedDevice[] = [];
  let ledPositions : Position[] = [];
  let createDeviceIndex = 0;
  let savedDeviceIndex = 0;

  let defaultDeviceList : DeviceMessageObject[] = [];

  let savedIndex = 0;

  let savedDeviceNames : {key: string, label: string}[] = [];

  let createDevice = false;

  let error = false;
  let deviceName = "";
  let savedDeviceName = "";

  let edit = false;
  
  let DeviceProto : protobuf.Root;
  let SettingsMessage : protobuf.Type;

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
        return {value: "", type: value.type};
      case "boolean":
        return {value: false, type: value.type};
      case "uint32":
      case "int32":
      case "float":
      case "Unit":
        return {value: 0, type: value.type};
      case "Settings":
        return "GENERATE_DEVICE";
      default:
        return createObjectFromMessage(DeviceProto.lookupType("devicepackage." + value.type));
    }
  }

  onMount(() => {
    protobuf.load("src/protos/device.proto").then(function(root) {
      if (!root) {
        throw "Error loading device.proto in AddDevice.";
      }
      DeviceProto = root;

      let unitMessage = root.lookupEnum("devicepackage.Unit");
      for (const [key, value] of Object.entries(unitMessage.valuesById)) {
        units.push({key: key, label: value});
      }

      SettingsMessage = root.lookupType("devicepackage.Settings");
      for (const device of (createObjectFromMessage(SettingsMessage).settings as OneOf).oneOf) {
        defaultDeviceList.push(device);
      }
      deviceList = JSON.parse(JSON.stringify(defaultDeviceList));
      loadJson();
    });
  });

  async function loadJson() {
    socket.addEventListener('message', (event) => handleMessage(event));
  }

  function handleMessage(event: MessageEvent) {
    const object = JSON.parse(event.data);
      if (Object.keys(object)[0] === "positions") {
        ledPositions = object.positions;
      } else if (Object.keys(object)[0] === "devices") {
        savedDevices = object.devices;
        updateSavedDeviceNames();
      }
  }

  function updateSavedDeviceNames() {
    savedDeviceNames.length = 0;
    for (const device of savedDevices) {
      savedDeviceNames.push({
        key: "device_" + savedIndex++,
        label: device.name
      });
    }
    savedDeviceNames = savedDeviceNames;
  }

  function resetCreateDevice() {
    deviceList.length = 0;
    deviceList = JSON.parse(JSON.stringify(defaultDeviceList));
    createDeviceIndex = 0;
    deviceName = "";
  }

  function openCreateNewDevice() {
    resetCreateDevice();
    createDevice = true;
  }

  async function loadFiles() {
    socket.send("load-files");
  }

  function openAddDevice() {
    createDevice = false;
    edit = false;
  }

  function deleteDevice() {
    savedDevices.splice(savedDeviceIndex, 1);
    if (savedDeviceIndex === savedDevices.length) {
      savedDeviceIndex--;
    }
    savedDevices = savedDevices;
    sendJson();
    updateSavedDeviceNames();
    createDevice = savedDevices.length === 0;
    getLedPositions(savedDevices[savedDeviceIndex].settings);
  }

  function editDevice() {
    edit = true;
    copyDevice();
    deviceName = savedDevices[savedDeviceIndex].name;
  }

  function copyDevice() {
    resetCreateDevice();
    createDeviceIndex = populateDeviceList(deviceList, savedDevices[savedDeviceIndex].settings);
    createDevice = true;
  }

  function populateDeviceList(deviceList : DeviceMessageObject[], savedDevice: DeviceMessageObject) : number {
    const savedDeviceTypeKey = Object.keys(savedDevice)[0];
    for (let i=0; i<deviceList.length; i++) {
      const device = deviceList[i];
      if (Object.keys(device)[0] === savedDeviceTypeKey) {
        populateDevice(device[savedDeviceTypeKey], savedDevice[savedDeviceTypeKey]);
        return i;
      }
    }
    throw "Could not load saved device";
  }

  function populateDevice(device : DeviceMessageObject, savedSettings: DeviceMessageObject) {
    for (const [key, value] of Object.entries(device)) {
      if (savedSettings[key] === undefined) {
        const oneOfTest = value as OneOf;
        if (oneOfTest?.selectedIndex !== undefined && oneOfTest.oneOf) {
          for (let i = 0; i < oneOfTest.oneOf.length; i++) {
            const [k, v] = Object.entries(oneOfTest.oneOf[i])[0];
            if (savedSettings[k] !== undefined) {
              value.selectedIndex = i;
              populateDevice(v, savedSettings[k]);
              break;
            }
          }
        }
      } else if (Array.isArray(savedSettings[key])) {
        device[key] = [];
        for (const item of savedSettings[key]) {
          if (typeof item === "object") {
            device[key].push(JSON.parse(JSON.stringify(item)));
          } else {
            device[key].push(item);
          }
        }
      } else if (typeof value === "object") {
        const valueTest = value as Value;
        if (valueTest?.type !== undefined && valueTest.value !== undefined) {
          valueTest.value = savedSettings[key];
        } else {
          populateDevice(value, savedSettings[key]);
        }
      } else if (value === "GENERATE_DEVICE") {
        device[key] = {
          devices: JSON.parse(JSON.stringify(defaultDeviceList)),
          type: "Settings",
          selectDevice: 0
        }
        device[key].selectedDevice = populateDeviceList(device[key].devices, savedSettings[key]);
      } else {
        device[key] = savedSettings[key];
      }
    }
  }

  function convertSettings(object: DeviceMessageObject) : DeviceMessageObject {
    const result : DeviceMessageObject = {};
    if (object?.type !== undefined && object.value !== undefined) {
      return object.value;
    }
    for (const [key, value] of Object.entries(object)) {
      if (Array.isArray(value)) {
        result[key] = [];
        for (const v of value) {
          result[key].push(typeof v === "object" ? convertSettings(v) : v);
        }
      } else if (typeof value === "object") {
        const oneOfTest = value as OneOf;
        if (value?.type !== undefined && value.value !== undefined) {
          result[key] = value.value;
        } else if (value?.selectedIndex !== undefined && value.oneOf) {
          const oneOf = oneOfTest.oneOf[oneOfTest.selectedIndex];
          result[Object.keys(oneOf)[0]] = convertSettings(Object.values(oneOf)[0]);
        } else if (value?.devices && value.selectedDevice !== undefined) {
          result[key] = convertSettings(value.devices[value.selectedDevice]);
        } else {
          result[key] = convertSettings(value);
        }
      } else {
        result[key] = value;
      }
    }
    return result;
  }

  function handleSave() {
    const newDevice = new SavedDevice(deviceName, {});
    const key = Object.keys(deviceList[createDeviceIndex])[0] as string;
    const setting = convertSettings(Object.values(deviceList[createDeviceIndex])[0]);
    newDevice.settings[key] = setting;

    const DeviceMessage = DeviceProto.lookupType("devicepackage.Device");
    const errorMessage = DeviceMessage.verify(newDevice);
    if (errorMessage) throw errorMessage;

    if (!edit) {
      savedDevices.push(newDevice);
    } else if(savedDeviceIndex < savedDevices.length) {
      savedDevices[savedDeviceIndex] = newDevice;
    } else {
      throw "Could not edit device";
    }

    savedDevices.sort(SavedDevice.compare);
    savedDeviceIndex = findIndexOf(newDevice);

    getLedPositions(newDevice.settings);

    sendJson();

    updateSavedDeviceNames();
    deviceName = "";
    openAddDevice();
  }

  function getLedPositions(settings: DeviceMessageObject) {
    socket.send("getPosition" + JSON.stringify(settings));
  }

  function findIndexOf(device: SavedDevice) : number {
    for(let i=0; i<savedDevices.length; i++) {
      if(device === savedDevices[i]) {
        return i;
      }
    }
    throw "Could not find device";
  }

  async function sendJson() {
    const savedDevicesMessages = {
      devices: savedDevices
    }

    const SavedDeviceMessage = DeviceProto.lookupType("devicepackage.SavedDevices");
    const errorMessage = SavedDeviceMessage.verify(savedDevicesMessages);
    if (errorMessage) throw errorMessage;

    const json = JSON.stringify(savedDevicesMessages);
    socket.send(json);
  }

  function mouseOverSave() {
    if (deviceName === '') {
      error = true;
    }
  }
  function mouseLeaveSave() {
    error = false;
  }

  function handleSelect() {
    getLedPositions(savedDevices[savedDeviceIndex].settings);
  }

  async function handleClose() {
    handleAdd();
    socket.removeEventListener('message', (event) => handleMessage(event));
  }

  function handleAdd() {
    deviceDisplays.push(new DeviceDisplay(savedDeviceName, savedDevices[savedDeviceIndex], ledPositions));
    deviceDisplays = deviceDisplays;
  }

</script>

<Modal>
  <div slot="trigger" let:open>
    <button class="add-device" on:click={() => {loadFiles().then(open)}}>
      <Icon icon={roundPlus} />
    </button>
  </div>
  <div class="header" slot="header">
    {#if createDevice || savedDevices.length === 0}
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
    {#if createDevice || savedDevices.length === 0}
      <div class="outer-section">
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
      </div>
    {:else}
      <div class="add-device-name-container">
        <input class:error
              type="text" 
              class="device-name" 
              bind:value={savedDeviceName}
              placeholder="New device" />
      </div>
      <div class="outer-section">
        <div class="saved-device-container">
          <div class="saved-select">
            <Select items={savedDeviceNames} 
                    bind:selectedIndex={savedDeviceIndex}
                    on:select={handleSelect} />
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
      </div>
      <div class="device-preview-container">
        <DevicePreview ledPositions={ledPositions} />
      </div>
    {/if}
  </div>
  <div class="footer" slot="footer" let:store={{close}}>
    <!-- svelte-ignore a11y-mouse-events-have-key-events -->
    <div class="submit-container"
         on:mouseover={mouseOverSave}
         on:mouseleave={mouseLeaveSave}>
      {#if createDevice || savedDevices.length === 0}
        <button on:click={handleSave}
                disabled={deviceName === ''}>
          Save Device
        </button>
      {:else}
        <button on:click={() => {handleClose().then(close)}}>Add Device</button>
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
  
  .outer-section {
    border: 1px dashed var(--color-border);
    border-radius: 18px;
    display: flex;
    flex-direction: column;
    padding: 8px;
  }
  .outer-section:not(:first-child) {
    margin-top: 18px;
  }

  .device-name-container,
  .add-device-name-container {
    display: flex;
  }
  
  .device-name-container {
    /* This is so the text is aligned instead of the focus border. */
    margin: -4px -4px 12px -4px;
  }
  .add-device-name-container {
    margin: 2px 2px 0 2px;
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
