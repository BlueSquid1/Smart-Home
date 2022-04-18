import * as isensor from './sensor'

export type Status = "disconnected" | "triggered" | "untriggered";

export type CallbackType = (curState : Status, oldState : Status) => void;

export interface IConnection
{
    statusChangeEvent(stateChange : CallbackType) : void;

    sendStatus(newState : Status) : boolean;

    getStatus() : Status;
}