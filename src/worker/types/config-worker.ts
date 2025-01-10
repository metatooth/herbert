import ConfigDevice from "./ConfigDevice";

export default interface ConfigWorker {
  interval: number;
  polling: number;
  devices: ConfigDevice[];
}
