<script lang="ts">
import ConfigNarrow from "@client/components/ConfigNarrow.vue";
import DeviceNarrow from "@client/components/DeviceNarrow.vue";
import MeterNarrow from "@client/components/MeterNarrow.vue";
import ProfileNarrow from "@client/components/ProfileNarrow.vue";
import WorkerNarrow from "@client/components/WorkerNarrow.vue";
import ZoneNarrow from "@client/components/ZoneNarrow.vue";

export default {
  components: {
    ConfigNarrow,
    DeviceNarrow,
    MeterNarrow,
    ProfileNarrow,
    WorkerNarrow,
    ZoneNarrow,
  },

  props: {
    item: { type: Object, required: true },
    type: { type: String, required: true },
  },

  computed: {
    row() {
      let itemtype = null;
      switch (this.type) {
        case "config":
          itemtype = ConfigNarrow;
          break;
        case "device":
          itemtype = DeviceNarrow;
          break;
        case "meter":
          itemtype = MeterNarrow;
          break;
        case "profile":
          itemtype = ProfileNarrow;
          break;
        case "worker":
          itemtype = WorkerNarrow;
          break;
        case "zone":
          itemtype = ZoneNarrow;
          break;
        default:
      }

      return itemtype;
    },
  },
};
</script>

<template>
  <component
    :is="row"
    :config="item"
    :device="item"
    :meter="item"
    :profile="item"
    :worker="item"
    :zone="item"
  />
</template>
