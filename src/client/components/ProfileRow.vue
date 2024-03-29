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
      <span v-else>{{ name }}</span>
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
      <select-control-type
        :controltype="controltype"
        @select-controltype="selected"
        v-if="editing"
      />
      <span v-else>
        {{ controltype }}
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
          :value="parseFloat(lampontemperature)"
          :precision="1"
          units="°"
          size="small"
          color="#ffe08a"
          simple="true"
        />
        <target
          icon="tint"
          :value="parseFloat(lamponhumidity)"
          :precision="0"
          units="%"
          size="small"
          color="#ffe08a"
          simple="true"
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
          :value="parseFloat(lampofftemperature)"
          :precision="1"
          units="°"
          size="small"
          color="#7a7a7a"
          simple="true"
        />
        <target
          icon="tint"
          :value="parseFloat(lampoffhumidity)"
          :precision="0"
          units="%"
          size="small"
          color="#7a7a7a"
          simple="true"
        />
      </span>
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
import { mapActions } from "vuex";
import Target from "@/components/Target.vue";
import EditControls from "@/components/EditControls.vue";
import SelectControlType from "@/components/SelectControlType.vue";
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
    locked: Boolean,
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

    let lampon = parseFloat(this.profile.lampontemperature);
    let lampoff = parseFloat(this.profile.lampofftemperature);

    if (this.units === "F") {
      lampon = celsius2fahrenheit(lampon);
      lampoff = celsius2fahrenheit(lampoff);
    } else if (this.units === "K") {
      lampon = celsius2kelvin(lampon);
      lampoff = celsius2kelvin(lampoff);
    }

    return {
      name: this.profile.profile,
      controltype: this.profile.controltype,
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
    SelectControlType,
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
    }
  },

  methods: {
    cancel() {
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

      let lampon = parseFloat(this.profile.lampontemperature);
      let lampoff = parseFloat(this.profile.lampofftemperature);

      if (this.units === "F") {
        lampon = celsius2fahrenheit(lampon);
        lampoff = celsius2fahrenheit(lampoff);
      } else if (this.units === "K") {
        lampon = celsius2kelvin(lampon);
        lampoff = celsius2kelvin(lampoff);
      }

      this.name = this.profile.profile;
      this.controltype = this.profile.controltype;
      this.lampstart = `${hourString}:${start[1]}:00`;
      this.lampduration = this.profile.lampduration["hours"];
      this.lampontemperature = lampon;
      this.lampofftemperature = lampoff;
      this.lamponhumidity = this.profile.lamponhumidity;
      this.lampoffhumidity = this.profile.lampoffhumidity;
      this.bloweractive = this.profile.bloweractive / 1000;
      this.blowercycle = this.profile.blowercycle / 1000;
      this.irrigationperday = parseInt(this.profile.irrigationperday);
      this.irrigationduration = this.profile.irrigationduration / 1000;

      this.editing = false;
    },

    destroy() {
      this.remove(this.profile);
      this.editing = false;
    },

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
        lampoffhumidity: this.lampoffhumidity,
        bloweractive: this.bloweractive * 1000,
        blowercycle: this.blowercycle * 1000,
        irrigationperday: this.irrigationperday,
        irrigationduration: this.irrigationduration * 1000,
        controltype: this.controltype
      };

      this.edit(profile);
      this.editing = false;
    },

    selected(val: string) {
      this.controltype = val;
    },

    ...mapActions("profiles", ["edit", "remove"])
  }
});

export default ProfileRow;
</script>
