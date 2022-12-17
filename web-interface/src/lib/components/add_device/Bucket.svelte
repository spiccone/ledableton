<script lang="ts">
	import type {BucketMessageObject, DeviceMessageObject} from "$lib/device";
	import CreateDevice from "./CreateDevice.svelte";

  export let deviceTypes : DeviceMessageObject[];
  export let key : string;
  export let fields : DeviceMessageObject;
  export let units : {key: string, label: string}[] = [];
  export let allowableBuckets : number;

  const generate = fields.bucket === "GENERATE_DEVICE";
  if (generate && allowableBuckets > 0) {
    fields[key] = {
      selectedDevice: 0,
      devices: (JSON.parse(JSON.stringify(deviceTypes))).filter(hasBucket),
      type: "Settings"
    };
  }

  let deviceField = fields[key] as BucketMessageObject;

  function hasBucket(element : DeviceMessageObject) {
    return allowableBuckets > 1 || 
          !Object.values(Object.values(element)[0]).includes("GENERATE_DEVICE");
  }
</script>

{#if allowableBuckets > 0}
  <div class="section">
    <CreateDevice deviceTypes={deviceField.devices} 
                        bind:selectedTypeIndex={deviceField.selectedDevice}
                        units={units} 
                        allowableBuckets={allowableBuckets} />
  </div>
{/if}

<style>
  .section {
    border: 1px dashed var(--color-border);
    border-radius: 12px;
    padding: 8px;
    width: 100%;
  }
</style>