<template>
  <div :id="linkto" class="level">
    <div class="card">
      <div class="card-content">
        <edit-text v-bind:text="zone.nickname" @edit-text="saveNickname" />
      </div>

      <meter-actual :zone="zone" :units="units" />

      <meter-target :zone="zone" :units="units" />

      <div class="card-content">
        <select-profile
          label="Growing"
          v-bind:zone="zone"
          @select-profile="saveProfile"
        />
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
        <select-meter @select-meter="add" />
      </div>

      <div class="card-content">
        <select-device
          label="Switches"
          v-bind:devices="devices"
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
import SelectDevice from "@/components/SelectDevice.vue";
import SelectMeter from "@/components/SelectMeter.vue";
import SelectProfile from "@/components/SelectProfile.vue";
import Timestamp from "@/components/Timestamp.vue";
import Vue from "vue";
import { Zone } from "@/store/zones/types";
import MeterWidget from "@/components/MeterWidget.vue";
import DeviceWidget from "@/components/DeviceWidget.vue";
import { mapGetters, mapActions } from "vuex";
import MeterActual from "@/components/MeterActual.vue";
import MeterTarget from "@/components/MeterTarget.vue";

const ZoneDetail = Vue.extend({
  props: {
    zone: Zone,
    units: String
  },

  data() {
    return {
      timestamp: new Date()
    };
  },

  components: {
    DeviceWidget,
    EditText,
    MeterActual,
    MeterTarget,
    MeterWidget,
    SelectDevice,
    SelectMeter,
    SelectProfile,
    Timestamp
  },

  computed: {
    linkto(): string {
      return `zone-details-${this.zone.id}`;
    },

    ...mapGetters("devices", ["devices"]),
    ...mapGetters("meters", ["meters"]),
    ...mapGetters("profiles", ["profiles"])
  },

  mounted() {
    setTimeout(() => this.scrollFix(this.$route.hash), 1);
  },

  methods: {
    add(selected: string) {
      const payload = { zone: this.zone, device: selected };
      console.log("ADD WITH", payload);
      this.addDevice(payload);
      this.fetchData();
    },

    remove(selected: string) {
      const payload = { zone: this.zone, device: selected };
      this.removeDevice(payload);
      this.fetchData();
    },

    saveNickname(nickname: string) {
      const zone = {
        id: this.zone.id,
        nickname: nickname,
        profileid: this.zone.profileid
      };

      this.edit(zone);
    },

    saveProfile(profile: number) {
      const zone = {
        id: this.zone.id,
        nickname: this.zone.nickname,
        profileid: profile
      };

      this.edit(zone);
    },

    scrollFix(hashbang: string) {
      location.hash = hashbang;
    },

    ...mapActions("zones", ["addDevice", "edit", "fetchData", "removeDevice"])
  }
});

export default ZoneDetail;
</script>
