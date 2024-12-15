<template>
  <div class="card">
    <div class="card-header">
      <div class="card-header-title">
        <p class="title"></p>
        <p class="subtitle"></p>
      </div>
      <div class="card-header-icon">
        <router-link :to="{ name: 'dashboard' }">
          <span class="icon">
            <font-awesome-icon icon="times-circle" />
          </span>
        </router-link>
      </div>
    </div>
    <div class="card" v-if="editing">
      <div class="card-header">
        <div class="card-header-title">
          <div class="field is-horizontal">
            <div class="field-label is-medium">
              <label class="label">Name</label>
            </div>
            <div class="field-body">
              <div class="field is-narrow">
                <div class="control">
                  <input class="input" v-model="nickname" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="card-content">
        <div class="field is-horizontal">
          <div class="field-label is-medium">
            <label class="label">Grow Profile</label>
          </div>
          <div class="field-body">
            <div class="field is-narrow">
              <div class="control">
                <div class="select">
                  <select v-model="profileid">
                    <option
                      v-for="profile in profiles"
                      :key="profile.id"
                      :value="profile.id"
                    >
                      {{ profile.profile }}
                    </option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="field is-horizontal">
          <div class="field-label is-medium">
            <label class="label">Daytime Leaf Diff</label>
          </div>
          <div class="field-body">
            <div class="field is-narrow">
              <div class="control">
                <input class="input" type="number" v-model="lamponleafdiff" />
              </div>
            </div>
          </div>
        </div>

        <div class="field is-horizontal">
          <div class="field-label is-medium">
            <label class="label">Nighttime Leaf Diff</label>
          </div>
          <div class="field-body">
            <div class="field is-narrow">
              <div class="control">
                <input class="input" type="number" v-model="lampoffleafdiff" />
              </div>
            </div>
          </div>
        </div>
        <div class="field is-horizontal">
          <div class="field-label is-medium">
            <label class="label">Max. Irrigators</label>
          </div>
          <div class="field-body">
            <div class="field is-narrow">
              <div class="control">
                <input class="input" type="number" v-model="maxirrigators" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="card-content">
        <div class="field is-horizontal">
          <div class="field-label is-medium">
            <label class="label">Meters</label>
          </div>
          <div class="field-body">
            <div class="field is-narrow">
              <div class="control">
                <div class="select is-multiple">
                  <select multiple v-model="zonemeters">
                    <option
                      v-for="meter in meters"
                      :key="meter.device"
                      :value="meter.device"
                    >
                      {{ meter.name }}
                    </option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="card-content">
        <div class="field is-horizontal">
          <div class="field-label is-medium">
            <label class="label">Devices</label>
          </div>
          <div class="field-body">
            <div class="field is-narrow">
              <div class="control">
                <div class="select is-multiple">
                  <select multiple v-model="zonedevices">
                    <option
                      v-for="device in devices"
                      :key="device.device"
                      :value="device.device"
                    >
                      {{ device.name }}
                    </option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="card-content">
        <div class="field is-horizontal">
          <div class="field-label is-medium">
            <label class="label">Children</label>
          </div>
          <div class="field-body">
            <div class="field is-narrow">
              <div class="control">
                <div class="select is-multiple">
                  <select multiple v-model="zonechildren">
                    <option
                      v-for="zone in zones"
                      :key="zone.id"
                      :value="zone.id"
                    >
                      {{ zone.nickname }}
                    </option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <zone-detail :zone="zone" :units="settings.units" :locked="locked" v-else />

    <div class="card">
      <div class="card-footer">
        <div class="card-footer-item">
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
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { mapActions, mapGetters } from "vuex";

import ZoneDetail from "@/components/ZoneDetail.vue";
import EditControls from "@/components/EditControls.vue";

const ZonePage = Vue.extend({
  components: {
    EditControls,
    ZoneDetail,
  },

  data() {
    return {
      nickname: "",
      profileid: 0,
      lamponleafdiff: 0,
      lampoffleafdiff: 0,
      maxirrigators: 0,
      zonemeters: [],
      zonedevices: [],
      zonechildren: [],
      editing: false,
    };
  },

  mounted() {
    this.nickname = this.zone.nickname;
    this.profileid = this.zone.profile.id;

    if (this.settings.units === "F") {
      this.lamponleafdiff = (this.zone.lamponleafdiff * 9) / 5;
      this.lampoffleafdiff = (this.zone.lampoffleafdiff * 9) / 5;
    } else {
      this.lamponleafdiff = this.zone.lamponleafdiff;
      this.lampoffleafdiff = this.zone.lampoffleafdiff;
    }

    this.maxirrigators = this.zone.maxirrigators;

    this.zone.meters.forEach((m) => {
      this.zonemeters.push(m.device);
    });

    this.zone.devices.forEach((d) => {
      this.zonedevices.push(d.device);
    });

    this.zone.children.forEach((c) => {
      this.zonechildren.push(c);
    });
  },

  computed: {
    locked() {
      return this.$route.params.locked;
    },

    zone() {
      const id = this.$route.params.id;
      const z = this.zones.filter((z) => {
        return z.id === id;
      });
      return z[0];
    },

    ...mapGetters("settings", ["settings"]),
    ...mapGetters("profiles", ["profiles"]),
    ...mapGetters("zones", ["zones"]),
    ...mapGetters("devices", ["devices"]),
    ...mapGetters("meters", ["meters"]),
  },

  methods: {
    editable() {
      this.editing = true;
    },

    save() {
      let lampon = this.lamponleafdiff;
      let lampoff = this.lampoffleafdiff;
      if (this.units === "F") {
        lampon = (lampon * 5) / 9;
        lampoff = (lampoff * 5) / 9;
      }

      const zone = {
        ...this.zone,
        nickname: this.nickname,
        profileid: this.profileid,
        lamponleafdiff: lampon,
        lampoffleafdiff: lampoff,
        maxirrigators: this.maxirrigators,
        meters: this.zonemeters,
        devices: this.zonedevices,
        children: this.zonechildren,
      };
      this.edit(zone);
      this.editing = false;
    },

    destroy() {
      if (confirm("OK to delete?")) {
        this.remove(this.zone);
        this.$router.push({ name: "dashboard" });
      }
    },

    cancel() {
      this.editing = false;
    },

    ...mapActions("zones", ["edit", "remove"]),
  },
});

export default ZonePage;
</script>
