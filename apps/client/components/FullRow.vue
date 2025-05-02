<script lang="ts">
import ConfigRow from "@client/components/ConfigRow.vue";
import DeviceRow from "@client/components/DeviceRow.vue";
import MeterRow from "@client/components/MeterRow.vue";
import ProfileRow from "@client/components/ProfileRow.vue";
import WorkerRow from "@client/components/WorkerRow.vue";
import ZoneRow from "@client/components/ZoneRow.vue";

export default {
  components: {
    ConfigRow,
    DeviceRow,
    MeterRow,
    ProfileRow,
    WorkerRow,
    ZoneRow,
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
          itemtype = ConfigRow;
          break;
        case "device":
          itemtype = DeviceRow;
          break;
        case "meter":
          itemtype = MeterRow;
          break;
        case "profile":
          itemtype = ProfileRow;
          break;
        case "worker":
          itemtype = WorkerRow;
          break;
        case "zone":
          itemtype = ZoneRow;
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
