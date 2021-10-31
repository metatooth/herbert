<template>
  <section class="section" ref="collection">
    <div class="level">
      <span class="title">{{ activeCount }} {{ name }}</span>
      <herbert-button
        v-if="!single"
        style="margin: 20px"
        :show="true"
        :icon="icon"
        color="black"
        @on-click="toggle"
      />
    </div>
    <div class="tile is-ancestor" v-if="single">
      <div class="tile is-4 is-vertical" v-if="isMeter">
        <meter-tile v-for="meter in activeSet" :key="meter.id" :meter="meter" />
      </div>
      <div class="tile is-4 is-vertical" v-if="isDevice">
        <device-tile
          v-for="device in activeSet"
          :key="device.device"
          :device="device"
        />
      </div>
      <div class="tile is-4 is-vertical" v-if="isProfile">
        <profile-tile
          v-for="profile in activeSet"
          :key="profile.id"
          :profile="profile"
          :units="settings.units"
        />
      </div>
      <div class="tile is-4 is-vertical" v-if="isZone">
        <zone-tile v-for="zone in activeSet" :key="zone.id" :zone="zone" />
      </div>
      <div class="tile is-4 is-vertical" v-if="isWorker">
        <worker-tile
          v-for="worker in activeSet"
          :key="worker.id"
          :worker="worker"
        />
      </div>
    </div>
    <div v-if="!single && !table">
      <div class="tile is-ancestor" v-if="isMeter">
        <div class="tile is-4 is-vertical">
          <meter-tile v-for="meter in left" :key="meter.meter" :meter="meter" />
        </div>
        <div class="tile is-4 is-vertical">
          <meter-tile
            v-for="meter in middle"
            :key="meter.meter"
            :meter="meter"
          />
        </div>
        <div class="tile is-4 is-vertical">
          <meter-tile
            v-for="meter in right"
            :key="meter.meter"
            :meter="meter"
          />
        </div>
      </div>
      <div class="tile is-ancestor" v-if="isDevice">
        <div class="tile is-4 is-vertical">
          <device-tile
            v-for="device in left"
            :key="device.device"
            :device="device"
          />
        </div>
        <div class="tile is-4 is-vertical">
          <device-tile
            v-for="device in middle"
            :key="device.device"
            :device="device"
          />
        </div>
        <div class="tile is-4 is-vertical">
          <device-tile
            v-for="device in right"
            :key="device.device"
            :device="device"
          />
        </div>
      </div>
      <div class="tile is-ancestor" v-if="isProfile">
        <div class="tile is-4 is-vertical">
          <profile-tile
            v-for="profile in left"
            :key="profile.id"
            :profile="profile"
            :units="settings.units"
          />
        </div>
        <div class="tile is-4 is-vertical">
          <profile-tile
            v-for="profile in middle"
            :key="profile.id"
            :profile="profile"
            :units="settings.units"
          />
        </div>
        <div class="tile is-4 is-vertical">
          <profile-tile
            v-for="profile in right"
            :key="profile.id"
            :profile="profile"
            :units="settings.units"
          />
        </div>
      </div>
      <div class="tile is-ancestor" v-if="isZone">
        <div class="tile is-4 is-vertical">
          <zone-tile
            v-for="zone in left"
            :key="zone.id"
            :zone="zone"
            :units="settings.units"
          />
        </div>
        <div class="tile is-4 is-vertical">
          <zone-tile
            v-for="zone in middle"
            :key="zone.id"
            :zone="zone"
            :units="settings.units"
          />
        </div>
        <div class="tile is-4 is-vertical">
          <zone-tile
            v-for="zone in right"
            :key="zone.id"
            :zone="zone"
            :units="settings.units"
          />
        </div>
      </div>
      <div class="tile is-ancestor" v-if="isWorker">
        <div class="tile is-4 is-vertical">
          <worker-tile
            v-for="worker in left"
            :key="worker.id"
            :worker="worker"
            :units="settings.units"
          />
        </div>
        <div class="tile is-4 is-vertical">
          <worker-tile
            v-for="worker in middle"
            :key="worker.id"
            :worker="worker"
            :units="settings.units"
          />
        </div>
        <div class="tile is-4 is-vertical">
          <worker-tile
            v-for="worker in right"
            :key="worker.id"
            :worker="worker"
            :units="settings.units"
          />
        </div>
      </div>
      <div class="tile is-ancestor" v-if="isConfig">
        <div class="tile is-4 is-vertical">
          <config-tile
            v-for="config in left"
            :key="config.id"
            :config="config"
            :units="settings.units"
          />
        </div>
        <div class="tile is-4 is-vertical">
          <config-tile
            v-for="config in middle"
            :key="config.id"
            :config="config"
            :units="settings.units"
          />
        </div>
        <div class="tile is-4 is-vertical">
          <config-tile
            v-for="config in right"
            :key="config.id"
            :config="config"
            :units="settings.units"
          />
        </div>
      </div>
    </div>
    <table class="table" v-if="!single && table">
      <thead>
        <th v-for="(heading, index) in headings" :key="`heading-${index}`">
          {{ heading }}
        </th>
      </thead>
      <tbody v-if="isMeter">
        <meter-row
          v-for="(item, index) in activeSet"
          :key="`item-${index}`"
          :meter="item"
          :units="settings.units"
        />
      </tbody>
      <tbody v-if="isDevice">
        <device-row
          v-for="(item, index) in activeSet"
          :key="`item-${index}`"
          :device="item"
        />
      </tbody>
      <tbody v-if="isProfile">
        <profile-row
          v-for="(item, index) in activeSet"
          :key="`item-${index}`"
          :profile="item"
          :units="settings.units"
        />
      </tbody>
      <tbody v-if="isZone">
        <zone-row
          v-for="(item, index) in activeSet"
          :key="`item-${index}`"
          :zone="item"
          :units="settings.units"
        />
      </tbody>
      <tbody v-if="isWorker">
        <worker-row
          v-for="(item, index) in activeSet"
          :key="`item-${index}`"
          :worker="item"
        />
      </tbody>
      <tbody v-if="isConfig">
        <config-row
          v-for="(item, index) in activeSet"
          :key="`item-${index}`"
          :config="item"
        />
      </tbody>
    </table>
    <div class="tile is-ancestor" v-if="allowed">
      <div class="tile is-parent">
        <div class="tile is-child box">
          <p class="title">
            <add-controls
              @on-add="addable"
              @on-save="save"
              @on-cancel="cancel"
            />
          </p>
          <div class="content" v-if="adding">
            <div class="control">
              <input
                class="input"
                type="text"
                v-model="nickname"
                placeHolder="Nickname"
                @keyup.esc="cancel"
                @keyup.enter="save"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import Vue from "vue";
