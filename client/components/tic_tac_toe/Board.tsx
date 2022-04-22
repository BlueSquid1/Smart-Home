
import * as React from 'react';
import * as square from "./Square";

interface Props {
    squares : square.Mark[];
    onClick: (i : number) => void;
}

export class Board extends React.Component <Props> {
    private renderSquare(i : number) : React.ReactNode {
        return (
            <square.Square
                key={i}
                mark={this.props.squares[i]}
                onClick={() => this.props.onClick(i)} 
            />
        );
    }

    override render() : React.ReactNode {
        let rows = [];
        for(let rowNum = 0; rowNum < 3; ++rowNum) {
            let columns = [];
            for(let colNum = 0; colNum < 3; ++colNum) {
                columns.push(this.renderSquare(rowNum * 3 + colNum));
            }
            rows.push(
            <div className="board-row" key={rowNum}>
                {columns}
            </div>
            )
        }
        return (
        <div>
            {rows}
        </div>
        );
    }
}