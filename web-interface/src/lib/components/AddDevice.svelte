<script lang="ts">
  import {onMount} from 'svelte';
  import {DeviceType, SavedDevice} from '$lib/types';
  import Select from './SelectDevice.svelte';
  import Modal from "./Modal.svelte";
  import Icon from '@iconify/svelte';
  import roundPlus from '@iconify/icons-ic/round-plus';
  import arrowBackRounded from '@iconify/icons-material-symbols/arrow-back-rounded';
  import protobuf from 'protobufjs';
  import {nameFormat} from "../helper-functions";
	import SelectDevice from './SelectDevice.svelte';

  let devices : SavedDevice[] = [new SavedDevice("test", "test")];
  let deviceTypes : DeviceType[] = [];
  let deviceTypesNoBuckets : DeviceType[] = [];

  let selectedDevice : SavedDevice | DeviceType;
  let selectedDeviceField : SavedDevice | DeviceType;

  // let selectedDevice : {value : string, label : string};
  // let selectedDeviceType : {value : string, label : string, fields : {key: string, type: string}[]};
  
  onMount(() => {
    protobuf.load("src/protos/device.proto").then(function(root) {
      if (!root) {
        throw "error";
      }
      //selectedDevice = devices[0];

      let TypeMessage = root.lookupType("devicepackage.Type");
      for (const [key, value] of Object.entries(TypeMessage.fields)) {
        const fieldMessage = root.lookupType("devicepackage." + value.type).fields;
        const fields = [];
        let isBucket = false;
        for (const [key, value] of Object.entries(fieldMessage)) {
          fields.push({key: key, type: value.type});
          isBucket = isBucket || value.type == "Type";
        }
        if (!isBucket) {
          deviceTypesNoBuckets.push(new DeviceType(key, nameFormat(key), fields));
        }
        deviceTypes.push(new DeviceType(key, nameFormat(key), fields));
      }
      //selectedDeviceType = deviceTypes[0];
    });
  });

  let deviceName = "";
  let newDevice = false;

  function addNewDevice() {
    newDevice = true;
  }

  function backToDevices() {
    newDevice = false;
  }

  function handleSubmit() {
    
	}
</script>

<Modal>
  <div slot="trigger" let:open>
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <div class="add-device" on:click={open}>
      <Icon icon={roundPlus} />
    </div>
  </div>
  <div slot="header">
    <h1>
      <input class="device-name" bind:value={deviceName} placeholder="Unnamed device"/>
    </h1>
  </div>
  <div class="content" slot="content">
    <form class="form" on:submit|preventDefault={handleSubmit}>
      <div class="outer-section">
        <SelectDevice bind:selectedItem={selectedDevice} savedDevices={devices} deviceTypes={deviceTypes}>
          <div slot="type-field">
            <div class="inner-section">
              <SelectDevice 
                bind:selectedItem={selectedDeviceField} 
                savedDevices={devices}
                deviceTypes={deviceTypesNoBuckets}
                savedDeviceLabel="Bucket device:"
                deviceTypeLabel="Bucket device type:"/>
              </div>
          </div>
        </SelectDevice>
      </div>
    </form>
  </div>
  <div class="footer" slot="footer">
    <button class="submit" disabled={!deviceName} type=submit>
      Add Device
    </button>
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

  .content {
    position: relative;
    height: 100%;
    width: 100%;
  }

  .form {
    display: flex;
    flex-direction: column;
  }

  .outer-section,
  .inner-section {
    border: 1px dashed var(--color-border);
    border-radius: var(--border-radius-input);
  }
  .outer-section {
    margin-bottom: 12px;
    padding: 8px;
  }
  .inner-section {
    margin-top: 12px;
    padding: 8px;
  }

  .footer {
    display: flex;
    justify-content: flex-end;
  }
</style>
