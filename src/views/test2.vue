<template>
  <div>
    <JsonView :data="json">
      <template #jsonKey="{ data }">{{ data.jsonKey }} ：</template>
    </JsonView>
  </div>
</template>
<script>
import JsonView from "@/components/JsonView/index.vue";
import { areaAll } from "./config";
export default {
  name: "TestView2",
  components: {
    JsonView,
  },
  data() {
    return {
      json: areaAll,
    };
  },
};
</script>
