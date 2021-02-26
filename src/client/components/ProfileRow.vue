<template>
  <tr>
    <td class="has-background-primary-light">{{ profile }}</td>
    <td class="has-background-light">
      <span class="is-family-code"> {{ lampOnHour }}:{{ lampOnMinute }} </span>
      /
      <span class="is-family-code">
        {{ duration }}
      </span>
    </td>
    <td class="has-background-warning-light">
      <target
        icon="thermometer-half"
        :value="dayTemperature"
        :precision="1"
        :units="unitsWithDegree"
      />
    </td>
    <td class="has-background-warning-light">
      <target icon="tint" :value="lampOnHumidity" :precision="0" units="%" />
    </td>
    <td class="has-background-warning-light">
      <target icon="cloud" :value="lampOnPressure" :precision="1" units="hPa" />
    </td>
    <td class="has-background-info-light">
      <target
        icon="thermometer-half"
        :value="nightTemperature"
        :precision="1"
        :units="unitsWithDegree"
      />
    </td>
    <td class="has-background-info-light">
      <target icon="tint" :value="lampOffHumidity" :precision="0" units="%" />
    </td>
    <td class="has-background-info-light">
      <target
        icon="cloud"
        :value="lampOffPressure"
        :precision="1"
        units="hPa"
      />
    </td>
  </tr>
</template>

<script lang="ts">
import Vue from "vue";
import Target from "@/components/Target.vue";
import { vaporPressureDeficit } from "../../shared/utils";

const ProfileRow = Vue.extend({
  props: {
    id: { type: Number, default: -1 },
    profile: { type: String, default: "" },
    lampOnHour: { type: String, default: "00" },
    lampOnMinute: { type: String, default: "00" },
    lampDuration: { type: Number, default: -1 },
    lampOnTemperature: { type: Number, default: -1 },
    lampOnHumidity: { type: Number, default: -1 },
    lampOffTemperature: { type: Number, default: -1 },
    lampOffHumidity: { type: Number, default: -1 },
    units: { type: String, default: "F" },
    timestamp: { type: Date, default: new Date() }
  },

  components: {
    Target
  },

  computed: {
    duration(): string {
      return this.lampDuration + "hrs";
    },

    unitsWithDegree(): string {
      return "°" + this.units;
    },

    dayTemperature(): number {
if (this.units === "F") {
return this.lampOnTemperature * 9 /5 + 32;
} 

return this.lampOnTemperature;
},

nightTemperature(): number {
if (this.units === "F") {
return this.lampOffTemperature * 9 /5 + 32;
} 

return this.lampOffTemperature;
},

    lampOnPressure(): number {
      return (
        vaporPressureDeficit(
          this.lampOnTemperature,
          0.6,
          this.lampOnHumidity / 100
        ) / 1000
      );
    },

    lampOffPressure(): number {
      return (
        vaporPressureDeficit(
          this.lampOffTemperature,
          -0.6,
          this.lampOffHumidity / 100
        ) / 1000
      );
    }
  }
});

export default ProfileRow;
</script>
