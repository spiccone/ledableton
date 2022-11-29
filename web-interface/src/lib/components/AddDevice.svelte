<script lang="ts">
  import Modal from "./Modal.svelte";
  import Icon from '@iconify/svelte';
  import roundPlus from '@iconify/icons-ic/round-plus';
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
    Content here
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