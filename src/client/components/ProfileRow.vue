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
      <div class="field is-grouped">
        <target
          icon="thermometer-half"
          :value="dayTemperature"
          :precision="1"
          :units="unitsWithDegree"
          size="small"
          text="black"
          background="warning"
        />
        <target
          icon="tint"
          :value="parseFloat(profile.lamponhumidity)"
          :precision="0"
          units="%"
          size="small"
          text="black"
          background="warning"
        />
        <target
          icon="cloud"
          :value="lamponPressure"
          :precision="1"
          units="hPa"
          size="small"
          text="black"
          background="warning"
        />
      </div>
    </td>
    <td v-if="editing">
      <div class="field is-grouped">
        <div class="control has-icons-left">
          <input
            class="input"
            type="number"
            v-model="lampontemperature"
            min="lampMin"
            max="lampMax"
            size="4"
            step="0.1"
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
      <div class="field is-grouped">
        <target
          icon="thermometer-half"
          :value="nightTemperature"
          :precision="1"
          :units="unitsWithDegree"
          size="small"
          text="white"
          background="info"
        />
        <target
          icon="tint"
          :value="parseFloat(profile.lampoffhumidity)"
          :precision="0"
          units="%"
          size="small"
          text="white"
          background="info"
        />
        <target
          icon="cloud"
          :value="lampoffPressure"
          :precision="1"
          units="hPa"
          size="small"
          text="white"
          background="info"
        />
      </div>
    </td>
    <td v-if="editing">
      <div class="field is-grouped">
        <div class="control has-icons-left">
          <input
            class="input"
            type="number"
            v-model="lampofftemperature"
            min="tempMin"
            max="tempMax"
            step="0.1"
            size="4"
          />
          <span class="icon is-left">
            <font-awesome-icon icon="thermometer-half" class="is-left" />
          </span>
        </div>
        <div class="control has-icons-left">
          <input
            class="input"
            type="number"
            v-model="lampoffhumidity"
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
import { mapActions } from "vuex";
import Target from "@/components/Target.vue";
import EditControls from "@/components/EditControls.vue";
import { celsius2fahrenheit, vaporPressureDeficit } from "../../shared/utils";
import { Profile } from "@/store/profiles/types";

const ProfileRow = Vue.extend({
  props: {
    profile: Profile,
    units: String
  },

  data() {
    const start = this.profile.lampstart.split(":");
    let hourInt = parseInt(start[0]);
    if (hourInt < 0) {
      hourInt = 24 + hourInt;
    }
    let hourString;
    if (hourInt < 10) {
      hourString = "0" + hourInt;
    } else {
      hourString = hourInt.toString();
    }

    let lampon = this.profile.lampontemperature;
    let lampoff = this.profile.lampofftemperature;

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
      lampoffhumidity: this.profile.lampoffhumidity,
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
      const hour = parseInt(start[0]);

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
          this.profile.lamponhumidity / 100
        ) / 1000
      );
    },

    lampoffPressure(): number {
      return (
        vaporPressureDeficit(
          parseFloat(this.profile.lampofftemperature),
          -0.6,
          this.profile.lampoffhumidity / 100
        ) / 1000
      );
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
    editable() {
      this.editing = true;
    },

    save() {
      const start = this.lampstart.split(":");
      console.log("start", start);
      let hourInt = parseInt(start[0]);
      if (hourInt > 24) {
        hourInt = hourInt - 24;
      }
      console.log("hour int", hourInt);

      let hourString;
      if (hourInt < 10) {
        hourString = "0" + hourInt;
      } else {
        hourString = hourInt.toString();
      }
      console.log("hour string", hourString);

      let ontemp = this.lampontemperature;
      let offtemp = this.lampofftemperature;
      if (this.units === "F") {
        ontemp = ((ontemp - 32) * 5) / 9;
        offtemp = ((offtemp - 32) * 5) / 9;
      }
      console.log("lampstart", `${hourString}:${start[1]}`);
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

      this.edit(profile);
      this.editing = false;
    },

    destroy() {
      this.remove(this.profile);
      this.editing = false;
    },

    cancel() {
      this.editing = false;
    },

    ...mapActions("profiles", ["edit", "remove"])
  }
});

export default ProfileRow;
</script>
