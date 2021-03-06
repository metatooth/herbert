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
        {{ lamponHour }}:{{ lamponMinute }}
      </div>
      <div v-else>
        <input class="input" type="time" v-model="lampstart" />
      </div>
    </td>
    <td class="has-background-light">
      <div class="is-family-code" v-if="!editing">
        {{ durationWithUnits }}
      </div>
      <div v-else>
        <input
          class="input"
          type="number"
          v-model="lampduration"
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
        :value="parseFloat(profile.lamponhumidity)"
        :precision="0"
        units="%"
        text="black"
        background="warning"
      />
      <target
        icon="cloud"
        :value="lamponPressure"
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
            v-model="lampontemperature"
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
            v-model="lamponhumidity"
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
        :value="parseFloat(profile.lampoffHumidity)"
        :precision="0"
        units="%"
        text="black"
        background="info"
      />
      <target
        icon="cloud"
        :value="lampoffPressure"
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
            v-model="lampofftemperature"
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
            v-model="lampoffHumidity"
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

import { celsius2fahrenheit, vaporPressureDeficit } from "../../shared/utils";

const ProfileRow = Vue.extend({
  props: {
    profile: Object,
    units: String
  },

  data() {
    console.log("profile", this.profile);
    const start = this.profile.lampstart.split(":");
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

    let lampon = parseFloat(this.profile.lampontemperature);
    let lampoff = parseFloat(this.profile.lampofftemperature);

    if (this.units === "F") {
      lampon = celsius2fahrenheit(lampon);
      lampoff = celsius2fahrenheit(lampoff);
    }

    return {
      name: this.profile.profile,
      lampstart: `${hourString}:${start[1]}:00`,
      lampduration: this.profile.lampduration["hours"],
      lampontemperature: lampon,
      lampofftemperature: lampoff,
      lamponhumidity: this.profile.lamponhumidity,
      lampoffHumidity: this.profile.lampoffHumidity,
      editing: false
    };
  },

  components: {
    EditControls,
    Target
  },

  computed: {
    durationWithUnits(): string {
      return this.profile.lampduration["hours"] + "hrs";
    },

    unitsWithDegree(): string {
      return "°" + this.units;
    },

    dayTemperature(): number {
      if (this.units === "F") {
        return celsius2fahrenheit(this.profile.lampontemperature);
      }

      return parseFloat(this.profile.lampontemperature);
    },

    nightTemperature(): number {
      if (this.units === "F") {
        return celsius2fahrenheit(this.profile.lampofftemperature);
      }

      return parseFloat(this.profile.lampofftemperature);
    },

    lampMin(): number {
      const min = 15;
      if (this.units === "F") {
        return celsius2fahrenheit(min);
      }

      return min;
    },

    lampMax(): number {
      const max = 30;
      if (this.units === "F") {
        return celsius2fahrenheit(max);
      }

      return max;
    },

    lamponMinute(): string {
      const start = this.profile.lampstart.split(":");
      return start[1];
    },

    lamponHour(): string {
      const start = this.profile.lampstart.split(":");
      const hour = parseInt(start[0]) - 5; // WARNING!

      if (hour < 0) {
        return (24 + hour).toString();
      } else if (hour < 10) {
        return "0" + hour;
      } else {
        return hour.toString();
      }
    },

    lamponPressure(): number {
      return (
        vaporPressureDeficit(
          parseFloat(this.profile.lampontemperature),
          0.6,
          parseFloat(this.profile.lamponhumidity) / 100
        ) / 1000
      );
    },

    lampoffPressure(): number {
      return (
        vaporPressureDeficit(
          parseFloat(this.profile.lampofftemperature),
          -0.6,
          parseFloat(this.profile.lampoffHumidity) / 100
        ) / 1000
      );
    },

    profileUpdatedAt(): Date {
      return new Date(Date.parse(this.profile.updatedAt));
    }
  },

  watch: {
    units(val) {
      if (val === "F") {
        this.lampontemperature = (this.lampontemperature * 9) / 5 + 32;
        this.lampofftemperature = (this.lampofftemperature * 9) / 5 + 32;
      } else {
        this.lampontemperature = ((this.lampontemperature - 32) * 5) / 9;
        this.lampofftemperature = ((this.lampofftemperature - 32) * 5) / 9;
      }
    }
  },

  methods: {
    edit() {
      this.editing = true;
    },

    save() {
      const start = this.lampstart.split(":");
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

      let ontemp = this.lampontemperature;
      let offtemp = this.lampofftemperature;
      if (this.units === "F") {
        ontemp = ((ontemp - 32) * 5) / 9;
        offtemp = ((offtemp - 32) * 5) / 9;
      }

      const profile = {
        id: this.profile.id,
        profile: this.name,
        lampstart: `${hourString}:${start[1]}`,
        lampduration: `${this.lampduration} hours`,
        lampontemperature: ontemp,
        lamponhumidity: this.lamponhumidity,
        lampofftemperature: offtemp,
        lampoffhumidity: this.lampoffhumidity
      };

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
