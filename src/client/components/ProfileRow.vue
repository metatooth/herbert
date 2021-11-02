<template>
  <tr>
    <td>
      <input
        v-if="editing"
        class="input"
        type="text"
        v-model="name"
        placeHolder="profile name"
      />
      <span v-else>{{ profile.profile }}</span>
    </td>
    <td>
      <input v-if="editing" class="input" type="time" v-model="lampstart" />
      <span class="is-family-code" v-else>
        {{ lamponHour }}:{{ lamponMinute }}
      </span>
    </td>
    <td>
      <input
        v-if="editing"
        class="input"
        type="number"
        v-model="lampduration"
        min="0"
        max="24"
        size="2"
      />
      <span class="is-family-code" v-else>
        {{ durationWithUnits }}
      </span>
    </td>
    <td>
      <div class="field is-grouped is-grouped-multiline" v-if="editing">
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
      <span class="field is-grouped" v-else>
        <target
          icon="thermometer-half"
          :value="dayTemperature"
          :precision="1"
          units="°"
          size="small"
          color="#ffe08a"
        />
        <target
          icon="tint"
          :value="dayHumidity"
          :precision="0"
          units="%"
          size="small"
          color="#ffe08a"
        />
      </span>
    </td>
    <td>
      <div class="field is-grouped is-grouped-multiline" v-if="editing">
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
      <span class="field is-grouped is-grouped-multiline" v-else>
        <target
          icon="thermometer-half"
          :value="nightTemperature"
          :precision="1"
          units="°"
          size="small"
          color="#7a7a7a"
        />
        <target
          icon="tint"
          :value="nightHumidity"
          :precision="0"
          units="%"
          size="small"
          color="#7a7a7a"
        />
      </span>
    </td>
    <td>
      <div class="field is-grouped is-grouped-multiline" v-if="editing">
        <div class="control has-icons-left">
          <input
            class="input"
            type="number"
            v-model="bloweractive"
            min="0"
            max="180"
            size="3"
          />
          <span class="icon is-left">
            <font-awesome-icon icon="wind" class="is-left" />
          </span>
        </div>
        <div class="control has-icons-left">
          <input
            class="input"
            type="number"
            v-model="blowercycle"
            min="30"
            max="864000000"
            size="3"
          />
          <span class="icon is-left">
            <font-awesome-icon icon="wind" class="is-left" />
          </span>
        </div>
      </div>

      <div class="tags has-addons" v-else>
        <span class="tag is-small has-text-success has-background-black-bis">
          <font-awesome-icon icon="wind" />
        </span>
        <span class="tag is-small has-text-dark is-success"
          >{{ bloweractive }}s / {{ blowercycle }}s</span
        >
      </div>
    </td>
    <td>
      <div class="field is-grouped is-grouped-multiline" v-if="editing">
        <div class="control has-icons-left">
          <input
            class="input"
            type="number"
            v-model="irrigationduration"
            min="0"
            max="3600"
            size="3"
          />
          <span class="icon is-left">
            <font-awesome-icon icon="cloud-rain" class="is-left" />
          </span>
        </div>
        <div class="control has-icons-left">
          <input
            class="input"
            type="number"
            v-model="irrigationperday"
            min="0"
            max="24"
            size="2"
          />
          <span class="icon is-left">
            <font-awesome-icon icon="cloud-rain" class="is-left" />
          </span>
        </div>
      </div>
      <div class="tags has-addons" v-else>
        <span class="tag is-small has-text-success has-background-black-bis">
          <font-awesome-icon icon="cloud-rain" />
        </span>
        <span class="tag is-small has-text-dark is-success"
          >{{ irrigationduration }}s</span
        >
        <span class="tag is-small has-text-dark is-success"
          >{{ irrigationperday }} / day</span
        >
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
      bloweractive: this.profile.bloweractive / 1000,
      blowercycle: this.profile.blowercycle / 1000,
      irrigationperday: parseInt(this.profile.irrigationperday),
      irrigationduration: this.profile.irrigationduration / 1000,
      updatedat: new Date(Date.parse(this.profile.updatedat)),
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
