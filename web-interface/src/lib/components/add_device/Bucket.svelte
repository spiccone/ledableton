<script lang="ts">
	import type { DeviceMessageObject, FieldValue } from "$lib/types";
	import { onMount } from "svelte";
	import CreateDeviceObject from "./CreateDeviceObject.svelte";

  export let deviceTypes : DeviceMessageObject[];
  export let key : string;
  export let fields : DeviceMessageObject;
  export let units : {key: string, label: string}[] = [];
  export let allowableBuckets : number;

  const generate = fields.bucket === "GENERATE_DEVICE";
  if (generate && allowableBuckets > 0) {
    fields[key] = (JSON.parse(JSON.stringify(deviceTypes))).filter(hasBucket)
  }

  let deviceField = fields[key] as DeviceMessageObject[];

  function hasBucket(element : DeviceMessageObject) {
    return allowableBuckets > 1 || 
          !Object.values(Object.values(element)[0]).includes("GENERATE_DEVICE");
  }
</script>

{#if allowableBuckets > 0}
  <div class="section">
    <CreateDeviceObject deviceTypes={deviceField} 
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