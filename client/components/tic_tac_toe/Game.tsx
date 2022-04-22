import * as React from "react";
import * as board from "./Board";
import * as square from "./Square";
import * as moveHistory from "./MoveHistory";

interface WinningResults {
    winner : square.MarkUnion;
    winningSquares : number[];
}

export interface Position {
    col : number,
    row : number
}

interface State {
    history : moveHistory.History[];
    xIsNext : boolean;
    stepNumber : number;
}

export class Game extends React.Component <{}, State, {}> {
    constructor(props : any)
    {
        super(props)

        let emptyBoard :  square.Mark[] = [];
        for(let i = 0; i < 9; ++i) {
            emptyBoard.push({
                value: null,
                isBold: false
            })
        }

        this.state = {
            history: [{
                squares: emptyBoard,
            }],
            xIsNext: true,
            stepNumber: 0
        }
    }

    private handleClick(i : number) : void {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = JSON.parse(JSON.stringify(current.squares));
        if(squares[i].value || calculateWinner(squares).winner) {
            return;
        }
        squares[i].value = this.state.xIsNext ? 'X' : 'O';
        this.setState({
            history: history.concat([{
                squares:  squares
            }]),
            xIsNext: !this.state.xIsNext,
            stepNumber: history.length
        });
    }

    private jumpTo(move : number) : void {
        this.setState({
            stepNumber: move,
            xIsNext: (move % 2) == 0
        })
    }

    override render() : React.ReactNode {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[this.state.stepNumber];
        const winnerResults = calculateWinner(current.squares);

        let status;
        if(winnerResults.winner) {
            status = 'Winner: ' + winnerResults.winner;
            winnerResults.winningSquares.forEach((i : number)=>{
                current.squares[i].isBold = true;
            });
        } else {
            status = 'Current player: ' + (this.state.xIsNext ? 'X' : 'O');
        }

        return (
            <React.Fragment>
                <div className="header">{status}</div>
                <div className="game">
                    <div className="game-board">
                        <board.Board
                            squares={current.squares}
                            onClick={(i: number) => this.handleClick(i)}
                        />
                    </div>
                    <div className="game-info">
                        <moveHistory.MoveHistory
                            history={history}
                            onClick={(i: number) => this.jumpTo(i)}
                        />
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

function calculateWinner(squares : square.Mark[]) : WinningResults {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a].value && squares[a].value === squares[b].value && squares[a].value === squares[c].value) {
            return {
                winner: squares[a].value,
                winningSquares: [a, b, c]
            };
        }
    }
    return {
        winner: null,
        winningSquares: []
    };
  }