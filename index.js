button = document.getElementById("delete");
let selectedCells = [];
let selectedElement;
let board = [];

let boardPattern = [
  [2, 2, 3, 0, 3, 3],
  [2, 2, 3, 0, 0, 0],
  [2, 3, 3, 0, 0, 0],
  [2, 3, 3, 3, 3, 0],
  [1, 3, 3, 3, 1, 1],
  [1, 1, 3, 3, 0, 3],
  [1, 1, 1, 2, 2, 3]
]

class Cell {
  static Suits = {
    DIAMOND: {
      symbol: "♢",
      type: 0,
    },
    HEART: {
      symbol: "♡",
      type: 1,
    },
    SPADE: {
      symbol: "♠",
      type: 2,
    },
    CLUB: {
      symbol: "♣",
      type: 3,
    },
  }

  neighbors = [];

  // X and Y are coordinates of the cell
  // Type  is the suit of the card and could be number 0-3
  constructor({
    x,
    y,
    type
  }) {
    this.suit = Object.values(Cell.Suits)[type];
    this.id = `${y}/${x}`;
    this.x = x;
    this.y = y;
  }

  addNeighbor(cell) {
    this.neighbors.push(cell);
  }

  setElement(element) {
    this.element = element;
  }

  getNeighbors() {
    return this.neighbors;
  }

  getSuit() {
    return this.suit;
  }

  getId() {
    return this.id;
  }

  getElement() {
    return this.element;
  }
}

function createBoard(sizeY) {
  let board = [];
  for (let y = 0; y < sizeY; y++) {
    board.push([]);
  }
  return board;
}

function setRandomBoard(sizeX, sizeY) {
  for (let y = 0; y < sizeY; y++) {
    for (let x = 0; x < sizeX; x++) {
      board[y][x].push(new Cell({
        x: x,
        y: y,
        type: Math.floor(Math.random() * 4)
      }));
    }
  }
}

function setBoardFromPattern(pattern) {
  for (let y = 0; y < pattern.length; y++) {
    for (let x = 0; x < pattern[y].length; x++) {
      board[y].push(new Cell({
        x: x,
        y: y,
        type: pattern[y][x]
      }));
    }
  }
}

function searchNeighbors(board) {
  for (let y = 0; y < board.length; y++) {
    for (let x = y % 2; x < board[y].length; x += 2) {
      let cell = board[y][x];
      let position = cell.getId().split("/");
      position[0] = +position[0];
      position[1] = +position[1];
      if (position[0] - 1 >= 0) {
        if (board[position[0] - 1][position[1]].suit.type == cell.suit.type) {
          neighbor = board[position[0] - 1][position[1]];
          cell.addNeighbor(neighbor);
          neighbor.addNeighbor(cell);
        }
      }
      if (position[1] - 1 >= 0) {
        if (board[position[0]][position[1] - 1].suit.type == cell.suit.type) {
          neighbor = board[position[0]][position[1] - 1];
          cell.addNeighbor(neighbor);
          neighbor.addNeighbor(cell);
        }
      }
      if (position[0] + 1 < board.length) {
        if (board[position[0] + 1][position[1]].suit.type == cell.suit.type) {
          neighbor = board[position[0] + 1][position[1]];
          cell.addNeighbor(neighbor);
          neighbor.addNeighbor(cell);
        }
      }
      if (position[1] + 1 < board[position[0]].length) {
        if (board[position[0]][position[1] + 1].suit.type == cell.suit.type) {
          neighbor = board[position[0]][position[1] + 1];
          cell.addNeighbor(neighbor);
          neighbor.addNeighbor(cell);
        }
      }
    }
  }
}

function searchAllNeighbors(cell) {
  selectedCells.push(cell);
  cell.getNeighbors().forEach(neighbor => {
    if (!selectedCells.includes(neighbor)) {
      selectedCells = [...new Set([...selectedCells, ...searchAllNeighbors(neighbor)])];
    }
  });
  return selectedCells;
}

function setActiveCell(cell) {
  if (selectedElement) {
    selectedElement.getElement().classList.remove("selected");
  }

  if (selectedCells != []) {
    selectedCells.forEach(cell => {
      cell.getElement().classList.remove("active");
    })
    selectedCells = [];
  }

  cell.getElement().classList.add("selected");
  neighbors = searchAllNeighbors(cell);
  neighbors.forEach(neighbor => {
    neighbor.getElement().classList.add("active");
  })
  selectedElement = cell;
  button.disabled = false;
}

function createElement(cell) {
  let element = document.createElement("div");
  element.classList.add("cell");
  element.innerHTML = cell.suit.symbol;
  element.addEventListener("click", () => {
    setActiveCell(cell);
  })
  return element;
}

function renderBoard(board) {
  let grid = document.getElementById("grid");
  for (let y = 0; y < board.length; y++) {
    for (let x = 0; x < board[y].length; x++) {
      let cell = board[y][x];
      let element = createElement(cell);
      cell.setElement(element);
      grid.appendChild(element);
    }
  }
}

function hideCell() {
  if (selectedCells != []) {
    selectedCells.forEach(cell => {
      cell.getElement().classList.add("hidden");
      cell.getElement().classList.remove("active");
      cell.getElement().classList.remove("selected");
    });
    selectedElement = null;
    selectedCells = [];
    button.disabled = true;
  }

}

button.addEventListener("click", () => {
  hideCell();
});

board = createBoard(7);

setBoardFromPattern(boardPattern)

searchNeighbors(board)

renderBoard(board)

console.log(board)