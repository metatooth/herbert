export class Config {
  nickname = "";
  config = "";

  toString() {
    return JSON.stringify(this.config);
  }
}

export interface ConfigState {
  configs: Config[];
  error: boolean;
}
