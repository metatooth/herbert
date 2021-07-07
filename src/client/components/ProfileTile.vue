<template>
  <div class="tile is-parent">
    <div class="tile is-child box">
      <p class="title">
        HERE
      </p>
      <div class="content">
      </div>
      <div class="content">
        <timestamp :timestamp="lastupdate" :readable="readable" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { mapActions } from "vuex";
import Target from "@/components/Target.vue";
import {
  celsius2fahrenheit,
  celsius2kelvin,
  fahrenheit2celsius,
  kelvin2celsius,
  vaporPressureDeficit
} from "../../shared/utils";
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
    } else if (this.units === "K") {
      lampon = celsius2kelvin(lampon);
      lampoff = celsius2kelvin(lampoff);
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

  computed: {
    durationWithUnits(): string {
      return this.profile.lampduration["hours"] + "hrs";
    },

    unitsWithDegree(): string {
      return "°" + this.units;
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

    lastupdate() {
      return this.updatedat;
    },

    dayTemperature(): number {
      if (this.units === "F") {
        return celsius2fahrenheit(this.profile.lampontemperature);
      } else if (this.units === "K") {
        return celsius2kelvin(this.profile.lampontemperature);
      }

      return this.profile.lampontemperature;
    },

    nightTemperature(): number {
      if (this.units === "F") {
        return celsius2fahrenheit(this.profile.lampofftemperature);
      } else if (this.units === "K") {
        return celsius2kelvin(this.profile.lampofftemperature);
      }

      return this.profile.lampofftemperature;
    },

    dayHumidity(): number {
      return this.profile.lamponhumidity;
    },

    nightHumidity(): number {
      return this.profile.lampoffhumidity;
    },

    lampMin(): number {
      let min = 15;
      if (this.units === "F") {
        min = celsius2fahrenheit(min);
      } else if (this.units === "K") {
        min = celsius2kelvin(min);
      }

      return min;
    },

    lampMax(): number {
      let max = 30;
      if (this.units === "F") {
        max = celsius2fahrenheit(max);
      } else if (this.units === "K") {
        max = celsius2kelvin(max);
      }

      return max;
    },

    dayPressure(): number {
      return (
        vaporPressureDeficit(
          this.profile.lampontemperature,
          0.6,
          this.profile.lamponhumidity / 100
        ) / 1000
      );
    },

    nightPressure(): number {
      return (
        vaporPressureDeficit(
          this.profile.lampofftemperature,
          -0.6,
          this.profile.lampoffhumidity / 100
        ) / 1000
      );
    }
  },

  methods: {
    editable() {
      this.editing = true;
    },

    save() {
      const start = this.lampstart.split(":");
      let hourInt = parseInt(start[0]);
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
        ontemp = fahrenheit2celsius(ontemp);
        offtemp = fahrenheit2celsius(offtemp);
      } else if (this.units === "K") {
        ontemp = kelvin2celsius(ontemp);
        offtemp = kelvin2celsius(offtemp);
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
