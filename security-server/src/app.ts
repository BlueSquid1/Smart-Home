import * as express from 'express';
import * as path from 'path';

import * as securityMgr from './security-mgr';

export class App
{
    public constructor(server : express.Express) {
        this.securityMgr = new securityMgr.SecurityMgr(server);
    }

    public init() : void {
        const securityFilePath = path.join(__dirname, 'security.json');
        this.securityMgr.initalize(securityFilePath);
    }

    public armHouse() {
        this.securityMgr.armHouse();
    }

    public unarmHouse() {
        this.securityMgr.unarmHouse();
    }

    private securityMgr : securityMgr.SecurityMgr;
}