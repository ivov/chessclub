import React from "react";

const BoardTitle = props => {
  const { date, white, black, winner } = props;
  const winnerIsWhite = winner === white;
  const winnerIsBlack = winner === black;
  const winnerIsDraw = winner === "Tablas";

  return (
    <React.Fragment>
      <div className="board-title-container">
        <div className="board-title-line">
          <div>
            <span className="mdi mdi-circle-outline" /> {white}
          </div>
          vs.
          <div>
            <span className="mdi mdi-circle" /> {black}
          </div>
        </div>
      </div>
      <div className="board-title-container">
        <div className="board-title-line">
          <div>{date}</div>
          <div>
            {winnerIsDraw && <span className="mdi mdi-checkerboard" />}
            {winnerIsWhite && (
              <span className="mdi mdi-checkbox-marked-circle-outline" />
            )}
            {winnerIsBlack && (
              <span className="mdi mdi-checkbox-marked-circle" />
            )}
            {winner}
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default BoardTitle;
