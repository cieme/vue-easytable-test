<!-- eslint-disable vue/no-mutating-props -->
<template>
  <div style="width: 100%; height: 100%" @click.stop>
    <el-input
      v-if="cellData.title == 'number'"
      v-model="cellData.data"
      type="number"
    ></el-input>
    <el-input
      v-else
      type="textarea"
      autosize
      v-model="cellData.data"
      ref="textareaInputRef"
    />
  </div>
</template>
<script>
// @input.native="inputHandle"
// @keydown.native="keydownHandle"
export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: "Edit",
  props: {
    cellData: Object,
    column: Object,
  },
  inject: ["veTable"],
  data() {
    return {
      options: [],
    };
  },
  mounted() {
    this.addEvent();
    this.$nextTick(() => {
      this.resize();
    });
  },
  methods: {
    resize() {
      this.veTable.$refs.veTable.$refs.cellSelectionRef.resetCellPositions();
    },
    addEvent() {
      const handle = (e) => {
        e.stopPropagation();
        e.preventDefault();
        // eslint-disable-next-line vue/no-mutating-props
        this.cellData.isEdit = false;
        this.$nextTick(() => {
          this.resize();
        });
        this.veTable.isEditToggle(false);
        // this.veTable.cellSelectionToggle(true);
      };

      document.addEventListener("click", handle);
      document.addEventListener("contextmenu", handle);
      this.$once("hook:beforeDestroy", () => {
        document.removeEventListener("click", handle);
        document.removeEventListener("contextmenu", handle);
      });
    },
    inputHandle(e) {
      // console.log(e.target.value);
      // if (e.target.value === "[object Object]") {
      //   // eslint-disable-next-line vue/no-mutating-props
      //   this.cellData.data = "";
      // }
    },
    keydownHandle(e) {
      if (e.keyCode === 8 || e.keyCode === 46) {
        // eslint-disable-next-line vue/no-mutating-props
        this.cellData.data = this.cellData.data.slice(
          0,
          this.cellData.data.length - 1
        );
      }
    },
  },
};
</script>
