import React, { Component } from "react";
import apiCaller from "../utils/apiCaller";
import { formatTimestamp } from "../utils/formatTimestamp";

class LogArea extends Component {
  constructor(props) {
    super(props);
    this.state = {
      log: []
    };
  }

  async getLog() {
    const apiEndpoint = "/api/log";
    const token = localStorage.getItem("jwt");
    const config = {
      headers: {
        "x-auth-token": token
      }
    };
    const { data: jsonArray } = await apiCaller.get(apiEndpoint, config);
    const reversedJsonArray = jsonArray.reverse();
    return reversedJsonArray;
  }

  translateLabel(label) {
    if (label === "user-created") return "Registro de usuario";
    if (label === "game-created") return "Registro de partida";
    if (label === "login") return "Ingreso de usuario";
    if (label === "logout") return "Egreso de usuario";
    if (label === "news-created") return "Publicación de anuncio";
  }

  async formatMessage(message) {
    const regex = new RegExp(/players: (\d+) vs. (\d+) - author: (.*)/);
    const whiteId = message.match(regex)[1];
    const blackId = message.match(regex)[2];
    const apiEndpoint = `/api/users/usernameByIdForBoth/?white=${whiteId}&black=${blackId}`;
    const { data } = await apiCaller.get(apiEndpoint);
    const whiteUsername = data[0];
    const blackUsername = data[1];
    const vsString = `${whiteUsername} vs. ${blackUsername}\n`;
    return vsString;
  }

  async componentDidMount() {
    const jsonArray = await this.getLog();
    for (let object of jsonArray) {
      object.timestamp = formatTimestamp(object.timestamp);
      object.label = this.translateLabel(object.label);
      if (object.label === "Registro de partida")
        object.message = await this.formatMessage(object.message);
    }
    this.setState({ log: jsonArray });
  }

  render() {
    const { log } = this.state;

    return (
      <div className="area-container">
        <div className="log-container">
          {log &&
            log.map((item, index) => {
              const relevantClass = {
                "Registro de partida": "registro-de-partida",
                "Registro de usuario": "registro-de-usuario",
                "Ingreso de usuario": "ingreso-de-usuario",
                "Egreso de usuario": "egreso-de-usuario",
                "Publicación de anuncio": "publicacion-de-anuncio"
              };
              return (
                <div
                  className={"log-line " + relevantClass[item.label]}
                  key={index}
                >
                  <div>{item.label}</div>
                  <div>{item.message}</div>
                  <div>{item.timestamp}</div>
                </div>
              );
            })}
        </div>
      </div>
    );
  }
}

export default LogArea;
