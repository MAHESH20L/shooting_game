const config = {

    type: Phaser.AUTO,

    width: window.innerWidth,

    height: window.innerHeight,

    backgroundColor: '#101820',

    scale: {

        mode: Phaser.Scale.RESIZE,

        autoCenter: Phaser.Scale.CENTER_BOTH

    },

    scene: {
        create: create
    }

};

const game = new Phaser.Game(config);

let score = 0;

let timeLeft = 60;

let gameOver = false;

let isPaused = false;

let timerEvent;

let target;

let scoreText;

let timerText;

let resultText;

let yesButton;

let exitButton;

let pauseButton;

function create() {

    const width = window.innerWidth;

    const height = window.innerHeight;

    const isMobile = width < 768;

    const safeTop = isMobile ? 80 : 20;

    const safeBottom = isMobile ? 140 : 80;

    // Responsive Sizes

    const titleSize = isMobile ? '22px' : '40px';

    const textSize = isMobile ? '15px' : '26px';

    const scoreSize = isMobile ? '18px' : '28px';

    const buttonSize = isMobile ? '16px' : '22px';

    const resultSize = isMobile ? '24px' : '42px';

    // Background

    this.add.rectangle(

        width / 2,

        height / 2,

        width,

        height,

        0x101820

    );

    // Decorative Background

    for(let i = 0; i < 120; i++){

        this.add.circle(

            Phaser.Math.Between(0,width),

            Phaser.Math.Between(0,height),

            Phaser.Math.Between(1,3),

            0x223344

        );

    }

    // Title

    this.add.text(

        width / 2,

        safeTop,

        'TARGET SHOOTING GAME',

        {

            fontSize:titleSize,

            fill:'#00ff99',

            fontStyle:'bold'

        }

    ).setOrigin(0.5);

    // Disclaimer

    this.add.text(

        width / 2,

        safeTop + 40,

        'Shoot only the RED DOT target',

        {

            fontSize:textSize,

            fill:'#ffffff'

        }

    ).setOrigin(0.5);

    // Score

    scoreText = this.add.text(

        15,

        safeTop + 80,

        'Score: 0',

        {

            fontSize:scoreSize,

            fill:'#ffffff'

        }

    );

    // Timer

    timerText = this.add.text(

        width - 270,

        safeTop + 80,

        'Time: 60',

        {

            fontSize:scoreSize,

            fill:'#ffffff'

        }

    );

    // Pause Button

    pauseButton = this.add.text(

        width - 150,

        safeTop + 75,

        'PAUSE',

        {

            fontSize:buttonSize,

            backgroundColor:'#ffaa00',

            padding:{
                x:12,
                y:8
            },

            fill:'#000000'

        }

    )

    .setInteractive()

    .on('pointerdown', () => {

        togglePause();

    });

    // Exit Button

    exitButton = this.add.text(

        width - 70,

        safeTop + 75,

        'EXIT',

        {

            fontSize:buttonSize,

            backgroundColor:'#aa0000',

            padding:{
                x:12,
                y:8
            },

            fill:'#ffffff'

        }

    )

    .setInteractive()

    .on('pointerdown', () => {

        // Return previous page

        if(window.history.length > 1){

            history.back();

        }

        else{

            window.location.href = 'about:blank';

        }

    });

    // Target Size

    const targetRadius = isMobile ? 28 : 40;

    // Red Dot

    target = this.add.circle(

        width / 2,

        height / 2,

        targetRadius,

        0xff0000

    );

    // Desktop Crosshair

    if(!isMobile){

        const graphics = this.add.graphics();

        graphics.lineStyle(2, 0xffffff);

        graphics.strokeCircle(0,0,15);

        graphics.lineBetween(-20,0,20,0);

        graphics.lineBetween(0,-20,0,20);

        const crosshair = this.add.container(0,0,[graphics]);

        this.input.on('pointermove', pointer => {

            crosshair.x = pointer.x;

            crosshair.y = pointer.y;

        });

    }

    // Shooting

    this.input.on('pointerdown', pointer => {

        if(gameOver || isPaused) return;

        shoot(pointer, this);

    });

    // Resize

    window.addEventListener('resize', () => {

        game.scale.resize(

            window.innerWidth,

            window.innerHeight

        );

    });

    // Start

    moveTarget();

    startTimer(this);

}

function togglePause(){

    if(gameOver) return;

    isPaused = !isPaused;

    // Pause

    if(isPaused){

        timerEvent.paused = true;

        pauseButton.setText('RESUME');

        target.setVisible(false);

    }

    // Resume

    else{

        timerEvent.paused = false;

        pauseButton.setText('PAUSE');

        target.setVisible(true);

    }

}

function shoot(pointer, scene){

    const distance = Phaser.Math.Distance.Between(

        pointer.x,
        pointer.y,
        target.x,
        target.y

    );

    // HIT

    if(distance < target.radius + 10){

        score += 10;

        scoreText.setText(
            'Score: ' + score
        );

        // Flash Effect

        target.setFillStyle(0x00ff00);

        scene.time.delayedCall(100, () => {

            target.setFillStyle(0xff0000);

        });

        moveTarget();

    }

    // MISS

    else{

        score -= 2;

        if(score < 0){

            score = 0;

        }

        scoreText.setText(
            'Score: ' + score
        );

    }

}

function moveTarget(){

    const width = window.innerWidth;

    const height = window.innerHeight;

    const isMobile = width < 768;

    const safeTop = isMobile ? 180 : 140;

    const safeBottom = isMobile ? 140 : 80;

    const radius = target.radius;

    target.x = Phaser.Math.Between(

        radius + 20,

        width - radius - 20

    );

    target.y = Phaser.Math.Between(

        safeTop,

        height - safeBottom

    );

}

function startTimer(scene){

    timerEvent = scene.time.addEvent({

        delay:1000,

        callback: () => {

            if(gameOver || isPaused) return;

            timeLeft--;

            timerText.setText(
                'Time: ' + timeLeft
            );

            if(timeLeft <= 0){

                endGame(scene);

            }

        },

        loop:true

    });

}

function endGame(scene){

    gameOver = true;

    target.setVisible(false);

    pauseButton.setVisible(false);

    const width = window.innerWidth;

    const height = window.innerHeight;

    const isMobile = width < 768;

    const resultSize = isMobile ? '24px' : '42px';

    const buttonSize = isMobile ? '22px' : '36px';

    // Result Text

    resultText = scene.add.text(

        width / 2,

        height * 0.35,

        'TIME OVER\n\n' +

        'Final Score: ' + score +

        '\n\nPlay Again?',

        {

            fontSize:resultSize,

            fill:'#00ff99',

            align:'center'

        }

    ).setOrigin(0.5);

    // YES

    yesButton = scene.add.text(

        width * 0.35,

        height * 0.72,

        'YES',

        {

            fontSize:buttonSize,

            backgroundColor:'#00aa00',

            padding:{
                x:20,
                y:10
            },

            fill:'#ffffff'

        }

    )

    .setOrigin(0.5)

    .setInteractive()

    .on('pointerdown', () => {

        restartGame(scene);

    });

}

function restartGame(scene){

    score = 0;

    timeLeft = 60;

    gameOver = false;

    isPaused = false;

    resultText.destroy();

    yesButton.destroy();

    pauseButton.setVisible(true);

    pauseButton.setText('PAUSE');

    scoreText.setText('Score: 0');

    timerText.setText('Time: 60');

    target.setVisible(true);

    moveTarget();

    startTimer(scene);

}
