const express = require('express');
const app = express();
const port = process.env.CLIENT_PORT || '8080';

app.use(express.static('dist/client'));

app.listen(port, () => {
  console.log(`Herbert client listing at ${port}`);
});
