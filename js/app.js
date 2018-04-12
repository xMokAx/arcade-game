// keep track of the score
let score;
// keep track of level
let level;
// to keep track of the last used arrow key
let clickedKey;

// Enemies our player must avoid
// Variables applied to each of our instances go here,
class Enemy {
    constructor(x, y, speed) {
        this.loc = [x, y];
        this.speed = speed;
        // The image/sprite for our enemies, this uses
        // a helper we've provided to easily load images
        this.sprite = 'images/enemy-bug.png';
        this.hitBox = [50, 50];
    }
    // Update the enemy's position, required method for game
    // Parameter: dt, a time delta between ticks
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    update(dt) {
        this.loc[0] += (this.speed * dt);
        if (this.loc[0] > ctx.canvas.width) {
            this.loc[0] = -101;
        }
    }
    // Draw the enemy on the screen, required method for game
    render() {
        ctx.drawImage(Resources.get(this.sprite), this.loc[0], this.loc[1]);
    }
}

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
class Player {
    constructor(x, y, sprite) {
        this.loc = [x, y];
        this.sprite = sprite;
        this.hitBox = [50, 50];
    }

    update(dt) {
        //prevent the player from going out of the left of the game
        if (this.loc[0] < 0) {
            this.loc[0] += 101;
            //prevent the player from going out the right of the game
        } else if (this.loc[0] > ctx.canvas.width - 101) {
            this.loc[0] -= 101;
        }
        // when the player reaches the water at level one increase the score and
        // starts level two, at level two increase the score and restart the game
        if (this.loc[1] < 0) {
            score += 100;
            if (level === 1) {
                createlevelTwo();
                level = 2;
            } else if (level === 2) {
                score += 200;
                alert(`You Won with ${score} Score`);
                document.location.reload();
            }
            this.loc = [202, 392];
            ctx.canvas.width = ctx.canvas.width;
            // prevent the player from going out the bottom of the game
        } else if (this.loc[1] > 392) {
            this.loc[1] = 392;
        }
    }
    // draw the player on the screen
    render() {
        ctx.drawImage(Resources.get(this.sprite), this.loc[0], this.loc[1]);
    }
    // change player loc depending on which key was pressed
    handleInput(keys) {
        switch (keys) {
            case 'left':
                this.loc[0] -= 101;
                clickedKey = 'left';
                break;
            case 'right':
                this.loc[0] += 101;
                clickedKey = 'right';
                break;
            case 'up':
                this.loc[1] -= 83;
                clickedKey = 'up';
                break;
            case 'down':
                this.loc[1] += 83;
                clickedKey = 'down';
        }
    }
}
// gem class with only render method
class Gem {
    constructor(x, y, sprite) {
        this.loc = [x, y];
        this.sprite = sprite;
        this.hitBox = [50, 50];
    }
    render() {
        ctx.drawImage(Resources.get(this.sprite), this.loc[0], this.loc[1]);
    }
}
// rock class with only render method
class Rock {
    constructor(x, y) {
        this.loc = [x, y];
        this.sprite = 'images/rock.png';
        this.hitBox = [50, 50];
    }
    render() {
        ctx.drawImage(Resources.get(this.sprite), this.loc[0], this.loc[1]);
    }
}
// heart class with only render method
class Heart {
    constructor(x, y) {
        this.loc = [x, y];
        this.sprite = 'images/heart.png';
    }
    render() {
        ctx.drawImage(Resources.get(this.sprite), this.loc[0], this.loc[1]);
    }
}


// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
let allEnemies = [new Enemy(-101, 60, 400), new Enemy(-101, 143, 500), new Enemy(-101, 226, 350), new Enemy(-101, 309, 200)];

const player = new Player(202, 392, 'images/char-boy.png');

let gems = [new Gem(214.5, 81, 'images/gem-orange.png'), new Gem(416.5, 164, 'images/gem-green.png'), new Gem(113.5, 247, 'images/gem-blue.png')];

let hearts = [new Heart(430, 10), new Heart(455, 10), new Heart(480, 10)];

const rocks = [new Rock(202, 143)];

// this function will be called from the update function to handle player
// collision with other objects
function checkCollisions(objects) {
    for (let i = 0; i < objects.length; i++) {
        if (objects[i].loc[0] < player.loc[0] + player.hitBox[0] &&
            objects[i].loc[0] + objects[i].hitBox[0] > player.loc[0] &&
            objects[i].loc[1] < player.loc[1] + player.hitBox[1] &&
            objects[i].hitBox[1] + objects[i].loc[1] > player.loc[1]) {
            switch (objects) {
                // if the object is a rock check value of clicked key and move the player
                // back to his previous location (the rock is impassable)
                case rocks:
                    switch (clickedKey) {
                        case 'left':
                            player.loc[0] += 101;
                            break;
                        case 'right':
                            player.loc[0] -= 101;
                            break;
                        case 'up':
                            player.loc[1] += 83;
                            break;
                        case 'down':
                            player.loc[1] -= 83;
                    }
                    break;
                    // if the object is an enemy reduce the score by 50, move the player back
                    // to the starting location and decrement the number of hearts he has by 1
                    // if the player has no hearts the game is over and restarted
                case allEnemies:
                    player.loc = [202, 392];
                    score -= 50;
                    if (score < 0) {
                        score = 0;
                    }
                    hearts.splice(0, 1);
                    if (hearts.length === 0) {
                        alert("Game Over");
                        document.location.reload();
                    }
                    ctx.canvas.width = ctx.canvas.width;
                    break;
                case gems:
                    gems.splice(i, 1);
                    score += 50;
                    ctx.canvas.width = ctx.canvas.width;
            }
        }
    }
}
// create level two objects
function createlevelTwo() {
    rocks.push(new Rock(404, 226));
    gems = [new Gem(517.5, 81, 'images/gem-orange.png'), new Gem(416.5, 330, 'images/gem-green.png'), new Gem(213.5, 247, 'images/gem-blue.png'), new Gem(12.5, 164, 'images/gem-orange.png')];
    allEnemies.push(new Enemy(-101, 60, 250), new Enemy(-101, 143, 350), new Enemy(-101, 226, 400), new Enemy(-101, 309, 300));
}

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function (e) {
    let allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };
    player.handleInput(allowedKeys[e.keyCode]);
});

const controller = document.querySelector('.controller')
// listenes for clicks on the controller buttons and sends the
// keys player.handlInput() method
controller.addEventListener('click', (e) => {
    if (e.target.nodeName === 'BUTTON') {
        switch (e.target.id) {
            case 'up':
                player.handleInput('up');
                break;
            case 'right':
                player.handleInput('right');
                break;
            case 'down':
                player.handleInput('down');
                break;
            case 'left':
                player.handleInput('left');
        }
    }
});

const avatarList = document.querySelector('.avatar-list');;
//check if the clicked item is image if true assign player sprite to its source attribute
avatarList.addEventListener('click', (e) => {
    if (e.target.nodeName === 'IMG') {
        player.sprite = e.target.getAttribute('src');
        for (img of avatarList.children) {
            img.classList.remove('selected');
        }
        e.target.classList.add('selected');
    }
});