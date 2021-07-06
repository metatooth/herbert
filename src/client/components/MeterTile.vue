<template>
  <div class="tile is-parent">
    <div class="tile is-child box">
      <p class="title">
        <span v-if="editing">
          <input
            class="input"
            type="text"
            placeHolder="Name this meter"
            v-model="nickname"
            @keyup.esc="cancel" />
        </span>
        <span v-else>{{ meter.nickname || meter.device }}</span>
      </p>
      <p class="subtitle">
        <span class="icon" :class="meterClass">
          <font-awesome-icon icon="tachometer-alt" />
        </span>
        <span class="tag is-medium">{{  meter.device }}</span>
      </p>
      <div class="content">
        <meter-actual :meter="meter" />
      </div>
      <div class="content">
        <timestamp :timestamp="meter.updatedat" :readable="readable" />
      </div>
      <div class="content">
        <router-link
          :to="{
               name: 'readings',
               params: { name: meter.nickname, device: meter.device }
               }"
          >
          history
        </router-link>
      </div>
      <edit-controls
        @on-edit="editable"
        @on-save="save"
        @on-destroy="destroy"
        @on-cancel="cancel" />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { mapActions, mapGetters } from "vuex";
import { Meter } from "@/store/meters/types";
import { Notification } from "@/store/notifications/types";
import { celsius2fahrenheit, celsius2kelvin } from "../../shared/utils";
import MeterActual from "@/components/MeterActual.vue";
import Timestamp from "@/components/Timestamp.vue";
import EditControls from "@/components/EditControls.vue";

const MeterTile = Vue.extend({
  props: {
    meter: Meter
  },

  data() {
    return {
      nickname: this.meter.nickname,
      readable: true,
      editing: false
    };
  },
  
  components: {
    EditControls,
    MeterActual,
    Timestamp
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

    ...mapGetters("notifications", ["notifications"])
  },

  methods: {
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

    destroy() {
      if (confirm("OK to remove?")) {
        this.remove(this.meter);
      }
    },

    cancel() {
      this.nickname = this.meter.nickname;
      this.editing = false;
    },

    ...mapActions("meters", ["edit", "remove"])
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
