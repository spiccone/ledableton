<script lang="ts">
  import {onMount} from 'svelte';
  import Select from './Select.svelte';
  import Modal from "./Modal.svelte";
  import Icon from '@iconify/svelte';
  import roundPlus from '@iconify/icons-ic/round-plus';
  import protobuf from 'protobufjs';
  import {nameFormat} from "../helper-functions";

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

  let deviceName : string;
  let type : {value : number, label : string};

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
    <h1>Add Device</h1>
  </div>
  <div slot="content">
    <form on:submit|preventDefault={handleSubmit}>
      <label for="name">Name</label>
      <input name="name" bind:value={deviceName}>

      <Select items={deviceTypes} />
    
      <button disabled={!deviceName} type=submit>
        Submit
      </button>
    </form>
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
</style>