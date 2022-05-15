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


// Last non-error route is used to detected 404 errors
app.use(function(req, res, next){
    console.error("404 error when client: " + req.ip + " accessing: " + req.url);
    res.status(404);
    res.send('404 error');
});


const port = 80;
app.listen(port, () => {
    console.log(`Security server is up on ${port}`);
});