import { Device, Profile, Zone, Worker } from "./mutation-types";

const mutations = {
  ADD_ZONE_DEVICE(state: any, zone: Zone) {
    console.log("add zone device mutation", zone);
  },

  ADD_ZONE(state: any, zone: Zone) {
    zone.updatedAt = new Date();
    state.zones.push(zone);
  },

  REMOVE_ZONE_DEVICE(state: any, payload: any) {
    console.log("remove zone device mutation", payload);
  },

  REMOVE_ZONE(state: any, zone: Zone) {
    state.zones.splice(state.zones.indexOf(zone), 1);
  },

  EDIT_ZONE(state: any, zone: Zone) {
    const found = state.zones.find((el: Zone) => el.id === zone.id);
    const index = state.zones.indexOf(found);
    state.zones.splice(index, 1, zone);
  },

  SET_ZONES(state: any, zones: Zone[]) {
    state.zones = zones;
  },

  ADD_PROFILE(state: any, profile: Profile) {
    profile.updatedAt = new Date();
    state.profiles.push(profile);
  },

  REMOVE_PROFILE(state: any, profile: Profile) {
    const index = state.profiles.indexOf(profile);
    state.profiles.splice(state.profiles.indexOf(profile), 1);
  },

  EDIT_PROFILE(state: any, profile: Profile) {
    const found = state.profiles.find((el: Profile) => el.id === profile.id);
    const index = state.profiles.indexOf(found);
    state.profiles.splice(index, 1, profile);
  },

  SET_PROFILES(state: any, profiles: Profile[]) {
    state.profiles = profiles;
  },

  EDIT_DEVICE(state: any, device: Device) {
    const found = state.devices.find(
      (el: Device) => el.device === device.device
    );
    const index = state.devices.indexOf(found);
    state.devices.splice(index, 1, device);
  },

  SET_DEVICES(state: any, devices: Device[]) {
    state.devices = devices;
  },

  EDIT_WORKER(state: any, worker: Worker) {
    const found = state.workers.find(
      (el: Worker) => el.worker === worker.worker
    );
    const index = state.workers.indexOf(worker);
    state.workers.splice(index, 1, worker);
  },

  SET_WORKERS(state: any, workers: Worker[]) {
    state.workers = workers;
  }
};

export default mutations;
