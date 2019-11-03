import React, { Component } from "react";
import DatePicker from "react-datepicker";
import { registerLocale } from "react-datepicker";
import es from "date-fns/locale/es";
import apiCaller from "../utils/apiCaller";
import GameInputTable from "./GameInputTable";
import emptyMovesArray from "../utils/emptyMovesArray";
import "react-datepicker/dist/react-datepicker.css";

registerLocale("es", es);

class GameEditArea extends Component {
  constructor(props) {
    super(props);
    this.state = {
      game: {
        id: "",
        date: new Date(),
        white: "",
        black: "",
        winner: "",
        event: "",
        moves: emptyMovesArray
      },
      error: "",
      infoForForm: {
        allUsers: [],
        selectedWhite: "",
        selectedBlack: ""
      }
    };
    this.handleTextboxChange = this.handleTextboxChange.bind(this);
    this.handleDropdownChangeForPlayer = this.handleDropdownChangeForPlayer.bind(
      this
    );
    this.handleDropdownChangeForWinner = this.handleDropdownChangeForWinner.bind(
      this
    );
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleDatePickerChange = this.handleDatePickerChange.bind(this);
  }

  handleDatePickerChange(date) {
    this.setState({
      game: { ...this.state.game, date }
    });
  }

  handleTextboxChange(submitEvent) {
    this.setState({
      game: { ...this.state.game, event: submitEvent.target.value }
    });
  }

  handleDropdownChangeForPlayer(event) {
    if (event.target.id === "white") {
      this.setState({
        infoForForm: {
          ...this.state.infoForForm,
          selectedWhite: event.target.value
        }
      });
      this.setState({
        game: { ...this.state.game, white: event.target.value }
      });
    }

    if (event.target.id === "black") {
      this.setState({
        infoForForm: {
          ...this.state.infoForForm,
          selectedBlack: event.target.value
        }
      });
      this.setState({
        game: { ...this.state.game, black: event.target.value }
      });
    }
  }

  handleDropdownChangeForWinner(event) {
    this.setState({
      game: { ...this.state.game, winner: event.target.value }
    });
  }

  async getIdForWhiteAndBlack(white, black) {
    const apiEndpoint = `/api/users/idByUsernameForBoth/?white=${white}&black=${black}`;
    const { data } = await apiCaller.get(apiEndpoint);
    return data;
  }

  createPGN() {
    const { date, event, white, black, winner, moves } = this.state.game;

    let pgnResultCode;
    if (winner === white) pgnResultCode = "1-0";
    if (winner === black) pgnResultCode = "0-1";
    if (winner === "Tablas") pgnResultCode = "1/2-1/2";

    const pgnEvent = `[Event "${event}"]#`;
    const pgnSite = `[Site "Buenos Aires ARG"]#`;
    const pgnDate = `[Date "${date.getFullYear()}.${date.getMonth()}.${date.getDate()}"]#`;
    const pgnWhite = `[White "${white}"]#`;
    const pgnBlack = `[Black "${black}"]#`;
    const pgnResult = `[Result "${pgnResultCode}"]##`;

    let pgnMoves = "";
    for (let object of moves) {
      if (object.white !== "" || object.black !== "") {
        const turn = `${object.number}. ${object.white} ${object.black}#`;
        pgnMoves += turn;
      }
    }
    pgnMoves += pgnResultCode;

    const PGN =
      pgnEvent + pgnSite + pgnDate + pgnWhite + pgnBlack + pgnResult + pgnMoves;

    return PGN;
  }

  checkForErrorsOnSubmit() {
    const { white, black, winner } = this.state.game;

    if (white === "") {
      this.setState({ error: "Elegir jugador de blancas." });
      return true;
    }
    if (black === "") {
      this.setState({ error: "Elegir jugador de negras." });
      return true;
    }
    if (winner === "") {
      this.setState({ error: "Elegir resultado." });
      return true;
    }
    if (white === black) {
      this.setState({ error: "Elegir jugadores distintos." });
      return true;
    }

    return false;
  }

  async handleSubmit(submitEvent) {
    submitEvent.preventDefault();

    const { id: gameId, date, event, white, black, winner } = this.state.game;

    const anyErrors = this.checkForErrorsOnSubmit();
    if (anyErrors) return;

    const [whiteId, blackId] = await this.getIdForWhiteAndBlack(white, black);

    let winnerId;
    if (winner === "Tablas") winnerId = 0;
    if (winner === white) winnerId = whiteId;
    if (winner === black) winnerId = blackId;

    const PGN = await this.createPGN();

    const apiEndpoint = "/api/games/" + gameId;
    const editedGame = {
      date,
      event,
      white: whiteId,
      black: blackId,
      winner: winnerId,
      moves: PGN
    };

    const token = localStorage.getItem("jwt");
    const config = {
      headers: {
        "x-auth-token": token
      }
    };
    const response = await apiCaller.put(apiEndpoint, editedGame, config);
    if (response) window.location = "/ver-partida";
  }

