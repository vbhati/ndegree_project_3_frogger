// Enemies our player must avoid
var Enemy = function(x,y,z) {
    // Variables applied to each of our instances go here,
    this.x = x;
    this.y = y;
    this.speed = z;
    this.sprite = 'images/enemy-bug.png';
}

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // Multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    if(this.x > 510) {
        this.x = start;
    } else {
        this.x = (this.x) + dt*(this.speed);
    }
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Check if there is any collision between enemy and player
// If yes reset player to start.
Enemy.prototype.checkCollisions = function() {
    var xStart = player.x - 60;
    if(this.y == player.y && (this.x > xStart && this.x < player.x)) {
        player.x = 200;
        player.y = 400
    }
};

// Player that will fight enemies
var Player = function(x,y) {
    this.x = x;
    this.y = y;
}

// Update the player's position
Player.prototype.update = function() {
    this.x = this.x;
    this.y = this.y;
}


// Draw the player on the screen, required method for game
Player.prototype.render = function(imageUrl) {
    ctx.drawImage(Resources.get(imageUrl), this.x, this.y);
}


// It receives user input "keypress" value and moves the player
// according to that input.
Player.prototype.handleInput = function(code) {
    if(!gameInProgress) {
        gameInProgress = true;
    }
    if(code === "up" && this.y !== 72) {
        this.x = this.x;
        this.y = this.y - 82;
    } else if(code === "down" && this.y !== 400) {
        this.x = this.x;
        this.y = this.y + 82;
    } else if(code === "left" && this.x !== 0) {
        this.x = this.x - 100;
        this.y = this.y;
    } else if(code === "right" && this.x !== 400) {
        this.x = this.x + 100;
        this.y = this.y;
    }
    player.checkWinner();
}

//Check if the player has reached water and won
Player.prototype.checkWinner = function() {
    if(player.y == 72) {
        setTimeout(function() {
            //Display message
            ctx.font = "20pt Impact";
            ctx.textAlign = "center";
            ctx.fillStyle = "black";
            ctx.fillText('KEEP PLAYING',250,100);
            //Update player coordinates.
            setTimeout(function() {
                player.x = 200;
                player.y = 400;
            }, 500);
        }, 1000);
    }
}

// Now instantiate your objects.
var start = -80;
var enemy1 = new Enemy(-25,154,170);
var enemy2 = new Enemy(-50,236,190);
var enemy3 = new Enemy(0,318,130);
var enemy4 = new Enemy(-10,236,50);
var enemy5 = new Enemy(-30,154,100);
// Place all enemy objects in an array called allEnemies
var allEnemies = [enemy1,enemy2,enemy3,enemy4,enemy5];
// Place the player object in a variable called player
var player = new Player(200, 400);
var gameInProgress = false;


// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

   player.handleInput(allowedKeys[e.keyCode]);
});




