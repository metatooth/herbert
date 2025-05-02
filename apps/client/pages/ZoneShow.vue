<script lang="ts">
import { mapActions, mapGetters } from "vuex";

import BackToDashboard from "@client/components/BackToDashboard.vue";
import EditControls from "@client/components/EditControls.vue";
import ZoneDetail from "@client/components/ZoneDetail.vue";

export default {
  components: {
    BackToDashboard,
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
};
</script>

<template>
  <div ref="zonepage" class="container">
    <back-to-dashboard />
    <div v-if="editing" class="card">
      <div class="card-header">
        <div class="card-header-title">
          <div class="field is-horizontal">
            <div class="field-label is-medium">
              <label class="label">Name</label>
            </div>
            <div class="field-body">
              <div class="field is-narrow">
                <div class="control">
                  <input v-model="nickname" class="input" />
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
                <input v-model="lamponleafdiff" class="input" type="number" />
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
                <input v-model="lampoffleafdiff" class="input" type="number" />
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
                <input v-model="maxirrigators" class="input" type="number" />
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
                  <select v-model="zonemeters" multiple>
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
                  <select v-model="zonedevices" multiple>
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
                  <select v-model="zonechildren" multiple>
                    <option
                      v-for="target in zones"
                      :key="target.id"
                      :value="target.id"
                    >
                      {{ target.nickname }}
                    </option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <zone-detail v-else :zone="zone" :units="settings.units" :locked="locked" />

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
