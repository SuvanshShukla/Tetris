const canvas = document.getElementById('tetris');
const context = canvas.getContext('2d');

context.scale(20,20);

context.fillStyle = '#000';
context.fillRect(0, 0, canvas.width, canvas.height);

const matrix = [    //->this is the data structure for holding the tetriminos, also we have three rows for taking into account the rotation of the pieces
    [0, 0, 0],
    [1, 1, 1],
    [0, 1, 0]
];

function drawMatrix(matrix, offset){
    matrix.forEach((row, y) =>{     //>>this is for drawing/filling in each space for the piece
        row.forEach((value, x)=> {
            if(value!== 0){     //>>only if the space is not zero
                context.fillStyle= 'red';       //## fills the block with color red
                context.fillRect(x + offset.x,
                                 y + offset.y,
                                  1, 1);   //## fills with one unit at the corresponding abcissa and ordinate
    
            }
        });
    });
}

const player ={
    pos: {x:5, y:5},
    matrix: matrix
}

drawMatrix(player.matrix, player.pos);