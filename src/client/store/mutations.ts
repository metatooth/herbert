const mutations = {
  ADD_ZONE(state, zone) {
    zone["updated_at"] = new Date();
    state.zones.push(zone);
  },

  REMOVE_ZONE(state, zone) {
    state.zones.splice(state.zones.indexOf(zone), 1);
  },

  EDIT_ZONE(state, zone) {
    console.log("edit zone?", zone);
    const found = state.zones.find(el => el.id === zone.id);
    console.log("found", found);
    const index = state.zones.indexOf(found);
    console.log("index", index);

    state.zones.splice(index, 1, zone);
  },

  SET_ZONES(state, zones: []) {
    state.zones = zones;
  },

  ADD_PROFILE(state, profile) {
    console.log("add profile?", profile);
    profile["updated_at"] = new Date();
    state.profiles.push(profile);
  },

  REMOVE_PROFILE(state, profile) {
    console.log("remove profile?", profile);
    const index = state.profiles.indexOf(profile);
    console.log("profiles index", index);
    state.profiles.splice(state.profiles.indexOf(profile), 1);
  },

  EDIT_PROFILE(state, profile) {
    console.log("edit profile?", profile);
    const found = state.profiles.find(el => el.id === profile.id);
    console.log("found", found);
    const index = state.profiles.indexOf(found);
    console.log("index", index);

    state.profiles.splice(index, 1, profile);
  },

  SET_PROFILES(state, profiles: []) {
    state.profiles = profiles;
  },

  SET_DEVICES(state, devices: []) {
    state.devices = devices;
  },

  SET_WORKERS(state, workers: []) {
    state.workers = workers;
  }
};

export default mutations;
