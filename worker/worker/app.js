import * as fs from 'fs';
import { networkInterfaces } from 'os';

try {
  fs.mkdirSync('./log');
} catch (e) {
  if (e.code != 'EEXIST') {
    console.error('Could not set up log directory, error was: ', e);
    process.exit(1);
  }
}

try {
  fs.mkdirSync('./store');
} catch (e) {
  if (e.code != 'EEXIST') {
    console.error('Could not set up storage directory, error was: ', e);
    process.exit(1);
  }
}

export class App {
  constructor() {
    App.instance = App.instance || this;
    return App.instance;
  }

  init() {
    this.initialized = true;
  }

  async run() {
    while (true) {
      console.log('RUN', new Date());
      console.log(this);
      if (!this.initialized) {
        return Promise.reject('app is not initialized');
      }
      await new Promise((resolve) =>
        setTimeout(resolve, process.env.INTERVAL || 3000),
      );
    }
  }
}
