const input = require("./input");

// helper that safely fils coordinate
const fillCoordinate = (matrix, x, y) => {
  if (!matrix[x]) matrix[x] = [];
  if (!matrix[x][y]) matrix[x][y] = [];

  if (matrix[x][y] >= 1) matrix[x][y] += 1;
  else matrix[x][y] = 1;
};

// mutates a passed in matrix, applying appropriate surface
const fillMatrix = matrix => ({ x, y, w, h }) => {
  for (let i = x; i < x + w; i++) {
    for (let j = y; j < y + h; j++) {
      fillCoordinate(matrix, i, j);
    }
  }
};

// map all overlaps onto one matrix
const mapOverlaps = coordinates => {
  const matrix = [];
  coordinates.forEach(fillMatrix(matrix));
  return matrix;
};

// count the surface of overlap
const countOverlaps = overlaps =>
  overlaps.reduce(
    (rowCount, row) =>
      rowCount + row.reduce((colCount, x) => colCount + (x > 1 ? 1 : 0), 0),
    0
  );

// helper to figure out coordinates from text input
const extractCoordinates = description => {
  const coords = description.match(/\#\d+ \@ (\d+),(\d+): (\d+)x(\d+)/);
  return {
    x: parseInt(coords[1]),
    y: parseInt(coords[2]),
    w: parseInt(coords[3]),
    h: parseInt(coords[4])
  };
};

const fabricClaims = input.split("\n").map(extractCoordinates);

console.log(countOverlaps(mapOverlaps(fabricClaims)));
