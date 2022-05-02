import * as express from 'express';
import * as path from 'path';

import * as securityMgr from './security-mgr';

const app = express.default();

const securityApp = new securityMgr.SecurityMgr(app);
const securityFilePath = path.join(__dirname, 'security.json');
const result = securityApp.initalize(securityFilePath);
if(!result) {
  console.log("failed to initalise. Shutting down.");
  process.exit(1);
}

app.get('/api/arm', (req, res) => {
  securityApp.armHouse();
  res.send('arming house');
});

app.get('/api/unarm', (req, res) => {
  securityApp.unarmHouse();
  res.send('unarmed house');
});

const port = 80;
app.listen(port, () => {
  console.log(`Security server is up on ${port}`)
});