<template>
  <div class="container">
    <div v-click-outside="clickoutsideHandle" style="background: red">
      <div class="btn-group">
        <el-button type="primary" @click="addRow">添加行2</el-button>
        <el-button type="primary" @click="addCol">添加列2</el-button>
        <el-button type="primary" @click="saveData">保存数据2</el-button>
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
        :cell-selection-option="cellSelectionOption"
        :eventCustomOption="eventCustomOption"
      />
      <input type="text" value="12343241" />
    </div>
  </div>
</template>

<script>
import clickoutside from "./directives/clickoutside";
import BodyCell from "./components/bodyCell.vue";
import bodyTitleCell from "./components/bodyTitleCell.vue";
export default {
  name: "ViewView2",
  components: {
    // eslint-disable-next-line vue/no-unused-components
    BodyCell,
    // eslint-disable-next-line vue/no-unused-components
    bodyTitleCell,
  },
  directives: {
    "click-outside": clickoutside,
  },
  provide() {
    return {
      veTable: this,
    };
  },
  data() {
    return {
      /*  */
      copyData: null,
      isEdit: false,
      editData: null,
      editHeaderData: null,
      eventCustomOption: {
        headerCellEvents: ({ column, rowIndex }) => {
          return {
            dblclick: () => {
              const key = column.key;
              const currentColumn = this.columns.find(
                (item) => item.key === key
              );
              if (this.editHeaderData) {
                this.editHeaderData.isEdit = false;
                this.editHeaderData.children[0].isEdit = false;
              }
              this.editHeaderData = currentColumn;
              if (rowIndex == 0) {
                currentColumn.isEdit = true;
              } else if (rowIndex == 1) {
                currentColumn.children[0].isEdit = true;
                /* 取children */
              }
              this.isEditToggle(true);
            },
          };
        },
        // body 列事件自定义
        bodyCellEvents: ({ row, column, rowIndex }) => {
          return {
            click: (event) => {
              /*  */
              if (event.shiftKey) {
                this.$refs.veTable.$refs.editInputRef.$refs.textareaInputRef.focus();
                return;
              }
            },
            dblclick: () => {
              if (column.key == "index") return false;

              rowIndex;
              if (this.editData) {
                this.editData.isEdit = false;
              }

              row[column.key].isEdit = true;
              this.editData = row[column.key];
              this.isEditToggle(true);
            },
          };
        },
      },
      editOption: {},
      clipboardOption: {
        copy: true,
        paste: false,
        cut: false,
        delete: true,
        beforeCopy: ({ data }) => {
          this.clipboardOption.paste = true;
          this.copyData = data;
        },
        afterPaste: ({ selectionRangeIndexes }) => {
          const oldData = this.copyData;
          const { startRowIndex, startColIndex } = selectionRangeIndexes;

          if (oldData == null) {
            return;
          }
          /* 正常复制 */
          let tableDataRow = startRowIndex;
          console.log(tableDataRow);
          for (let index = 0; index < oldData.length; index++) {
            const element = oldData[index];
            let tableDataCol = startColIndex - 1;
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
        beforeDelete: () => {
          if (this.isEdit) {
            return false;
          }
        },
        afterDelete: ({ data, selectionRangeIndexes }) => {
          if (data == null) {
            return;
          }
          const { startRowIndex, startColIndex } = selectionRangeIndexes;
          let tableDataRow = startRowIndex;
          console.log(tableDataRow);

          for (let index = 0; index < data.length; index++) {
            const element = data[index];
            let tableDataCol = startColIndex - 1;
            const xData = this.tableData[tableDataRow];

            if (xData == undefined) {
              return;
            }
            /*  */
            for (const key in element) {
              if (Object.hasOwnProperty.call(element, key)) {
                let item = element[key];

                if (item === "" || item === null || item === undefined) {
                  item = {
                    isEdit: false,
                    data: "",
                  };
                }
                /* 清空值 */
                item.data = "";
                xData[tableDataCol++] = item;
              }
            }
            tableDataRow++;
          }
        },
      },
      cellSelectionOption: {
        enable: true,
      },
      /*  */
      rowStyleOption: {
        clickHighlight: false,
        hoverHighlight: false,
      },
      /* 拖拽宽度配置 */
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
          console.log(currentColumn);
          currentColumn.width = columnWidth;
        },
      },
      /* 表头 */
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
          isEdit: false,
          children: [
            {
              field: "index",
              key: "index",
              title: "string",
              width: 100,
              editable: false,
              edit: false,
              operationColumn: true,
              isEdit: false,
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
    this.$once("hook:beforeDestroy", () => {
      this.removeEvent();
    });
    this.$nextTick(() => {
      document.removeEventListener(
        "keydown",
        this.$refs.veTable.dealKeydownEvent
      );
    });
  },

  methods: {
    clickoutsideHandle() {
      this.$refs.veTable.tableClickOutside();
    },
    cellSelectionToggle(enable) {
      this.cellSelectionOption.enable = enable;
    },
    isEditToggle(enable) {
      this.isEdit = enable;

      // if (enable) {
      //   // 按下上、下、左、右按键可以直接选中其他单元格，并停止当前单元格编辑状态
      //   this.$refs.veTable.enableStopEditing = false;
      //   /* 打开 */

      //   // this.$set(this.clipboardOption, "delete", false);
      // } else {
      //   // 按下上、下、左、右按键可以直接选中其他单元格，并停止当前单元格编辑状态
      //   this.$refs.veTable.enableStopEditing = true;
      //   // this.$set(this.clipboardOption, "delete", true);
      // }
    },
    handle(event) {
      // if (this.isEdit) {
      //   return;
      // }
      // if (event.keyCode == 8) {
      //   const newEvent = new KeyboardEvent("keydown", {
      //     key: "Backspace",
      //     code: "Backspace",
      //     keyCode: 46,
      //     which: 46,
      //     charCode: 46,
      //     cancelable: true,
      //     bubbles: true,
      //   });
      //   document.dispatchEvent(newEvent);
      // }
      /* 如果是删除或者退格 */
      if (event.keyCode == 8 || event.keyCode == 46) {
        if (this.isEdit) {
          return false;
        }
        // const data = this.$refs.veTable.getRangeCellSelection();
        this.$refs.veTable.deleteCellSelectionRangeValue();
      }
    },
    handle2(e) {
      e.stopPropagation();
      e.preventDefault();
      this.clickoutsideHandle();
    },
    addEvent() {
      /*  */
      document.addEventListener("keydown", this.handle);
      document.addEventListener("contextmenu", this.handle2);
    },
    removeEvent() {
      document.removeEventListener("keydown", this.handle);
      document.removeEventListener("contextmenu", this.handle2);
    },
    initColumns() {
      for (let i = 0; i < 3; i++) {
        this.columns.push({
          key: `${i}`,
          title: `title_${i}`,
          edit: false,
          width: 100,
          align: "center",
          isEdit: false,
          renderHeaderCell: ({ column }, h) => {
            const currentColumn = this.columns.find(
              (item) => item.key === column.key
            );

            return h(bodyTitleCell, {
              props: {
                column: currentColumn,
                i,
              },
            });
          },
          children: [
            {
              field: `${i}`,
              key: `${i}`,
              title: `string`,
              edit: false,
              width: 100,
              isEdit: false,
              renderHeaderCell: ({ column }, h) => {
                const currentColumn = this.columns.find(
                  (item) => item.key === column.key
                );
                return (
                  currentColumn.children[0].title +
                  currentColumn.children[0].isEdit
                );
              },
              renderBodyCell: ({ row, column, rowIndex }, h) => {
                row, column, rowIndex, h;
                // console.log(row, column, rowIndex);
                const currentColumn = this.columns.find(
                  (item) => item.key === column.key
                );
                return h(BodyCell, {
                  props: {
                    row,
                    column: currentColumn.children[0],
                    rowIndex,
                    i,
                  },
                });
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
            obj[`${j}`] = {
              isEdit: false,
              data: `${j}_${i}`,
            };
          }
          obj[`2`] = {
            isEdit: false,
            data: [{ data: "11" }, { data: "22" }, { data: "33" }],
          };
        } else {
          for (let j = 0; j < 3; j++) {
            obj[`${j}`] = {
              isEdit: false,
              data: "",
            };
          }
          obj[`2`] = {
            isEdit: false,
            data: "",
          };
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
      /* col */
      const lastLength = this.columns.length - 1;
      const col = {
        key: `${lastLength}`,
        title: `title_${lastLength}`,
        edit: true,
        width: 100,
        align: "center",
        isEdit: false,
        renderHeaderCell: ({ column }, h) => {
          const currentColumn = col;
          // const currentColumn = this.columns.find(
          //   (item) => item.key === column.key
          // );
          console.log(col);
          return h(bodyTitleCell, {
            props: {
              column: currentColumn,
              i: lastLength,
            },
          });
        },
        children: [
          {
            field: `${lastLength}`,
            key: `${lastLength}`,
            title: `number`,
            edit: true,
            width: 100,
            isEdit: false,
            renderHeaderCell: ({ column }, h) => {
              const currentColumn = col;
              return (
                currentColumn.children[0].title +
                currentColumn.children[0].isEdit
              );
            },
            renderBodyCell: ({ row, column, rowIndex }, h) => {
              row, column, rowIndex, h;
              // console.log(row, column, rowIndex);
              const currentColumn = col;
              return h(BodyCell, {
                props: {
                  row,
                  column: currentColumn.children[0],
                  rowIndex,
                  i: lastLength,
                },
              });
            },
          },
        ],
      };
      this.columns.push(col);

      /* row */
      const colLength = Object.keys(this.tableData[0]).filter(
        (item) => item !== "rowKey"
      ).length;
      /* 列长 */

      /* 处理数据,较为重要 */
      for (let index = 0; index <= colLength; index++) {
        const obj = this.tableData[index];
        if (obj) {
          this.$set(obj, `${colLength}`, { isEdit: false, data: null });
        }
      }
      console.log(this.columns);
      console.log(this.tableData);
    },
    saveData() {
      /*  */
      // const data = {
      //   columns: this.columns,
      //   tableData: {},
      // };
      console.log(this.columns);
      console.log(this.tableData);
    },
  },
};
</script>
