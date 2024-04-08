<template>
  <div class="container">
    <div class="btn-group">
      <button @click="addRow">添加行</button>
      <button @click="addCol">添加列</button>
      <button @click="saveData">保存数据</button>
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
      :eventCustomOption="eventCustomOption"
    />
  </div>
</template>

<script>
export default {
  data() {
    return {
      eventCustomOption: {
        // body 列事件自定义
        bodyCellEvents: ({ row, column, rowIndx }) => {
          return {
            click: (event) => {
              if (event.shiftKey) {
                this.$refs.veTable.$refs.editInputRef.$refs.textareaInputRef.focus();
                return;
              }
            },
            dblclick: () => {
              console.log("bodyCellEvents click", row, column, rowIndx);
            },
          };
        },
      },

      copyData: null,
      clipboardOption: {
        copy: true,
        paste: false,
        cut: false,
        delete: true,
        beforeCopy: ({ data }) => {
          this.clipboardOption.paste = true;
          this.copyData = data;
        },
        afterPaste: ({ data, selectionRangeIndexes }) => {
          const oldData = this.copyData;
          const { startRowIndex, startColIndex } = selectionRangeIndexes;

          if (oldData == null) {
            let tableDataRow = startRowIndex;
            for (let index = 0; index < data.length; index++) {
              const element = data[index];
              let tableDataCol = startColIndex;
              const xData = this.tableData[tableDataRow];
              if (xData == undefined) {
                return;
              }
              /*  */
              for (const key in element) {
                if (Object.hasOwnProperty.call(element, key)) {
                  const item = element[key];
                  let obj = {};
                  if (item !== "[object Object]") {
                    obj = JSON.parse(JSON.stringify(item));
                  } else if (typeof item === "object") {
                    obj = JSON.parse(JSON.stringify(item));
                  } else {
                    obj = item;
                  }
                  this.$set(xData, tableDataCol++, obj);
                  // xData[tableDataCol++] = item;
                }
              }
              tableDataRow++;
            }
            return;
          }
          /* 正常复制 */
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
        afterCut: () => {
          /* 剪切本身不应该赋值,处理粘贴就好了 */
          // this.clipboardOption.afterPaste({ selectionRangeIndexes });
        },
        afterDelete: () => {
          /* 删除会让其变为 字符串 */
          // data, selectionRangeIndexes, selectionRangeKeys
        },
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
        sizeChange: ({ column, columnWidth }) => {
          const currentColumn = this.columns.find(
            (item) => item.key === column.key
          );
          currentColumn.width = columnWidth;
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
        // if (event.keyCode == 67 && (event.metaKey || event.ctrlKey)) {
        //   const newEvent = new ClipboardEvent("copy");
        //   document.dispatchEvent(newEvent);
        //   this.$refs.veTable.$refs.editInputRef.$refs.textareaInputRef.dispatchEvent(
        //     newEvent
        //   );
        // }
      };
      document.addEventListener("keydown", handle);
      this.$once("hook:beforeDestroy", () => {
        document.removeEventListener("keydown", handle);
      });
    },
    initColumns() {
      for (let i = 0; i < 3; i++) {
        this.columns.push({
          key: `${i + 1}`,
          title: `title_${i + 1}`,
          edit: false,
          width: 100,
          align: "center",
          children: [
            {
              field: `${i + 1}`,
              key: `${i + 1}`,
              title: `string`,
              edit: false,
              width: 100,
              renderBodyCell: ({ row, column, rowIndex }, h) => {
                row, column, rowIndex, h;
                if (row[`${i + 1}`]?.data instanceof Array) {
                  return row[`${i + 1}`].data
                    .map((item) => item.data)
                    .join(",");
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
      for (let i = 0; i < 4; i++) {
        const obj = {};
        if (i < 3) {
          for (let j = 0; j < 3; j++) {
            obj[`${j + 1}`] = {
              isEdit: false,
              data: `${j + 1}_${i + 1}`,
            };
          }
          obj[`3`] = {
            isEdit: false,
            data: [{ data: "11" }, { data: "22" }, { data: "33" }],
          };
        } else {
          for (let j = 0; j < 3; j++) {
            obj[`${j + 1}`] = null;
          }
          obj[`3`] = null;
        }
        obj.rowKey = i;
        data.push(obj);
      }
      this.tableData = data;
      // console.log(data);
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

      /* 处理数据 */
      for (let index = 0; index < colLength; index++) {
        const obj = this.tableData[index];
        this.$set(obj, `${colLength + 1}`, null);
      }
    },
    saveData() {
      /*  */
      // const data = {
      //   columns: this.columns,
      //   tableData: {},
      // };
      console.log(this.tableData);
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
/* .ve-table .ve-table-edit-input-container {
  opacity: 1 !important;
  z-index: 2 !important;
} */
</style>
