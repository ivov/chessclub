import React, { Component } from "react";
import { Switch, Route } from "react-router-dom";
import jwtDecode from "jwt-decode";
import Header from "./Header";
import Subheader from "./Subheader";
import ClubArea from "./ClubArea";
import ToolArea from "./ToolArea";
import GameWatchArea from "./GameWatchArea";
import Board from "./Board";
import RegisterArea from "./RegisterArea";
import LoginArea from "./LoginArea";
import Logout from "./Logout";
import GameInputArea from "./GameInputArea";
import GameEditArea from "./GameEditArea";
import NewsWatchArea from "./NewsWatchArea";
import UsersWatchArea from "./UsersWatchArea";
import NewsInputArea from "./NewsInputArea";
import LogArea from "./LogArea";
import PlayerProfile from "./PlayerProfile";
import "../css/app.css";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { username: "", isAdmin: false };
  }

  componentDidMount() {
    try {
      const token = localStorage.getItem("jwt");
      const user = jwtDecode(token);
      this.setState({ username: user.username, isAdmin: user.is_admin });
    } catch (error) {} // anonymous user
  }

  render() {
    const { username, isAdmin } = this.state;
    const isLoggedIn = username !== "";

    return (
      <div id="all-content">
        <Route
          render={routerProps => (
            <Header {...routerProps} username={username} isAdmin={isAdmin} />
          )}
        />
        <Route
          render={routerProps => (
            <Subheader
              {...routerProps}
              isAdmin={isAdmin}
              isLoggedIn={isLoggedIn}
            />
          )}
        />
        <Switch>
          <Route exact path="/" component={ClubArea} />
          <Route path="/acerca-del-club" component={ClubArea} />
          <Route path="/acerca-de-esta-herramienta" component={ToolArea} />
          <Route path="/registrarse" component={RegisterArea} />
          <Route path="/ingresar" component={LoginArea} />
          <Route
            path="/salir"
            render={routerProps => (
              <Logout {...routerProps} username={username} />
            )}
          />
          <Route
            path="/ver-partida"
            render={routerProps => (
              <GameWatchArea {...routerProps} username={this.state.username} />
            )}
          />
          <Route path="/partida/:id" component={Board} />
          <Route path="/ingresar-partida" component={GameInputArea} />
          <Route path="/editar-partida/:id" component={GameEditArea} />
          <Route path="/anuncios-del-club" component={NewsWatchArea} />
          <Route path="/ver-registros" component={LogArea} />
          <Route path="/ver-usuarios" component={UsersWatchArea} />
          <Route path="/publicar-anuncio" component={NewsInputArea} />
          <Route
            path="/perfil-del-jugador"
            render={routerProps => (
              <PlayerProfile {...routerProps} username={this.state.username} />
            )}
          />
        </Switch>
      </div>
    );
  }
}

export default App;
