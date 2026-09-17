import "./styles.css";

const BOARD_SIZE = 8;

function getNeighbors([x, y]) {
  const moves = [
    [x + 2, y + 1],
    [x + 2, y - 1],
    [x - 2, y + 1],
    [x - 2, y - 1],
    [x + 1, y + 2],
    [x + 1, y - 2],
    [x - 1, y + 2],
    [x - 1, y - 2],
  ];
  return moves.filter(
    ([nx, ny]) => nx >= 0 && ny >= 0 && nx < BOARD_SIZE && ny < BOARD_SIZE,
  );
}

// Breadth-first search: the first time the queue reaches `end` is
// guaranteed to be via the shortest path, since every move has equal cost.
function knightMoves(start, end) {
  const visited = new Set([start.toString()]);
  const queue = [[start, [start]]];

  while (queue.length > 0) {
    const [pos, path] = queue.shift();
    if (pos[0] === end[0] && pos[1] === end[1]) return path;

    for (const neighbor of getNeighbors(pos)) {
      if (!visited.has(neighbor.toString())) {
        visited.add(neighbor.toString());
        queue.push([neighbor, [...path, neighbor]]);
      }
    }
  }

  return null;
}

export { BOARD_SIZE, getNeighbors, knightMoves };
