const getters = {
  allZones: (state: Store) => state.zones,
  allProfiles: (state: Store) => state.profiles,
  allDevices: (state: Store) => state.devices,
  allWorkers: (state: Store) => state.workers
};

export default getters;
