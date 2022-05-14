import * as liteEvent from './LiteEvent';

export type Status = "disconnected" | "triggered" | "untriggered" | "connected";

export type StatusArgs = { curState : Status, oldState : Status };

export type CallbackType = (states : StatusArgs) => void;

export abstract class IConnection
{
    constructor() {
        this.callback = new liteEvent.LiteEvent<StatusArgs>();
    }

    public listenToStatusChange(stateChange : CallbackType) : void {
        this.callback.add(stateChange);
    }

    public abstract sendStatus(newState : Status) : boolean;

    public abstract getStatus() : Status;


    protected callback : liteEvent.LiteEvent<StatusArgs>;
}