<script lang="ts">
import { mapGetters } from "vuex";

import AddControls from "@client/components/AddControls.vue";
import FullTable from "@client/components/FullTable.vue";
import ButtonBase from "@client/components/ButtonBase.vue";
import NarrowTable from "@client/components/NarrowTable.vue";
import SingleColumn from "@client/components/SingleColumn.vue";
import ThreeColumns from "@client/components/ThreeColumns.vue";

import { Config } from "@client/store/configs/types";
import { Profile } from "@client/store/profiles/types";
import { Zone } from "@client/store/zones/types";

export default {
  components: {
    AddControls,
    FullTable,
    ButtonBase,
    NarrowTable,
    SingleColumn,
    ThreeColumns,
  },

  props: {
    filter: String,
    locked: Boolean,
    type: String,
  },

  data() {
    return {
      adding: false,
      nickname: "",
      single: false,
      table: true,
    };
  },

  computed: {
    ...mapGetters("meters", ["meters"]),
    ...mapGetters("devices", ["devices"]),
    ...mapGetters("profiles", ["profiles"]),
    ...mapGetters("zones", ["zones"]),
    ...mapGetters("workers", ["workers"]),
    ...mapGetters("configs", ["configs"]),
    ...mapGetters("settings", ["settings"]),

    activeSet() {
      let selected;
      if (this.type === "meter") {
        selected = this.meters;
      } else if (this.type === "device") {
        selected = this.devices;
      } else if (this.type === "profile") {
        selected = this.profiles;
      } else if (this.type === "zone") {
        selected = this.zones;
      } else if (this.type === "worker") {
        selected = this.workers;
      } else if (this.type === "config") {
        selected = this.configs;
      }

      const active = selected.filter((el) => {
        if (this.filter === "") {
          return true;
        }

        if (el.nickname) {
          const regexp = new RegExp(this.filter, "i");
          if (el.nickname.match(regexp)) {
            return true;
          }
        }

        if (el.device) {
          return el.device.match(this.filter);
        }

        if (el.id) {
          if (typeof el.id === "number" && this.filter !== "") {
            return el.id === parseInt(this.filter);
          }
        }

        return false;
      });

      return active.sort((a, b) => {
        let A;
        if (a.nickname) {
          A = a.nickname;
        } else if (a.device) {
          A = a.device.slice(12);
        } else if (a.meter) {
          A = a.meter.slice(12);
        }

        let B;
        if (b.nickname) {
          B = b.nickname;
        } else if (b.device) {
          B = b.device.slice(12);
        } else if (b.meter) {
          B = b.meter.slice(12);
        }

        return A > B;
      });
    },

    activeCount() {
      return this.activeSet.length;
    },

    allowed() {
      return !this.table && (this.isProfile || this.isZone || this.isConfig);
    },

    headings() {
      if (this.isMeter) {
        return ["Name", "Zone?", "Reading Today", ""];
      } else if (this.isDevice) {
        return ["Name", "Zone?", "Status Today", ""];
      } else if (this.isProfile) {
        return [
          "Name",
          "Start",
          "Duration",
          "Type",
          "Day",
          "Night",
          "Water",
          "",
        ];
      } else if (this.isZone) {
        return [
          "Name & Profile & Lights",
          "Temp & RH",
          "Devices",
          "Last Ping",
          "Active?",
        ];
      } else if (this.isWorker) {
        return ["MAC", "INET", "Name", "Configuration", "Last Ping", ""];
      } else if (this.isConfig) {
        return ["Name", "Configuration", "Updated", ""];
      }

      return [];
    },

    icon() {
      if (this.table) {
        return "grip-vertical";
      } else {
        return "list";
      }
    },

    isMeter() {
      return this.type === "meter";
    },

    isDevice() {
      return this.type === "device";
    },

    isProfile() {
      return this.type === "profile";
    },

    isZone() {
      return this.type === "zone";
    },

    isWorker() {
      return this.type === "worker";
    },

    isConfig() {
      return this.type === "config";
    },

    name() {
      let name;
      if (this.isMeter) {
        name = "Meter";
      } else if (this.isDevice) {
        name = "Device";
      } else if (this.isProfile) {
        name = "Profile";
      } else if (this.isZone) {
        name = "Zone";
      } else if (this.isWorker) {
        name = "Herbert";
      } else if (this.isConfig) {
        name = "Config";
      }

      if (this.activeCount !== 1) {
        name = name + "s";
      }

      return name;
    },

    left() {
      const items = [];
      for (let i = 0; i < this.activeCount; i = i + 3) {
        if (this.activeSet[i]) {
          items.push(this.activeSet[i]);
        }
      }
      return items;
    },

    middle() {
      const items = [];
      for (let i = 1; i < this.activeCount; i = i + 3) {
        if (this.activeSet[i]) {
          items.push(this.activeSet[i]);
        }
      }
      return items;
    },

    right() {
      const items = [];
      for (let i = 2; i < this.activeCount; i = i + 3) {
        if (this.activeSet[i]) {
          items.push(this.activeSet[i]);
        }
      }
      return items;
    },
  },

  mounted() {
    if (this.$refs.collection.clientWidth < 700) {
      this.single = true;
    }
  },

  methods: {
    addable() {
      this.adding = true;
    },

    save() {
      if (this.isProfile) {
        const profile = new Profile();
        // WARNING!
        profile.profile = this.nickname;
        profile.timezone = "America/New_York";
        profile.lampstart = "12:00";
        profile.lampduration = { hours: 12 };

        profile.lampontemperature = 23;
        profile.lampofftemperature = 18;

        profile.lamponhumidity = 55;
        profile.lampoffhumidity = 55;

        profile.bloweractive = 30000;
        profile.blowercycle = 180000;

        profile.irrigationperday = 2;
        profile.irrigationduration = 210000;

        this.$store.dispatch("profiles/add", profile);
      } else if (this.isZone) {
        const zone = new Zone();
        zone.nickname = this.nickname;
        zone.profileid = 1;

        this.$store.dispatch("zones/add", zone);
      } else if (this.isConfig) {
        const config = new Config();
        config.nickname = this.nickname;
        config.config = { changeme: "true" };
        this.$store.dispatch("configs/add", config);
      }

      this.nickname = "";
      this.adding = false;
    },

    cancel() {
      this.nickname = "";
      this.adding = false;
    },

    toggle() {
      this.table = !this.table;
    },
  },
};
</script>