import { mapGetters } from "vuex";

import AddControls from "@/components/AddControls.vue";
import ConfigRow from "@/components/ConfigRow.vue";
import ConfigTile from "@/components/ConfigTile.vue";
import DeviceRow from "@/components/DeviceRow.vue";
import DeviceTile from "@/components/DeviceTile.vue";
import HerbertButton from "@/components/Button.vue";
import MeterRow from "@/components/MeterRow.vue";
import MeterTile from "@/components/MeterTile.vue";
import ProfileRow from "@/components/ProfileRow.vue";
import ProfileTile from "@/components/ProfileTile.vue";
import WorkerRow from "@/components/WorkerRow.vue";
import WorkerTile from "@/components/WorkerTile.vue";
import ZoneRow from "@/components/ZoneRow.vue";
import ZoneTile from "@/components/ZoneTile.vue";

import { Config } from "@/store/configs/types.ts";
import { Profile } from "@/store/profiles/types.ts";
import { Zone } from "@/store/zones/types.ts";

const Collection = Vue.extend({
  props: {
    filter: String,
    type: String
  },

  data() {
    return {
      adding: false,
      nickname: "",
      single: false,
      table: false
    };
  },

  components: {
    AddControls,
    ConfigRow,
    ConfigTile,
    DeviceRow,
    DeviceTile,
    HerbertButton,
    MeterRow,
    MeterTile,
    ProfileRow,
    ProfileTile,
    WorkerRow,
    WorkerTile,
    ZoneRow,
    ZoneTile
  },

  mounted() {
    if (this.$refs.collection.clientWidth < 700) {
      this.single = true;
    }
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

      const active = selected.filter(el => {
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

        console.log("not nickname or device");
        console.log(typeof el.id, el.id);
        console.log(typeof this.filter, this.filter);

        if (el.id) {
          if (typeof el.id === "number" && this.filter !== "") {
            console.log("will search for", parseInt(this.filter));
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
      return this.isProfile || this.isZone || this.isConfig;
    },

    headings() {
      if (this.isMeter) {
        return ["Name", "Current Temp & RH", "Last Ping", "History", "MAC", ""];
      } else if (this.isDevice) {
        return ["Name", "Status & Type", "Last Ping", "History", "MAC", ""];
      } else if (this.isProfile) {
        return [
          "Name",
          "Day Start",
          "Duration",
          "Day Temp & RH",
          "Night Temp & RH",
          "Blower",
          "Irrigation",
          ""
        ];
      } else if (this.isZone) {
        return [
          "Name",
          "Profile & Lights",
          "Current Temp & RH",
          "Last Ping",
          "Active?"
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
        name = "Worker";
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
        config.config = '{ "changeme": "true" }';
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
    }
  }
});

export default Collection;
</script>
