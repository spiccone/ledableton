<script lang="ts">
  import {onMount} from 'svelte';
  import {DeviceType, Field, DeviceFieldValue as FieldValue, SavedDevice} from '$lib/types';
  import Modal from "./Modal.svelte";
  import Icon from '@iconify/svelte';
  import roundPlus from '@iconify/icons-ic/round-plus';
  import protobuf from 'protobufjs';
  import {nameFormat} from "../helper-functions";
	import SelectDevice from './SelectDevice.svelte';

  let devices : SavedDevice[] = [new SavedDevice("test", "test", [])];
  let deviceTypes : DeviceType[] = [];
  let deviceTypesNoBuckets : DeviceType[] = [];
  let units : {key: string, label: string}[] = [];

  let selectedDevice : SavedDevice | DeviceType;
  let selectedDeviceBucket : SavedDevice | DeviceType;
  let selectedItemOptions : FieldValue[] | null;
  
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
        console.log(fieldMessage);
        for (const [key, value] of Object.entries(fieldMessage)) {
          if (!value.partOf) {
            fields.push(new Field(key, nameFormat(key), value.type, value.repeated));
            isBucket = isBucket || value.type == "Type";
          }
        }
        const oneofs = valueTypeMessage.oneofs;
        if (oneofs) {
          for (const [name, oneof] of Object.entries(oneofs)) {
            const oneofFields : {key: string, label: string, type: string}[] = [];
            for (const [key, value] of Object.entries(oneof.fieldsArray)) {
              oneofFields.push({key: value.name, label: nameFormat(value.name), type: value.type});
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
  });

  let deviceName = "";

  function handleSubmit() {
    console.log(selectedDevice);
    console.log(selectedDeviceBucket);
    console.log(selectedItemOptions);
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
    <form id="add-device" class="form" >
      <div class="outer-section">
        <SelectDevice bind:selectedItem={selectedDevice} 
                      bind:selectedItemOptions={selectedItemOptions}
                      savedDevices={devices} 
                      deviceTypes={deviceTypes}
                      units={units}>
          <div class="inner-section" slot="type-field">
              <SelectDevice bind:selectedItem={selectedDeviceBucket} 
                            savedDevices={devices}
                            deviceTypes={deviceTypes}
                            units={units}
                            savedDeviceLabel="Bucket device"
                            deviceTypeLabel="Bucket device type"/>
             
          </div>
        </SelectDevice>
      </div>
    </form>
  </div>
  <div class="footer" slot="footer">
    <button class="submit" on:click={handleSubmit}>
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

  .device-name {
    background: none;
    border: 0 solid var(--color-border);
    border-radius: var(--border-radius-input);
    margin: 2px;
    padding: 4px 6px 2px;
  }
  .device-name:hover {
    border-width: 1px;
    margin: 1px;
  }
  .device-name:focus {
    border-width: 2px;
    margin: 0;
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
    width: 100%;
  }

  .footer {
    display: flex;
    justify-content: flex-end;
  }
</style>
