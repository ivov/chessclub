import React from "react";

const BoardButton = props => {
  const {
    onClick,
    buttonIcon,
    buttonName,
    disabledAtNoMovesYet,
    disabledAtLastMove
  } = props;

  return (
    <button
      onClick={onClick}
      className="board-controls-button"
      id={
        (disabledAtLastMove ? "board-controls-button-disabled" : "") ||
        (disabledAtNoMovesYet ? "board-controls-button-disabled" : "")
      }
    >
      <span className={"mdi " + buttonIcon} />
      <br />
      {buttonName}
    </button>
  );
};

export default BoardButton;
