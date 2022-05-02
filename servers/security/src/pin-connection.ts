import * as onoff from 'onoff';

import * as iconnection from './iconnection';

export class PinConnection extends iconnection.IConnection {

    public constructor(pinNum : number, direction : onoff.Direction) {
        super();
        this.status = "untriggered";
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

    public sendStatus(newState : iconnection.Status) : boolean {
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
            this.callback.trigger({curState: newStatus, oldState: oldStatus});
        }
    }

    private status : iconnection.Status; // e.g. disconnected, triggered, untriggered etc

    private pin : onoff.Gpio;
    private direction : onoff.Direction;
}