<script lang="ts">
import { mapActions, mapGetters } from "vuex";

import EditControls from "@client/components/EditControls.vue";
import MeterActual from "@client/components/MeterActual.vue";
import Readable from "@client/components/Readable.vue";
import { Meter } from "@client/store/meters/types";

export default {
  components: {
    EditControls,
    MeterActual,
    Readable,
  },

  props: {
    meter: { type: Meter, required: true },
    locked: Boolean,
    units: String,
  },

  data() {
    return {
      nickname: this.meter.nickname,
      updatedat: new Date(this.meter.updatedat),
      updating: false,
      editing: false,
    };
  },

  computed: {
    zone() {
      const found = this.zones.filter((zone) => {
        const meters = zone.meters.filter((meter) => {
          return this.meter.device === meter.device;
        });
        return meters.length !== 0;
      });

      return found.length !== 0 ? found[0] : null;
    },

    zoneid() {
      const zone = this.zone;
      if (zone) {
        return zone.id;
      }
      return 0;
    },

    zonename() {
      const zone = this.zone;
      if (zone) {
        return zone.nickname;
      }
      return "";
    },

    ...mapGetters("zones", ["zones"]),
  },

  watch: {
    meter() {
      this.updating = false;
    },
  },

  methods: {
    editable(): void {
      this.editing = true;
    },

    save(): void {
      this.edit({
        ...this.meter,
        nickname: this.nickname,
      });
      this.editing = false;
    },

    cancel() {
      this.nickname = this.meter.nickname;
      this.editing = false;
    },

    destroy() {
      if (confirm("OK to remove?")) {
        this.remove(this.meter);
      }
    },

    ...mapActions("meters", ["edit", "remove"]),
  },
};
</script>

<template>
  <tr>
    <td>
      <div v-if="editing" class="field is-grouped">
        <div class="control">
          <input
            v-model="nickname"
            class="input"
            type="text"
            @keyup.esc="cancel"
            @keyup.enter="save"
          />
        </div>
      </div>
      <span v-else class="is-size-5">
        {{ meter.name }}
      </span>
    </td>
    <td>
      {{ zonename }}
    </td>
    <td>
      <meter-actual :meter="meter" :units="units" />
    </td>
    <td class="is-italic">
      <router-link
        :to="{
          name: 'readings',
          params: { name: meter.nickname, device: meter.device },
        }"
      >
        <readable :timestamp="new Date(meter.timestamp)" />
      </router-link>
    </td>
    <td class="is-size-5">
      {{ meter.device }}
    </td>
    <td>
      <edit-controls
        v-if="!locked"
        @on-edit="editable"
        @on-save="save"
        @on-destroy="destroy"
        @on-cancel="cancel"
      />
    </td>
  </tr>
</template>
