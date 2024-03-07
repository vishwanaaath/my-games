let currentPlayer = true;
let player1Moves = [];
let player2Moves = [];
let click = 0;
let player1Wins = false;
let player2Wins = false;

function main() {
  let boardCells = document.querySelectorAll(".box");
  boardCells.forEach((box) => {
    box.addEventListener("click", function () {
      click++;
      if (currentPlayer === true) {
        box.innerHTML = "X";
        box.classList.add("xcolor");
        player1Moves.push(this.id);
        console.log("first player array", player1Moves);
        if (checkWinner(player1Moves)) {
          setInterval(() => {
            let container = document.getElementById("container");
            container.style.display = "none";
            let win = document.getElementById("win");
            win.style.display = "flex";
            win.innerText = "X wins!";
            player1Wins = true;
            console.log(player1Wins);
            console.log(1);
          }, 500);
        }
        currentPlayer = false;
      } else {
        box.innerHTML = "O";
        box.classList.add("ocolor");
        player2Moves.push(this.id);
        console.log("second player array", player2Moves);
        if (checkWinner(player2Moves)) {
          setInterval(() => {
            let container = document.getElementById("container");
            container.style.display = "none";
            let win = document.getElementById("win");
            win.style.display = "flex";
            win.innerText = "O wins!";
            player2Wins = true;
            console.log(player2Wins);
            console.log(2);
          }, 1000);
        }
        currentPlayer = true;
      }
      if (click === 9 && player1Wins === false && player2Wins === false) {
        setInterval(() => {
          let container = document.getElementById("container");
          container.style.display = "none";
          let win = document.getElementById("win");
          win.style.display = "flex";
          win.innerText = "it's a draw";
        }, 1000);
      }
      return player1Moves, player2Moves;
    });
  });
}

function checkWinner(playerArray) {
  const winningCombos = [
    ["1", "2", "3"],
    ["4", "5", "6"],
    ["7", "8", "9"],
    ["1", "5", "9"],
    ["3", "5", "7"],
    ["1", "4", "7"],
    ["2", "5", "8"],
    ["3", "6", "9"],
  ];

  let winner = winningCombos.find((combo) => {
    return combo.every((cell) => playerArray.includes(cell));
  });

  if (winner) {
    highlightWinningCells(winner);
    console.log(winner);
    return winner;
  } else {
    return null;
  }
}

function highlightWinningCells(winningCombo) {
  winningCombo.forEach((cellId) => {
    let cell = document.getElementById(cellId);
    cell.classList.add("highlight");
    setTimeout(() => {
      cell.classList.remove("highlight");
    }, 500);
  });
}

main();
