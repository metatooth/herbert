<script lang="ts">
import { mapActions } from "vuex";

import {
  celsius2fahrenheit,
  celsius2kelvin,
  fahrenheit2celsius,
  kelvin2celsius,
} from "@shared/utils";

import EditControls from "@client/components/EditControls.vue";
import Readable from "@client/components/Readable.vue";
import SelectControlType from "@client/components/SelectControlType.vue";
import Target from "@client/components/Target.vue";

import { Profile } from "@client/store/profiles/types";

export default {
  components: {
    EditControls,
    Readable,
    SelectControlType,
    Target,
  },

  props: {
    locked: Boolean,
    profile: Profile,
    units: String,
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
      controltype: this.profile.controltype,
      lampstart: `${hourString}:${start[1]}:00`,
      lampduration: this.profile.lampduration["hours"],
      lampontemperature: lampon,
      lampofftemperature: lampoff,
      lamponhumidity: this.profile.lamponhumidity,
      lampoffhumidity: this.profile.lampoffhumidity,
      bloweractive: this.profile.bloweractive / 1000,
      blowercycle: this.profile.blowercycle / 1000,
      irrigationperday: this.profile.irrigationperday,
      irrigationduration: this.profile.irrigationduration / 1000,
      updatedat: this.profile.updatedat,
      editing: false,
    };
  },

  computed: {
    durationWithUnits(): string {
      return this.lampduration + "hrs";
    },

    lamponMinute(): string {
      const start = this.lampstart.split(":");
      return start[1];
    },

    lamponHour(): string {
      const start = this.lampstart.split(":");
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
    },
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

      let ontemp = parseFloat(this.lampontemperature);
      let offtemp = parseFloat(this.lampofftemperature);

      console.log(
        "lamp on",
        this.lampontemperature,
        typeof this.lampontemperature,
      );
      console.log("lamp on", ontemp, typeof ontemp);
      console.log("this units", this.units);

      if (this.units === "F") {
        ontemp = fahrenheit2celsius(ontemp);
        offtemp = fahrenheit2celsius(offtemp);
      } else if (this.units === "K") {
        ontemp = kelvin2celsius(ontemp);
        offtemp = kelvin2celsius(offtemp);
      }

      console.log("lampon", ontemp);

      const profile = {
        id: this.profile.id,
        profile: this.name,
        controltype: this.controltype,
        lampstart: `${hourString}:${start[1]}:00`,
        lampduration: `${this.lampduration} hours`,
        lampontemperature: ontemp,
        lamponhumidity: this.lamponhumidity,
        lampofftemperature: offtemp,
        lampoffhumidity: this.lampoffhumidity,
        bloweractive: this.bloweractive * 1000,
        blowercycle: this.blowercycle * 1000,
        irrigationperday: this.irrigationperday,
        irrigationduration: this.irrigationduration * 1000,
      };

      this.edit(profile);
      this.editing = false;
    },

    selected(val: string) {
      this.controltype = val;
    },

    destroy() {
      this.remove(this.profile);
      this.editing = false;
    },

    cancel() {
      this.editing = false;
    },

    ...mapActions("profiles", ["edit", "remove"]),
  },
};
</script>

<template>
  <div class="tile is-parent">
    <div class="tile is-child box">
      <div class="title">
        <span v-if="editing">
          <div class="field is-grouped">
            <div class="control">
              <input
                v-model="name"
                class="input"
                type="text"
                placeHolder="Name this profile"
                @keyup.esc="cancel"
              />
            </div>
          </div>
        </span>
        <span v-else>{{ name }}</span>
      </div>
      <div class="subtitle">
        <span v-if="editing">
          <select-control-type
            :controltype="controltype"
            @select-controltype="selected"
          />
        </span>
        <span v-else>{{ controltype }}</span>
      </div>
      <div v-if="editing" class="content">
        <div class="field is-grouped">
          <div class="control">
            <input v-model="lampstart" class="input" type="time" />
          </div>

          <div class="control">
            <input
              v-model="lampduration"
              class="input"
              type="number"
              min="0"
              max="24"
              size="2"
            />
          </div>
        </div>

        <div class="field is-grouped">
          <div class="control has-icons-left">
            <input
              v-model="lampontemperature"
              class="input"
              type="number"
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
              v-model="lamponhumidity"
              class="input"
              type="number"
              min="0"
              max="100"
              size="2"
            />
            <span class="icon is-left">
              <font-awesome-icon icon="tint" class="is-left" />
            </span>
          </div>
        </div>

        <div class="field is-grouped">
          <div class="control has-icons-left">
            <input
              v-model="lampofftemperature"
              class="input"
              type="number"
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
              v-model="lampoffhumidity"
              class="input"
              type="number"
              min="0"
              max="100"
              size="2"
            />
            <span class="icon is-left">
              <font-awesome-icon icon="tint" class="is-left" />
            </span>
          </div>
        </div>

        <div class="field is-grouped">
          <div class="control has-icons-left">
            <input
              v-model="irrigationduration"
              class="input"
              type="number"
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
              v-model="irrigationperday"
              class="input"
              type="number"
              min="0"
              max="24"
              size="2"
            />
            <span class="icon is-left">
              <font-awesome-icon icon="cloud-rain" class="is-left" />
            </span>
          </div>
        </div>
      </div>
      <div v-else class="content">
        <div class="tags has-addons">
          <span class="tag is-small is-dark has-text-warning">
            <font-awesome-icon icon="lightbulb" />
          </span>
          <span class="tag is-small is-family-code is-warning">
            {{ lamponHour }}:{{ lamponMinute }} {{ durationWithUnits }}
          </span>
        </div>

        <div class="field is-grouped is-grouped-multiline">
          <target
            icon="thermometer-half"
            :value="lampontemperature"
            units="°"
            size="small"
            color="#ffe08a"
          />
          <target
            icon="tint"
            :value="lamponhumidity"
            units="%"
            size="small"
            color="#ffe08a"
          />
        </div>

        <div class="field is-grouped is-grouped-multiline">
          <target
            icon="thermometer-half"
            :value="lampofftemperature"
            units="°"
            size="small"
            color="#7a7a7a"
          />
          <target
            icon="tint"
            :value="lampoffhumidity"
            units="%"
            size="small"
            color="#7a7a7a"
          />
        </div>

        <div class="tags has-addons">
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
      </div>
      <div class="content is-italic">
        Updated <readable :timestamp="new Date(updatedat)" />
      </div>
      <div class="content">
        <edit-controls
          v-if="!locked"
          @on-edit="editable"
          @on-save="save"
          @on-destroy="destroy"
          @on-cancel="cancel"
        />
      </div>
    </div>
  </div>
</template>
