import React from "react";
import { makeDisplayDate } from "../utils/makeDisplayDate";
import { Link } from "react-router-dom";

const GamesList = props => {
  const { title, gamesList, username, withEdit } = props;
  return (
    <div className="game-list-container">
      {title && <b>Listado de partidas</b>}
      {gamesList &&
        gamesList.map((game, index) => {
          const isOwnedByUser =
            game.white === username || game.black === username;
          return (
            <div className="game-list-item-and-edit-button" key={index}>
              <Link to={"/partida/" + game.id} className="game-list-item">
                <div id="game-list-item-players-cell">
                  {game.white} vs. {game.black}
                </div>
                <div id="game-list-item-date-cell">
                  {makeDisplayDate(game.date)}
                </div>
              </Link>
              <Link
                id="edit-button"
                to={"/editar-partida/" + game.id}
                className={
                  withEdit
                    ? isOwnedByUser
                      ? "edit-showing"
                      : "edit-hidden"
                    : "edit-disabled"
                }
              >
                Editar
              </Link>
            </div>
          );
        })}
    </div>
  );
};

export default GamesList;
