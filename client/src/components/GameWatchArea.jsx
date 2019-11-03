import React, { Component } from "react";
import GamesList from "./GamesList";
import apiCaller from "../utils/apiCaller";

class GameWatchArea extends Component {
  constructor(props) {
    super(props);
    this.state = {
      gamesList: null
    };
  }

  async componentDidMount() {
    const apiEndpoint = "/api/games";
    const { data: retrievedGames } = await apiCaller.get(apiEndpoint);
    this.setState({ gamesList: retrievedGames });
  }

  render() {
    const { gamesList } = this.state;

    return (
      <div className="area-container">
        <GamesList
          gamesList={gamesList}
          title={true}
          username={this.props.username}
          withEdit={true}
        />
      </div>
    );
  }
}

export default GameWatchArea;
