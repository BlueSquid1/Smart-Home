import * as express from 'express';

import * as app from './app';

const server = express.default();

const securityApp = new app.App(server);
securityApp.init();

server.get('/api/arm', (req, res) => {
  securityApp.armHouse();
  res.send('armed house');
});

server.get('/api/unarm', (req, res) => {
  securityApp.unarmHouse();
  res.send('unarmed house');
});

const port = 3000;
server.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})