import Vue from "vue";
import Vuex, { StoreOptions } from "vuex";
import { RootState } from "./types";
import { zones } from "./zones";
import { notifications } from "./notifications";
import { profiles } from "./profiles";
import { devices } from "./devices";
import { workers } from "./workers";

Vue.use(Vuex);

const store: StoreOptions<RootState> = {
  strict: true,
  state: {
    version: "1.0.0"
  },
  modules: {
    zones,
    notifications,
    profiles,
    devices,
    workers
  }
};

export default new Vuex.Store<RootState>(store);
