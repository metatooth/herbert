<script lang="ts">
import { mapActions } from "vuex";

import ButtonBase from "@client/components/ButtonBase.vue";
import UnitsSelector from "@client/components/UnitsSelector.vue";
import { Settings } from "@client/store/settings/types";

export default {
  components: {
    ButtonBase,
    UnitsSelector,
  },

  props: {
    settings: Settings,
  },

  data() {
    return {
      title: this.settings.title,
      logo: this.settings.logo,
      locale: this.settings.locale,
      timezone: this.settings.timezone,
      units: this.settings.units,
      refresh: this.settings.refresh / 1000,
      timeout: this.settings.timeout / 1000,
      interval: this.settings.interval / 1000,
      openweather: this.settings.openweather,
      cityname: this.settings.cityname,
      statecode: this.settings.statecode,
      reportingperiod: this.settings.reportingperiod / 1000,
      pin: this.settings.pin,
      name: "",
      filedata: "",
    };
  },

  computed: {
    changed(): boolean {
      if (
        this.settings.title !== this.title ||
        this.name !== "" ||
        this.filedata !== "" ||
        this.settings.locale !== this.locale ||
        this.settings.timezone !== this.timezone ||
        this.settings.units !== this.units ||
        this.settings.refresh !== 1000 * this.refresh ||
        this.settings.timeout !== 1000 * this.timeout ||
        this.settings.interval !== 1000 * this.interval ||
        this.settings.openweather !== this.openweather ||
        this.settings.cityname !== this.cityname ||
        this.settings.statecode !== this.statecode ||
        this.settings.reportingperiod !== 1000 * this.reportingperiod ||
        this.settings.pin !== this.pin
      ) {
        return true;
      }
      return false;
    },

    filename(): string {
      return this.name ? this.name : "None selected.";
    },

    url(): string {
      return "http://localhost:5000";
    },
  },

  methods: {
    cancel() {
      this.title = this.settings.title;
      this.logo = this.settings.logo;
      this.locale = this.settings.locale;
      this.timezone = this.settings.timezone;
      this.units = this.settings.units;
      this.refresh = this.settings.refresh / 1000;
      this.timeout = this.settings.timeout / 1000;
      this.interval = this.settings.interval / 1000;
      this.openweather = this.settings.openweather;
      this.cityname = this.settings.cityname;
      this.statecode = this.settings.statecode;
      this.reportingperiod = this.settings.reportingperiod / 1000;
      this.pin = this.settings.pin;
    },

    pick() {
      const element = this.$refs.file as HTMLInputElement;
      element.click();
    },

    picked(event: Event) {
      const element = event.currentTarget as HTMLInputElement;
      const files: FileList | null = element.files;

      if (files) {
        this.name = files[0].name;

        const fileReader = new FileReader();
        fileReader.addEventListener("load", () => {
          this.filedata = (fileReader.result as string) || "";
        });

        fileReader.readAsDataURL(files[0]);
      }
    },

    save() {
      let logo = new Uint8Array();
      if (this.filedata) {
        logo = Buffer.from(this.filedata);
      }

      const data: Settings = {
        id: this.settings.id,
        title: this.title,
        logo: logo,
        locale: this.locale,
        timezone: this.timezone,
        units: this.units,
        refresh: 1000 * this.refresh,
        timeout: 1000 * this.timeout,
        interval: 1000 * this.interval,
        openweather: this.openweather,
        cityname: this.cityname,
        statecode: this.statecode,
        reportingperiod: 1000 * this.reportingperiod,
        pin: this.pin,
        createdat: this.settings.createdat,
        updatedat: new Date(),
        deleted: false,
      };
      this.edit(data);
    },

    select(units: string) {
      this.units = units;
    },

    ...mapActions("settings", ["edit"]),
  },
};
</script>

<template>
  <section class="section">
    <div class="field">
      <label class="label">Title</label>
      <div class="control">
        <input
          v-model="title"
          class="input"
          type="text"
          placeholder="Name your grow."
        />
      </div>
    </div>

    <div class="field">
      <label class="label">Logo</label>
      <div class="control">
        <div class="file is-boxed">
          <label class="file-label">
            <input
              ref="file"
              class="file-input"
              type="file"
              accept="image/png"
              @change="picked"
            />
            <span class="file-cta" @click="pick">
              <font-awesome-icon icon="upload" />
              <span class="file-label"> Choose a file… </span>
              <span class="file-name">
                {{ filename }}
              </span>
            </span>
          </label>
        </div>
      </div>
    </div>

    <div class="field">
      <label class="label">Locale</label>
      <div class="control">
        <input v-model="locale" class="input" type="text" />
      </div>
    </div>

    <div class="field">
      <label class="label">Timezone</label>
      <div class="control">
        <input v-model="timezone" class="input" type="text" />
      </div>
    </div>

    <div class="field">
      <label class="label">Units</label>
      <units-selector :units="units" @change-units="select" />
    </div>

    <div class="field">
      <label class="label">Refresh Rate (seconds)</label>
      <div class="control">
        <input v-model="refresh" class="input" type="number" />
      </div>
    </div>

    <div class="field">
      <label class="label">Timeout Period (seconds)</label>
      <div class="control">
        <input v-model="timeout" class="input" type="number" />
      </div>
    </div>

    <div class="field">
      <label class="label">Server Interval (seconds)</label>
      <div class="control">
        <input v-model="interval" class="input" type="number" />
      </div>
    </div>

    <div class="field">
      <label class="label">Reporting Period (seconds)</label>
      <div class="control">
        <input v-model="reportingperiod" class="input" type="number" />
      </div>
    </div>

    <div class="field">
      <label class="label">OpenWeather API Key</label>
      <div class="control">
        <input v-model="openweather" class="input" type="text" />
      </div>
    </div>

    <div class="field">
      <label class="label">City Name</label>
      <div class="control">
        <input v-model="cityname" class="input" type="text" />
      </div>
    </div>

    <div class="field">
      <label class="label">State Code</label>
      <div class="control">
        <input v-model="statecode" class="input" type="text" />
      </div>
    </div>

    <div class="field">
      <label class="label">PIN</label>
      <div class="control">
        <input v-model="pin" class="input" type="text" size="8" />
      </div>
    </div>

    <div class="field">
      <label class="label">API Base URL</label>
      <div class="control">
        <a target="_blank" :href="url">{{ url }}</a>
      </div>
    </div>

    <div v-if="changed" class="field is-grouped">
      <button-base color="success" icon="check" @on-click="save" />
      <button-base color="danger" icon="times" @on-click="cancel" />
    </div>
  </section>
</template>
