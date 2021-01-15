process.env.NODE_ENV = process.env.NODE_ENV || 'development';

import { App } from './app';

(async () => {
    const app = App.instance();
    app.run();
})();
