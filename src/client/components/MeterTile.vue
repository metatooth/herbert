<template>
  <div class="tile is-parent">
    <div class="tile is-child box">
      <p class="title">
        <span v-if="editing">
          <div class="field">
            <div class="control">
              <input
                class="input"
                type="text"
                placeHolder="Name this meter"
                v-model="nickname"
                @keyup.esc="cancel"
              />
            </div>
          </div>
        </span>
        <span v-else>
          {{ meter.name }}
        </span>
      </p>
      <p class="subtitle">
        {{ meter.device }}
      </p>
      <p class="subtitle">
        <span v-if="editing">
          <div class="control">
            <select-zone-for-device
              :zoneid="zoneid"
              @select-zone="selectzone"
            />
          </div>
        </span>
        <span v-else>
          {{ zonename }}
        </span>
      </p>
      <div class="content">
        <meter-actual :meter="meter" width="200px" />
      </div>
      <div class="content">
        <readable class="is-italic" :timestamp="new Date(meter.updatedat)" />
      </div>
      <div class="content">
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
</template>

<script lang="ts">
import Vue from "vue";
import { mapActions, mapGetters } from "vuex";
import { Meter } from "@/store/meters/types";
import { Notification } from "@/store/notifications/types";
import MeterActual from "@/components/MeterActual.vue";
import Readable from "@/components/Readable.vue";
import EditControls from "@/components/EditControls.vue";
import SelectZoneForDevice from "@/components/SelectZoneForDevice.vue";

const MeterTile = Vue.extend({
  props: {
    locked: Boolean,
    meter: Meter
  },

  data() {
    return {
      nickname: this.meter.nickname,
      editing: false
    };
  },

  components: {
    EditControls,
    MeterActual,
    Readable,
    SelectZoneForDevice
  },

  computed: {
    meterClass(): string {
      const found = this.notifications.find((n: Notification) => {
        return n.id === this.meter.device;
      });

      if (found) {
        return "has-text-danger";
      }

      return "has-text-success";
    },

    zone() {
      const found = this.zones.filter(zone => {
        const meters = zone.meters.filter(meter => {
          return this.meter.device === meter.device;
        });
        return meters.length !== 0;
      });

      return found.length !== 0 ? found[0] : null;
    },

    zoneid() {
      const zone = this.zone;
      if (zone) {
        return zone.id;
      }
      return 0;
    },

    zonename() {
      const zone = this.zone;
      if (zone) {
        return zone.nickname;
      }
      return "";
    },

    ...mapGetters("notifications", ["notifications"]),
    ...mapGetters("zones", ["zones"])
  },

  methods: {
    cancel() {
      this.nickname = this.meter.nickname;
      this.editing = false;
    },

    destroy() {
      if (confirm("OK to remove?")) {
        this.remove(this.meter);
      }
    },

    editable() {
      this.editing = true;
    },

    save() {
      this.edit({
        ...this.meter,
        nickname: this.nickname
      });
      this.editing = false;
    },

    selectzone(zone: number) {
      const target = this.zones.filter(z => {
        return zone === z.id;
      });

      if (target.length !== 0) {
        const payload = { zone: target[0], device: this.meter.device };

        this.zones.forEach(zone => {
          zone.meters.forEach(meter => {
            if (meter.device === this.meter.device) {
              const doomed = { zone: zone, device: this.meter.device };
              this.removeDevice(doomed);
            }
          });

          if (payload.zone.id === zone.id) {
            this.addDevice(payload);
          }
        });
      }
    },

    ...mapActions("meters", ["edit", "remove"]),
    ...mapActions("zones", ["addDevice", "removeDevice"])
  }
});

export default MeterTile;
</script>

<style>
.subtitle .icon {
  margin: 5px 5px;
}

.subtitle > span {
  overflow: hidden;
}
</style>
