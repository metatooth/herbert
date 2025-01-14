<script lang="ts">
import Vue from "vue";
import { mapGetters } from "vuex";
import ChartBase from "@/components/ChartBase.vue";
import { convertToLocalTime } from "date-fns-timezone";
import BackToDashboard from "@/components/BackToDashboard.vue";

const Statuses = Vue.extend({
  components: {
    BackToDashboard,
    ChartBase,
  },
  props: {
    name: { type: String, default: "" },
  },

  data() {
    return {
      range: "hour",
      statuses: [],
    };
  },

  computed: {
    ...mapGetters("settings", ["settings"]),
  },

  watch: {
    range() {
      this.refresh();
    },
  },

  mounted() {
    this.refresh();
  },

  methods: {
    refresh() {
      const xhr = new XMLHttpRequest();
      const url = process.env.VUE_APP_API_URL;

      xhr.open(
        "GET",
        `${url}/statuses/?device=${this.$route.params.device}&last=${this.range}`,
      );

      xhr.onload = () => {
        const data = JSON.parse(xhr.response);
        if (!data.error) {
          this.statuses = [];
          data.forEach((d) => {
            const ts = convertToLocalTime(d.observedat, {
              timeZone: this.settings.timezone,
            });
            const status = {
              x: ts,
              y: d.status === "on" ? 1 : 0,
            };

            this.statuses.push(status);
          });
        }
      };

      xhr.send();
    },
  },
});
export default Statuses;
</script>

<template>
  <div id="statuses">
    <section class="section">
      <back-to-dashboard />
    </section>
    <section class="section">
      <h2 class="title">{{ $route.params.name }} Switch Status</h2>
      <h2 class="subtitle">
        {{ $route.params.device }}
      </h2>

      <form class="control">
        Last&nbsp;
        <label for="year" class="radio">
          <input id="year" v-model="range" type="radio" value="year" />
          Year
        </label>
        &nbsp;
        <label for="month" class="radio">
          <input id="month" v-model="range" type="radio" value="month" />
          Month
        </label>
        &nbsp;
        <label for="week" class="radio">
          <input id="week" v-model="range" type="radio" value="week" />
          Week
        </label>
        &nbsp;
        <label for="day" class="radio">
          <input id="day" v-model="range" type="radio" value="day" />
          Day
        </label>
        &nbsp;
        <label for="hour" class="radio">
          <input id="hour" v-model="range" type="radio" value="hour" />
          Hour
        </label>
      </form>

      <div class="columns">
        <div class="column is-half">
          <chart-base
            id="statuschart"
            :data="statuses"
            label="Device Status"
            title="Duty Cycle"
            type="line"
          />
        </div>
        <div class="column is-half" />
      </div>
    </section>
  </div>
</template>
