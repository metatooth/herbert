<template>
  <tr>
    <td>
      <a :href="linkToConfig">{{ id }}</a>
    </td>
    <td>
      <timestamp :timestamp="timestamp" />
    </td>
    <td>
      <div>
        <a :href="linkToConfig">{{ profile || "Config me!" }}</a>
      </div>
    </td>
    <td>
      <div class="field is-grouped">
        <target
          icon="thermometer-half"
          :value="temp"
          :precision="1"
          :units="unitsWithDegree"
        />
        <target icon="tint" :value="humidity" :precision="0" units="%" />
        <target icon="cloud" :value="pressure" :precision="1" units="hPa" />
      </div>
    </td>
    <td>
      <div class="tags has-addons">
        <system name="lamp" :status="lamp" />
        <system name="blower" :status="blower" />
        <system name="heater" :status="heater" />
        <system name="dehumidifier" :status="dehumidifier" />
        <system name="humidifier" :status="humidifier" />
      </div>
    </td>
    <td>
      <router-link
        :to="{
          name: 'readings',
          params: { environment: id, name: 'Main', meter: main }
        }"
      >
        MAIN
      </router-link>
    </td>
    <td>
      <router-link
        :to="{
          name: 'readings',
          params: { environment: id, name: 'Intake', meter: intake }
        }"
      >
        INTAKE
      </router-link>
    </td>
  </tr>
</template>

<script lang="ts">
import Vue from "vue";

import Target from "@/components/Target.vue";
import Timestamp from "@/components/Timestamp.vue";
import System from "@/components/System.vue";

const ClientRow = Vue.extend({
  props: {
    id: {
      type: String,
      default: ""
    },
    main: {
      type: String,
      default: ""
    },
    intake: {
      type: String,
      default: ""
    },
    profile: {
      type: String,
      default: ""
    },
    temperature: {
      type: Number,
      default: -1
    },
    humidity: {
      type: Number,
      default: -1
    },
    pressure: {
      type: Number,
      default: -1
    },
    blower: Number,
    dehumidifier: Number,
    heater: Number,
    humidifier: Number,
    lamp: Number,
    timestamp: {
      type: Date,
      default: new Date()
    },
    units: {
      type: String,
      default: ""
    }
  },

  components: {
    Target,
    Timestamp,
    System
  },

  computed: {
    linkToConfig(): string {
      return "#" + this.id + "config";
    },

    temp(): number {
      if (this.units === "C") {
        return this.temperature;
      } else {
        return (this.temperature * 9) / 5 + 32;
      }
    },

    unitsWithDegree(): string {
      return "°" + this.units;
    }
  }
});

export default ClientRow;
</script>
