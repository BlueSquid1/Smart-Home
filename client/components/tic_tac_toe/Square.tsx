import * as React from 'react';

export type MarkUnion = 'X' | 'O' | null;

export interface Mark {
    value : MarkUnion;
    isBold : boolean;
}

export interface Props {
    mark: Mark;
    onClick: () => void;
}

export function Square(props : Props) : React.ReactElement | null {
    let markText;
    if(props.mark.isBold) {
        markText = <b>{props.mark.value}</b>
    } else {
        markText = props.mark.value
    }
    return(
      <button 
            className="square" 
            onClick={props.onClick}
        >
            {markText}
        </button>
    );
}