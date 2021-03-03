<template>
  <tr>
    <td class="has-background-primary-light">
      <div v-if="!editing">{{ profile.profile }}</div>
      <div v-else>
        <input
          class="input"
          type="text"
          v-model="name"
          placeHolder="profile name"
        />
      </div>
    </td>
    <td class="has-background-light">
      <div class="is-family-code" v-if="!editing">
        {{ lampOnHour }}:{{ lampOnMinute }}
      </div>
      <div v-else>
        <input
          class="input"
          type="time"
          v-model="lampStart"
        />
      </div>
    </td>
    <td class="has-background-light">
      <div class="is-family-code" v-if="!editing">
        {{ duration }}
      </div>
      <div v-else>
        <input
          class="input"
          type="number"
          v-model="lampDuration"
          min="0"
          max="24"
          size="2"
        />
      </div>
    </td>
    <td class="has-background-warning-light" v-if="!editing">
      <target
        v-if="!editing"
        icon="thermometer-half"
        :value="dayTemperature"
        :precision="1"
        :units="unitsWithDegree"
        text="black"
        background="warning"
        />
      <target
        icon="tint"
        :value="parseFloat(profile.lamp_on_humidity)"
        :precision="0"
        units="%"
        text="black"
        background="warning"
      />
      <target
        icon="cloud"
        :value="lampOnPressure"
        :precision="1"
        units="hPa"
        text="black"
        background="warning"
      />
    </td>
    <td v-if="editing">
      <div class="field">
        <div class="control has-icons-left">
          <input
            class="input"
            type="number"
            v-model="lampOnTemperature"
            min="lampMin"
            max="lampMax"
            size="2"
            />
          <span class="icon is-left">
            <font-awesome-icon icon="thermometer-half" class="is-left" />
          </span>
        </div>
        <div class="control has-icons-left">
          <input
            class="input"
            type="number"
            v-model="lampOnHumidity"
            min="0"
            max="100"
            size="2"
            />
          <span class="icon is-left">
            <font-awesome-icon icon="tint" class="is-left" />
          </span>
        </div>        
      </div>
    </td>
    <td class="has-background-info-light" v-if="!editing">
      <target
        icon="thermometer-half"
        :value="nightTemperature"
        :precision="1"
        :units="unitsWithDegree"
        text="black"
        background="info"
      />
      <target
        icon="tint"
        :value="parseFloat(profile.lamp_off_humidity)"
        :precision="0"
        units="%"
        text="black"
        background="info"
      />
      <target
        icon="cloud"
        :value="lampOffPressure"
        :precision="1"
        units="hPa"
        text="black"
        background="info"
        />
    </td>
    <td v-if="editing">
      <div class="field">
        <div class="control has-icons-left">
          <input
            class="input"
            type="number"
            v-model="lampOffTemperature"
            min="tempMin"
            max="tempMax"
            size="2"
            />
          <span class="icon is-left">
            <font-awesome-icon icon="thermometer-half" class="is-left" />
          </span>
        </div>
        <div class="control has-icons-left">
          <input
            class="input"
            type="number"
            v-model="lampOffHumidity"
            min="0"
            max="100"
            size="2"
            />
          <span class="icon is-left">
            <font-awesome-icon icon="tint" class="is-left" />
          </span>
        </div>        
      </div>
    </td>
    <td>
      <edit-controls
        @on-edit="edit"
        @on-save="save"
        @on-destroy="destroy"
        @on-cancel="cancel"
      />
    </td>
  </tr>
</template>

<script lang="ts">
import Vue from "vue";
import Target from "@/components/Target.vue";
import EditControls from "@/components/EditControls.vue";

import { vaporPressureDeficit } from "../../shared/utils";

