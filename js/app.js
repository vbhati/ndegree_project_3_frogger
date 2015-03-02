// Enemies our player must avoid
var Enemy = function(x,y,z) {
    // Variables applied to each of our instances go here,
    this.x = x;
    this.y = y;
    this.speed = z;

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
}

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
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
Enemy.prototype.checkCollisions = function(){
  /*  var thisX = parseInt(this.x);
    var thisY = parseInt(this.y) + 9;
    if(player.y - thisY <= 10 )
        console.log("HEllo World");
// console.log( "thisX Difference                           : " + (thisX));
  //  console.log( "playerX                          : " + player.x);
//console.log( "thisY Difference                           : " + (thisY);

    if(player.x - parseInt(this.x) < 20) {
        player.x = 200;
        player.y = 400;
    }*/
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function(x,y) {
    // Variables applied to each of our instances go here,
    this.x = x;
    this.y = y;

    // The image/sprite for our player, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/char-boy.png';
}

// Update the player's position
Player.prototype.update = function() {
    this.x = this.x;
    this.y = this.y;
}

// Draw the player on the screen, required method for game
Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}


// It receives user input "keypress" value and moves the player
// according to that input.
Player.prototype.handleInput = function(code) {
    if(code === "up" && this.y !== -10) {
        this.x = this.x;
        this.y = this.y - 82;
        console.log("this.y :  " + this.y);
    } else if(code === "down" && this.y !== 400) {
        this.x = this.x;
        this.y = this.y + 82;
        console.log("this.y :  " + this.y);
    } else if(code === "left" && this.x !== 0) {
        this.x = this.x - 100;
        this.y = this.y;
    } else if(code === "right" && this.x !== 400) {
        this.x = this.x + 100;
        this.y = this.y;
    }
}

// Now instantiate your objects.
var start = -80;
var enemy1 = new Enemy(start,63,60);
var enemy2 = new Enemy(start,145,150);
var enemy3 = new Enemy(start,230,100);

//var enemy1 = new Enemy(start,60,60);
//var enemy2 = new Enemy(start,145,150);
//var enemy3 = new Enemy(start,230,100);
//var enemy4 = new Enemy(start,60,150);
//var enemy5 = new Enemy(start,145,120);
//var enemy6 = new Enemy(start,230,100);
// Place all enemy objects in an array called allEnemies
var allEnemies = [enemy1,enemy2];//enemy3,enemy4,enemy5,enemy6];
// Place the player object in a variable called player
var player = new Player(200, 400);


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
