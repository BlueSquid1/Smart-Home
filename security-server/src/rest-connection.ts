import {Express, Request, Response} from 'express';

import * as iconnection from './iconnection';

export class RestConnection extends iconnection.IConnection {

    public constructor(server : Express, sensorUrl : string) {
        super();
        this.status = "disconnected";

        server.get("/api/sensor/" + sensorUrl, (req : Request, res : Response) => {
            this.statusHandler(req, res);
        });
    }

    public sendStatus(newState : iconnection.Status) : boolean {
        //TODO
        return false;
    }

    public getStatus(): iconnection.Status {
        return this.status;
    }

    private statusHandler(req : Request, res : Response) : void {
        const newStatus = <iconnection.Status>req.query['status'];
        if(this.status !== newStatus) {
            const oldStatus = this.status;
            this.status = newStatus;
            this.callback.trigger({curState: newStatus, oldState: oldStatus});
        }
        res.sendStatus(200);
    }

    private status : iconnection.Status; // e.g. disconnected, triggered, untriggered etc
}