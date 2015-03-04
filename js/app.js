// Enemies player must avoid
// Parameter : x cordinate, y cordinate and enemy's speed
var Enemy = function(x,y,z) {
    this.x = x;
    this.y = y;
    this.speed = z;
    this.sprite = 'images/enemy-bug.png';
};

// Update the enemy's position
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    /* Multiply any movement by the dt parameter which will
     * ensure the game runs at the same speed for all computers.
     */
    if(this.x > 510) {
        this.x = start;
    } else {
        this.x = (this.x) + dt*(this.speed);
    }
};

// Draw enemy on the screen
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Check if there is any collision between enemy and player
// If yes reset player to start and update life count and score.
Enemy.prototype.checkCollisions = function() {
    var xStart = player.x - 60;
    if(this.y == player.y && (this.x > xStart && this.x < player.x)) {
        player.x = 200;
        player.y = 400;
        if(lifeCount > 0) {
            lifeCount--;
            if(score !== 0 ) {
                score = score - 100;
            }
        }
    }
};

// Player that will fight enemies
// Parameters: x and y coordinates
var Player = function(x,y) {
    this.x = x;
    this.y = y;
};

// Update the player's position
Player.prototype.update = function() {
    this.x = this.x;
    this.y = this.y;
};

// Draw the player on screen
// Parameters : player's image which user has chosen
Player.prototype.render = function(imageUrl) {
    ctx.drawImage(Resources.get(imageUrl), this.x, this.y);
};

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
};

// Check if the player has made it to water
Player.prototype.checkWinner = function() {
    if(player.y == 72) {
        // Setting time delay before moving player
        // back to start position
        setTimeout(function() {
            player.x = 200;
            player.y = 400;
            score = score + 100;
        }, 1000);
    }
};

// Instantiate enemy objects.
var start = -80;
var enemy1 = new Enemy(-25,154,170);
var enemy2 = new Enemy(-50,236,190);
var enemy3 = new Enemy(0,318,130);
var enemy4 = new Enemy(-10,236,50);
var enemy5 = new Enemy(-30,154,100);

// Place all enemy objects in an array
var allEnemies = [enemy1,enemy2,enemy3,enemy4,enemy5];

// Instantiate player object
var player = new Player(200, 400);

// flag to check if game has started or not
var gameInProgress = false;

// Keep track of Player's Score
var score = 0;

// Keep count of player's life left
var lifeCount = 3;

// This listens for key presses and sends the keys to
// Player.handleInput() method.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

   player.handleInput(allowedKeys[e.keyCode]);
});




