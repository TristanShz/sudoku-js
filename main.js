"use strict";

const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

const CELL_SIZE = 75;
const DEFAULT_GRID = [
  [5,0,0,2,0,9,0,6,0],
  [0,6,2,7,3,0,0,9,8],
  [4,0,9,6,0,0,1,3,2],
  [9,0,0,0,0,0,4,0,7],
  [0,8,7,3,4,0,0,1,0],
  [2,0,0,1,0,0,0,0,3],
  [3,4,0,0,2,6,8,0,0],
  [0,0,6,0,5,1,0,0,0],
  [0,0,1,0,0,0,2,0,6],
];

class Sudoku {

  selectedCell = undefined;

  constructor() {
    this.grid = [...DEFAULT_GRID.map(ROW => [...ROW])];
    this.errorMessage = document.querySelector("#errorMessage");
    canvas.addEventListener("click", (e) => {
      sudoku.selectCell(e.offsetX, e.offsetY);
    })
    document.addEventListener("keyup", (e) => {
      const validKeys = ["1","2","3","4","5","6","7","8","9"]
      if(validKeys.includes(e.key)) {
        this.handleNumberInput(parseInt(e.key));
      }else if(e.key === "Backspace") {
        this.clearCell();
      } else {
        this.displayErrorMessage("Please type a number");
      }
    })
  }

  init() {
    canvas.width = this.grid.length * CELL_SIZE;
    canvas.height = this.grid.length * CELL_SIZE;
    this.drawGrid();
    this.drawNumbers();
  }

  clearCanvas() {
    ctx.clearRect(0,0, this.grid.length * CELL_SIZE, this.grid.length * CELL_SIZE);
  }

  clearCell() {
    this.grid[this.selectedCell.y][this.selectedCell.x] = 0;
    this.updateCanvas();
  }

  displayErrorMessage(message) {
    this.errorMessage.innerHTML = message;
    setTimeout(() => this.errorMessage.innerHTML = "", 3000);
  }

  updateCanvas() {
    this.clearCanvas();
    this.drawGrid();
    this.drawNumbers();
  }

  drawGrid() {
    this.grid.forEach((row,rowIndex) => {
      row.forEach((col,colIndex) => {
        ctx.strokeStyle = "#ffffff";
        ctx.strokeRect(colIndex * CELL_SIZE, rowIndex * CELL_SIZE, CELL_SIZE, CELL_SIZE);
      });
    });
  }

  drawNumbers() {
    this.grid.forEach((row, rowIndex) => {
      row.forEach((col, colIndex) => {
        if(col) {
          if(DEFAULT_GRID[rowIndex][colIndex]) ctx.fillStyle = "lightgrey";
          else ctx.fillStyle = "blue";
          ctx.font = "48px sans-serif";
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText(
            col.toString(),
            colIndex * CELL_SIZE + CELL_SIZE / 2 , rowIndex * CELL_SIZE + CELL_SIZE / 2
          );
        }
      });
    });
  }

  getRowIndex(posY) {
    let rowIndex;
    this.grid.forEach((row,index) => {
      if(posY > index * CELL_SIZE && posY < (index + 1) * CELL_SIZE){
        rowIndex = index
      }
    })

    return rowIndex;
  }

  getColIndex(posX) {
    let colIndex;
    this.grid.forEach((row,index) => {
      if(posX > index * CELL_SIZE && posX < (index + 1) * CELL_SIZE){
        colIndex = index
      }
    })

    return colIndex;
  }

  selectCell(posX, posY) {
    const colIndex = this.getColIndex(posX);
    const rowIndex = this.getRowIndex(posY);
    if(DEFAULT_GRID[rowIndex][colIndex]) {
      this.displayErrorMessage("This one was a number present by default in the grid");
      return;
    }

    this.updateCanvas();
    ctx.strokeStyle = "#6b0000";
    ctx.strokeRect(colIndex * CELL_SIZE, rowIndex * CELL_SIZE, CELL_SIZE, CELL_SIZE);

    this.selectedCell = { x: colIndex, y: rowIndex };
  }

  handleNumberInput(number) {
    if(this.inputIsValid(number)) {
      ctx.fillStyle = 'green';
      this.grid[this.selectedCell.y][this.selectedCell.x] = number;
    }
    else ctx.fillStyle = "red";
    ctx.font = "48px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(
      number.toString(),
      this.selectedCell.x * CELL_SIZE + CELL_SIZE / 2 , this.selectedCell.y * CELL_SIZE + CELL_SIZE / 2
    );
    setTimeout(() => this.updateCanvas(),1000);
  }

  inputIsValid(number) {
    let isValid = true;
    this.grid.forEach((row, rowIndex) => {
      row.forEach((value, colIndex) => {
        if(colIndex === this.selectedCell.x || rowIndex === this.selectedCell.y){
          if(value === number) isValid = false;
        }
        if(this.grid[Math.floor(this.selectedCell.y / 3) * 3 + Math.floor(colIndex / 3)][Math.floor(this.selectedCell.x / 3) * 3 + colIndex % 3] === number) {
          isValid = false;
        }
      })
    })

    return isValid;
  }
}

const sudoku = new Sudoku();
sudoku.init();
