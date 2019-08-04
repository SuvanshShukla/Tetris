const canvas = document.getElementById('tetris');
const context = canvas.getContext('2d');

context.scale(20, 20);

//>>There is actually an issue of caching in browsers while running this which causes some pieces to rotate funny
//>> So to avoid that you should probably clear your browsers cache before playing/running

function arenaSweep() {
    let rowCount = 1;
    outer: for(let y = arena.length-1; y>0; --y){
        for (let x=0; x<arena[y].length; ++x){
            if(arena[y][x]===0) {
                continue outer;
            }
        }
        const row = arena.splice(y, 1)[0].fill(0);
        arena.unshift(row); 
        ++y;

        player.score += rowCount*10;
        rowCount *= 2
    }
}



function collide(arena, player) {   //>>for collision detection
    const m = player.matrix;
    const o = player.pos;
    for(let y=0; y<m.length; ++y){  //## we are basically iterating over the player here
        for(let x=0; x<m[y].length; ++x){
            if(m[y][x] !==0 &&      //-> check player matrix on y and x if not zero we continue
                (arena[y + o.y] &&  //-> here we check if the arena has a row 
                 arena[y + o.y][x + o.x]) !==0){  //-> here we check if the arena has both and they are both not zero then return true
                    return true;
            }
        }
    }
    return false;
}

function createMatrix(w, h) {   //## this function is made to draw all tetriminos
    const matrix = [];  //declare an empty matrix 
    while (h--){
        matrix.push(new  Array(w).fill(0)); //push zeroes into it
    }
    return matrix;
}

function createPiece(type) {
    if(type === 'T'){
        return [    //->this is the data structure for holding the tetriminos, also we have three rows for taking into account the rotation of the pieces
            [0, 0, 0],
            [1, 1, 1],
            [0, 1, 0]
        ];
    }
    else if(type === 'O'){
        return [    
            [2, 2],
            [2, 2]
        ];
    }
    else if(type === 'L'){
        return [
            [0, 3, 0],
            [0, 3, 0],
            [0, 3, 3]
        ]
    }
    else if(type === 'J'){
        return [
            [0, 4, 0],
            [0, 4, 0],
            [4, 4, 0]
        ]
    }
    else if(type === 'I'){
        return [
            [0, 5, 0, 0],
            [0, 5, 0, 0],
            [0, 5, 0, 0],
            [0, 5, 0, 0]
        ]
    }
    else if(type === 'S'){
        return [
            [0, 6, 6],
            [6, 6, 0],
            [0, 0, 0]
        ]
    }
    else if(type === 'Z'){
        return [
            [7, 7, 0],
            [0, 7, 7],
            [0, 0, 0]
        ]
    }
}

function draw() {   //OKK made a separate function to draw tetriminos
    context.fillStyle = '#000'; //-> this and the line below it are written to refresh the canvas 
    context.fillRect(0, 0, canvas.width, canvas.height);

    drawMatrix(arena, {x: 0, y: 0});
    drawMatrix(player.matrix, player.pos);
}

function drawMatrix(matrix, offset) {
    matrix.forEach((row, y) => {     //>>this is for drawing/filling in each space for the piece
        row.forEach((value, x) => {
            if (value !== 0) {     //>>only if the space is not zero
                context.fillStyle = colors[value];       //## fills the block with color red
                context.fillRect(x + offset.x,
                                 y + offset.y,
                                 1, 1);   //## fills with one unit at the corresponding abcissa and ordinate

            }
        });
    });
}

function merge(arena, player) {     //>> this function will copy the values of the player into the arena at the correct positions 
    player.matrix.forEach((row, y) =>{
        row.forEach((value, x) =>{
            if (value !== 0){
                arena[y + player.pos.y][x + player.pos.x] = value;
            }
        })
    })
}

function playerDrop() {
    player.pos.y++; //>> here after every second the ordinate value of the tetrimino is incremented 
    if(collide(arena, player)){
        player.pos.y--;
        merge(arena, player);
        playerReset();
        // debugger;
        arenaSweep();
        updateScore();
    }
    dropCounter = 0;    //>> here the drop counter is reset after every drop inorder to keep the drops uniform
}

