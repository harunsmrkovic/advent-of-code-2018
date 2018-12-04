const input = require("./input");

// helper that safely fils coordinate, and pushes overlapping IDs into an array
const fillCoordinate = (matrix, overlappingIds, x, y, id) => {
  if (!matrix[x]) matrix[x] = [];
  if (!matrix[x][y]) matrix[x][y] = [];

  if (matrix[x][y] >= 1) {
    overlappingIds.push(matrix[x][y]);
    overlappingIds.push(id);
  }
  matrix[x][y] = id;
};

// mutates a passed in matrix, applying appropriate surface, plus forms overlapping IDs array
const fillMatrix = (matrix, overlappingIds) => ({ x, y, w, h, id }) => {
  for (let i = x; i < x + w; i++) {
    for (let j = y; j < y + h; j++) {
      fillCoordinate(matrix, overlappingIds, i, j, id);
    }
  }
};

// fill the matrix, and then check for overlapping Ids
const getIntactFabric = input => {
  const matrix = [];
  const overlappingIds = [];
  const coordinates = input.split("\n").map(extractCoordinates);

  coordinates.forEach(fillMatrix(matrix, overlappingIds));
  const unoverlappedFabric = coordinates.find(
    ({ id }) => !overlappingIds.includes(id)
  );

  return unoverlappedFabric.id;
};

// helper to figure out coordinates from text input
const extractCoordinates = description => {
  const coords = description.match(/\#(\d+) \@ (\d+),(\d+): (\d+)x(\d+)/);
  return {
    id: parseInt(coords[1]),
    x: parseInt(coords[2]),
    y: parseInt(coords[3]),
    w: parseInt(coords[4]),
    h: parseInt(coords[5])
  };
};

console.log(getIntactFabric(input));
