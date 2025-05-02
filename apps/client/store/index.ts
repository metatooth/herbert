import { createStore } from "vuex";

import { RootState } from "./types";
import { zones } from "./zones";
import { notifications } from "./notifications";
import { profiles } from "./profiles";
import { devices } from "./devices";
import { meters } from "./meters";
import { workers } from "./workers";
import { settings } from "./settings";
import { configs } from "./configs";

const store = createStore({
  strict: true,
  state: {
    version: "1.0.0",
  },
  modules: {
    zones,
    notifications,
    profiles,
    devices,
    meters,
    workers,
    settings,
    configs,
  },
});

export default store;
