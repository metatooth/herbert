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
        <span v-else>{{ meter.name }}</span>
      </p>
      <p class="subtitle">
        {{ meter.device }}
      </p>
      <div class="content">
        <meter-actual :meter="meter" />
      </div>
      <div class="content">
        <readable class="is-italic" :timestamp="new Date(meter.updatedat)" />
        <router-link
          :to="{
            name: 'readings',
            params: { name: meter.nickname, device: meter.device }
          }"
        >
          &gt;&gt;&gt;
        </router-link>
      </div>
      <div class="content">
        <edit-controls
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

const MeterTile = Vue.extend({
  props: {
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
    Readable
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
