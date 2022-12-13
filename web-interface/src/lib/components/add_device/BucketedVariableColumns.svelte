<script lang="ts">
	import type { DeviceFieldValue, DeviceType, Field } from "$lib/types";
  import Icon from '@iconify/svelte';
  import roundPlus from '@iconify/icons-ic/round-plus';
  import roundMinus from '@iconify/icons-ic/round-minus';
	import Checkbox from "../basic/Checkbox.svelte";
	import FieldDisplay from "./FieldDisplay.svelte";

  export let fields : Field[];
  export let fieldValues : DeviceFieldValue[];
  export let units: {key: string, label: string}[] = [];

  let columnField : Field;
  let rowField : Field;
  let unitField : Field;

  let columnFieldValue : DeviceFieldValue;
  let rowFieldValue : DeviceFieldValue;
  let unitFieldValue : DeviceFieldValue;

  let alignTop = false;

  for (let [index, field] of fields.entries()) {
    switch (field.key) {
      case "columns":
        columnField = field;
        columnFieldValue = fieldValues[index];
        break;
      case "rowSpacing":
        rowField = field;
        rowFieldValue = fieldValues[index];
        break;
      case "unit":
        unitField = field;
        unitFieldValue = fieldValues[index];
        break;
    }
  }

  addColumn(0);

  function addRow() {
    const numRows = columnFieldValue.nestedRepeatedValue.length;
    if (numRows > 0) {rowFieldValue.addToRepeatedValue(0);}
    columnFieldValue.addToRepeatedValue([0]);
    columnFieldValue = columnFieldValue;
  }

  function subtractRow() {
    rowFieldValue.removeFromRepeatedValue();
    columnFieldValue.removeFromRepeatedValue();
    columnFieldValue = columnFieldValue;
  }

  function addColumn(index: number) {
    columnFieldValue.addToNestedRepeatedValue(index, 0);
    columnFieldValue = columnFieldValue;
  }

  function subtractColumn(index: number) {
    if (columnFieldValue.nestedRepeatedValue[index].length > 1) {
      columnFieldValue.removeFromNestedRepeatedValue(index);
      columnFieldValue = columnFieldValue;
    }
  }

  function handleAlignTop() {
    if (alignTop) {
      for (let columnList of columnFieldValue.nestedRepeatedValue) {
        columnList[0] = 0;
      }
    }
  }
</script>

<div class="BucketedVariableColumns">
  <div class="options">
    <FieldDisplay inputId=field_bvc_unit
                  field={unitField}
                  fieldValue={unitFieldValue}
                  units={units}
                  zIndex={20} />
  </div>
  <div class="column-container">
    <div class="variable-columns{alignTop ? ' align-top' : ''}">
      {#each columnFieldValue.nestedRepeatedValue as value, i (i)}
        <div class="column">
          <div class="first-bucket"></div>
          {#each columnFieldValue.nestedRepeatedValue[i] as value, j (j)}
            {#if !alignTop || j > 0}
              <div class="entry"></div>
                <div class="column-input-container">
                  <input class="column-input" 
                        type="text"
                        bind:value={columnFieldValue.nestedRepeatedValue[i][j]} />
                </div>
                <div class="bucket"></div>
            {/if}
          {/each}
          <button class="add" on:click|preventDefault={() => addColumn(i)}>
            <Icon icon={roundPlus} />
          </button>
          <button class="subtract"
                  disabled={columnFieldValue.nestedRepeatedValue[i].length < 2}
                  on:click|preventDefault={() => subtractColumn(i)}>
            <Icon icon={roundMinus} />
          </button>
        </div>
        {#if rowFieldValue.repeatedValue.length > i}
          <div class="row-input-container">
            <input class="row-input" 
                  type="text" 
                  bind:value={rowFieldValue.repeatedValue[i]} />
          </div>
        {/if}
      {/each}
      <div class="row-buttons">
        <button class="add" on:click|preventDefault={() => addRow()}>
          <Icon icon={roundPlus} />
        </button>
        <button class="subtract" 
                disabled={columnFieldValue.nestedRepeatedValue.length < 2}
                on:click|preventDefault={() => subtractRow()}>
          <Icon icon={roundMinus} />
        </button>
      </div>
    </div>
    <div class="align-top-container">
      <Checkbox bind:value={alignTop} on:change={handleAlignTop}>
        Align top
      </Checkbox>
    </div>
  </div>
</div>
<slot name="type-field"/>

<style>
  .BucketedVariableColumns {
    width: 100%;
  }

  .options {
    align-items: flex-end;
    display: flex;
    flex-direction: row;
  }
  .column-container{
    border: 1px dashed var(--color-border);
    border-radius: 12px;
    box-sizing: border-box;
    margin-top: 6px;
    position: relative;
    width: 100%;
  }

  .variable-columns {
    display: flex;
    flex-direction: row;
    overflow: scroll;
    padding: 12px 12px 32px;
  }

  .column {
    display: flex;
    flex: 0 0 auto;
    flex-direction: column;
    margin-top: 18px;
    width: 60px;
  }

  .bucket,
  .first-bucket {
    background: #000;
    border-radius: 3px;
    box-sizing: border-box;
    flex: 0 0 auto;
    height: 11px;
    margin-left: 6px;
    width: 11px;
  }
  .variable-columns:not(.align-top) .first-bucket {
    background: none;
    border: 1px solid var(--color-border);
  }

  .column-input-container {
    align-items: center;
    border-left: 1px solid var(--color-border);
    display: flex;
    flex: 0 0 auto;
    height: 30px;
    margin-left: 11px;
    width: 50px;
  }
  .row-input-container {
    border-bottom: 1px solid var(--color-border);
    flex: 0 0 auto;
    height: fit-content;
    margin: 0 -7px 0 -43px;
    padding: 0 3px 3px 3px;
    width: 40px;
  }

  .column-input,
  .row-input {
    cursor: text;
    background: none;
    border: 0;
    border-radius: 4px;
    box-sizing: border-box;
    font-size: 12px;
    padding: 4px 6px 2px 6px;
    width: 100%;
  }
  .column-input {
    margin-left: 3px;
  }
  .row-input {
    text-align: center;
  }

  .row-buttons {
    display: flex;
    flex: 0 0 auto;
    flex-direction: column;
    justify-content: center;
    margin-left: -12px;
  }

  .add,
  .subtract {
    display: flex;
    box-sizing: content-box;
    border-radius: 50%;
    height: 13px;
    margin-top: 8px;
    padding: 4px;
    width: 13px;
  }

  .align-top-container {
    bottom: 12px;
    position: absolute;
    right: 16px;
  }
</style>
