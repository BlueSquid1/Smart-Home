import * as express from 'express';

import * as sensor from './sensor';
import * as securityLoader from './security-loader';
import * as iconnection from './iconnection';

export class SecurityMgr
{
    public constructor(server : express.Express) {
        this.server = server;
        this.status = 'unarmed';
        this.secConfig = new securityLoader.SecuritySettings();
    }

    public initalize(settingsFile : string) : boolean {
        const configResults = securityLoader.SensorLoader.loadFromJson(this.server, settingsFile);

        if(!configResults) {
            return false;
        }

        this.secConfig = configResults;

        // Hook up the callbacks that can trigger the alarm
        for(let sensor of this.secConfig.sensors) {
            sensor.listenToStatusChange((sensor : sensor.Sensor, curState : iconnection.Status, oldState : iconnection.Status) => {
                this.securityEvent(sensor, curState, oldState);
            });
        }
        return true;
    }

    public armHouse() {
        this.status = 'armed';
        console.log("armed house");
    }

    public unarmHouse() {
        this.status = 'unarmed';
        console.log("unarmed house");
    }

    private securityEvent(sensor : sensor.Sensor, curState : iconnection.Status, oldState : iconnection.Status) {
        // An event that could trigger the alarm has just occured
        switch(this.status) {
            case 'unarmed': {
                return;
                break;
            }
            case 'armed': {
                if(sensor.getModel() === 'pir') {
                    if(curState === 'triggered') {
                        console.log("A pir was triggered. Going to high alert.");
                        this.status = 'high-alert';
                        //start timer
                        setTimeout(() => { this.handleHighAlert() }, this.secConfig.highAlertDurationSeconds * 1000);
                    }
                }
                break;
            }
            case 'high-alert': {
                if(sensor.getModel() === 'pir') {
                    if(curState === 'disconnected') {
                        console.log("A PIR was disconnected on high alert. Too sus. Going to breached.");
                        this.handleBreached();
                    }
                }
                break;
            }
        }
    }

    private handleHighAlert() {
        if(this.status !== 'high-alert') {
            console.log("no longer in high alert. No further action.");
            return;
        }

        console.log("still in high alert after timeout. Going to breached.");
        this.handleBreached();
    }

    private handleBreached() {
        console.log("Triggering alarm.");

        this.status = 'breached';

        // Invoking the sirens.
        const sirens = this.secConfig.sensors.filter( sensor => sensor.getModel() === 'siren');
        sirens.forEach( siren => siren.sendStatus('triggered'));

        // Invoke strobe lights.
        const strobes = this.secConfig.sensors.filter( sensor => sensor.getModel() == 'strobe' );
        strobes.forEach( strobe => strobe.sendStatus('triggered') );

        setTimeout(() => { this.handleRecover() }, this.secConfig.highAlertDurationSeconds * 1000);
    }

    private handleRecover() {
        console.log("Silencing alarm.");
        this.status = 'recovery';

        // Turn off sirens.
        const sirens = this.secConfig.sensors.filter( sensor => sensor.getModel() === 'siren');
        sirens.forEach( siren => siren.sendStatus('untriggered'));

        // Turn off strobe lights.
        const strobes = this.secConfig.sensors.filter( sensor => sensor.getModel() == 'strobe' );
        strobes.forEach( strobe => strobe.sendStatus('untriggered') );

        setTimeout(() => { this.handlePostRecovery() }, this.secConfig.recoveryDurationHours * 60 * 60 * 1000);
    }

    private handlePostRecovery() {
        if(this.status === 'recovery') {
            console.log('still in recovery mode. Rearming house');
            this.status = 'armed';
        }
    }

    private secConfig : securityLoader.SecuritySettings;
    private status : 'unarmed' | 'armed' | 'breached' | 'high-alert' | 'recovery';

    private server : express.Express;
}