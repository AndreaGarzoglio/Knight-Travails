//Knight Travails Project
//_______________________
//Your task is to build a function knightMoves that shows the shortest possible way to get from one square to another by outputting all squares the knight will stop on along the way.
//You can think of the board as having 2 - dimensional coordinates.Calling your function would therefore look like:
//knightMoves([0, 0], [1, 2]) // returns [[0,0],[1,2]]
//______________________
// STEP 1: function getNeighBors([x,y]): finds the knight's moves
function getNeighbors([x, y]) {
    // -const moves: array that determines every possible vertex the Knight can move to
    const moves = [
        [x + 2, y + 1], [x + 2, y - 1], [x - 2, y + 1], [x - 2, y - 1], [x + 1, y + 2], [x + 1, y - 2], [x - 1, y + 2], [x - 1, y - 2]
    ];
    // -filters moves that are in range of the chessboard
    return moves.filter(([nx, ny]) => nx >= 0 && ny >= 0 && nx < 8 && ny < 8);
}
//_____________________
// STEP 2: function knightMoves(start,end): returns a path array with the least possible number of moves that takes the knight to get from the start to the end 
function knightMoves(start, end) {
    // - new Set visited: a set that gets updated with vertices that have been visited
    const visited = new Set();
    visited.add(start.toString());
    // - new array queue: breadth first search array that takes an item and then an array of all the items that came before (starts with start)
    const queue = [[start, [start]]];
    // - while queue.length>0:
    while (queue.length > 0) {
        // --const [pos, path]: takes the first array of queue and creates the pos const from the first item and the path array from the second
        const [pos, path] = queue.shift();
        // --best case scenario: if pos x and y are the same as end x and y, the knight reached its destination. return path
        if (pos[0] === end[0] && pos[1] === end[1]) return path;
        // --for(const neighbor of getNeighbors(pos)):
        for (const neighbor of getNeighbors(pos)) {
            // ---if the neighbor isn't in visited, add it to visited and push to queue neighbor with the path+ neighbor
            if (!visited.has(neighbor.toString())) {
                visited.add(neighbor.toString());
                queue.push([neighbor, [...path, neighbor]]);
            }
        }
    }

}


//_____________________
// STEP 3: function display(): display the results
function display(path) {
    // - Print: "You made it in X moves! Here's your path:"
    console.log(`You made it in ${path.length - 1} moves!  Here's your path:`);
    // - Print each position in the path on a new line
    path.forEach(position => console.log(position));
}

display(knightMoves([0, 0], [7, 7]));