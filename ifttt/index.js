// index.js

// init project
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();

app.use(bodyParser.json());
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));
app.use(express.static('assets'));

app.use((req, res, next) => {
  require('./app/router')(req, res, next);
});

const listener = app.listen(process.env.PORT, function() {
  console.log('Your app is listening on port ' + listener.address().port);
});


// Only run this in development
if (process.env.NODE_ENV !== 'production') {
  const chokidar = require('chokidar');

  // Set up watcher to watch all files in ./app
  const watcher = chokidar.watch('./app');

  watcher.on('ready', function() {
    // On any file change event
    // You could customise this to only run on new/save/delete etc
    // This will also pass the file modified into the callback
    // however for this example we aren't using that information
    watcher.on('all', function() {
      console.log('Reloading server...');
      // Loop through the cached modules
      // The "id" is the FULL path to the cached module
      Object.keys(require.cache).forEach(function(id) {
        // Get the local path to the module
        const localId = id.substr(process.cwd().length);

        // Ignore anything not in server/app
        if (!localId.match(/^\/app\//)) return;

        // Remove the module from the cache
        delete require.cache[id];
      });
      console.log('Server reloaded.');
    });
  });
}
