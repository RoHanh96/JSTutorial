const squares = Array.from(document.querySelectorAll('#board div'));
const messages = document.querySelector('h2');
const winningCombos = [
    [0, 1, 2],
    [3, 4, 5], 
    [6, 7, 8], 
    [0, 3, 6], 
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];
let board;
let turn = 'X';
let win;

init = () => {
    board = [
        '', '', '',
        '', '', '',
        '', '', ''
    ];

    render();
};

/* Fill square with X or O */
render = () => {
    board.forEach((mark, index) => {
        squares[index].textContent = mark;
    });

    messages.textContent = win === 'T' ? `That's a tie, queen!` : win ? `${win} wins the games!` : `It's ${turn}'s turn`;
};

/* Init board */
init();

/* Handle turn */
handleTurn = (event) => {
    let idx = squares.findIndex((square) => {
        return square == event.target;
    });

    board[idx] = turn;
    turn = turn === 'X' ? 'O' : 'X';
    win = getWinner();
    render();
}

/* Get winner */
getWinner = () => {
    let winner = null;
    winningCombos.forEach((combo, index) => {
        let winCondition = board[combo[0]] && board[combo[0]] === board[combo[1]] && board[combo[0]] === board[combo[2]];
        if (winCondition) {
            winner = board[combo[0]];
        }
    });

    return winner ? winner : board.includes('') ? null : 'T';
};

/* Event listener */
document.getElementById('board').addEventListener('click', (event) => {
    handleTurn(event);
});
document.getElementById('reset-button').addEventListener('click', init);