const ProfileRow = Vue.extend({
  props: {
    profile: Object,
    units: String
  },

  data() {
    const start = this.profile.lamp_start.split(":");
    console.log(start);
    let hourInt = parseInt(start[0]) - 5; // WARNING!
    if (hourInt < 0) {
      hourInt = 24 + hourInt;
    }
    let hourString;
    if (hourInt < 10) {
      hourString = "0" + hourInt;
    } else {
      hourString = hourInt.toString();
    }
    console.log(hourInt);
    console.log(hourString);

    let lampOn = parseFloat(this.profile.lamp_on_temperature);
    let lampOff = parseFloat(this.profile.lamp_off_temperature);

    if (this.units === "F") {
      lampOn = lampOn * 9 / 5 + 32;
      lampOff = lampOff * 9 / 5 + 32;
    }
    
    return {
      name: this.profile.profile,
      lampStart: `${hourString}:${start[1]}:00`,
      lampDuration: this.profile.lamp_duration["hours"],
      lampOnTemperature: lampOn,
      lampOffTemperature: lampOff,
      lampOnHumidity: this.profile.lamp_on_humidity,
      lampOffHumidity: this.profile.lamp_off_humidity,
      editing: false
    }
  },
  
  components: {
    EditControls,
    Target
  },

  computed: {
    duration(): string {
      return this.profile.lamp_duration["hours"] + "hrs";
    },

    unitsWithDegree(): string {
      return "°" + this.units;
    },

    dayTemperature(): number {
      if (this.units === "F") {
        return (this.profile.lamp_on_temperature * 9) / 5 + 32;
      }

      return parseFloat(this.profile.lamp_on_temperature);
    },

    nightTemperature(): number {
      if (this.units === "F") {
        return (this.profile.lamp_off_temperature * 9) / 5 + 32;
      }

      return parseFloat(this.profile.lamp_off_temperature);
    },

    lampMin(): number {
      const min = 15;
      if (this.units === "F") {
        return (min * 9) / 5 + 32;
      }

      return min;
    },
                  
    lampMax(): number {
      const max = 30;
      if (this.units === "F") {
        return (max * 9) / 5 + 32;
      }

      return max;
    },
                  
    lampOnMinute(): string {
      const start = this.profile.lamp_start.split(":");
      return start[1];
    },
    
    lampOnHour(): string {
      const start = this.profile.lamp_start.split(":");
      const hour = parseInt(start[0]) - 5; // WARNING! 
     
      if (hour < 0) {
        return (24 + hour).toString();
      } else if (hour < 10) {
        return "0" + hour;
      } else {
        return hour.toString();
      }
    },

    lampOnPressure(): number {
      return (
        vaporPressureDeficit(
          parseFloat(this.profile.lamp_on_temperature),
          0.6,
          parseFloat(this.profile.lamp_on_humidity) / 100
        ) / 1000
      );
    },

    lampOffPressure(): number {
      return (
        vaporPressureDeficit(
          parseFloat(this.profile.lamp_off_temperature),
          -0.6,
          parseFloat(this.profile.lamp_off_humidity) / 100
        ) / 1000
      );
    },

    updatedAt(): Date {
      return new Date(Date.parse(this.profile.updated_at));
    }
  },

  watch: {
    units(val) {
      if (val === "F") {
        this.lampOnTemperature = (this.lampOnTemperature * 9) / 5 + 32;
        this.lampOffTemperature = (this.lampOffTemperature * 9) / 5 + 32;
      } else {
        this.lampOnTemperature = (this.lampOnTemperature - 32) * 5 / 9;
        this.lampOffTemperature = (this.lampOffTemperature - 32) * 5 / 9;
      }
    }
  },
  
  methods: {
    edit() {
      this.editing = true;
    },

    save() {
      const start = this.lampStart.split(":");
      let hourInt = parseInt(start[0]) + 5; // WARNING!
      if (hourInt > 24) {
        hourInt = hourInt - 24;
      }
      let hourString;
      if (hourInt < 10) {
        hourString = "0" + hourInt;
      } else {
        hourString = hourInt.toString();
      }

      let onTemp = this.lampOnTemperature;
      let offTemp = this.lampOffTemperature;
      if (this.units === "F") {
        onTemp = (onTemp - 32) * 5 / 9;
        offTemp = (offTemp - 32) * 5 / 9;
      }
      
      const profile = {
        id: this.profile.id,
        profile: this.name,
        lampStart: `${hourString}:${start[1]}`,
        lampDuration: `${this.lampDuration} hours`,
        lampOnTemperature: onTemp,
        lampOnHumidity: this.lampOnHumidity,
        lampOffTemperature: offTemp, 
        lampOffHumidity: this.lampOffHumidity
     };

      console.log("SAVE PROFILE", profile);
      this.$store.dispatch("editProfile", profile);
      this.editing = false;
    },

    destroy() {
      this.$store.dispatch("removeProfile", this.profile);
      this.editing = false;
    },

    cancel() {
      this.editing = false;
    }
  }

});

export default ProfileRow;
</script>
