<template>
  <div class="container">
    <ve-table
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
        beforeCopy: ({ data, selectionRangeIndexes, selectionRangeKeys }) => {
          console.log("beforeCopy");
          this.log({ data, selectionRangeIndexes, selectionRangeKeys });
          this.copyData = data;
        },
        afterCopy: ({ data, selectionRangeIndexes, selectionRangeKeys }) => {
          console.log("afterCopy");
          this.log({ data, selectionRangeIndexes, selectionRangeKeys });
        },
        beforePaste: ({ data, selectionRangeIndexes, selectionRangeKeys }) => {
          data = this.copyData;
          console.log("beforePaste");
          this.log({ data, selectionRangeIndexes, selectionRangeKeys });
        },
        afterPaste: ({ data, selectionRangeIndexes, selectionRangeKeys }) => {
          data = this.copyData;
          console.log("afterPaste");
          this.log({ data, selectionRangeIndexes, selectionRangeKeys });
          console.log(this.tableData);
        },
        beforeCut: ({ data, selectionRangeIndexes, selectionRangeKeys }) => {
          console.log("beforeCut");
          this.log({ data, selectionRangeIndexes, selectionRangeKeys });
        },
        afterCut: ({ data, selectionRangeIndexes, selectionRangeKeys }) => {
          console.log("afterCut");
          this.log({ data, selectionRangeIndexes, selectionRangeKeys });
        },
        beforeDelete: ({ data, selectionRangeIndexes, selectionRangeKeys }) => {
          console.log("beforeDelete");
          this.log({ data, selectionRangeIndexes, selectionRangeKeys });
        },
        afterDelete: ({ data, selectionRangeIndexes, selectionRangeKeys }) => {
          console.log("afterDelete");
          this.log({ data, selectionRangeIndexes, selectionRangeKeys });
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
      for (let i = 0; i < 10; i++) {
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
      for (let i = 0; i < 5; i++) {
        const obj = {};
        for (let j = 0; j < 8; j++) {
          obj[`${j + 1}`] = {
            data: `${j + 1}_${i + 1}`,
          };
        }
        obj[`9`] = [{ data: "11" }, { data: "22" }, { data: "33" }];
        obj.rowKey = i;
        data.push(obj);
      }
      this.tableData = data;
      console.log(data);
    },
  },
};
</script>
<style>
body {
  min-height: 100vh;
}
.container {
  width: 100%;
}
</style>