  formatPGNforGameInputTable(pgn) {
    const moveArray = pgn
      .replace(/.*##/, "")
      .replace(/ {2}.*/, "")
      .replace(/#1\/2-1\/2/, "")
      .split("#");

    const regex = /(\d+\.\s)(\S*)(.*)?/;
    let formattedPGN = [];

    for (let move of moveArray) {
      const match = move.match(regex);
      let moveObject = {};
      moveObject.number = Number(match[1].replace(".", ""));
      moveObject.white = match[2];
      if (match[3]) moveObject.black = match[3].replace(" ", "");
      formattedPGN.push(moveObject);
    }

    return formattedPGN;
  }

  async componentDidMount() {
    const path = window.location.pathname;
    const match = path.match(/(editar-partida\/)(\d+)/);
    const gameId = Number(match[2]);

    const apiEndpointForAllUsers = "/api/users/";
    const { data: allUsers } = await apiCaller.get(apiEndpointForAllUsers);
    this.setState({ infoForForm: { allUsers } });

    const apiEndpointForEditing = "/api/games/gameForDisplay/" + gameId;
    const { data: gameForEditing } = await apiCaller.get(apiEndpointForEditing);
    const formattedPGN = this.formatPGNforGameInputTable(gameForEditing.pgn);

    this.setState({
      game: {
        id: gameId,
        date: new Date(gameForEditing.date),
        event: gameForEditing.event,
        white: gameForEditing.white,
        black: gameForEditing.black,
        winner: gameForEditing.winner,
        moves: formattedPGN
      },
      infoForForm: {
        ...this.state.infoForForm,
        selectedWhite: gameForEditing.white,
        selectedBlack: gameForEditing.black
      }
    });
  }

  render() {
    const { game, error, infoForForm } = this.state;
    const movesLoaded = game.moves !== emptyMovesArray;

    return (
      <div className="area-container">
        <form onSubmit={this.handleSubmit}>
          <fieldset id="game-input-geninfo-container">
            <div id="game-input-title">Editar partida</div>

            <div className="label-and-field">
              <label htmlFor="datepicker">Fecha</label>
              <DatePicker
                selected={game.date}
                onChange={this.handleDatePickerChange}
                value={game.date}
                locale="es"
                dateFormat="dd/MM/yyyy"
              />
            </div>

            <div className="label-and-field">
              <label htmlFor="event">Evento</label>
              <input
                type="text"
                name="event"
                value={game.event}
                onChange={this.handleTextboxChange}
                placeholder="..."
              />
            </div>

            <div className="label-and-field">
              <label htmlFor="white">Blancas</label>
              <select
                onChange={this.handleDropdownChangeForPlayer}
                id="white"
                value={infoForForm.selectedWhite}
              >
                <option>Jugador</option>
                {infoForForm.allUsers &&
                  infoForForm.allUsers.map((user, index) => {
                    return (
                      <option value={user} key={index}>
                        {user}
                      </option>
                    );
                  })}
              </select>
            </div>

            <div className="label-and-field">
              <label htmlFor="black">Negras</label>
              <select
                onChange={this.handleDropdownChangeForPlayer}
                id="black"
                value={infoForForm.selectedBlack}
              >
                <option>Jugador</option>
                {infoForForm.allUsers &&
                  infoForForm.allUsers.map((user, index) => {
                    return (
                      <option value={user} key={index}>
                        {user}
                      </option>
                    );
                  })}
              </select>
            </div>

            <div className="label-and-field">
              <label htmlFor="winner">Ganador</label>
              <select
                onChange={this.handleDropdownChangeForWinner}
                id="winner"
                value={game.winner}
              >
                <option>Resultado</option>
                <option value={infoForForm.selectedWhite}>
                  {infoForForm.selectedWhite || "Jugador"}
                </option>
                <option value={infoForForm.selectedBlack}>
                  {infoForForm.selectedBlack || "Jugador"}
                </option>
                <option value="Tablas">Tablas</option>
              </select>
            </div>

            {error && <div className="input-error">{error}</div>}

            <div id="game-input-submit">
              <input type="submit" value="Confirmar" method="post" />
            </div>
          </fieldset>
          {movesLoaded && <GameInputTable moves={game.moves} />}
        </form>
      </div>
    );
  }
}

export default GameEditArea;
