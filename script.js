function Player(name, marker) {
  return { name, marker, score: 0 };
}

function GameBoard() {
  this.cells = Array(9).fill(null);

  this.setCell = function (index, marker) {
    if (this.cells[index] === null) {
      this.cells[index] = marker;
      return true;
    }
    return false;
  };

  this.getCell = function (index) {
    return this.cells[index];
  };

  this.reset = function () {
    this.cells = Array(9).fill(null);
  };

  this.isFull = function () {
    return this.cells.every((cell) => cell !== null);
  };
}

const WINNING_COMBOS = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

const GameController = (function () {
  const player1 = Player("Player 1", "X");
  const player2 = Player("Player 2", "O");
  const board = new GameBoard();

  let currentPlayer = player1;
  let gameOver = false;

  const gameCells = document.querySelectorAll("#cells > div");
  const p1ScoreEl = document.getElementById("p-one-score");
  const p2ScoreEl = document.getElementById("p-two-score");
  const resetBtn = document.getElementById("reset-btn");

  const statusEl = document.createElement("p");
  statusEl.id = "game-status";
  statusEl.style.cssText =
    "color:#D1DEDE;font-size:24px;text-align:center;margin-top:10px;";
  document.getElementById("score").after(statusEl);

  function updateStatus(message) {
    statusEl.textContent = message;
  }

  function checkWinner() {
    for (const combo of WINNING_COMBOS) {
      const [a, b, c] = combo;
      if (
        board.getCell(a) !== null &&
        board.getCell(a) === board.getCell(b) &&
        board.getCell(a) === board.getCell(c)
      ) {
        highlightWinningCells(combo);
        return board.getCell(a);
      }
    }
    return null;
  }

  function highlightWinningCells(combo) {
    combo.forEach((index) => {
      gameCells[index].style.background = "#2ecc40";
      gameCells[index].style.color = "#111";
    });
  }

  function clearHighlights() {
    gameCells.forEach((cell) => {
      cell.style.background = "";
      cell.style.color = "";
    });
  }

  function handleCellClick(index) {
    if (gameOver) return;

    if (!board.setCell(index, currentPlayer.marker)) return;

    gameCells[index].textContent = currentPlayer.marker;

    const winner = checkWinner();
    if (winner) {
      gameOver = true;
      if (winner === player1.marker) {
        player1.score++;
        p1ScoreEl.textContent = player1.score;
        updateStatus(`${player1.name} wins!`);
      } else {
        player2.score++;
        p2ScoreEl.textContent = player2.score;
        updateStatus(`${player2.name} wins!`);
      }
      return;
    }

    if (board.isFull()) {
      gameOver = true;
      updateStatus("It's a tie!");
      return;
    }

    currentPlayer = currentPlayer === player1 ? player2 : player1;
    updateStatus(`${currentPlayer.name}'s turn (${currentPlayer.marker})`);
  }

  function resetGame() {
    board.reset();
    currentPlayer = player1;
    gameOver = false;
    clearHighlights();
    gameCells.forEach((cell) => (cell.textContent = ""));
    updateStatus(`${player1.name}'s turn (${player1.marker})`);
  }

  function init() {
    gameCells.forEach((cell, index) => {
      cell.addEventListener("click", () => handleCellClick(index));
    });
    resetBtn.addEventListener("click", resetGame);
    updateStatus(`${player1.name}'s turn (${player1.marker})`);
  }

  return { init, resetGame };
})();

GameController.init();
