<script lang="ts">
</script>

<div class="SplitInput">
  <div class="first">
    <slot name="first"></slot>
  </div>
  <div class="second">
    <slot name="second"></slot>
  </div>
</div>

<style>
  .SplitInput {
    display: flex;
    flex-direction: row;
    height: var(--input-height, 36px);
  }
  .first  {
    --corner-input: var(--corner-input, 12px) 0 0 var(--corner-input, 12px);
  }
  .first:focus-within {
    z-index: 2;
  }
  .second {
    --corner-input: 0 var(--corner-input, 12px) var(--corner-input, 12px) 0;
    margin: 0 -1px;
  }
</style>