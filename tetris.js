const canvas = document.getElementById('tetris');
const context = canvas.getContext('2d');

context.scale(20, 20);



const matrix = [    //->this is the data structure for holding the tetriminos, also we have three rows for taking into account the rotation of the pieces
    [0, 0, 0],
    [1, 1, 1],
    [0, 1, 0]
];

function collide(arena, player) {   //>>for collision detection
    const [m, o] = [player.matrix, player.pos];
    for(let y=0; y<m.length; ++y){  //## we are basically iterating over the player here
        for(let x=0; x<m[y].length; ++x){
            if(m[y][x] !==0 &&      //-> check player matrix on y and x if not zero we continue
                (arena[y + o.y] &&  //-> here we check if the arena has a row 
                 arena[y +o.y][x + o.x]) !==0){  //-> here we check if the arena has both and they are both not zero then return true
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
        player.pos.y = 0;
    }
    dropCounter = 0;    //>> here the drop counter is reset after every drop inorder to keep the drops uniform
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

const arena = createMatrix(12, 20); //>> this is made for capturing uncleared/stuck pieces


const player = {
    pos: { x: 5, y: 5 },
    matrix: matrix
}

document.addEventListener('keydown', event=>{
    // console.log(event);
    if(event.keyCode === 37){
        player.pos.x--;
    }
    else if(event.keyCode === 39){
        player.pos.x++;
    }
    else if(event.keyCode === 40){
        playerDrop();
    }
    
    
})

update(); //>> game is initialized here
