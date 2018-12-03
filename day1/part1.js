const input = require("./input");

const frequencyDetector = (sequence, startPosition = 0) =>
  sequence.reduce((result, cmd) => (result += parseInt(cmd)), startPosition);

console.log(frequencyDetector(input.split("\n")));
