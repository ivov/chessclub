import React from "react";

function arrayPairChunker(array) {
  let chunks = [],
    i = 0,
    n = array.length;
  while (i < n) {
    chunks.push(array.slice(i, (i += 2)));
  }
  return chunks;
}

const BoardTable = props => {
  const { moveHistory, currentTurn, onClick } = props;
  const moveHistoryInPairs = arrayPairChunker(moveHistory);
  const half = Math.floor(moveHistoryInPairs.length / 2);
  const firstHalf = moveHistoryInPairs.slice(0, half);
  const secondHalf = moveHistoryInPairs.slice(half);

  return (
    <div id="board-table">
      <div id="board-table-left-half">
        {firstHalf.map((item, index) => {
          const isActive = currentTurn - 1 === index;
          return (
            // eslint-disable-next-line
            <a key={index} onClick={onClick}>
              <div className={isActive ? "selected" : ""}>
                <b>{index + 1}.</b> {item[0]} {item[1]}
              </div>
            </a>
          );
        })}
      </div>
      <div id="board-table-right-half">
        {secondHalf.map((item, index) => {
          const isActive = currentTurn - 1 === index + half;
          return (
            // eslint-disable-next-line
            <a key={index} onClick={onClick}>
              <div className={isActive ? "selected" : ""}>
                <b>{index + 1 + half}.</b> {item[0]} {item[1]}
              </div>
            </a>
          );
        })}
      </div>
    </div>
  );
};

export default BoardTable;
