<!-- eslint-disable vue/no-mutating-props -->
<template>
  <div style="width: 100%; height: 100%">
    <Edit v-if="isEdit" :cellData.sync="row[i]" />
    <div v-else style="line-height: 40px">
      <template>
        {{ dataRender }}
      </template>
    </div>
  </div>
</template>
<script>
import Edit from "./Edit.vue";
export default {
  name: "BodyCell",
  components: {
    Edit,
  },
  props: {
    row: Object,
    column: Object,
    rowIndex: Number,
    i: Number,
  },
  computed: {
    isEdit() {
      return this?.row[this.i]?.isEdit;
    },
    data() {
      return this?.row[this?.i]?.data;
    },
    dataRender() {
      if (this.data instanceof Array) {
        return this.data.map((item) => item.data).join(",");
      }
      return this.data;
    },
  },
  updated() {
    if (
      typeof this?.row[this.i] === "string" ||
      this?.row[this.i] === null ||
      this?.row[this.i] === undefined
    ) {
      this.$set(this.row, this.i, { data: "", isEdit: false });
    }
  },
};
</script>
