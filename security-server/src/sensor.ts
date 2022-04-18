import * as iconnection from "./iconnection";

export type Model = "PIR" | "RS-LD95-B";

export class Sensor {
    public constructor(name : string, model : Model, connection : iconnection.IConnection) {
        this.name = name;
        this.model = model;
        this.connection = connection;
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

    private name : string;
    private model : Model;
    private connection : iconnection.IConnection;
}