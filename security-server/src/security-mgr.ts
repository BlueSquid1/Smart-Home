import * as sensor from './sensor';

class SecurityMgr
{
    public constructor() {
        this.sensors = [];
    }

    public loadJson( jsonFile : string ) : boolean {
        return true;
    }

    private triggerAlarm() : boolean;

    private sensors : sensor.Sensor[];
}