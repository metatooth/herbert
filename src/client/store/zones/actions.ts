import { ActionTree } from "vuex";
import HTTP from "@/api/http";
import { ZonesState, Zone } from "./types";
import { Device } from "../devices/types";
import { Meter } from "../meters/types";
import { RootState } from "../types";

export const actions: ActionTree<ZonesState, RootState> = {
  add({ commit }, payload: Zone) {
    const json = JSON.stringify(payload);
    HTTP.post("/zones", json).then(response => {
      commit("ADD", Object.assign(new Zone(), response.data));
    });
  },

  addDevice({ commit }, payload: { zone: Zone; device: string }) {
    const json = JSON.stringify({ device: payload.device });
    HTTP.post(`/zones/${payload.zone.id}/devices`, json).then(response => {
      const device = response.data.devices.find(
        el => el.device === payload.device
      );
      if (device) {
        commit("ADD_DEVICE", {
          zone: payload.zone,
          device: Object.assign(new Device(), device)
        });
      }

      const meter = response.data.meters.find(
        el => el.device === payload.device
      );
      if (meter) {
        commit("ADD_METER", {
          zone: payload.zone,
          meter: Object.assign(new Meter(), meter)
        });
      }
    });
  },

  addChild({ commit }, payload: { zone: Zone; child: string }) {
    const json = JSON.stringify({ child: payload.child });
    HTTP.post(`/zones/${payload.zone.id}/children`, json).then(() => {
      commit("ADD_CHILD", payload);
    });
  },

  edit({ commit }, payload: Zone) {
    const json = JSON.stringify(payload);
    HTTP.put(`/zones/${payload.id}`, json).then(response => {
      const zone = Object.assign(new Zone(), response.data);
      const clone = JSON.parse(JSON.stringify(response.data));

      zone.maxirrigators = parseInt(clone.maxirrigators);

        if (zone.profile) {
          zone.profile.lampontemperature = parseFloat(
            clone.profile.lampontemperature
          );

          zone.profile.lamponhumidity = parseFloat(
            clone.profile.lamponhumidity
          );
          zone.profile.lampofftemperature = parseFloat(
            clone.profile.lampofftemperature
          );

          zone.profile.lampoffhumidity = parseFloat(
            clone.profile.lampoffhumidity
          );
        }


      commit("EDIT", zone);
    });
  },

  fetchData({ commit }) {
    HTTP.get("/zones").then(response => {
      const payload: Zone[] = [];
      response.data.forEach((json: object) => {
        const zone = Object.assign(new Zone(), json);
        const clone = JSON.parse(JSON.stringify(json));

        zone.maxirrigators = parseInt(clone.maxirrigators);

        if (zone.profile) {
          zone.profile.lampontemperature = parseFloat(
            clone.profile.lampontemperature
          );

          zone.profile.lamponhumidity = parseFloat(
            clone.profile.lamponhumidity
          );
          zone.profile.lampofftemperature = parseFloat(
            clone.profile.lampofftemperature
          );

          zone.profile.lampoffhumidity = parseFloat(
            clone.profile.lampoffhumidity
          );
        }

        const devices: Device[] = [];
        const meters: Meter[] = [];
        const children: number[] = [];

        clone.devices.forEach((d: object) => {
          const device = new Device(JSON.stringify(d));
          devices.push(device);
        });

        clone.meters.forEach((m: object) => {
          const meter = new Meter(JSON.stringify(m));
          meters.push(meter);
        });

        clone.children.forEach((i: number) => {
          children.push(i);
        });

        zone.devices = devices;
        zone.meters = meters;
        zone.children = children;

        payload.push(zone);
      });
      commit("SET", payload);
    });
  },

  remove({ commit }, payload: Zone) {
    HTTP.delete(`/zones/${payload.id}`);
    commit("REMOVE", payload);
  },

  removeDevice({ commit }, payload: { zone: Zone; device: string }) {
    HTTP.delete(`/zones/${payload.zone.id}/devices/${payload.device}`);
    commit("REMOVE_DEVICE", payload);
  },

  removeMeter({ commit }, payload: { zone: Zone; meter: string }) {
    HTTP.delete(`/zones/${payload.zone.id}/devices/${payload.meter}`);
    commit("REMOVE_METER", payload);
  },

  removeChild({ commit }, payload: { zone: Zone; child: string }) {
    const json = JSON.stringify({ child: payload.child });
    HTTP.delete(`/zones/${payload.zone.id}/children/${payload.child}`, json);
    commit("REMOVE_CHILD", payload);
  }
};
