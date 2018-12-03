const input = require("./input");

const findSameLetters = (baseWord, quoteWord) =>
  baseWord
    .split("")
    .reduce(
      (sames, letter, i) => (quoteWord[i] === letter ? sames + letter : sames),
      ""
    );

const findClosestIds = ids =>
  ids
    .map((baseId, bi) =>
      ids
        .filter((_, qi) => bi !== qi) // exclude base word
        .map(quoteId => findSameLetters(baseId, quoteId))
    )
    .reduce((acc, arr) => acc.concat(arr), []) // flatten
    .reduce((longest, id) => (longest.length < id.length ? id : longest), "");

console.log(findClosestIds(input.split("\n")));
