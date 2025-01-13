import ConfigDevice from "./config-device";

export default interface ConfigWorker {
  interval: number;
  polling: number;
  devices: ConfigDevice[];
}
