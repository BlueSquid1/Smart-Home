import * as fs from 'fs';
import * as onoff from 'onoff';

import * as express from 'express';
import * as sensor from './sensor';
import * as pinConnection from './pin-connection';
import * as restConnection from './rest-connection';
import * as iconnection from './iconnection';


export class SensorLoader {
    public static loadFromJson(server : express.Express, jsonFile : string) : sensor.Sensor[] {
        const fileString = fs.readFileSync(jsonFile, 'utf8');
        const fileSettings = JSON.parse(fileString);

        const sensorSettings = fileSettings['sensors'];

        let sensors : sensor.Sensor[] = [];

        for(let sensorSetting of sensorSettings) {
            const name = sensorSetting['name'];
            const type = sensorSetting['model'];
            const connectionType = sensorSetting['connection-type'];
            let connection : iconnection.IConnection;
            if(connectionType === 'rest') {
                const ipAddress = sensorSetting['rest-address'];
                connection = new restConnection.RestConnection(server, ipAddress);
            } else if(connectionType === 'pin') {
                const pinNum = sensorSetting['pin-number'];
                let pinDirection : onoff.Direction = 'in';
                switch(type) {
                    case 'siren':
                    case 'strobe': {
                        pinDirection = 'out';
                        break;
                    }
                }
                connection = new pinConnection.PinConnection(pinNum, pinDirection)
            }
            else
            {
                return [];
            }
            sensors.push(new sensor.Sensor(name, type, connection))           
        }
        return sensors;
    }
}