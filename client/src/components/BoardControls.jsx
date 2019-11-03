import React from "react";
import BoardButton from "./BoardButton";

const BoardControls = props => {
  const {
    flipAction,
    beginningAction,
    backAction,
    forwardAction,
    endAction,
    autoAction,
    autoState,
    atLastMove,
    noMovesYet,
    downloadAction
  } = props;

  return (
    <div id="board-controls">
      <BoardButton
        buttonName="Rotar"
        onClick={flipAction}
        buttonIcon="mdi-swap-vertical-bold"
      />
      <BoardButton
        buttonName="Al inicio"
        onClick={beginningAction}
        buttonIcon="mdi-skip-backward"
        disabledAtNoMovesYet={noMovesYet}
      />
      <BoardButton
        buttonName="Retroceder"
        onClick={backAction}
        buttonIcon="mdi-step-backward"
        disabledAtNoMovesYet={noMovesYet}
      />
      <BoardButton
        buttonName="Avanzar"
        onClick={forwardAction}
        buttonIcon="mdi-step-forward"
        disabledAtLastMove={atLastMove}
      />
      <BoardButton
        buttonName="Al final"
        onClick={endAction}
        buttonIcon="mdi-skip-forward"
        disabledAtLastMove={atLastMove}
      />
      <BoardButton
        buttonName="Automático"
        onClick={autoAction}
        autoState={autoState}
        buttonIcon={autoState === false ? "mdi-play" : "mdi-pause"}
        disabledAtLastMove={atLastMove}
      />
      <BoardButton
        buttonName="Descargar"
        onClick={downloadAction}
        buttonIcon="mdi-download"
      />
    </div>
  );
};

export default BoardControls;
