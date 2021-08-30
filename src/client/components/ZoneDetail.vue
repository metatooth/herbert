<template>
  <div :id="linkto" class="level">
    <div class="card">
      <div class="card-content">
        <edit-text :text="nickname" @edit-text="saveNickname" />
      </div>

      <zone-actual :zone="zone" :units="units" />

      <zone-target :zone="zone" :units="units" />

      <div class="card-content">
        <select-profile
          label="Growing"
          :zone="zone"
          @select-profile="saveProfile"
        />
      </div>

      <div class="card-content" v-if="zone.children.length > 0">
        <edit-number
          :num="maxirrigators"
          label="Max Irrigators"
          icon="cloud-rain"
          size="medium"
          @edit-number="saveMaxIrrigators"
        />
      </div>

      <div class="card-content">
        <div class="field is-grouped is-grouped-multiline">
          <child-widget
            v-for="child in zone.children"
            :key="child"
            :id="child"
            @remove-child="removeChildZone"
            @jump="jump"
          />
        </div>
      </div>

      <div class="card-content">
        <div class="field is-grouped is-grouped-multiline">
          <meter-widget
            v-for="meter in zone.meters"
            :key="meter.device"
            :meter="meter"
            :units="units"
            @remove-device="remove"
          />
        </div>
      </div>

      <div class="card-content">
        <div class="field is-grouped is-grouped-multiline">
          <device-widget
            v-for="device in zone.devices"
            :key="device.device"
            :device="device"
            @remove-device="remove"
          />
        </div>
      </div>

      <div class="card-content">
        <select-zone :exclude="zone" @select-zone="addZone" />
      </div>

      <div class="card-content">
        <select-meter @select-meter="add" />
      </div>

      <div class="card-content">
        <select-device
          label="Switches"
          :devices="devices"
          @select-device="add"
        />
      </div>

      <footer class="card-footer">
        <div class="card-footer-item">
          <timestamp :timestamp="this.timestamp" />
        </div>
      </footer>
    </div>
  </div>
</template>

<script lang="ts">
import EditText from "@/components/EditText.vue";
import EditNumber from "@/components/EditNumber.vue";
import SelectDevice from "@/components/SelectDevice.vue";
import SelectMeter from "@/components/SelectMeter.vue";
import SelectZone from "@/components/SelectZone.vue";
import SelectProfile from "@/components/SelectProfile.vue";
import Timestamp from "@/components/Timestamp.vue";
import Vue from "vue";
import { Zone } from "@/store/zones/types";
import MeterWidget from "@/components/MeterWidget.vue";
import DeviceWidget from "@/components/DeviceWidget.vue";
import { mapGetters, mapActions } from "vuex";
import ZoneActual from "@/components/ZoneActual.vue";
import ZoneTarget from "@/components/ZoneTarget.vue";
import ChildWidget from "@/components/ChildWidget.vue";

const ZoneDetail = Vue.extend({
  props: {
    zone: Zone,
    units: String
  },

  data() {
    return {
      nickname: this.zone.nickname,
      profileid: this.zone.profileid,
      maxirrigators: this.zone.maxirrigators,
      timestamp: new Date()
    };
  },

  components: {
    ChildWidget,
    DeviceWidget,
    EditNumber,
    EditText,
    ZoneActual,
    ZoneTarget,
    MeterWidget,
    SelectDevice,
    SelectMeter,
    SelectProfile,
    SelectZone,
    Timestamp
  },

  computed: {
    linkto(): string {
      return `zone-details-${this.zone.id}`;
    },

    ...mapGetters("devices", ["devices"]),
    ...mapGetters("meters", ["meters"]),
    ...mapGetters("profiles", ["profiles"]),
    ...mapGetters("zones", ["zones"])
  },

  mounted() {
    setTimeout(() => this.scrollFix(this.$route.hash), 1);
  },

  methods: {
    add(selected: string) {
      const payload = { zone: this.zone, device: selected };
      this.addDevice(payload);
      this.fetchData();
    },

    addZone(selected: string) {
      const payload = { zone: this.zone, child: selected };
      this.addChild(payload);
      this.fetchData();
    },

    child(id: number) {
      let child = null;
      this.zones.forEach(zone => {
        if (zone.id === id) {
          child = zone;
        }
      });
      return child;
    },

    remove(selected: string) {
      const payload = { zone: this.zone, device: selected };
      this.removeDevice(payload);
      this.fetchData();
    },

    removeChildZone(selected: number) {
      const payload = { zone: this.zone, child: selected };
      this.removeChild(payload);
      this.fetchData();
    },

    saveNickname(nickname: string) {
      const zone = {
        ...this.zone,
        nickname: nickname
      };

      this.edit(zone);
    },

    saveProfile(profile: number) {
      const zone = {
        ...this.zone,
        profileid: profile
      };

      this.edit(zone);
    },

    saveMaxIrrigators(max: number) {
      const zone = {
        ...this.zone,
        maxirrigators: max
      };

      this.edit(zone);
    },

    scrollFix(hashbang: string) {
      location.hash = hashbang;
    },

    jump() {
      setTimeout(() => this.scrollFix(this.$route.hash), 1);
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
