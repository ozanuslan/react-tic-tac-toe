/* eslint-disable react/button-has-type */
/* eslint-disable react/no-access-state-in-setstate */
/* eslint-disable no-use-before-define */
/* eslint-disable no-plusplus */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/prefer-stateless-function */
/* eslint-disable class-methods-use-this */
/* eslint-disable max-classes-per-file */
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
  return (
    <button
      className="square"
      style={props.isWinning ? { backgroundColor: 'yellowgreen' } : {}}
      onClick={props.onClick}
    >
      {props.value}
    </button>
  );
}

class Board extends Component {
  renderSquare(i) {
    return (
      <Square
        key={`Square ${i}`}
        isWinning={this.props.winningSquares.includes(i)}
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  renderGrid() {
    let rows = [];
    for (var i = 0; i < 3; i++) {
      let squares = [];
      for (var j = 0; j < 3; j++) {
        squares.push(this.renderSquare(3 * i + j));
      }
      rows.push(
        <div key={`Board-Row ${i}`} className="board-row">
          {squares}
        </div>,
      );
    }
    return rows;
  }

  render() {
    return <div>{this.renderGrid()}</div>;
  }
}

class Game extends Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [
        {
          squares: Array(9).fill(null),
          move: {
            x: null,
            y: null,
          },
        },
      ],
      winningSquares: [0, 1, 2],
      stepNumber: 0,
      selectedMove: 0,
      xIsNext: true,
      isDescending: true,
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([
        {
          squares,
          move: {
            x: i % 3,
            y: Math.floor(i / 3),
          },
        },
      ]),
      stepNumber: history.length,
      selectedMove: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: step % 2 === 0,
    });
    this.setSelectedMove(step);
  }

  setSelectedMove(step) {
    this.setState({
      selectedMove: step,
    });
  }

  toggleDescending() {
    this.setState({
      isDescending: !this.state.isDescending,
    });
  }

  setWinningSquares(squares) {
    this.setState({
      winningSquares: squares,
    });
  }

  render() {
    const { history } = this.state;
    const current = history[this.state.stepNumber];
    const result = calculateWinner(current.squares);

    let moves = history.map((step, move) => {
      const desc = move ? 'Go to move #' + move : 'Go to game start';
      const moveCoords = move === 0 ? '' : `(${history[move].move.x},${history[move].move.y})`;
      const symbol = move % 2 === 0 ? 'O' : 'X';
      return (
        <li key={move}>
          <button
            onClick={() => {
              this.jumpTo(move);
            }}
            style={move === this.state.selectedMove ? { fontWeight: 'bold' } : {}}
          >
            {desc} {moveCoords} {move === 0 ? '' : symbol}
          </button>
        </li>
      );
    });

    let status;
    if (result) {
      status = result.winner === 'Draw' ? 'Draw!' : `Winner: ${result.winner}`;
    } else {
      status = `Next player: ${this.state.xIsNext ? 'X' : 'O'}`;
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            key="Board"
            squares={current.squares}
            winningSquares={result ? result.winningSquares : []}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <button className="button" onClick={() => this.toggleDescending()}>
            Sort by: {this.state.isDescending ? 'Descending' : 'Ascending'}
          </button>
          {this.state.isDescending ? (
            <ol start={0}>{moves}</ol>
          ) : (
            <ol start={moves.length - 1} reversed>
              {moves.reverse()}
            </ol>
          )}
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(<Game />, document.getElementById('root'));

function calculateWinner(squares) {
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
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { winner: squares[a], winningSquares: lines[i] };
    }
  }
  if (!squares.includes(null)) return { winner: 'Draw', winningSquares: [] };
  return null;
}
