// A commented copy of index.js, shown in the "how it works" modal.
const KNIGHT_SOURCE = `function getNeighbors([x, y]) {
  // every one of the 8 possible L-shaped knight moves from [x, y]
  const moves = [
    [x + 2, y + 1], [x + 2, y - 1], [x - 2, y + 1], [x - 2, y - 1],
    [x + 1, y + 2], [x + 1, y - 2], [x - 1, y + 2], [x - 1, y - 2],
  ];
  // keep only the moves that land on the 8x8 board
  return moves.filter(([nx, ny]) => nx >= 0 && ny >= 0 && nx < 8 && ny < 8);
}

function knightMoves(start, end) {
  // breadth-first search: explores the board one move-radius at a time,
  // so the first time we reach "end" it's via the shortest path
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
}`;

export { KNIGHT_SOURCE };
