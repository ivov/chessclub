/* eslint no-undef: "off"*/

import React, { Component } from "react";
import FileSaver from "file-saver";
import BoardTitle from "./BoardTitle";
import BoardControls from "./BoardControls";
import BoardTable from "./BoardTable";
import apiCaller from "../utils/apiCaller";
import { makeDisplayDate } from "../utils/makeDisplayDate";
import "../css/chessboard.css";
import Chess from "../utils/chess";

class Board extends Component {
  constructor(props) {
    super(props);
    this.state = {
      board: null,
      game: new Chess(), // from Chess.js
      moveHistory: null, // array of moves
      placeInHistory: null, // index of moveHistory
      currentTurn: null, // number for move pair
      date: "",
      event: "",
      white: "",
      black: "",
      winner: "",
      pgn: "",
      gameId: this.props.match.params.id, // url parameter
      autoState: false, // for auto button
      timeouts: [] // for auto button
    };
    this.onClickedPosition = this.onClickedPosition.bind(this);
    this.handleFlip = this.handleFlip.bind(this);
    this.handleBeginning = this.handleBeginning.bind(this);
    this.handleBack = this.handleBack.bind(this);
    this.handleForward = this.handleForward.bind(this);
    this.handleEnd = this.handleEnd.bind(this);
    this.handleAuto = this.handleAuto.bind(this);
    this.handleDownload = this.handleDownload.bind(this);
  }

  initializeBoard() {
    const boardConfig = {
      showNotation: false,
      position: "start"
    };
    const newBoard = ChessBoard("myBoard", boardConfig);
    this.setState({ board: newBoard });
  }

  initializeMoveHistory(pgn) {
    // const loadOptions = {
    //   // sloppy: true,
    //   // newline_char: "$"
    //   newline_char: "#"
    // };
    this.state.game.load_pgn(pgn);
    this.setState({ moveHistory: this.state.game.history() });
    this.state.game.reset();
  }

  handleBack() {
    const moveToTakeBackExists = this.state.placeInHistory !== null;
    if (moveToTakeBackExists) {
      const atFirstMove = this.state.placeInHistory === 0;
      if (atFirstMove) {
        this.setState({ placeInHistory: null });
        this.setState({ currentTurn: null });
      } else {
        let newPlace = this.state.placeInHistory - 1;
        this.setState({ placeInHistory: newPlace });
        this.updateTurn(newPlace);
      }
      this.state.game.undo();
      this.displayPosition();
    }
  }

  handleForward() {
    const { moveHistory, placeInHistory, timeouts } = this.state;
    const atLastMove =
      moveHistory[placeInHistory - 1] === moveHistory.slice(-1)[0];

    if (!atLastMove) {
      const noMovesYet = this.state.placeInHistory === null;
      let newPlace;
      noMovesYet ? (newPlace = 0) : (newPlace = this.state.placeInHistory + 1);
      const move = this.state.moveHistory[newPlace];
      this.state.game.move(move);
      this.setState({ placeInHistory: newPlace });
      this.updateTurn(newPlace);
      this.displayPosition();
    } else if (atLastMove) {
      this.setState({ autoState: false });
      for (let timeout of timeouts) {
        clearTimeout(timeout);
      }
    }
  }

  handleEnd() {
    const { moveHistory } = this.state;
    const newPlace = moveHistory.length;

    for (let move of moveHistory) {
      this.state.game.move(move);
    }

    this.setState({ placeInHistory: newPlace });
    this.updateTurn(newPlace);
    this.displayPosition();
  }

  handleAuto() {
    const { autoState, moveHistory, placeInHistory, timeouts } = this.state;
    const autoEnabled = autoState === true;
    const atLastMove =
      moveHistory[placeInHistory - 1] === moveHistory.slice(-1)[0];

    if (!autoEnabled && !atLastMove) {
      this.setState({ autoState: true });
      let duration = 0;
      // eslint-disable-next-line
      for (let _ of moveHistory) {
        let timeout = setTimeout(this.handleForward, duration);
        duration += 2000;
        timeouts.push(timeout);
      }
    } else if (autoEnabled) {
      this.setState({ autoState: false });
      for (let timeout of timeouts) {
        clearTimeout(timeout);
      }
    }
  }

