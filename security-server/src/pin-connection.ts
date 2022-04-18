import * as onoff from 'onoff';

import * as iconnection from './iconnection';
import * as isensor from './sensor';

export class PinConnection implements iconnection.IConnection {

    public constructor(pinNum : number, direction : onoff.Direction, stateChange ?: iconnection.CallbackType) {
        this.status = "untriggered";
        this.callback = stateChange;
        this.direction = direction;

        if(direction == 'in') {
            this.pin = new onoff.Gpio(pinNum, 'in', 'both');
            this.pin.watch((err: Error | null | undefined, value: onoff.BinaryValue)=>{
                this.statusHandler(err, value);
            });
        }
        else {
            this.pin = new onoff.Gpio(pinNum, 'out');
        }

        // Unexport the GPIO point on deconstruction.
        const reg = new FinalizationRegistry((pin: onoff.Gpio) => {
            pin.unexport();
        });
        reg.register(this, this.pin);
    }

    public SendStatus(newState : iconnection.Status) : boolean {
        if(this.direction === 'in')
        {
            return false;
        }

        const newValue = newState == 'triggered' ? 1 : 0;
        this.pin.writeSync(newValue);
        return true;
    }

    public getStatus() : iconnection.Status {
        return this.status;
    }

    private statusHandler(err: Error | null | undefined, value: onoff.BinaryValue) : void {
        if(err)
        {
            throw err;
        }

        const newStatus = value == 1 ? 'triggered' : 'untriggered';
        if(this.status !== newStatus) {
            const oldStatus = this.status;
            this.status = newStatus;
            if(this.callback) {
                this.callback(newStatus, oldStatus);
            }
        }
    }

    private status : iconnection.Status; // e.g. disconnected, triggered, untriggered etc

    private pin : onoff.Gpio;
    private direction : onoff.Direction;

    private callback : iconnection.CallbackType | undefined;
}