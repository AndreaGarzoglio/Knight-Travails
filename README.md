# Knight Travails

A from-scratch JavaScript solver for the knight's shortest path on a
chessboard, paired with an interactive web app: click two squares and
watch the knight hop along the shortest route, found with a
breadth-first search.

The app uses a "terminal" style interface: a large, borderless chessboard
takes center stage, with a side panel (a bottom drawer on mobile) holding
the move controls and a log of past commands.

## Project structure

```
src/
├── index.html            # UI markup
├── index.js              # getNeighbors and knightMoves (the BFS solver)
├── main.js                # wires the UI to the solver (board, knight, log, state)
├── annotated-source.js   # a commented copy of the solver, shown in the "how it works" modal
├── styles.css             # "terminal" theme (JetBrains Mono, dark, violet)
└── favicon.svg             # browser tab icon / app logo
```

Config files in the repo root: `webpack.config.js`, `eslint.config.js`,
`.prettierrc` / `.prettierignore`.

## The solver

`getNeighbors([x, y])` lists the (up to 8) L-shaped moves a knight can
make from a square, filtered to whatever stays on the 8x8 board.

`knightMoves(start, end)` runs a breadth-first search over those moves:
it explores the board one move-radius at a time, so the first time it
reaches `end` is guaranteed to be via the shortest possible path. It
returns that path as an array of `[x, y]` coordinates, start to finish.

## The interactive UI

- a **chessboard**: click a square to place the knight, click another to
  send it there. The path is highlighted and the knight animates across
  it one hop at a time;
- a **move count**, shown both under the board and in the side panel's
  log, once the knight lands;
- a **"how it works"** button that opens a modal with a commented copy
  of the solver (`annotated-source.js`);
- manual **from** / **to** coordinate fields plus **run**, **random**
  and **reset**, for driving the board without clicking;
- on narrow screens, the side panel collapses into a drawer you tap open
  from the bottom of the screen, so the board keeps the full viewport.

## Commands

```bash
npm install       # install dependencies
npm run dev       # start the dev server (webpack-dev-server) with hot reload
npm run build     # production build, output in docs/
npm run lint      # run eslint on src/
```
