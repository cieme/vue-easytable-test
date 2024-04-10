<!-- eslint-disable vue/no-mutating-props -->
<template>
  <div style="width: 100%; height: 100%" @click.stop>
    <el-input v-model="cellData.title" type="text"></el-input>
  </div>
</template>
<script>
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
