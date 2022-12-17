<script lang="ts">
	import type {DeviceMessageObject, RepeatedNumber} from "$lib/device";
  import Icon from '@iconify/svelte';
  import autoAwesomeMotionOutlineRounded from '@iconify/icons-material-symbols/auto-awesome-motion-outline-rounded';
  import roundPlus from '@iconify/icons-ic/round-plus';
  import roundMinus from '@iconify/icons-ic/round-minus';
	import Checkbox from "../basic/Checkbox.svelte"
  import Labeled from "../basic/Labeled.svelte";
	import SplitInput from "../basic/SplitInput.svelte";
	import FieldDisplay from "./FieldDisplay.svelte";
	import Bucket from "./Bucket.svelte";

  export let fields : DeviceMessageObject;
  export let deviceTypes : DeviceMessageObject[];
  export let units : {key: string, label: string}[] = [];
  export let allowableBuckets = 2;

  if (!('columnSpacing' in fields)) {
    throw "BucketedVariableColumns does not have columnSpacing field";
  }
  if (!('rowSpacing' in fields)) {
    throw "BucketedVariableColumns does not have rowSpacing field";
  }
  if (!('units' in fields)) {
    throw "BucketedVariableColumns does not have units field";
  }
  if (!('bucket' in fields)) {
    throw "BucketedVariableColumns does not have bucket field";
  }

  let columnSpacing = fields.columnSpacing as RepeatedNumber[];
  let rowSpacing = fields.rowSpacing as number[];

  let alignTop = true;

  let columnAutoFill = 20;
  let rowAutoFill = 30;

  initalize();

  function initalize() {
    if (rowSpacing.length === 1 && typeof rowSpacing[0] === "object" ) {
      rowSpacing.pop();
      // This is to change from using the value object to just numbers
      // We could also use all Value objects
      columnSpacing.pop();
      columnSpacing.push({repeatedNumber: [0]});
    }
  }

  function addToColumn(index: number) {
    if(index < columnSpacing.length) {
      columnSpacing[index].repeatedNumber.push(columnAutoFill);
    }
    columnSpacing = columnSpacing;
  }

  function subtractFromColumn(index: number) {
    if (columnSpacing[index]?.repeatedNumber.length > 1) {
      columnSpacing[index].repeatedNumber.pop();
      columnSpacing = columnSpacing;
    }
  }

  function addToRow() {
    rowSpacing.push(rowAutoFill);
    columnSpacing.push({repeatedNumber: [0]});
    columnSpacing = columnSpacing;
  }

  function subtractFromRow() {
    rowSpacing.pop();
    columnSpacing.pop();
    columnSpacing = columnSpacing;
  }


  function handleAlignTop() {
    if (alignTop) {
      for (let columnList of columnSpacing) {
        columnList.repeatedNumber[0] = 0;
      }
    } 
  }

  function fillColumns() {
    for (let columnList of columnSpacing) {
      for (let i=alignTop ? 1 : 0; i<columnList.repeatedNumber.length; i++) {
        columnList.repeatedNumber[i] = columnAutoFill;
      } 
    }
    columnSpacing = columnSpacing;
  }

  function fillRows() {
    for (let i=0; i<rowSpacing.length; i++) {
      rowSpacing[i]= rowAutoFill;
    }
    rowSpacing = rowSpacing;
  }
</script>

<div class="BucketedVariableColumns">
  <div class="options">
    <div class="option-item">
      <FieldDisplay key="units"
                          bind:fields={fields}
                          units={units} />
    </div>
    <div class="option-item">
      <Labeled inputId="field_bvc_rowFill">
        <span slot="label">Fill rows</span>
        <span slot="content">
          <SplitInput>
            <input slot="first" 
                   id="field_bvc_rowFill" 
                   class="option-input"
                   type="number" 
                   bind:value={rowAutoFill} />
            <button slot="second"
                    on:click={fillRows}>
              <Icon icon={autoAwesomeMotionOutlineRounded} />
            </button>
          </SplitInput>
        </span>
      </Labeled>
    </div>
    <div class="option-item">
      <Labeled inputId="field_bvc_columnFill">
        <span slot="label">Fill columns</span>
        <span slot="content">
          <SplitInput>
            <input slot="first" 
                   id="field_bvc_columnFill" 
                   class="option-input"
                   type="number" 
                   bind:value={columnAutoFill} />
            <button slot="second"
                    on:click={fillColumns}>
              <Icon icon={autoAwesomeMotionOutlineRounded} />
            </button>
          </SplitInput>
        </span>
      </Labeled>
    </div>
  </div>
  <div class="column-container">
    <div class="variable-columns{alignTop ? ' align-top' : ''}">
      {#each columnSpacing as value, i (i)}
        <div class="column">
          <div class="first-bucket"></div>
          {#each columnSpacing[i].repeatedNumber as value, j (j)}
            {#if !alignTop || j > 0}
              <div class="entry"></div>
                <div class="column-input-container">
                  <input class="column-input" 
                        type="text"
                        bind:value={columnSpacing[i].repeatedNumber[j]} />
                </div>
                <div class="bucket"></div>
            {/if}
          {/each}
          <button class="add" on:click|preventDefault={() => addToColumn(i)}>
            <Icon icon={roundPlus} />
          </button>
          <button class="subtract"
                  disabled={columnSpacing[i].repeatedNumber.length < 2}
                  on:click|preventDefault={() => subtractFromColumn(i)}>
            <Icon icon={roundMinus} />
          </button>
        </div>
        {#if i < rowSpacing.length}
          <div class="row-input-container">
            <input class="row-input" 
                  type="text" 
                  bind:value={rowSpacing[i]} />
          </div>
        {/if}
      {/each}
      <div class="row-buttons">
        <button class="add" on:click|preventDefault={() => addToRow()}>
          <Icon icon={roundPlus} />
        </button>
        <button class="subtract" 
                disabled={columnSpacing.length < 2}
                on:click|preventDefault={() => subtractFromRow()}>
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
<div class="bucket-selection">
  <Bucket deviceTypes={deviceTypes}
          key="bucket"
          fields={fields}
          units={units} 
          allowableBuckets={allowableBuckets-1} />
</div>

<style>
  .BucketedVariableColumns {
    width: 100%;
  }

  .options {
    align-items: flex-end;
    display: flex;
    flex-direction: row;
    gap: var(--grid-gap, 12px 8px);
  }

  .option-item {
    flex: 0 1 auto;
  }

  .option-input {
    max-width: 80px;
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
    height: auto;
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

  .bucket-selection {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    width: 100%;
  }
</style>

