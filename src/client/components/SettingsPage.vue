<template>
  <section class="section">
    <div class="field">
      <label class="label">Title</label>
      <div class="control">
        <input
          class="input"
          type="text"
          v-model="title"
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
              class="file-input"
              type="file"
              ref="file"
              accept="image/png"
              @change="picked"
            />
            <span class="file-cta" @click="pick">
              <font-awesome-icon icon="upload" />
              <span class="file-label">
                Choose a file…
              </span>
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
        <input class="input" type="text" v-model="locale" />
      </div>
    </div>

    <div class="field">
      <label class="label">Timezone</label>
      <div class="control">
        <input class="input" type="text" v-model="timezone" />
      </div>
    </div>

    <div class="field">
      <label class="label">Units</label>
      <units-selector v-bind:units="units" @change-units="select" />
    </div>

    <div class="field">
      <label class="label">Refresh Rate (seconds)</label>
      <div class="control">
        <input class="input" type="number" v-model="refresh" />
      </div>
    </div>

    <div class="field">
      <label class="label">Timeout Period (seconds)</label>
      <div class="control">
        <input class="input" type="number" v-model="timeout" />
      </div>
    </div>

    <div class="field">
      <label class="label">API Base URL</label>
      <div class="control">
        <a target="_blank" :href="url">{{ url }}</a>
      </div>
    </div>

    <div class="field is-grouped">
      <herbert-button
        color="success"
        icon="check"
        :show="changed"
        @on-click="save"
      />
      <herbert-button
        color="danger"
        icon="times"
        :show="changed"
        @on-click="cancel"
      /> 
   </div>
  </section>
</template>

<script lang="ts">
import Vue from "vue";
import { mapActions } from "vuex";
import { Settings } from "@/store/settings/types";
import UnitsSelector from "@/components/UnitsSelector.vue";
import HerbertButton from "@/components/Button.vue";

const SettingsPage = Vue.extend({
  props: {
    settings: Settings
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
      name: ""
    };
  },

  components: {
    HerbertButton,
    UnitsSelector
  },

  computed: {
    changed() {
      if (
        this.settings.title !== this.title ||
        this.settings.logo !== this.logo ||
        this.settings.locale !== this.locale ||
        this.settings.timezone !== this.timezone ||
        this.settings.units !== this.units ||
        this.settings.refresh !== 1000 * this.refresh ||
        this.settings.timeout !== 1000 * this.timeout
      ) {
        return true;
      }
      return false;
    },

    filename() {
      return (this.name) ? this.name : "No selected.";
    },

    url() {
      return process.env.VUE_APP_API_URL;
    }
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
    },

    pick() {
      this.$refs.file.click();
    },

    picked(event) {
      const files = event.target.files;
      this.name = files[0].name;
      const fileReader = new FileReader();
      fileReader.addEventListener("load", () => {
        this.logo = fileReader.result;
        console.log("IMAGE", this.logo);
      });
      fileReader.readAsDataURL(files[0]);
    },

    save() {
      const data: Settings = {
        id: this.settings.id,
        title: this.title,
        logo: this.logo,
        locale: this.locale,
        timezone: this.timezone,
        units: this.units,
        refresh: 1000 * this.refresh,
        timeout: 1000 * this.timeout,
        createdat: this.settings.createdat,
        updatedat: new Date(),
        deleted: false
      };
      this.edit(data);
    },

    select(units: string) {
      this.units = units;
    },

    ...mapActions("settings", ["edit"])
  }
});

export default SettingsPage;
</script>
