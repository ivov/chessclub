const emptyMovesArrayGenerator = () => {
  let array = [];
  for (let i = 0; i < 50; i++) {
    let object = {};
    object.number = i + 1;
    object.white = "";
    object.black = "";
    array.push(object);
  }
  return array;
};

const emptyMovesArray = emptyMovesArrayGenerator();

module.exports = emptyMovesArray;
