var origBoard;
var huPlayer = 'X';
var aiPlayer = '0';
const winCombos = [
	[0,1,2], [3,4,5], [6,7,8], 
	[0,3,6], [1,4,7], [2,5,8],
	[0,4,8], [6,4,2]
];

const cells = document.querySelectorAll(".cell");
startGame();

function startGame() {
	document.querySelector(".endgame").style.display = "none";
	origBoard = Array.from(Array(9).keys());
	for(var i=0; i<cells.length; i++) {
		cells[i].innerText = '';
		cells[i].style.removeProperty('background-color');
		cells[i].addEventListener('click', turnClick, false);
	}
}

function getId(id) {
	if(id=="one") {
		return 0;
	} else if(id=="two") {
		return 1;
	} else if(id=="three") {
		return 2;
	} else if(id=="four") {
		return 3;
	} else if(id=="five") {
		return 4;
	} else if(id=="six") {
		return 5;
	} else if(id=="seven") {
		return 6;
	} else if(id=="eight") {
		return 7;
	} else if(id=="nine") {
		return 8;
	}
}

function getElement(id) {
	if(id==0) {
		return document.getElementById("one");
	} else if(id==1) {
		return document.getElementById("two");
	} else if(id==2) {
		return document.getElementById("three");
	} else if(id==3) {
		return document.getElementById("four");
	} else if(id==4) {
		return document.getElementById("five");
	} else if(id==5) {
		return document.getElementById("six");
	} else if(id==6) {
		return document.getElementById("seven");
	} else if(id==7) {
		return document.getElementById("eight");
	} else if(id==8) {
		return document.getElementById("nine");
	}
}

function turnClick(cell) {
	id = getId(cell.target.id)
	if(typeof origBoard[id]=="number") {
		turn(cell.target, huPlayer);
		if(!checkTie() && !checkWin(origBoard, huPlayer)) {
			turn(getElement(bestSpot()), aiPlayer);
		}
	}
}

function turn(cell, player) {
	id = getId(cell.id);
	origBoard[id] = player;
	var image = document.createElement("img");
	if(player=='X') {
		image.setAttribute("src", "cross.png");
	} else {
		image.setAttribute("src", "circle.png");
	}
	cell.appendChild(image);
	let gameWon = checkWin(origBoard, player);
	if(gameWon) {
		gameOver(gameWon, player);
	}
}

function gameOver(gameWon, player) {
	for(var i=0; i<gameWon.length; i++) {
		let ele = getElement(gameWon[i]);
		ele.style.backgroundColor = "#c40404";
	}

	for(var i=0; i<cells.length; i++) {
		cells[i].removeEventListener('click', turnClick);
	}

	declareWinner(player == huPlayer ? "You Win!" : "You Lose!")
}

function declareWinner(who) {
	document.querySelector('.endgame').style.display = "block";
	document.querySelector(".endgame .text").innerText = who;
}

function checkWin(origBoard, player) {
	for(var i=0; i<winCombos.length; i++) {
		if(origBoard[winCombos[i][0]]===player && origBoard[winCombos[i][1]]===player && origBoard[winCombos[i][2]]===player) {
			return winCombos[i];
		}
	}
}

function checkTie() {
	if(!checkWin(origBoard, huPlayer)){
		if(emptySquares().length==0) {
			for(var i=0; i<cells.length; i++) {
				cells[i].removeEventListener('click', turnClick, false);
			}
			declareWinner("It's a draw!");
			return true;
		}
		return false;
	}
}

function emptySquares() {
	return origBoard.filter(s => typeof s == 'number');
}

function bestSpot() {
	return minimax(origBoard, aiPlayer).index;
}

function minimax(newBoard, player) {
	var availableSpots = emptySquares();
	if(checkWin(newBoard, huPlayer)) {
		return {score: -10};
	} else if(checkWin(newBoard, aiPlayer)) {
		return {score: 10};
	} else if(availableSpots.length==0) {
		return {score: 0};
	}

	var moves = [];
	for(var i=0; i<availableSpots.length; i++) {
		var move = {};
		move.index = newBoard[availableSpots[i]];
		newBoard[availableSpots[i]] = player;
		if(player==aiPlayer) {
			var result = minimax(newBoard, huPlayer);
			move.score = result.score;
		} else {
			var result = minimax(newBoard, aiPlayer);
			move.score = result.score;
		}
		newBoard[availableSpots[i]] = move.index;
		moves.push(move);
	}

	var bestMove;
	if(player==aiPlayer) {
		var bestScore = -10000;
		for(var i=0; i<moves.length; i++) {
			if(moves[i].score > bestScore) {
				bestScore = moves[i].score;
				bestMove = i;
			}
		}
	} else {
		var bestScore = 10000;
		for(var i=0; i<moves.length; i++) {
			if(moves[i].score < bestScore) {
				bestScore = moves[i].score;
				bestMove = i;
			}
		}
	}

	return moves[bestMove];
}