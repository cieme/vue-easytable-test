<!-- eslint-disable vue/no-mutating-props -->
<template>
  <div style="width: 100%; height: 100%">
    <bodyTitleEdit :cellData.sync="column" v-if="column.isEdit" />
    <template v-else> {{ column.title }} </template>
  </div>
</template>
<script>
import bodyTitleEdit from "./bodyTitleEdit";
export default {
  name: "BodyTitleCell",
  components: {
    bodyTitleEdit,
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
};
</script>
