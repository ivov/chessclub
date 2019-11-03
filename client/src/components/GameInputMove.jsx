import React from "react";

const GameInputMove = props => {
  return (
    <div className="number-and-move" id={props.number}>
      <label>{props.number}.</label>
      <input
        type="text"
        placeholder="..."
        onChange={props.onChange}
        className="white-input"
        value={props.whiteInput}
      />
      <input
        type="text"
        placeholder="..."
        onChange={props.onChange}
        className="black-input"
        value={props.blackInput}
      />
    </div>
  );
};

export default GameInputMove;