<template>
  <div ref="collection">
    <nav class="level is-mobile">
      <div class="level-left">
        <div class="level-item">
          <p class="subtitle is-5">
            <strong>{{ activeCount }}</strong> {{ name }}
          </p>
        </div>
      </div>
      <div class="level-right">
        <div class="level-item">
          <p class="control">
            <button-base
              style="margin: 20px"
              :show="true"
              :icon="icon"
              color="grey-lighter"
              size="small"
              @on-click="toggle"
            />
          </p>
        </div>
      </div>
    </nav>

    <narrow-table
      v-if="single && table"
      :items="activeSet"
      :type="type"
      :locked="locked"
    />

    <single-column
      v-if="single && !table"
      :items="activeSet"
      :type="type"
      :locked="locked"
    />

    <three-columns
      v-if="!single && !table"
      :left="left"
      :middle="middle"
      :right="right"
      :type="type"
      :locked="locked"
    />

    <full-table
      v-if="!single && table"
      :headings="headings"
      :items="activeSet"
      :type="type"
      :locked="locked"
    />

    <div v-if="allowed && !locked" class="box">
      <p class="title">
        <add-controls @on-add="addable" @on-save="save" @on-cancel="cancel" />
      </p>
      <div v-if="adding" class="content">
        <div class="control">
          <input
            v-model="nickname"
            class="input"
            type="text"
            placeHolder="Nickname"
            @keyup.esc="cancel"
            @keyup.enter="save"
          />
        </div>
      </div>
    </div>
  </div>
</template>
