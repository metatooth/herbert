<template>
  <tr>
    <td>
      <div class="field is-grouped" v-if="editing">
        <div class="control">
          <input
            class="input"
            type="text"
            v-model="nickname"
            @keyup.esc="cancel"
            @keyup.enter="save"
          />
        </div>
      </div>
      <span class="is-size-5" v-else>
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
      <readable :timestamp="new Date(Date.parse(meter.timestamp))" />
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

<script lang="ts">
import Vue from "vue";
import { mapActions, mapGetters } from "vuex";

import EditControls from "@/components/EditControls.vue";
import MeterActual from "@/components/MeterActual.vue";
import Readable from "@/components/Readable.vue";
import { Meter } from "@/store/meters/types";

const MeterRow = Vue.extend({
  props: {
    meter: Meter,
    locked: Boolean,
    units: String
  },

  data() {
    return {
      nickname: this.meter.nickname,
      updatedat: new Date(Date.parse(this.meter.updatedat)),
      updating: false,
      editing: false
    };
  },

  components: {
    EditControls,
    MeterActual,
    Readable
  },

  watch: {
    meter() {
      this.updating = false;
    }
  },

  computed: {
    zone() {
      const found = this.zones.filter(zone => {
        const meters = zone.meters.filter(meter => {
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

    ...mapGetters("zones", ["zones"])
  },

  methods: {
    editable(): void {
      this.editing = true;
    },

    save(): void {
      this.edit({
        ...this.meter,
        nickname: this.nickname
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

    ...mapActions("meters", ["edit", "remove"])
  }
});

export default MeterRow;
</script>
