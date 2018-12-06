const input = require("./input");
const {
  pipe,
  map,
  match,
  sort,
  split,
  reduce,
  range,
  path,
  pathOr,
  filter,
  defaultTo,
  inc,
  flatten
} = require("ramda");

const parseEvent = eventString => {
  const [_, date, hour, minute, action, guard] = match(
    /\[((?:\d|-)+) (\d+):(\d+)\] (?:(falls|wakes)|(?:\w+)) (?:\#(\d+))?/,
    eventString
  );

  return {
    date,
    minute: parseInt(minute),
    timestamp: new Date(`${date} ${hour}:${minute}`).getTime(),
    action,
    guard: guard && parseInt(guard)
  };
};

const parseEvents = map(parseEvent);
const parseInput = split("\n");
const sortEvents = sort(
  ({ timestamp: timestampA }, { timestamp: timestampB }) =>
    timestampA - timestampB
);
const onlyWithActionsAndGuardEq = findGuard =>
  filter(({ guard, action }) => guard === findGuard && action);

const assignGuards = pipe(
  reduce(
    (acc, event) => ({
      ...acc,
      events: [
        ...acc.events,
        { ...event, guard: event.guard || acc.lastGuard }
      ],
      lastGuard: event.guard || acc.lastGuard
    }),
    { events: [], lastGuard: null }
  ),
  path(["events"])
);

const getLongestSleeper = pipe(
  reduce(
    (acc, { guard, action, timestamp }) => {
      const { totals, lastSleep } = acc;
      if (action === "falls") return { ...acc, lastSleep: timestamp };
      if (action === "wakes") {
        const totalSleep = pathOr(0, [guard], totals) + (timestamp - lastSleep);
        const maxSleep = totalSleep > acc.maxSleep ? totalSleep : acc.maxSleep;
        const maxGuard = maxSleep !== acc.maxSleep ? guard : acc.maxGuard;

        return {
          ...acc,
          totals: {
            ...totals,
            [guard]: totalSleep
          },
          maxSleep,
          maxGuard
        };
      }

      return acc;
    },
    { totals: {}, maxGuard: 0, maxSleep: 0 }
  ),
  path(["maxGuard"])
);

const getMostFrequentMinute = pipe(
  reduce(
    (acc, minute) => {
      const freq = inc(defaultTo(0, acc[minute]));
      const maxFreq = freq > acc.maxFreq ? freq : acc.maxFreq;

      return {
        ...acc,
        [minute]: freq,
        maxFreq,
        maxFreqMinute: maxFreq !== acc.maxFreq ? minute : acc.maxFreqMinute
      };
    },
    { maxFreq: 0 }
  ),
  path(["maxFreqMinute"])
);

const getMinuteRanges = pipe(
  reduce(
    ({ ranges, lastStart }, { action, minute }) =>
      action === "falls"
        ? { ranges, lastStart: minute }
        : { ranges: [...ranges, range(lastStart, minute)] },
    { ranges: [], lastStart: 0 }
  ),
  path(["ranges"]),
  flatten
);

const solution = events => {
  const longestSleeper = getLongestSleeper(events);

  const mostFrequentMinute = pipe(
    onlyWithActionsAndGuardEq(longestSleeper),
    getMinuteRanges,
    getMostFrequentMinute
  )(events);

  return longestSleeper * mostFrequentMinute;
};

const result = pipe(
  parseInput,
  parseEvents,
  sortEvents,
  assignGuards,
  solution
)(input);

console.log(result);
