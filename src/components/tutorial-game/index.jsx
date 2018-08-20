import React from 'react';
import styles from './index.css';

const Square = (props) => {
  return (
    <button className={props.isSelected ? [styles.isSelected, styles.square].join(' ') : styles.square} onClick={props.onClick}>
      { props.value }
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square
        key={i.toString()}
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
        isSelected={this.props.isSelected[i]}
      />
    );
  }

  renderRow(i, width, rowKey) {
    var cols = [];
    for (var c = i; c < (i + width); c++) {
      cols.push(this.renderSquare(c))
    }
    return (
      <div key={rowKey.toString()} className={styles['board-row']}>
        {cols}
      </div>
    );
  }

  renderGrid(size) {
    var rows = [];
    for (var r = 0; r < size; r++) {
      rows.push(this.renderRow(r * size, size, r));
    }
    return (
      rows
    );
  }

  render() {
    var gridSize = Math.sqrt(this.props.squares.length);

    return (
      <div>
        <div className={styles.status}>{status}</div>
        {this.renderGrid(gridSize)}
      </div>
    );
  }
}

class SingleInput extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.submitHandler = this.submitHandler.bind(this);
    this.state = {
      inputField: this.props.inputField,
    };
  }

  submitHandler(evt) {
    evt.preventDefault();
    // pass the input field value to the event handler passed
    // as a prop by the parent (App)
    this.props.handlerFromParent(this.state.inputField);

    this.setState({
      inputField: this.state.inputField,
    });
  }

  handleChange(event) {
    this.setState({
      inputField: event.target.value
    });
  }

  render() {
    return (
      <div>
        <form onSubmit={this.submitHandler}>
          <p>Change Grid Size: </p>
          <input type="text"
                className={styles.inputText}
                 id="theInput"
                 value={this.state.inputField}
                 onChange={this.handleChange} />
          <input className={styles.button} type="submit" />
        </form>
      </div>
    );
  }
}


class Game extends React.Component {
  constructor(props) {
    super(props);
    var gameSize = 3;
    this.state = {
      history: [{
        squares: Array(gameSize * gameSize).fill(null),
        isSelected: Array(gameSize * gameSize).fill(false),
        moveSquare: null,
      }],
      stepNumber: 0,
      gameSize: gameSize,
      xIsNext: true,
      fromChild: '',
    };
    this.handleData = this.handleData.bind(this);
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    const isSelected = Array(this.state.gameSize * this.state.gameSize).fill(false);
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    isSelected[i] = true;
    this.setState({
      history: history.concat([{
        squares: squares,
        isSelected: isSelected,
        moveSquare: i,
      }]),
      gameSize: this.state.gameSize,
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }



  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    })
  }

  handleData(data) {
    this.setState({
      history: [{
        squares: Array(data * data).fill(null),
        isSelected: Array(data * data).fill(false),
        moveSquare: null,
      }],
      stepNumber: 0,
      gameSize: data,
      xIsNext: true,
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    const moves = history.map((step, move) => {
      const desc = move ?
        'Go to move #' + move :
        'Go to game start';
      const moveSquare = history[move].moveSquare;
      const moveDesc = move ?
        '(' + Math.floor( moveSquare / this.state.gameSize ) + ',' + moveSquare % this.state.gameSize + ')' :
        '';
      return (
        <li key={move}>
          <button className={move == this.state.stepNumber ? styles.isSelected : ''} onClick={() => this.jumpTo(move)}>{desc}</button>
          <div>{moveDesc}</div>
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
      <div className={styles.outerWrapper}>
        <h1>Not Your Momma's Tic Tac Toe</h1>
        <p>To win, get any entire row, column, or diagonal of length equal to the grid size!</p>
        <div className={styles.game}>
          <div className={styles['game-board']}>
          <Board
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
            isSelected={current.isSelected}
          />

          </div>
          <div className={styles['game-info']}>
            <SingleInput inputField={this.state.gameSize} handlerFromParent={this.handleData} />
            <p></p>
            <div>{status}</div>
            <ol>{moves}</ol>
          </div>
        </div>
      </div>
    );
  }
}

export default Game;


const calculateWinner = (squares) => {
  var gridSize = Math.sqrt(squares.length);

  for (var r = 0; r < gridSize; r++) {
    var canBeWinner = true;
    for (var c = 0; c < gridSize; c++) {
      if (squares[r * gridSize + c] != squares[r * gridSize]) {
        canBeWinner = false;
      }
    }
    if (canBeWinner) {
      return squares[r * gridSize];
    }
  }

  for (var c = 0; c < gridSize; c++) {
    var canBeWinner = true;
    for (var r = 0; r < gridSize; r++) {
      if (squares[r * gridSize + c] != squares[r * gridSize]) {
        canBeWinner = false;
      }
    }
    if (canBeWinner) {
      return squares[c];
    }
  }

  var canBeWinner = true;
  for (var r = 0; r < gridSize; r++) {
    if (squares[r * gridSize + r] != squares[0]) {
      canBeWinner = false;
    }
  }
  if (canBeWinner) {
    return squares[0];
  }

  var canBeWinner = true;
  for (var r = 0; r < gridSize; r++) {
    if (squares[r * gridSize + gridSize - 1 - r] != squares[gridSize - 1]) {
      canBeWinner = false;
    }
  }
  if (canBeWinner) {
    return squares[0];
  }

  return null;
}
