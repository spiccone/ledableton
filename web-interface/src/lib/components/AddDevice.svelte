<script lang="ts">
  import {onMount} from 'svelte';
  import Select from './Select.svelte';
  import Modal from "./Modal.svelte";
  import Icon from '@iconify/svelte';
  import roundPlus from '@iconify/icons-ic/round-plus';
  import arrowBackRounded from '@iconify/icons-material-symbols/arrow-back-rounded';
  import protobuf from 'protobufjs';
  import {nameFormat} from "../helper-functions";

  let devices : {value : string, label : string}[] = [{value: "test", label: "Test"}];
  let deviceTypes : {value : string, label : string}[] = [];
  
  onMount(() => {
    protobuf.load("src/protos/device.proto").then(function(root) {
      if (!root) {
        throw "error";
      }

      let TypeMessage = root.lookupType("devicepackage.Type");
      for (const [key, value] of Object.entries(TypeMessage.fields)) {
        deviceTypes.push({value: key, label: nameFormat(key)});
      }
    });
  });

  let deviceName = "";
  let type : {value : number, label : string};
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
      {#if devices.length > 0 && !newDevice}
        <label class="label" for="devices">Choose device:</label>
        <div class="device-select">
          <Select id="devices" items={devices} selectedValue={devices[0].value} />
          <!-- svelte-ignore a11y-click-events-have-key-events -->
          <button class="add" on:click={addNewDevice}>
            <Icon icon={roundPlus} />
          </button>
        </div>
      {:else}
        <label class="label" for="deviceTypes">Type:</label>
        <div class="device-select">
          <Select id="deviceTypes" items={deviceTypes} selectedValue={deviceTypes[0].value}/>
          {#if devices.length > 0}
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <button class="back" on:click={backToDevices}>
              <Icon icon={arrowBackRounded} />
            </button>
          {/if}
        </div>
      {/if}
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

  .label {
    font-size: 12px;
    margin: 0 0 4px 4px;
  }

  .add,
  .back {
    box-sizing: border-box;
    flex: 0 0 auto;
    height: 36px;
    margin-left: 16px;
    padding: 6px;
    width: 36px;
  }
  .device-select {
    display: flex;
    flex-direction: row;
    width: 100%;
  }

  .footer {
    display: flex;
    justify-content: flex-end;
  }
</style>
