import * as React from "react";
import * as square from "./Square";
import * as game from "./Game";

export interface History {
    squares : square.Mark[];
}

interface MoveHistoryProperty {
    history : History[];
    onClick : any;
}

interface MoveHistoryState {
    sortAscending : boolean;
}

export class MoveHistory extends React.Component <MoveHistoryProperty, MoveHistoryState, {}> {
    constructor(props : any) {
        super(props);
        this.state = {
            sortAscending: true
        }
    }

    calculateMove(prevSquares : square.Mark[], curSquares : square.Mark[]) : game.Position | null {
        for(let i = 0; i < curSquares.length; ++i) {
            if(prevSquares[i].value != curSquares[i].value) {
                return { 
                    col: (i % 3),
                    row: (Math.floor(i / 3))
                 };
            }
        }
        return null;
    }

    flipSortDir() {
        this.setState({
            sortAscending: !this.state.sortAscending
        })
    }
    
    override render() {
        const moves = this.props.history.map((curStep, index) => {
            let desc = 'Go to game start';
            if(index > 0)
            {
                const prevStep = this.props.history[index - 1];
                const position = this.calculateMove(prevStep.squares, curStep.squares);
                
                desc = 'Go to move #' + index + " (" + position?.col + ", " + position?.row + ")";
            }

            return(
                <li key={index}>
                    <button onClick={() => this.props.onClick(index)}>{desc}</button>
                </li>
            );
        });

        let sortText = 'ascending';
        if(!this.state.sortAscending) {
            sortText = 'descending';
            moves.reverse();
        }
        return(
            <div>
                <button onClick={() => this.flipSortDir()}>sort {sortText}</button>
                <ol reversed={!this.state.sortAscending}>
                    {moves}
                </ol>
            </div>
        );
    }
}