function playerMove(offset){   //->tetrimino movement has been consolidated into a function
    player.pos.x += offset;    //-> the value of direction matters, 1 means towards right or down and -1 means left
    if(collide(arena, player)){ //## if the tetriminos collide with the arena they should be able to move back
        player.pos.x -= offset;    //-> this is to allow the move back of the tetrimino
    }
    
}

function playerReset() {
    const pieces = 'ILJOTSZ';
    player.matrix = createPiece(pieces[pieces.length * Math.random() | 0])
    player.pos.y = 0;
    player.pos.x = (arena[0].length / 2 | 0) -
                    (player.matrix[0].length /2 | 0);
    if (collide(arena,player)) {
        arena.forEach(row => row.fill(0));
        player.score = 0;
        updateScore();
    }
}

function playerRotate(dir) {    //>> function has been modified for edge detection so that upon rotation if the tetrimino collides with a side it will correct itself
    const pos = player.pos.x;
    let offset = 1;
    rotate(player.matrix, dir);     //->here we are simply calling for rotation
    while(collide(arena, player)){
        player.pos.x += offset;     //##here upon detecting collision the abcissa of the tetrimino will be moved by the offset
        offset = -(offset + (offset>0 ? 1 : -1));   //## how much is the tetrimino supposed to move to correct itself is calculated here
        //>>it basically just keeps checking both sides until it detects a collision and saves the distance into offset
        if(offset > player.matrix[0].length) {      //!! this line checks if the offset is large enough to move the whole matrix
            rotate(player.matrix, -dir);        //!! here the tetrimino is rotated in the opposite direction
            player.pos.x = pos;     //!!after rotation the tetrimino is set back to its initial position
            return;     //-> basically the code keeps looking for an offset until it is big enough and on the correct side to navigate the while tetrimino matrix accross the obstacle
        }
    }
}

function rotate(matrix, dir) {  //!! to rotate a tetrimino we transpose its matrix and then reverse its columns
    for(let y=0; y<matrix.length; ++y){
        for(let x=0; x<y; ++x){     //-> the genius of this line is that we can simply swap elements of a matrix like this without using a temp vairable
            [
                matrix[x][y],
                matrix[y][x]
            ] = [
                matrix[y][x],
                matrix[x][y]
            ];
        }
        if(dir>0){
            matrix.forEach(row => row.reverse());
        }
        else{
            matrix.reverse();
        }
    }
}

let dropCounter = 0;    //->we set a drop counter to count how much time later the next drop in ordinate should occur
let dropInterval = 1000;    //->this is the interval with which we compare to drop the tetrimino

let lastTime = 0
function update(time = 0) {  //>> this was made to draw the game continously
    const deltaTime = time - lastTime;
    lastTime = time;

    dropCounter += deltaTime;
    if(dropCounter > dropInterval) {
        playerDrop();
    }
    
    draw();
    requestAnimationFrame(update);
}

function updateScore() {
    document.getElementById('score').innerText = player.score; 
}

const colors = [
    null,
    'red', 
    'brown',
    'violet', 
    'green',
    'orange',
    'cyan',
    'yellow',
]

const arena = createMatrix(12, 20); //>> this is made for capturing uncleared/stuck pieces


const player = {
    pos: { x: 0, y: 0 },
    matrix: null,
    score: 0,
}

document.addEventListener('keydown', event=>{
    // console.log(event);
    if(event.keyCode === 37){
        playerMove(-1);
    }
    else if(event.keyCode === 39){
        playerMove(1);
    }
    else if(event.keyCode === 40){
        playerDrop();
    }
    else if(event.keyCode === 81){
        playerRotate(-1);
    }
    else if(event.keyCode === 87){
        playerRotate(1);
    }
    
    
})

playerReset();
updateScore();
update(); //>> the game is initialized here
//>> the logic behind rotation of tetriminos is a transpose of the matrix and then reverse each row i.e. row1 row2 row3 after the reverse will become row3 row2 row1