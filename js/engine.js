/* Engine.js
 * This file provides the game loop functionality (update entities and render),
 * draws the initial game board on the screen, and then calls the update and
 * render methods on player and enemy objects (defined in app.js).
 *
 * A game engine works by drawing the entire game screen over and over, kind of
 * like a flipbook you may have created as a kid. When player moves across
 * the screen, it may look like just that image/character is moving or being
 * drawn but that is not the case. What's really happening is the entire "scene"
 * is being drawn over and over, presenting the illusion of animation.
 *
 * This engine is available globally via the Engine variable and it also makes
 * the canvas' context (ctx) object globally available to make writing app.js
 * a little simpler to work with.
 */

var Engine = (function(global) {
    /* Predefine the variables we'll be using within this scope,
     * create the canvas element, grab the 2D context for that canvas
     * set the canvas elements height/width and add it to the DOM.
     */
    var doc = global.document,
        win = global.window,
        canvas = doc.createElement('canvas'),
        ctx = canvas.getContext('2d'),
        lastTime;

    var imageUrl = null;
    var playerText, playerImageArr, lifeCountArr;

    canvas.width = 505;
    canvas.height = 623;
    doc.body.appendChild(canvas);

    /* This function serves as the kickoff point for the game loop itself
     * and handles properly calling the update and render methods.
     */
    function main() {
        /* Get our time delta information which is required if game
         * requires smooth animation. Because everyone's computer processes
         * instructions at different speeds we need a constant value that
         * would be the same for everyone (regardless of how fast their
         * computer is) - hurray time!
         */
        var now = Date.now(),
            dt = (now - lastTime) / 1000.0;


        /* Check if game is over.
         * If yes : update menu, display message "GAME OVER"
         * and reset game.
         */
        if(lifeCount === 0) {
            // Draw menu background again to remove existing content from
            // menu bar
            for (col = 0; col <= 4; col++) {
                ctx.drawImage(Resources.get('images/score-board.png'), col * 101, 0);
            }
            ctx.font = "bold 12pt Arial";
            ctx.textAlign = "center";
            ctx.fillStyle = "black";
            ctx.fillText('GAME OVER',70,80);
            // Set imageUrl to null which will remove player from start location
            imageUrl = null;
            // call reset function to reset game after two secons of Game over.
            setTimeout(function() {
                reset();
            }, 1000);

        }

        /* Call update/render functions, pass along the time delta to
         * update function since it may be used for smooth animation.
         */
        update(dt);
        render();

        /* Set lastTime variable which is used to determine the time delta
         * for the next time this function is called.
         */
        lastTime = now;

        /* Use the browser's requestAnimationFrame function to call this
         * function again as soon as the browser is able to draw another frame.
         */
        win.requestAnimationFrame(main);
    }

    /* This function does some initial setup that should only occur once,
     * particularly setting the lastTime variable that is required for the
     * game loop.
     */
    function init() {
        reset();
        lastTime = Date.now();
        main();
    }

    /* This function is called by main (game loop) and itself calls all
     * of the functions which may need to update entity's data.
     */
    function update(dt) {
        updateEntities(dt);
        checkCollisions();
    }

    /* This is called by the update function and loops through all of the
     * objects within allEnemies array as defined in app.js and calls
     * their update() methods. It will then call the update function for
     * player object.
     */
    function updateEntities(dt) {
        allEnemies.forEach(function(enemy) {
            enemy.update(dt);
        });
        player.update();
    }

    /* This is called by the update function. It checks for any collinsions
     * between player and enemy. It also updates the menu based on player's remaining
     * life left.
     */
    function checkCollisions() {
        allEnemies.forEach(function(enemy) {
            enemy.checkCollisions();
        });
        // Update life counts on menu bar. First draw the last block again
        // Then add new values to that block.
        ctx.font = "bold  12pt Arial";
        if(lifeCount == 2) {
            ctx.drawImage(Resources.get('images/score-board.png'), 404, 0);
            ctx.fillText('CHANCES',453,80);
            ctx.drawImage(Resources.get('images/life-icon.png'), 470, 90);
        } else if(lifeCount == 1) {
            ctx.drawImage(Resources.get('images/score-board.png'), 404, 0);
            ctx.fillText('CHANCES',453,80);
        }
    }
    /* This function initially draws the "game level", it then calls
     * the renderEntities function. This function is called every
     * game tick (or loop of the game engine) because that's how games work -
     * they are flipbooks creating the illusion of animation but in reality
     * they are just drawing the entire screen over and over.
     */
    function render() {
        /* This array holds the relative URL to the image used
         * for that particular row of the game level.
         */
        var rowImages = [
                'images/score-board.png',
                'images/water-block.png',   // Top row is water
                'images/stone-block.png',   // Row 1 of 3 of stone
                'images/stone-block.png',   // Row 2 of 3 of stone
                'images/stone-block.png',   // Row 3 of 3 of stone
                'images/grass-block.png',   // Row 1 of 2 of grass
                'images/grass-block.png'
            ],
            numRows = 7,
            numCols = 5,
            row, col;

        /* Loop through the number of rows and columns defined above
         * and, using the rowImages array, draw the correct image for that
         * portion of the "grid"
         */
        for (row = 1; row < numRows; row++) {
            for (col = 0; col < numCols; col++) {
                /* The drawImage function of the canvas' context element
                 * requires 3 parameters: the image to draw, the x coordinate
                 * to start drawing and the y coordinate to start drawing.
                 * We're using Resources helpers to refer to images to
                 * get the benefits of caching these images, since
                 * we're using them over and over.
                 */
                ctx.drawImage(Resources.get(rowImages[row]), col * 101, row * 82);
            }
        }

        renderEntities();
    }

    /* This function is called by the render function and is called on each game
     * tick. It's purpose is to then call the render functions defined
     * on enemy and player entities within app.js
     */
    function renderEntities() {
        /* Loop through all of the objects within the allEnemies array and call
         * the render function.
         */
        allEnemies.forEach(function(enemy) {
            enemy.render();
        });

        /* Add an event listener to the canvas element to listen for click events.
         * On start of game, user can select player displayed on canvas. Selection
         * is handled using canvas click event.
         */
        canvas.addEventListener("click", checkCanvasClickPosition, false);

        // Render player only if user has selected player in this case if imageUrl has value.
        if(imageUrl !== null) {
            player.render(imageUrl);
        }

        /* To update score on each tick and display on canvas menu.
         */
        ctx.drawImage(Resources.get('images/gap-filler.jpg'), 202, 50);

        ctx.font = "bold  24pt Arial";
        ctx.textAlign = "center";
        ctx.fillStyle = "#4A4A4A";
        ctx.fillText("FROGGER",248,40);

        ctx.font = "bold  12pt Arial";
        ctx.textAlign = "center";
        ctx.fillStyle = "black";
        ctx.fillText('SCORE',250,80);

        ctx.font = "bold  14pt Arial";
        ctx.fillText(score,250,125);
    }

    /* checkCanvasClickPosition(e) function gets called when user clicks anywhere within the canvas.
     * It's argument is a MouseEvent object that contains information about where user clicked.
     */
    function checkCanvasClickPosition(e) {

        // Initialize values of player images and life count.
        playerText = null;
        playerImageArr = {
            "imageDetails" : []
        };

        lifeCountArr = {
            "counts" : [
            {
                "xCordinate" : "440",
                "yCordinate" : "90"
            },
            {
                "xCordinate" : "470",
                "yCordinate" : "90"
            }
        ]};

        /* Check which player user has selected and store the value in
         * imageUrl variable to be used to display player on screen.
         */
        if(!gameInProgress) {
            var iconX,iconY;
            if (e.pageX !== undefined && e.pageY !== undefined) {
                iconX = e.pageX;
                iconY = e.pageY;

                 //iconX and iconY coordinates has values that are
                //relative to the document (that is, the entire HTML page).
                //Code below calculates coordinates relative to the canvas.
                iconX -= canvas.offsetLeft;
                iconY -= canvas.offsetTop;

                if(iconX >= 19 && iconX <= 50 && iconY >= 36 && iconY <= 128) {
                    imageUrl = 'images/char-boy.png';
                } else if(iconX >= 60 && iconX <= 92 && iconY >= 36 && iconY <= 128) {
                    imageUrl = 'images/char-pink-girl.png';
                }

                // Render player
                player.render(imageUrl);
                // draw the menu by removing player icons and updating remaining life icons.
                drawMenu(playerText, playerImageArr,lifeCountArr);
            }
        }
    }

    /* This function is used to set initial values of game elements.
     * It's only called once by the init() method.
     */
    function reset() {
        // resetting values
        score = 0;
        lifeCount = 3;
        gameInProgress = false;
        playerText = 'SELECT PLAYER';
        playerImageArr = {
            "imageDetails" : [
                {
                    "image" : "images/char-boy-icon.png",
                    "xCordinate" : "10",
                    "yCordinate" : "60"
                },
                {
                    "image" : "images/char-pink-girl-icon.png",
                    "xCordinate" : "50",
                    "yCordinate" : "60"
                }
        ]};

        lifeCountArr = {
            "counts" : [
                {
                    "xCordinate" : "410",
                    "yCordinate" : "90"
                },
                {
                    "xCordinate" : "440",
                    "yCordinate" : "90"
                },
                {
                    "xCordinate" : "470",
                    "yCordinate" : "90"
                }
        ]};

        // Draw the menu by removing player icons and updating remaining life icons.
        drawMenu(playerText, playerImageArr,lifeCountArr);
    }

    /* This function is called from reset function when the game starts and by checkCanvasClickPosition
     * function to draw menu once user has selected player
     */
    function drawMenu(playerText, playerImageArr,lifeCountArr) {
        // Draw menu background i.e. first row on canvas
        for (col = 0; col <= 4; col++) {
            ctx.drawImage(Resources.get('images/score-board.png'), col * 101, 0);
        }

        ctx.font = "bold  12pt Arial";
        ctx.textAlign = "center";
        ctx.fillStyle = "black";

        // Put "Select Player" text on menu if playerText variable is not null
        if(playerText !== null) {
            ctx.fillText(playerText,70,80);
        } else {
            ctx.fillText("MOVE PLAYER",83,80);
            ctx.fillText("USING ARROW KEYS",86,102);
        }

        // Display "Life Left" text on menu
        ctx.fillText('CHANCES',453,80);

        // Display "Score" on menu
        ctx.fillText('SCORE',250,80);
        ctx.fillText(score,250,125);

        /* Put player icons on menu bar, in future more player icons can be added since
         * we are using JSON object to hold image url and coordinates
         */
        if(playerImageArr.imageDetails.length > 0) {
            for(var i = 0 ; i < playerImageArr.imageDetails.length ; i++) {
                ctx.drawImage(Resources.get(playerImageArr.imageDetails[i].image), playerImageArr.imageDetails[i].xCordinate , playerImageArr.imageDetails[i].yCordinate);
            }
        }

        // Put life icons on menu, more life icons can be added if require through JSON
        if(lifeCountArr.counts.length > 0) {
            for(var i = 0 ; i < lifeCountArr.counts.length ; i++) {
                ctx.drawImage(Resources.get('images/life-icon.png'), lifeCountArr.counts[i].xCordinate , lifeCountArr.counts[i].yCordinate);
            }
        }
    }

    /* Go ahead and load all of the images we know we're going to need to
     * draw our game level. Then set init as the callback method, so that when
     * all of these images are properly loaded our game will start.
     */
    Resources.load([
        'images/stone-block.png',
        'images/water-block.png',
        'images/grass-block.png',
        'images/enemy-bug.png',
        'images/char-boy.png',
        'images/char-pink-girl.png',
        'images/score-board.png',
        'images/char-pink-girl-icon.png',
        'images/char-boy-icon.png',
        'images/life-icon.png',
        'images/gap-filler.jpg'
    ]);
    Resources.onReady(init);

    /* Assign the canvas' context object to the global variable (the window
     * object when run in a browser) so that developer's can use it more easily
     * from within their app.js files.
     */
    global.ctx = ctx;
})(this);
