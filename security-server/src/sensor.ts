import * as iconnection from "./iconnection";

export type Model = "pir" | "siren" | "strobe" | "lock";

export type CallbackType = (sensor : Sensor, curState : iconnection.Status, oldState : iconnection.Status) => void;

export class Sensor {
    public constructor(name : string, model : Model, connection : iconnection.IConnection) {
        this.name = name;
        this.model = model;
        this.connection = connection;

        // Give it a default status handlers so all changes can be logged.
        this.StatusChangeEvent( (sensor : Sensor, curState : iconnection.Status, oldState : iconnection.Status) => {
            this.defaultStatusListener(sensor, curState, oldState);
        });
    }

    public getName() : string {
        return this.name;
    }
    public getModel() : Model {
        return this.model;
    }

    public getStatus() : iconnection.Status {
        return this.connection.getStatus();
    }

    public sendStatus(newState : iconnection.Status) : boolean {
        return this.connection.sendStatus(newState);
    }

    public StatusChangeEvent(stateChange : CallbackType) : void {
        this.connection.statusChangeEvent((curState : iconnection.Status, oldState : iconnection.Status)=> {
            stateChange(this, curState, oldState);
        });
    }

    private defaultStatusListener(sensor : Sensor, curState : iconnection.Status, oldState : iconnection.Status) {
        console.log("sensor: " + sensor.getName() + "state changed from: " + oldState + " to new state: " + curState)
    }

    private name : string;
    private model : Model;
    private connection : iconnection.IConnection;
}