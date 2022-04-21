import * as fs from 'fs';
import * as onoff from 'onoff';

import * as express from 'express';
import * as sensor from './sensor';
import * as pinConnection from './pin-connection';
import * as restConnection from './rest-connection';
import * as iconnection from './iconnection';

export class SecuritySettings
{
    sensors: sensor.Sensor[] = [];
    highAlertDurationSeconds: number = 0.0;
    breachDurationSeconds: number = 0.0;
    recoveryDurationHours: number = 0.0;
}


export class SensorLoader {
    public static loadFromJson(server : express.Express, jsonFile : string) : SecuritySettings | undefined {
        const fileString = fs.readFileSync(jsonFile, 'utf8');
        const fileSettings = JSON.parse(fileString);

        const sensorSettings = fileSettings['sensors'];

        let secSettings = new SecuritySettings();

        secSettings.highAlertDurationSeconds = fileSettings['high-alert-duration-seconds'];
        secSettings.breachDurationSeconds = fileSettings['breach-duration-seconds'];
        secSettings.recoveryDurationHours = fileSettings['recovery-duration-hours'];

        for(let sensorSetting of sensorSettings) {
            const name = sensorSetting['name'];
            const type = sensorSetting['model'];
            const connectionType = sensorSetting['connection-type'];
            let connection : iconnection.IConnection;
            if(connectionType === 'rest') {
                const restName = sensorSetting['rest-name'];
                connection = new restConnection.RestConnection(server, restName);
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
                console.log("unknown connection type");
                return undefined;
            }
            secSettings.sensors.push(new sensor.Sensor(name, type, connection))           
        }
        return secSettings;
    }
}