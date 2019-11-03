import React, { Component } from "react";
import { registerLocale } from "react-datepicker";
import GamesList from "./GamesList";
import es from "date-fns/locale/es";
import apiCaller from "../utils/apiCaller";

registerLocale("es", es);

class PlayerProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userId: null,
      userInfo: {
        username: "",
        email: "",
        gamesTotal: "",
        gamesWon: "",
        gamesTied: "",
        gamesLost: ""
      },
      userGames: []
    };
  }

  cleanPropertiesOf(object) {
    object.gamesTotal = object.games_total;
    delete object.games_total;
    object.gamesWon = object.games_won;
    delete object.games_won;
    object.gamesTied = object.games_tied;
    delete object.games_tied;
    object.gamesLost = (
      object.gamesTotal -
      object.gamesWon -
      object.gamesTied
    ).toString();
    return object;
  }

  async getAndSetUserId() {
    const apiEndpointForId = "/api/users/idByUsername/" + this.props.username;
    const { data: userId } = await apiCaller.get(apiEndpointForId);
    this.setState({ userId });
  }

  async getAndSetUserInfo() {
    const apiEndpointForUser = "/api/users/userForProfile/" + this.state.userId;
    const { data: dirtyUserInfo } = await apiCaller.get(apiEndpointForUser);
    const userInfo = this.cleanPropertiesOf(dirtyUserInfo);
    this.setState({ userInfo });
  }

  async getAndSetUserGames() {
    const apiEndpointForGames = "/api/games/userGames/" + this.state.userId;
    const { data: userGames } = await apiCaller.get(apiEndpointForGames);
    this.setState({ userGames });
  }

  async fetchAllData() {
    await this.getAndSetUserId();
    await this.getAndSetUserInfo();
    await this.getAndSetUserGames();
  }

  async componentDidMount() {
    if (this.props.username !== "") {
      await this.fetchAllData();
    } else {
      this.forceUpdate();
    }
  }

  async componentDidUpdate(prevProps) {
    const newProps = this.props;
    if (prevProps.username !== newProps.username) {
      await this.fetchAllData();
    }
  }

  render() {
    const {
      username,
      email,
      gamesTotal,
      gamesWon,
      gamesTied,
      gamesLost
    } = this.state.userInfo;

    return (
      <div className="column-container">
        <div className="player-profile">
          <div className="player-profile-title">Perfil del jugador</div>
          <div className="player-profile-info">
            <div className="player-profile-name">
              <div>
                <b>{username}</b>
              </div>
              <div>{email}</div>
            </div>
            <div className="player-profile-games">
              <div>
                <div>Partidas</div>
                <div>{gamesTotal}</div>
              </div>
              <div>
                <div>Victorias</div>
                <div>{gamesWon}</div>
              </div>
              <div>
                <div>Derrotas</div>
                <div>{gamesLost}</div>
              </div>
              <div>
                <div>Tablas</div>
                <div>{gamesTied}</div>
              </div>
            </div>
          </div>
          <GamesList
            gamesList={this.state.userGames}
            title={false}
            withEdit={false}
          />
        </div>
      </div>
    );
  }
}

export default PlayerProfile;
