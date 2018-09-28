const input = document.forms[0];
const inputBoard = input.elements['numBoard'];
const inputBomb = input.elements['numBombs'];
const showBoard = document.getElementById('board');
const inputCoord = document.getElementById('inputCoord');
const btnSend = document.getElementById('btnSend');
const btnPlay = document.getElementById('btnPlay');
const gameInput = document.getElementById('gameInput');
const gameControl = document.getElementById('gameControl');
const gameMessage = document.getElementById('message');
const askRematch = document.getElementById('askRematch');

let board = [];

function sendData() {
  const minBoard = 1;
  const lengthBoard = Number(inputBoard.value);
  const numOfBombs = Number(inputBomb.value);
  const maxBombs = Math.ceil(lengthBoard / 3);
  
  if (numOfBombs < 1 || lengthBoard < minBoard) {
    return alert('Please input length of board and number of bomb first!');
  } else if (numOfBombs > lengthBoard) {
    return alert('Number of bombs must fewer than board length');
  } else if (numOfBombs > maxBombs) {
    return alert(`Max bombs is ${maxBombs}`);
  } else {
    initialize(lengthBoard, numOfBombs);
  }
}

function initialize(numBoard, numBomb) {
  gameInput.style.display = 'none';
  gameControl.style = '';
  
  board = [];
  for (let i = 1; i < numBoard+1; i++) {
    board.push({
      idx: i,
      isBomb: false,
      number: 0,
      isOpen: false,
      symbol: "O",
    });
  }
  generateBomb(numBoard, numBomb);
  generateNumber(numBoard);
  printBoard(numBoard);
}

function generateBomb(numBoard, numBomb) {
  let bombs = numBomb;
  while (bombs > 0) {
    const random = Math.floor(Math.random() * numBoard);
    const curBoard = board[random];
    if (!curBoard.isBomb) {
      curBoard.isBomb = true;
      bombs--;
    }
  }
}

function generateNumber(numBoard) {
  for (let i = 0; i < numBoard; i++) {
    if (!board[i].isBomb) {
      board[i].number = distributeNumber(i);
    }
  }
}

function distributeNumber(pos) {
  let point = 0;
  point += updateNumber(pos - 1);
  point += updateNumber(pos + 1);
  return point;
}

function updateNumber(pos) {
  return (pos >= 0 && pos < board.length && board[pos].isBomb) ? 1 : 0;
}

function printBoard(numBoard) {
  console.log('Bomb Number', board.filter(q => q.isBomb).map(q => q.idx));
  let area = '';
  let head = '';
  for (let i = 1; i < numBoard+1; i++) {
    head += `<td class=theadStyle>${i}</td>`;
  }
  let header = `<thead><tr>${head}</tr></thead>`;
  area += '<tr>';
  board.map(q => {
    area += `<td class=tdStyle>${q.symbol}</td>`;
  })
  area += '</tr>';
  showBoard.innerHTML = header + area;
}

function play() {
  const position = Number(inputCoord.value);
  const tileData = board[position-1];
  
  if (tileData.isOpen) {
    return alert('Board already open, please open another board!');
  }
  
  if (tileData.isBomb) {
    tileData.symbol = '*';
    showAllBomb();
    askToRematch('LOSE');
    return alert('YOU LOSE!');
  } else {
    if (tileData.number !== 0) {
      tileData.isOpen = true;
      tileData.symbol = tileData.number;
    } else {
      tileData.isOpen = true;
      tileData.symbol = '0';
      revealTile(position - 1);
    }
  }
  inputCoord.value = '';
  checkWin();
  printBoard(board.length);
}

function revealTile(position) {
  revealNearTile(position - 1);
  revealNearTile(position + 1);
}

function revealNearTile(pos) {
  const tile = board[pos];
  if (!tile) return;
  if (tile.isOpen) return;
  if (!tile.isBomb) {
    tile.isOpen = true;
    tile.symbol = tile.number || '0';
    revealTile(pos);
  }
}

function checkWin() {
  const numBomb = board.filter(q => q.isBomb).length;
  const tileNotOpen = board.filter(q => (!q.isOpen));
  if (tileNotOpen.length === numBomb) {
    showAllBomb();
    askToRematch('WIN');
    return alert('YOU WIN!');
  }
}

function showAllBomb() {
  board.map(q => (q.isBomb) ? q.symbol = '*' : q.symbol = q.number);
  printBoard(board.length);
}

function askToRematch(status) {
  gameMessage.innerHTML = `<h2>YOU ${status} THE GAME!</h2>`;
  gameMessage.style.color = (status === 'WIN') ? 'green' : 'red';
  gameControl.style.display = 'none';
  askRematch.style = '';
}

function rematch() {
  inputBoard.value = '';
  inputBomb.value = '';
  gameInput.style = '';
  showBoard.innerHTML = '';
  gameControl.style.display = 'none';
  askRematch.style.display = 'none';
}