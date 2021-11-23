<template>
  <div class="container" ref="zonepage">
    <back-to-dashboard />
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
                      >{{ profile.profile }}</option
                    >
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
                  <select multiple v-model="meters">
                    <option
                      v-for="meter in zone.meters"
                      :key="meter.device"
                      :value="meter.device"
                      >{{ meter.name }}</option
                    >
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
                  <select multiple v-model="devices">
                    <option
                      v-for="device in zone.devices"
                      :key="device.device"
                      :value="device.device"
                      >{{ device.name }}</option
                    >
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
                  <select multiple v-model="children">
                    <option v-for="id in zone.children" :key="id" :value="id">{{
                      lookupZone(id).nickname
                    }}</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <zone-detail :zone="zone" :units="settings.units" v-else />

    <div class="card">
      <div class="card-footer">
        <div class="card-footer-item">
          <edit-controls
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

import BackToDashboard from "@/components/BackToDashboard.vue";
import ZoneDetail from "@/components/ZoneDetail.vue";
import EditControls from "@/components/EditControls.vue";

const ZonePage = Vue.extend({
  components: {
    BackToDashboard,
    EditControls,
    ZoneDetail
  },

  data() {
    return {
      nickname: "",
      profileid: 0,
      lamponleafdiff: 0,
      lampoffleafdiff: 0,
      maxirrigators: 0,
      meters: [],
      devices: [],
      children: [],
      editing: false
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

    this.zone.meters.forEach(m => {
      this.meters.push(m.device);
    });

    this.zone.devices.forEach(d => {
      this.devices.push(d.device);
    });

    this.zone.children.forEach(c => {
      this.children.push(c);
    });
  },

  computed: {
    zone() {
      const id = this.$route.params.id;
      const z = this.zones.filter(z => {
        return z.id === id;
      });
      return z[0];
    },

    ...mapGetters("settings", ["settings"]),
    ...mapGetters("profiles", ["profiles"]),
    ...mapGetters("zones", ["zones"])
  },

  methods: {
    editable() {
      this.editing = true;
    },

    lookupZone(id: string) {
      const found = this.zones.filter(z => {
        return z.id === id;
      });
      return found[0];
    },

    save() {
      console.log("meters", this.meters);
      console.log("devices", this.devices);
      console.log("children", this.children);

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
        maxirrigators: this.maxirrigators
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

    ...mapActions("zones", ["edit", "remove"])
  }
});

export default ZonePage;
</script>
