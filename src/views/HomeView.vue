<template>
  <div class="container">
    <div class="btn-group">
      <button @click="addRow">添加行</button>
      <button @click="addCol">添加列</button>
    </div>
    <ve-table
      max-height="calc(100%)"
      fixed-header
      ref="veTable"
      style="width: 100%"
      :scroll-width="0"
      :columns="columns"
      :table-data="tableData"
      :border-around="true"
      :border-x="true"
      :border-y="true"
      :rowStyleOption="rowStyleOption"
      row-key-field-name="rowKey"
      :clipboard-option="clipboardOption"
      :columnWidthResizeOption="columnWidthResizeOption"
    />
  </div>
</template>

<script>
export default {
  data() {
    return {
      copyData: null,
      clipboardOption: {
        copy: true,
        paste: true,
        cut: true,
        delete: true,
        beforeCopy: ({ data }) => {
          this.copyData = data;
        },
        afterPaste: ({ selectionRangeIndexes }) => {
          const { startRowIndex, startColIndex } = selectionRangeIndexes;
          const oldData = this.copyData;
          // console.log(oldData);
          let tableDataRow = startRowIndex;
          for (let index = 0; index < oldData.length; index++) {
            const element = oldData[index];
            let tableDataCol = startColIndex;
            const xData = this.tableData[tableDataRow];
            if (xData == undefined) {
              return;
            }
            /*  */
            for (const key in element) {
              if (Object.hasOwnProperty.call(element, key)) {
                const item = element[key];
                // console.log(item);
                this.$set(
                  xData,
                  tableDataCol++,
                  JSON.parse(JSON.stringify(item))
                );
                // xData[tableDataCol++] = item;
              }
            }
            tableDataRow++;
          }
        },
        beforeCut: ({ data }) => {
          this.copyData = data;
        },
        afterCut: ({ selectionRangeIndexes }) => {
          this.clipboardOption.afterPaste({ selectionRangeIndexes });
        },
        // afterDelete: ({ data, selectionRangeIndexes, selectionRangeKeys }) => {
        //   data, selectionRangeIndexes, selectionRangeKeys;
        //   // this.log({ data, selectionRangeIndexes, selectionRangeKeys });
        // },
      },
      columnResizeInfo: {
        column: "",
        differWidth: "",
        columnWidth: "",
        tableWidth: "",
      },
      rowStyleOption: {
        clickHighlight: false,
        hoverHighlight: false,
      },
      columnWidthResizeOption: {
        // default false
        enable: true,
        // column resize min width
        minWidth: 30,
        // column size change
        sizeChange: ({ column, differWidth, columnWidth }) => {
          this.columnResizeInfo.column = column;
          this.columnResizeInfo.differWidth = differWidth;
          this.columnResizeInfo.columnWidth = columnWidth;
        },
      },
      columns: [
        {
          key: "index",
          title: "",
          width: 100,
          align: "center",
          fixed: "left",
          editable: false,
          edit: false,
          operationColumn: true,
          children: [
            {
              field: "index",
              key: "index",
              title: "string",
              width: 100,
              editable: false,
              edit: false,
              operationColumn: true,
              renderBodyCell: ({ row, column, rowIndex }, h) => {
                row, column, h;
                return ++rowIndex;
              },
            },
          ],
        },
      ],
      tableData: [],
    };
  },
  created() {
    this.initColumns();
    this.initTableData();
  },
  mounted() {
    this.addEvent();
  },

  methods: {
    addEvent() {
      const handle = (event) => {
        if (event.keyCode == 8) {
          const newEvent = new KeyboardEvent("keydown", {
            key: "Backspace",
            code: "Backspace",
            keyCode: 46,
            which: 46,
            charCode: 46,
            cancelable: true,
            bubbles: true,
          });
          document.dispatchEvent(newEvent);
        }
      };
      document.addEventListener("keydown", handle);
      this.$once("hook:beforeDestroy", () => {
        document.removeEventListener("keydown", handle);
      });
    },
    log({ data, selectionRangeIndexes, selectionRangeKeys }) {
      console.log("data::", data);
      console.log("selectionRangeIndexes::", selectionRangeIndexes);
      console.log("selectionRangeKeys::", selectionRangeKeys);
    },
    initColumns() {
      for (let i = 0; i < 9; i++) {
        this.columns.push({
          key: `${i + 1}`,
          title: `title_${i + 1}`,
          edit: true,
          width: 100,
          align: "center",
          children: [
            {
              field: `${i + 1}`,
              key: `${i + 1}`,
              title: `string`,
              edit: true,
              width: 100,
              renderBodyCell: ({ row, column, rowIndex }, h) => {
                row, column, rowIndex, h;
                if (row[`${i + 1}`] instanceof Array) {
                  return row[`${i + 1}`].map((item) => item.data).join(",");
                }
                return row[`${i + 1}`]?.data;
              },
            },
          ],
        });
      }
    },
    initTableData() {
      const data = [];
      for (let i = 0; i < 13; i++) {
        const obj = {};
        if (i < 8) {
          for (let j = 0; j < 8; j++) {
            obj[`${j + 1}`] = {
              data: `${j + 1}_${i + 1}`,
            };
          }
          obj[`9`] = [{ data: "11" }, { data: "22" }, { data: "33" }];
        } else {
          for (let j = 0; j < 8; j++) {
            obj[`${j + 1}`] = null;
          }
          obj[`9`] = null;
        }
        obj.rowKey = i;
        data.push(obj);
      }
      this.tableData = data;
      console.log(data);
    },
    addRow() {
      const obj = {};
      const lastLength = this.tableData.length;
      for (let index = 0; index < lastLength; index++) {
        obj[`${index + 1}`] = null;
        obj.rowKey = lastLength;
      }
      this.tableData.push(obj);
    },
    addCol() {
      const lastLength = this.columns.length;
      this.columns.push({
        key: `${lastLength}`,
        title: `title_${lastLength}`,
        edit: true,
        width: 100,
        align: "center",
        children: [
          {
            field: `${lastLength}`,
            key: `${lastLength}`,
            title: `string`,
            edit: true,
            width: 100,
            renderBodyCell: ({ row, column, rowIndex }, h) => {
              row, column, rowIndex, h;
              if (row[`${lastLength}`] instanceof Array) {
                return row[`${lastLength}`].map((item) => item.data).join(",");
              }
              return row[`${lastLength}`]?.data;
            },
          },
        ],
      });
      const colLength = Object.keys(this.tableData[0]).filter(
        (item) => item !== "rowKey"
      ).length;
      console.log(colLength);
      /* 处理数据 */
      for (let index = 0; index < colLength; index++) {
        const obj = this.tableData[index];
        this.$set(obj, `${colLength + 1}`, null);
      }
      // console.log(this.tableData);
    },
  },
};
</script>
<style>
body {
  min-height: 100vh;
  margin: 0;
  padding: 0;
}
.container {
  width: 100%;
  height: 100vh;
}
.vue-table-root,
.ve-table {
  height: 100%;
}
.btn-group {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 999;
}
</style>
