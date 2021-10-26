<template>
  <div :id="linkto" class="level">
    <div class="card">
      <div class="card-content">
        <edit-text :text="nickname" @edit-text="saveNickname" />
      </div>

      <zone-target :zone="zone" :units="settings.units" />

      <zone-actual :zone="zone" :units="settings.units" />

      <div class="card-content">
        <select-profile
          label="Growing"
          :zone="zone"
          @select-profile="saveProfile"
        />
        <edit-number
          :num="dayLeafDiff"
          label="Leaf Diff (Day)"
          icon="cannabis"
          color="#ffe08a"
          size="medium"
          @edit-number="saveLampOnLeafDiff"
        />
        <edit-number
          :num="nightLeafDiff"
          label="Leaf Diff (Night)"
          icon="cannabis"
          color="#209cee"
          size="medium"
          @edit-number="saveLampOffLeafDiff"
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
            :units="settings.units"
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
        <select-zone
          label="Zones"
          :zones="availableZones"
          @select-zone="addZone"
        />
      </div>

      <div class="card-content">
        <select-meter
          label="Meters"
          :meters="availableMeters"
          @select-meter="add"
        />
      </div>

      <div class="card-content">
        <select-device
          label="Switches"
          :devices="availableSwitches"
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
    zone: Zone
  },

  data() {
    return {
      nickname: this.zone.nickname,
      profileid: this.zone.profileid,
      maxirrigators: this.zone.maxirrigators,
      lamponleafdiff: this.zone.lamponleafdiff,
      lampoffleafdiff: this.zone.lampoffleafdiff,
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
    linkto() {
      return `zone-details-${this.zone.id}`;
    },

    availableMeters() {
      const taken = this.zone.meters.map(m => {
        return m.device;
      });

      return this.meters.filter(el => {
        return !taken.includes(el.device);
      });
    },

    availableSwitches() {
      const taken = this.zone.devices.map(d => {
        return d.device;
      });

      return this.devices.filter(el => {
        return !taken.includes(el.device) && el.devicetype !== null;
      });
    },

    availableZones() {
      return this.zones.filter(el => {
        return el.id !== this.zone.id;
      });
    },

    dayLeafDiff() {
      if (this.settings.units === "F") {
        return (this.lamponleafdiff * 9) / 5;
      } else {
        return this.lamponleafdiff;
      }
    },

    nightLeafDiff() {
      if (this.settings.units === "F") {
        return (this.lampoffleafdiff * 9) / 5;
      } else {
        return this.lampoffleafdiff;
      }
    },

    ...mapGetters("devices", ["devices"]),
    ...mapGetters("meters", ["meters"]),
    ...mapGetters("profiles", ["profiles"]),
    ...mapGetters("zones", ["zones"]),
    ...mapGetters("settings", ["settings"])
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

    saveLampOnLeafDiff(diff: number) {
      let val = diff;
      if (this.settings.units === "F") {
        val = (diff * 5) / 9;
      }

      const zone = {
        ...this.zone,
        lamponleafdiff: val
      };

      this.edit(zone);
    },

    saveLampOffLeafDiff(diff: number) {
      let val = diff;
      if (this.settings.units === "F") {
        val = (diff * 5) / 9;
      }

      const zone = {
        ...this.zone,
        lampoffleafdiff: val
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
