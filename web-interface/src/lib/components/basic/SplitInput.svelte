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
    height: 36px;
  }
  .first  {
    --border-radius-input: 12px 0 0 12px;
  }
  .first:focus-within {
    z-index: 2;
  }
  .second {
    --border-radius-input: 0 12px 12px 0;
    margin: 0 -1px;
  }
</style>