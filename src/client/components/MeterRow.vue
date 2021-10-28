<template>
  <tr>
    <td>
      <div class="field is-grouped" v-if="editing">
        <div class="control">
          <input
            class="input is-small"
            type="text"
            v-model="nickname"
            @keyup.esc="cancel"
            @keyup.enter="save"
          />
        </div>
        <div class="control">
          <button class="button is-small is-primary" @click="save">
            <font-awesome-icon icon="check" />
          </button>
        </div>
        <div class="control">
          <button class="button is-small is-danger" @click="cancel">
            <font-awesome-icon icon="times" />
          </button>
        </div>
      </div>
      <a class="is-size-5" @click="editable" v-if="!editing">
        {{ meter.name }}
      </a>
    </td>
    <td>
      <meter-actual :meter="meter" :units="units" />
    </td>
    <td>
      <timestamp :timestamp="new Date(Date.parse(meter.timestamp))" />
    </td>
    <td class="is-size-5">
      <router-link
        :to="{
          name: 'readings',
          params: { name: meter.nickname, device: meter.device }
        }"
      >
        &gt;&gt;&gt;
      </router-link>
    </td>
    <td class="is-size-5">
      {{ meter.device }}
    </td>
    <td>
      <edit-controls
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
import { mapState, mapActions } from "vuex";
import { Meter } from "@/store/meters/types";
import { Notification } from "@/store/notifications/types";
import { celsius2fahrenheit, celsius2kelvin } from "../../shared/utils";
import Timestamp from "@/components/Timestamp.vue";
import MeterActual from "@/components/MeterActual.vue";
import EditControls from "@/components/EditControls.vue";

const MeterRow = Vue.extend({
  props: {
    meter: Meter,
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
    Timestamp
  },

  watch: {
    meter() {
      this.updating = false;
    }
  },

  computed: {
    meterClass(): string {
      const found = this.notifications.find((n: Notification) => {
        return n.id === this.meter.device;
      });
      if (found) {
        return "has-text-danger";
      }

      return "has-text-success";
    },
    meterReadingHumidity(): number {
      return 100 * this.meter.humidity;
    },
    meterReadingTemperature(): number {
      if (this.units === "C") {
        return this.meter.temperature;
      } else if (this.units === "F") {
        return celsius2fahrenheit(this.meter.temperature);
      }
      return celsius2kelvin(this.meter.temperature);
    },
    unitsWithDegrees(): string {
      return "°" + this.units;
    },

    ...mapState("notifications", ["notifications"])
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
