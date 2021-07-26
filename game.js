(() => {
    
    const canvas = document.getElementById("canvas1");
    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = false;

    const canvas2 = document.createElement("canvas");
    canvas2.width = 960;
    canvas2.height = 960;
    const ctx2 = canvas2.getContext('2d');
    ctx2.imageSmoothingEnabled = false;

    let currentTime;
    let lastTime = 0;
    let delta = 0;
    const keyDown = {};
    let loaded = 0;

    let direction = "down";
    let lives = 3;

    let mapX = 0;
    let mapY = 0;

    let vDirection =  {
        x: 0,
        y: 0,
    };



    const sword = new Image();
    sword.src = 'sword.png';

    const heart = new Image();
    heart.src = 'heart.png';
    

    const grass1 = new Image();
    grass1.src = 'grass-test.png';

    const grass2 = new Image();
    grass2.src = 'grass-test2.png';

    const grass3 = new Image();
    grass3.src = 'grass-test3.png';

    const grass = [grass1, grass2, grass3];

    grass1.onload = () => {
        loaded++;
    };

    grass2.onload = () => {
        loaded++;
    };

    grass3.onload = () => {
        loaded++;
    };

    const map = [
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    ];

    for (let row = 0; row < map.length; row++) {
        for (let column = 0; column < map[0].length; column++) {
            map[row][column] = Math.floor(Math.random() * grass.length);
        }
    }

    function drawMap(ctx) {
        for (let row = 0; row < map.length; row++) {
            for (let column = 0; column < map[0].length; column++) {
                ctx.drawImage(
                    grass[map[row][column]],
                    0,
                    0,
                    16,
                    16,
                    64 * column + mapX,
                    64 * row + mapY,
                    64,
                    64
                );
                //ctx.strokeRect(256 *column, 256 * row, 256, 256) 
            } 
        }
    }

    let length;
    function unitVector(v) {
        length = Math.sqrt(v.x * v.x + v.y * v.y);
        var v1 = {x: 0, y: 0};
        if (length) {
            v1.x = v.x / length;
            v1.y = v.y / length;
        }
        
        return v1;
    }

    const enemyAnim = new SpriteAnimation({
        sprite: 'enemy1.png',
        frameWidth: 32,
        frameHeight: 32,
        ctx: ctx,
        x: 120,
        y: 100,
        direction: 'walkingDown',
        width: 96,
        height: 96,
    });

    enemyAnim.setPlay('walkingDown', [
        {x: 0, y: 0, duration: 160},
        {x: 32, y: 0, duration: 160},
        {x: 64, y: 0, duration: 160},
        {x: 0, y: 0, duration: 160},
    ]);

    enemyAnim.setPlay('walkingUp', [
        {x: 0, y: 32, duration: 160},
        {x: 32, y: 32, duration: 160},
        {x: 64, y: 32, duration: 160},
        {x: 0, y: 32, duration: 160},
    ]);

    enemyAnim.setPlay('walkingLeft', [
        {x: 0, y: 64, duration: 160},
        {x: 32, y: 64, duration: 160},
        {x: 64, y: 64, duration: 160},
        {x: 0, y: 64, duration: 160},
    ]);

    enemyAnim.setPlay('walkingRight', [
        {x: 0, y: 96, duration: 160},
        {x: 32, y: 96, duration: 160},
        {x: 64, y: 96, duration: 160},
        {x: 0, y: 96, duration: 160},
    ]);

    enemyAnim.setPlay('down-idle', [
        {x: 32, y: 0, duration: 160},
    ]);
    enemyAnim.setPlay('up-idle', [
        {x: 32, y: 32, duration: 160},
    ]);

    enemyAnim.setPlay('left-idle', [
        {x: 32, y: 64, duration: 160},
    ]);
    enemyAnim.setPlay('right-idle', [
        {x: 32, y: 96, duration: 160},
    ]);
    enemyAnim.options.direction = 'down-idle';

    const playerAnim = new SpriteAnimation({
        sprite: 'newplayer.png',
        frameWidth: 64,
        frameHeight: 64,
        ctx: ctx,
        x: (640 / 2 - 32),
        y: (640 / 2 - 32),
        direction: 'walkingDown',
        width: 128,
        height: 128,
    });
    

    playerAnim.setPlay('walkingDown', [
        {x: 0, y: 0, duration: 160},
        {x: 64, y: 0, duration: 160},
        {x: 128, y: 0, duration: 160},
        {x: 0, y: 0, duration: 160},
    ]);

    playerAnim.setPlay('walkingUp', [
        {x: 0, y: 64, duration: 160},
        {x: 64, y: 64, duration: 160},
        {x: 128, y: 64, duration: 160},
        {x: 0, y: 64, duration: 160},
    ]);

    playerAnim.setPlay('walkingLeft', [
        {x: 0, y: 128, duration: 160},
        {x: 64, y: 128, duration: 160},
        {x: 128, y: 128, duration: 160},
        {x: 0, y: 128, duration: 160},
    ]);

    playerAnim.setPlay('walkingRight', [
        {x: 0, y: 192, duration: 160},
        {x: 64, y: 192, duration: 160},
        {x: 128, y: 192, duration: 160},
        {x: 0, y: 192, duration: 160},
    ]);

    playerAnim.setPlay('down-idle', [
        {x: 64, y: 0, duration: 160},
    ]);
    playerAnim.setPlay('up-idle', [
        {x: 64, y: 64, duration: 160},
    ]);

    playerAnim.setPlay('left-idle', [
        {x: 64, y: 128, duration: 160},
    ]);
    playerAnim.setPlay('right-idle', [
        {x: 64, y: 192, duration: 160},
    ]);

    playerAnim.options.direction = 'left-idle';

    document.addEventListener('keydown',  (e) => {
        keyDown[e.keyCode] = true;
    });
    
    document.addEventListener('keyup', (e) => {
        keyDown[e.keyCode] = false;
    });

    function loop() {
        ctx.clearRect(0, 0, 640, 480);
        requestAnimationFrame(loop);

        if (!currentTime) {
            currentTime = performance.now();
        } else {
            delta = currentTime - lastTime;
        }

        drawMap(ctx);

        if (mapX <= -320) {
            mapX = -320;
        }

        if (mapX >= 0 ) {
            mapX = 0;
        }

        if (mapY <= -320) {
            mapY = -320;
        }

        if (mapY >= 0 ) {
            mapY = 0;
        }

        vDirection.x = playerAnim.options.x - enemyAnim.options.x;
        vDirection.y = playerAnim.options.y - enemyAnim.options.y;
        vDirection = unitVector(vDirection);

        if (length < 200) {
            enemyAnim.options.x += (0.1 * delta) * vDirection.x;
            enemyAnim.options.y += (0.1 * delta) * vDirection.y;

            enemyAnim.play("walkingDown", delta, ctx);

        } else {
            enemyAnim.play("down-idle", delta, ctx);
        }

        

    

        
        for (let i = 0; i < lives; i ++) {
            ctx.drawImage(heart, i * 32, 0, 32, 32);
        }

        if (keyDown[32]) {
            if (direction == "down") {
                ctx.drawImage(sword, 48, 0, 16, 16, playerAnim.options.x + 16, playerAnim.options.y + 64 + 25, 64, 64);
            }
            if (direction == "up") {
                ctx.drawImage(sword, 32, 0, 16, 16, playerAnim.options.x + 16, playerAnim.options.y - 48, 64, 64);
            }

            if (direction == "left") {
                ctx.drawImage(sword, 16, 0, 16, 16, playerAnim.options.x - 32, playerAnim.options.y + 32, 64, 64);
            }

            if (direction == "right") {
                ctx.drawImage(sword, 0, 0, 16, 16, playerAnim.options.x + 64, playerAnim.options.y + 32, 64, 64);
            }
        }
        
        if (keyDown[40]) {
            if (mapY <= -320 || (mapY >= -320 && playerAnim.options.y < (640 / 2 -32))) {
                playerAnim.options.y += 0.1 * delta;
            } else {
                mapY -= 0.2 * delta;
                
                if (length < 200) {
                    enemyAnim.options.y -= 0.1 * delta;
                } else {
                    enemyAnim.options.y -= 0.2 * delta;
                }
               
            }
           
            
            playerAnim.play('walkingDown', delta, ctx);
            playerAnim.options.direction = 'down-idle';
            direction = "down";
        } else if (keyDown[38]) {
            if (mapY >= 0 || (mapY <= 0 && playerAnim.options.y > (640 / 2 -32))) {
                playerAnim.options.y -= 0.2 * delta;
            } else {
                mapY += 0.2 * delta;
                if (length < 200) {
                    enemyAnim.options.y += 0.1 * delta;
                }  else {
                    enemyAnim.options.y += 0.2 * delta;
                }
               
            }
            
            
            playerAnim.play('walkingUp', delta, ctx);
            playerAnim.options.direction = 'up-idle';
            direction = "up";
        } else if (keyDown[37]) {
            if (mapX >= 0 || (mapX <= 0 && playerAnim.options.x > (640 / 2 -32))) {
                playerAnim.options.x -= 0.2 * delta;
            } else {
                mapX += 0.2 * delta;
                if (length < 200) {
                    enemyAnim.options.x += 0.1 * delta;
                } else {
                    enemyAnim.options.x += 0.2 * delta;
                }
            }
            playerAnim.play('walkingLeft', delta, ctx);
            playerAnim.options.direction = 'left-idle';
            direction = "left"
        } else if (keyDown[39]) {
            if (mapX <= -320 || (mapX >= -320 && playerAnim.options.x < (640 / 2 -32))) {
                playerAnim.options.x += 0.2 * delta;
            } else {
                mapX -= 0.2 * delta;
                if (length < 200) {
                    enemyAnim.options.x -= 0.1 * delta;
                } else {
                    enemyAnim.options.x -= 0.2 * delta;
                }
            }
            playerAnim.play('walkingRight', delta, ctx);
            playerAnim.options.direction = 'right-idle';
            direction = "right";
        } else {
            playerAnim.play(playerAnim.options.direction, delta, ctx);
        }

        lastTime = currentTime;
        currentTime = performance.now();
    }

    loop();
})();