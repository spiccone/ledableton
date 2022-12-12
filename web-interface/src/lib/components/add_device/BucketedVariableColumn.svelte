<script lang="ts">
	import type { DeviceFieldValue } from "$lib/types";
  import Icon from '@iconify/svelte';
  import roundPlus from '@iconify/icons-ic/round-plus';
  import roundMinus from '@iconify/icons-ic/round-minus';

  export let columnField : DeviceFieldValue;

  function addRow() {
    columnField.addToRepeatedValue([]);
    columnField = columnField;
  }

  function subtractRow() {
    columnField.removeFromRepeatedValue();
    columnField = columnField;
  }

  function addColumn(index: number) {
    columnField.addToNestedRepeatedValue(index, 0);
    columnField = columnField;
  }

  function subtractColumn(index: number) {
    columnField.removeFromNestedRepeatedValue(index);
    columnField = columnField;
  }

</script>

<div class="VariableColumns">
  {#each columnField.nestedRepeatedValue as value, i (i)}
    <div class="row">
      <div class="bucket"></div>
      {#each columnField.nestedRepeatedValue[i] as value, j (j)}
        <div class="column"></div>
          <input class="input" bind:value={columnField.nestedRepeatedValue[i][j]} />
          <div class="bucket"></div>
      {/each}
      <button class="add" on:click|preventDefault={() => addColumn(i)}>
        <Icon icon={roundPlus} />
      </button>
      <button class="subtract" on:click|preventDefault={() => subtractColumn(i)}>
        <Icon icon={roundMinus} />
      </button>
    </div>
  {/each}
  <div class="row-buttons">
    <button class="add" on:click|preventDefault={() => addRow()}>
      <Icon icon={roundPlus} />
    </button>
    <button class="subtract" on:click|preventDefault={() => subtractRow()}>
      <Icon icon={roundMinus} />
    </button>
  </div>
</div>

<style>
  .VariableColumns {
    display: flex;
    border: 1px dashed var(--color-border);
    border-radius: 12px;
    flex-direction: row;
    overflow: scroll;
    padding: 12px;
    width: 100%;
  }

  .row {
    display: flex;
    flex: 0 0 auto;
    flex-direction: column;
    width: 60px;
  }

  .bucket {
    background: #000;
    border-radius: 3px;
    flex: 0 0 auto;
    height: 11px;
    margin-left: 7px;
    width: 11px;
  }

  .input {
    background: none;
    border: 0;
    border-left: 1px solid var(--color-border);
    border-radius: 0;
    flex: 0 0 auto;
    font-size: 12px;
    margin-left: 12px;
    width: 100%;
  }

  .row-buttons {
    display: flex;
    flex: 0 0 auto;
    flex-direction: column;
    justify-content: center;
  }

  .add,
  .subtract {
    box-sizing: content-box;
    border-radius: 50%;
    height: 14px;
    margin-top: 8px;
    padding: 5px;
    width: 14px;
  }
</style>

