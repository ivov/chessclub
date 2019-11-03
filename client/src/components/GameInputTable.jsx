import React, { Component } from "react";
import GameInputMove from "./GameInputMove";

const makeNumberRange = (start, end) => {
  return Array(end - start + 1)
    .fill()
    .map((_, index) => start + index);
};

class GameInputTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      numberOfMoves: makeNumberRange(1, 50),
      currentPage: 1,
      movesPerPage: 10,
      moves: props.moves,
      emptyCell: ""
    };
    this.handleFwd = this.handleFwd.bind(this);
    this.handleBack = this.handleBack.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
  }

  handleFwd(submitEvent) {
    submitEvent.preventDefault();
    if (this.state.currentPage !== 5) {
      const newPage = this.state.currentPage + 1;
      this.setState({
        currentPage: newPage
      });
    }
  }

  handleBack(submitEvent) {
    submitEvent.preventDefault();
    if (this.state.currentPage !== 1) {
      const newPage = this.state.currentPage - 1;
      this.setState({
        currentPage: newPage
      });
    }
  }

  handleInputChange(event) {
    const { moves } = this.state;
    const moveIndex = event.target.parentElement.id - 1;
    const relevantMove = this.state.moves[moveIndex];

    if (event.target.className === "white-input") {
      relevantMove.white = event.target.value;
      relevantMove.black = event.target.nextSibling.value;
    } else if (event.target.className === "black-input") {
      relevantMove.white = event.target.previousSibling.value;
      relevantMove.black = event.target.value;
    }

    this.setState({ moves });
  }

  render() {
    const { numberOfMoves, currentPage, movesPerPage } = this.state;
    const lastMoveIndex = currentPage * movesPerPage;
    const firstMoveIndex = lastMoveIndex - movesPerPage;
    const currentMoves = numberOfMoves.slice(firstMoveIndex, lastMoveIndex);
    const indexCorrection = currentPage * 10 - 10;

    const renderedMoves = currentMoves.map((moveNumber, index) => {
      const moveExists =
        this.state.moves[index + indexCorrection] !== undefined;
      let blackExists;
      if (moveExists)
        blackExists =
          this.state.moves[index + indexCorrection].black !== undefined;

      return (
        <GameInputMove
          key={index}
          number={moveNumber}
          onChange={this.handleInputChange}
          whiteInput={
            moveExists ? this.state.moves[index + indexCorrection].white : ""
          }
          blackInput={
            moveExists && blackExists
              ? this.state.moves[index + indexCorrection].black
              : ""
          }
        />
      );
    });

    const atStart = this.state.currentPage === 1;
    const atEnd = this.state.currentPage === 5;

    return (
      <div id="input-movements-container">
        <fieldset>
          <legend>Movimientos</legend>
          {renderedMoves}
        </fieldset>
        <div id="game-input-move-controls">
          {!atStart && <button onClick={this.handleBack}>← Atrás</button>}
          {!atEnd && <button onClick={this.handleFwd}>Adelante →</button>}
        </div>
      </div>
    );
  }
}

export default GameInputTable;
