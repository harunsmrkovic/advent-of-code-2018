const input = require("./input");

const countLetters = id =>
  Object.values(
    id
      .split("")
      .reduce(
        (count, letter) => ({ ...count, [letter]: (count[letter] || 0) + 1 }),
        {}
      )
  );

const calculateChecksum = ids => {
  const { twos, threes } = ids.reduce(
    ({ twos, threes }, id) => {
      const counts = countLetters(id);
      const increaseTwosBy = counts.find(i => i === 2) ? 1 : 0;
      const increaseThreesBy = counts.find(i => i === 3) ? 1 : 0;
      return {
        twos: twos + increaseTwosBy,
        threes: threes + increaseThreesBy
      };
    },
    { twos: 0, threes: 0 }
  );

  return twos * threes;
};

console.log(calculateChecksum(input.split("\n")));
