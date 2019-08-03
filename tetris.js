const canvas = document.getElementById('tetris');
const context = canvas.getContext('2d');

context.scale(20, 20);



const matrix = [    //->this is the data structure for holding the tetriminos, also we have three rows for taking into account the rotation of the pieces
    [0, 0, 0],
    [1, 1, 1],
    [0, 1, 0]
];

function draw() {   //OKK made a separate function to draw tetriminos
    context.fillStyle = '#000'; //-> this and the line below it are written to refresh the canvas 
    context.fillRect(0, 0, canvas.width, canvas.height);

    drawMatrix(player.matrix, player.pos);
}

function drawMatrix(matrix, offset) {
    matrix.forEach((row, y) => {     //>>this is for drawing/filling in each space for the piece
        row.forEach((value, x) => {
            if (value !== 0) {     //>>only if the space is not zero
                context.fillStyle = 'red';       //## fills the block with color red
                context.fillRect(x + offset.x,
                    y + offset.y,
                    1, 1);   //## fills with one unit at the corresponding abcissa and ordinate

            }
        });
    });
}

let dropCounter = 0;    //->we set a drop counter to count how much time later the next drop in ordinate should occur
let dropInterval = 1000;    //->this is the interval with which we compare to drop the tetrimino

let lastTime = 0
function update(time = 0) {  //>> this was made to draw the game continously
    const deltaTime = time - lastTime;
    lastTime = time;

    dropCounter += deltaTime;
    if(dropCounter > dropInterval) {
        player.pos.y++; //>> here after every second the ordinate value of the tetrimino is incremented 
        dropCounter = 0;    //>> here the drop counter is reset after every drop inorder to keep the drops uniform
    }
    
    draw();
    requestAnimationFrame(update);
}

const player = {
    pos: { x: 5, y: 5 },
    matrix: matrix
}

update(); //>> game is initialized here
