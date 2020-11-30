const squares = Array.from(document.querySelectorAll('#board div'));
const messages = document.querySelector('h2');

let board;
let turn = 'X';

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
        console.log(mark, index);
    });

    messages.textContent = `It's ${turn}'s turn`;
};

init();

/* Event listener */
document.getElementById('board').addEventListener('click', (event) => {
    handleTurn(event);
});

handleTurn = (event) => {
    let idx = squares.findIndex((square) => {
        return square == event.target;
    });

    board[idx] = turn;
    turn = turn === 'X' ? 'O' : 'X';
    render();
    console.log(board);
}
