<script lang="ts">
    export let color: string;
</script>

<div class="DeviceColorIndicator" style="background: {color}">
</div>

<style>
  .DeviceColorIndicator {
    border-radius: 100%;
    border: none;
    flex: 0 0 auto;
    height: 14px;
    width: 14px;
    margin: 0 10px 10px 0;
    cursor: pointer;
  }
</style>