  displayPosition() {
    const fenPosition = this.state.game.fen();
    this.state.board.position(fenPosition);
  }

  updateTurn(newPlace) {
    const newPlaceisEven = newPlace % 2 === 0;
    const newPlaceisOdd = newPlace % 2 !== 0;
    if (newPlaceisEven) {
      const newTurn = newPlace / 2 + 1;
      this.setState({ currentTurn: newTurn });
    } else if (newPlaceisOdd) {
      const newTurn = Math.ceil(newPlace / 2);
      this.setState({ currentTurn: newTurn });
    }
  }

  onClickedPosition(event) {
    const divContents = event.target.innerHTML;
    const regex = new RegExp("(\\d+)(.</b>)(.*) ");
    const selectedTurn = Number(divContents.match(regex)[1]);
    this.setState({ currentTurn: selectedTurn });
    this.displaySpecificPosition(selectedTurn);
  }

  displaySpecificPosition(selectedTurn) {
    this.state.game.reset();
    const selectedPlace = Number(selectedTurn) * 2 - 1;
    const moves = this.state.moveHistory.slice(0, selectedPlace + 1);
    for (let i = 0; i < moves.length; i++) {
      this.state.game.move(moves[i]);
    }
    const fenPosition = this.state.game.fen();
    this.state.board.position(fenPosition);
    this.setState({ placeInHistory: selectedPlace });
  }

  handleFlip() {
    this.state.board.flip();
  }

  handleBeginning() {
    this.state.game.reset();
    this.setState({ currentTurn: null });
    this.setState({ placeInHistory: null });
    this.displayPosition();
  }

  handleDownload() {
    const { pgn, white, black, date } = this.state;
    const cleanPgn = pgn.replace(" undefined", "");
    const pgnFileTitle = `${white} vs. ${black} - ${date}`;

    var file = new File([cleanPgn], pgnFileTitle, {
      type: "text/plain; charset=utf-8"
    });
    FileSaver.saveAs(file);
  }

  async getCleanPgn(gameId) {
    const apiEndpoint = "/api/games/gameForDisplay/" + gameId;
    const { data: game } = await apiCaller.get(apiEndpoint);
    const { date, event, white, black, winner, pgn } = game;
    const displayDate = makeDisplayDate(date);

    this.setState({
      date: displayDate,
      event,
      white,
      black,
      winner
    });
    return pgn.replace(/#/g, "\r\n");
  }

  async componentDidMount() {
    await this.initializeBoard();
    const cleanPgn = await this.getCleanPgn(this.state.gameId);
    this.setState({ pgn: cleanPgn });
    this.initializeMoveHistory(cleanPgn);
  }

  render() {
    const {
      date,
      event,
      white,
      black,
      winner,
      currentTurn,
      moveHistory,
      placeInHistory
    } = this.state;

    const noMovesYet = placeInHistory === null;

    const placeInHistoryLoaded = placeInHistory !== null;
    let atLastMove;
    if (placeInHistoryLoaded) {
      atLastMove = moveHistory[placeInHistory - 1] === moveHistory.slice(-1)[0];
    }
    // console.log(moveHistory.slice(-1)[0]);

    return (
      <div className="area-container">
        <div className="watch-area-container">
          <div id="title-and-board-and-table">
            <div id="title-and-board">
              <BoardTitle
                date={date}
                white={white}
                black={black}
                winner={winner}
                event={event}
              />
              <div id="myBoard" />
            </div>
            {moveHistory !== null ? (
              <BoardTable
                moveHistory={moveHistory}
                currentTurn={currentTurn}
                onClick={this.onClickedPosition}
              />
            ) : null}
          </div>
          <BoardControls
            flipAction={this.handleFlip}
            beginningAction={this.handleBeginning}
            backAction={this.handleBack}
            forwardAction={this.handleForward}
            endAction={this.handleEnd}
            autoAction={this.handleAuto}
            autoState={this.state.autoState}
            atLastMove={atLastMove}
            noMovesYet={noMovesYet}
            downloadAction={this.handleDownload}
          />
        </div>
      </div>
    );
  }
}

export default Board;
