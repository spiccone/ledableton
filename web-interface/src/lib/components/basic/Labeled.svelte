<script lang="ts">
  export let inputId: string = "";
</script>

<div class="Labeled">
  <label class="label" for="{inputId}">
    <slot name="label"></slot>
  </label>
  <slot name="content"></slot>
</div>

<style>
  .label {
    --select-arrow-size: 4px;
    --select-arrow-gap: 4px;
    --select-arrow-margin: -2px 10px 0;
    --select-border-width: 0;
    --select-color: var(--color-text);
    --select-color-hover: #fff;
    --select-color-bg: var(--color-bg-main);
    --select-color-bg-hover: #444;
    --select-font-size: var(--font-size-label, 12px);
    --select-height: 20px;
    --select-padding: 0 8px;
    --select-margin: -3px 0 -3px -8px;
    --select-width: auto;
    font-size: var(--font-size-label, 12px);
    margin: 0 0 4px 4px;
    white-space: nowrap;
    width: fit-content;
  }

  .Labeled {
    display: flex;
    flex-direction: column;
    width: 100%;
  }
</style>