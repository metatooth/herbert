<script lang="ts">
import { mapGetters, mapActions } from "vuex";

import DeviceTag from "@client/components/DeviceTag.vue";
import Readable from "@client/components/Readable.vue";
import ZoneActual from "@client/components/ZoneActual.vue";
import ZoneStatusButton from "@client/components/ZoneStatusButton.vue";
import ZoneTag from "@client/components/ZoneTag.vue";
import { Device } from "@client/store/devices/types";
import { Zone } from "@client/store/zones/types";

export default {
  components: {
    DeviceTag,
    Readable,
    ZoneActual,
    ZoneStatusButton,
    ZoneTag,
  },
  props: {
    locked: Boolean,
    zone: Zone,
    units: { type: String, default: "" },
  },

  data() {
    return {
      nickname: this.zone.nickname,
      profileid: this.zone.profileid,
      editing: false,
    };
  },

  computed: {
    background() {
      if (this.zone.isDay(new Date())) {
        return "background-color: #ffe08a";
      } else {
        return "background-color: #7a7a7a";
      }
    },

    sorted() {
      const devices = [];
      this.zone.devices.forEach((d) => {
        devices.push(Object.assign(new Device(), d));
      });
      return devices.sort((a, b) => {
        return a.devicetype.localeCompare(b.devicetype);
      });
    },

    lastupdate() {
      let last = new Date();
      this.zone.meters.forEach((meter) => {
        const updatedat = new Date(meter.updatedat);
        if (last === null || updatedat > last) {
          last = updatedat;
        }
      });
      return last;
    },

    linkto(): string {
      return `#zone-details-${this.zone.id}`;
    },

    statusClass() {
      if (this.zone.active) {
        return "has-text-success";
      } else {
        return "has-text-info";
      }
    },

    statusIcon() {
      if (this.zone.active) {
        return "toggle-on";
      } else {
        return "toggle-off";
      }
    },

    text() {
      if (this.zone.isDay(new Date())) {
        return "color: #ffe08a";
      } else {
        return "color: #7a7a7a";
      }
    },

    ...mapGetters("profiles", ["profiles"]),
    ...mapGetters("settings", ["settings"]),
  },

  methods: {
    clicked() {
      this.$router.push({
        name: "zone",
        hash: this.linkto,
        params: { id: this.zone.id },
      });
    },

    editable() {
      this.editing = true;
    },

    save() {
      const zone = {
        id: this.zone.id,
        nickname: this.nickname,
        profileid: this.profileid,
      };

      this.edit(zone);
      this.editing = false;
    },

    destroy() {
      this.remove(this.zone);
      this.editing = false;
    },

    cancel() {
      this.nickname = this.zone.nickname;
      this.profileid = this.zone.profileid;
      this.editing = false;
    },

    toggle() {
      const zone = {
        ...this.zone,
        active: !this.zone.active,
      };
      this.edit(zone);
    },

    ...mapActions("zones", ["edit", "remove"]),
  },
};
</script>

<template>
  <tr>
    <td>
      <zone-tag :zone="zone" :locked="locked" />
    </td>
    <td>
      <zone-actual :zone="zone" :units="settings.units" />
    </td>
    <td>
      <device-tag
        v-for="device in sorted"
        :key="device.device"
        :device="device"
        :locked="locked"
      />
    </td>
    <td class="is-italic">
      <readable :timestamp="lastupdate" />
    </td>
    <td>
      <zone-status-button :zone="zone" :locked="locked" />
    </td>
  </tr>
</template>
