const input = require("./input");

/*  Following solution works for smaller data sets, but does not work for large sets
    because it hits Maximum call stack... node doesn't have Tail Call Optimisation

const doubleFrequencyDetector = (results, restOfSequence) => {
  const next = results[results.length - 1] + restOfSequence[0];

  if (results.indexOf(next) !== -1) return next;
  else
    return doubleFrequencyDetector(
      results.concat(next),
      restOfSequence.slice(1).concat(restOfSequence[0])
    );
};
*/

const doubleFrequencyDetector = sequence => {
  const intSequence = sequence.map(i => parseInt(i, 10));
  const sequenceLength = intSequence.length;
  const results = [];
  let step = 0;
  let lastResult = 0;

  while (results.indexOf(lastResult) === -1) {
    if (step === sequenceLength) step = 0;
    results.push(lastResult);
    lastResult += intSequence[step++];
  }

  return lastResult;
};

// console.log(doubleFrequencyDetector(["+1", "-1"]), "=>", 0);
// console.log(doubleFrequencyDetector(["+3", "+3", "+4", "-2", "-4"]), "=>", 10);
// console.log(doubleFrequencyDetector(["-6", "+3", "+8", "+5", "-6"]), "=>", 5);
// console.log(doubleFrequencyDetector(["+7", "+7", "-2", "-7", "-4"]), "=>", 14);
//
console.log(doubleFrequencyDetector(input.split("\n")));
