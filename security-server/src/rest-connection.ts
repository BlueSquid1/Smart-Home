import {Express, Request, Response} from 'express';

import * as isensor from './sensor';
import * as iconnection from './iconnection';

export class RestConnection implements iconnection.IConnection {

    public constructor(server : Express, sensorUrl : string) {
        this.status = "disconnected";
        this.callback = undefined;

        server.get("/api/sensor/" + sensorUrl, (req : Request, res : Response) => {
            this.statusHandler(req, res);
        });
    }

    statusChangeEvent(stateChange : iconnection.CallbackType) : void {
        this.callback = stateChange;
    }

    public sendStatus(newState : iconnection.Status) : boolean {
        //TODO
        return false;
    }

    public getStatus(): iconnection.Status {
        return this.status;
    }

    private statusHandler(req : Request, res : Response) : void {
        const newStatus = <iconnection.Status>req.params['status'];
        if(this.status !== newStatus) {
            const oldStatus = this.status;
            this.status = newStatus;
            if(this.callback) {
                this.callback(newStatus, oldStatus);
            }
        }
        res.sendStatus(200).json();
    }

    private status : iconnection.Status; // e.g. disconnected, triggered, untriggered etc

    private callback : iconnection.CallbackType | undefined;
}