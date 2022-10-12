const X = "X"
const O = "O"
const DIM = 3

class Position {

    constructor(board, turn) {
        this.board = board;
        this.turn = turn;
    }

    getTurn() {
        return this.turn;
    }

    move(idx) {
        let newBoard = [...this.board]
        newBoard[idx] = this.turn
        return new Position(newBoard, this.turn === X ? O : X)
    }

    possibleMoves() {
        let pm = [];
        for (let i = 0; i < this.board.length; i++) {
            if (this.board[i] === "") pm.push(i);
        }
        return pm;
    }

    isVictory(turn, start, step) {
        for (let i = 0; i < 3; i++) {
            if (this.board[start + step * i] !== turn) return false
        }
        return true
    }

    isWin(turn) {
        for (let i = 0; i < DIM; i++) {
            if (this.isVictory(turn, i * DIM, 1) || this.isVictory(turn, i, DIM)) return true;
        }
        return this.isVictory(turn, DIM - 1, DIM - 1) || this.isVictory(turn, 0, DIM + 1);
    }

    minimax() {
        if (this.isWin(X)) return 100;
        if (this.isWin(O)) return -100;

        if (this.possibleMoves().length === 0) return 0;

        let mm = null
        let pms = this.possibleMoves()
        pms.forEach(idx => {
            let value = this.move(idx).minimax();
            if (mm == null || this.turn === X && mm < value || this.turn === O && value < mm) mm = value;
        });
        return mm + (this.turn === X ? -1 : 1);
    }


    isEnd() {
        return this.isWin(X) || this.isWin(O) || this.possibleMoves().length === 0;
    }

    isDuplicationTurn(idx) {
        return this.board[idx] !== ""
    }
}

class Computer {
    constructor() {
        this.bestTurn = -1
    }

    getBestTurn() {
        return this.bestTurn;
    }

    getBestMove(position) {
        let mm = null;
        let pms = position.possibleMoves()
        pms.forEach(idx => {
            let value = position.move(idx).minimax();
            if (mm == null || position.getTurn() === X && mm < value || position.getTurn() === O && value < mm) {
                mm = value;
                this.bestTurn = idx
            }
        });
        return this.bestTurn
    }
}

var position = new Position(["", "", "", "", "", "", "", "", ""], X)
var computer = new Computer()

const board_container = document.querySelector(".play-area");

const winner_statement = document.getElementById("winner");


const check_for_winner = () => {
    if (position.isEnd()) {
        if (position.isWin(X)) {
            winner.innerText = "You win :v";
            winner.classList.add("playerWin");
        } else if (position.isWin(O)) {
            winner.innerText = "Computer win =))";
            winner.classList.add("computerWin");
        } else {
            winner.innerText = "Draw!";
            winner.classList.add("draw");
        }
        disableMove()
    }
};

const render_board = () => {
    board_container.innerHTML = ""
    position.board.forEach((e, i) => {
        board_container.innerHTML += `<div id="block_${i}" class="block" onclick="addPlayerMove(${i})">${position.board[i]}</div>`
        if (e === X || e === O) {
            document.querySelector(`#block_${i}`).classList.add("occupied");
        }
    });
};

const disableMove = () => {
    position.board.forEach((e, i) => {
        if (!document.body.classList.contains('occupied')) {
            console.log("i " + i);
            document.querySelector(`#block_${i}`).classList.add("occupied");
        }
    });
}

const move = idx => {
    position = position.move(idx)
}

const game_loop = () => {
    render_board();
    check_for_winner();
}

const addPlayerMove = e => {
    if (!position.isEnd() && !position.isDuplicationTurn(e)) {
        move(e)
        game_loop()
        addComputerMove()
    }
};

const addComputerMove = () => {
    let i = computer.getBestMove(position)
    move(i)
    game_loop()
};

const reset_board = () => {
    position = new Position(["", "", "", "", "", "", "", "", ""], X)
    winner.classList.remove("playerWin");
    winner.classList.remove("computerWin");
    winner.classList.remove("draw");
    winner.innerText = "";
    render_board();
};

//initial render
render_board();

