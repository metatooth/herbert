import HTTP from "@/api/http";

import {
  ADD_ZONE,
  EDIT_ZONE,
  REMOVE_ZONE,
  SET_ZONES,
  ADD_PROFILE,
  EDIT_PROFILE,
  REMOVE_PROFILE,
  SET_PROFILES,
  SET_DEVICES,
  SET_WORKERS
} from "./mutation-types";

export default {
  getZones({ commit }) {
    HTTP.get("/zones").then(response => {
      commit(SET_ZONES, response.data);
    });
  },

  getProfiles({ commit }) {
    HTTP.get("/profiles").then(response => {
      commit(SET_PROFILES, response.data);
    });
  },

  getDevices({ commit }) {
    HTTP.get("/devices").then(response => {
      commit(SET_DEVICES, response.data);
    });
  },

  getWorkers({ commit }) {
    HTTP.get("/workers").then(response => {
      commit(SET_WORKERS, response.data);
    });
  },

  addZone({ commit }, zone) {
    const json = JSON.stringify(zone);
    const headers = { headers: { "Content-Type": "application/json" } };
    HTTP.post("/zones", json).then(response => {
      commit(ADD_ZONE, response.data);
    });
  },

  removeZone({ commit }, zone) {
    HTTP.delete(`/zones/${zone.id}`).then(response => {
      commit(REMOVE_ZONE, zone);
    });
  },

  editZone({ commit }, zone) {
    const json = JSON.stringify(zone);
    HTTP.put(`/zones/${zone.id}`, json).then(response => {
      commit(EDIT_ZONE, response.data);
    });
  },

  addProfile({ commit }, profile) {
    const json = JSON.stringify(profile);
    HTTP.post("/profiles", json).then(response => {
      console.log("added profile", response.data);
      commit(ADD_PROFILE, response.data);
    });
  },

  removeProfile({ commit }, profile) {
    console.log("remove profile", profile);
    HTTP.delete(`/profiles/${profile.id}`).then(response => {
      console.log("REMOVED", response);
      commit(REMOVE_PROFILE, profile);
    });
  },

  editProfile({ commit }, profile) {
    const json = JSON.stringify(profile);
    HTTP.put(`/profiles/${profile.id}`, json).then(response => {
      commit(EDIT_PROFILE, response.data);
    });
  }

};
