import React, {Component} from 'react';
import './App.css';

class Square extends Component {
  render() {
    let bg = '#fff';
    let numArr = this.props.numArr;
    let i = this.props.i;
    if (numArr && numArr.includes(i) ){
      bg = 'red';
    }

    return (
      <button style={{ backgroundColor:bg }} className="square" onClick={ () => this.props.onClick() }>
        {this.props.value}
      </button>
    );
  }
}

class Board extends Component {
  renderSquare(i) {
    return <Square
      key={ i }
      i={ i }
      numArr={ this.props.numArr }
      value={this.props.squares[i]}
      onClick={() => this.props.onClick(i)}
    />;
  }

  render() {
    let rows = [];
    for (let i = 0, len = 3; i < len; i++){
      let g = [];
      for (let j = i*3, len = i*3+3; j < len; j++){
        g.push( this.renderSquare(j) );
      }
      rows.push(<div key={i} className="board-row">{ g }</div>);
    }

    return (
      <div>
        <div className="status">{this.props.status}</div>
        {rows}
      </div>
    );
  }
}

class Game extends React.Component {
  constructor() {
    super();
    this.state = {
      history: [{
        squares: Array(9).fill(null),
        lastStep: 'Game start',
      }],
      stepNumber: 0,
      xIsNext: true,
      historySortOrder: true,
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares).winner || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    let desc = squares[i] + 'move to:' + this.state.stepNumber;
    this.setState({
      history: history.concat([{
        squares: squares,
        lastStep:desc
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) ? false : true,
    });
  }

  render() {
    let history = this.state.history.slice();
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares).winner;
    const numArr = calculateWinner(current.squares).numArr;

    !this.state.historySortOrder ? history.reverse() : '';
    const moves = history.map((step, move) => {
      const desc = step.lastStep;

      let fontWeight = 'normal';
      if (this.state.stepNumber === move){
        fontWeight = 'bold'
      }

      return (
        <li key={ move }>
          <a style={{ fontWeight:fontWeight }}  href="#" onClick={() => this.jumpTo(move)}>{desc}</a>
        </li>
      );
    });

    let status;
    if (winner) {
      status = 'Winner: ' + winner;
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }
    return (
      <div className="game">
        <div className="game-board">
          <Board
            status = { status }
            squares={current.squares}
            numArr={ numArr }
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{/* status */}</div>
          <ol>{moves}</ol>
        </div>
        <div style={{ padding:'10px 0 0 10px' }}>
          <button onClick={ () => { this.setState({ historySortOrder: !this.state.historySortOrder});console.log(this.state.historySortOrder) } }>记录切换排序</button>
        </div>
      </div>
    );
  }
}

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
      return {
        winner:squares[a],
        numArr:[a, b, c],
      };
    }
  }
  return {};
}



export default Game;
