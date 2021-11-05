<template>
  <div class="card">
    <div class="card-header">
      <div class="card-header-title">
        <p class="title">{{ zone.nickname }}</p>
        <p class="subtitle">{{ zone.profile.profile }}</p>
      </div>
    </div>

    <div class="card-content">
      <nav class="level is-mobile">
        <div class="level-left">
          <div class="level-item">
            <zone-target class="box has-background-grey-darker" :zone="zone" />
          </div>
          <div class="level-item">
            <zone-actual class="box has-background-grey-darker" :zone="zone" />
          </div>
        </div>
        <div class="level-right" />
      </nav>
    </div>

    <div class="card-content">
      <div class="field is-grouped is-grouped-multiline">
        <div class="control">
          <div class="tags has-addons">
            <span
              class="tag has-background-grey-darker is-medium"
              :class="activeClass"
            >
              <font-awesome-icon :icon="activeIcon" />
            </span>
          </div>
        </div>
        <div class="control" v-if="isDay">
          <div class="tags has-addons">
            <span
              class="tag has-background-grey-darker is-medium"
              style="color: #ffe08a"
            >
              <font-awesome-icon icon="cannabis" />
            </span>
            <span class="tag has-text-black is-medium"
              >{{ lamponleafdiff.toFixed(1) }}&#176;</span
            >
          </div>
        </div>
        <div class="control" v-else>
          <div class="tags has-addons">
            <span
              class="tag has-background-grey-darker is-medium"
              style="color: #7a7a7a"
            >
              <font-awesome-icon icon="cannabis" />
            </span>
            <span class="tag has-text-black is-medium"
              >{{ lampoffleafdiff.toFixed(1) }}&#176;</span
            >
          </div>
        </div>
        <div class="control" v-if="zone.children.length > 0">
          <div class="tags has-addons">
            <span
              class="tag has-background-grey-darker has-text-info is-medium"
            >
              <font-awesome-icon icon="cloud-rain" />
            </span>
            <span class="tag has-text-black is-medium"
              >{{ maxirrigators }} max</span
            >
          </div>
        </div>
      </div>
    </div>

    <div class="card-content">
      <div class="field is-grouped is-grouped-multiline">
        <div
          class="control"
          v-for="(meter, index) in zone.meters"
          :key="`meter-${index}`"
        >
          <div class="clickable tags has-addons" @click="clickMeter(meter)">
            <span
              class="tag has-background-grey-darker has-text-success is-medium"
            >
              <font-awesome-icon icon="tachometer-alt" />
            </span>
            <span class="tag has-text-black is-medium">{{ meter.name }}</span>
          </div>
        </div>
        <div
          class="control"
          v-for="(device, index) in zone.devices"
          :key="`device-${index}`"
        >
          <div class="clickable tags has-addons" @click="clickDevice(device)">
            <span :class="deviceClass(device)">
              <font-awesome-icon :icon="device.icon" />
            </span>
            <span class="tag has-text-black is-medium">{{ device.name }}</span>
          </div>
        </div>
        <div
          class="control"
          v-for="(child, index) in zone.children"
          :key="`child-${index}`"
          @click="clickChild(child)"
        >
          <div class="clickable tags has-addons">
            <span
              class="tag has-background-grey-darker has-text-info is-medium"
            >
              <font-awesome-icon icon="grip-horizontal" />
            </span>
            <span class="tag has-text-black is-medium">{{
              zone.nickname
            }}</span>
          </div>
        </div>
      </div>
    </div>

    <footer class="card-footer">
      <div class="card-footer-item">
        <readable class="is-italic" :timestamp="lastupdate" />
      </div>
    </footer>
  </div>
</template>

<script lang="ts">
import Readable from "@/components/Readable.vue";
import Vue from "vue";
import { Zone } from "@/store/zones/types";
import { mapGetters, mapActions } from "vuex";
import ZoneActual from "@/components/ZoneActual.vue";
import ZoneTarget from "@/components/ZoneTarget.vue";

const ZoneDetail = Vue.extend({
  props: {
    zone: Zone,
    units: String
  },

  data() {
    let lampon = parseFloat(this.zone.lamponleafdiff);
    let lampoff = parseFloat(this.zone.lampoffleafdiff);

    if (this.units === "F") {
      lampon = (lampon * 9) / 5;
      lampoff = (lampoff * 9) / 5;
    }

    return {
      nickname: this.zone.nickname,
      profileid: parseInt(this.zone.profileid),
      maxirrigators: parseInt(this.zone.maxirrigators),
      lamponleafdiff: lampon,
      lampoffleafdiff: lampoff
    };
  },

  components: {
    ZoneActual,
    ZoneTarget,
    Readable
  },

  computed: {
    activeIcon() {
      if (this.zone.active) {
        return "toggle-on";
      } else {
        return "toggle-off";
      }
    },

    activeClass() {
      if (this.zone.active) {
        return "has-text-success";
      } else {
        return "has-text-info";
      }
    },

    linkto() {
      return `#zone-details-${this.zone.id}`;
    },

    isDay() {
      return this.zone.isDay(new Date());
    },

    lastupdate() {
      let lastupdate;
      this.zone.devices.forEach(d => {
        if (d.updatedat < lastupdate) lastupdate = d.updatedat;
      });
      return lastupdate;
    },

    ...mapGetters("devices", ["devices"]),
    ...mapGetters("meters", ["meters"]),
    ...mapGetters("profiles", ["profiles"]),
    ...mapGetters("zones", ["zones"]),
    ...mapGetters("settings", ["settings"])
  },

  methods: {
    clickChild(zone) {
      this.$router.push({ name: "zone", params: { id: zone.id } });
    },

    clickDevice(device) {
      this.$router.push({
        name: "statuses",
        params: { name: device.name, device: device.device }
      });
    },

    deviceClass(device) {
      return `tag has-background-grey-darker is-medium ${device.textClass}`;
    },

    clickMeter(meter) {
      this.$router.push({
        name: "readings",
        params: { name: meter.name, device: meter.device }
      });
    },

    ...mapActions("zones", [
      "addDevice",
      "addChild",
      "edit",
      "fetchData",
      "removeDevice",
      "removeChild"
    ])
  }
});

export default ZoneDetail;
</script>

<style scoped>
.clickable:hover {
  cursor: pointer;
}
</style>
