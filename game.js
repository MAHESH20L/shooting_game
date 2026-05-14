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

let target;

let scoreText;

let timerText;

let resultText;

let yesButton;

let exitButton;

function create() {

    const width = window.innerWidth;

    const height = window.innerHeight;

    const isMobile = width < 768;

    const titleSize = isMobile ? '24px' : '40px';

    const textSize = isMobile ? '16px' : '26px';

    const scoreSize = isMobile ? '20px' : '30px';

    const buttonSize = isMobile ? '28px' : '40px';

    const resultSize = isMobile ? '28px' : '42px';

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

        width * 0.5,

        isMobile ? 20 : 30,

        'TARGET SHOOTING GAME',

        {

            fontSize:titleSize,

            fill:'#00ff99',

            fontStyle:'bold'

        }

    ).setOrigin(0.5,0);

    // Disclaimer

    this.add.text(

        width * 0.5,

        isMobile ? 60 : 90,

        'Shoot only the RED DOT target',

        {

            fontSize:textSize,

            fill:'#ffffff',

            align:'center'

        }

    ).setOrigin(0.5,0);

    // Score

    scoreText = this.add.text(

        15,
        15,

        'Score: 0',

        {

            fontSize:scoreSize,

            fill:'#ffffff'

        }

    );

    // Timer

    timerText = this.add.text(

        width - (isMobile ? 110 : 180),
        15,

        'Time: 60',

        {

            fontSize:scoreSize,

            fill:'#ffffff'

        }

    );

    // Target Size

    const targetRadius = isMobile ? 30 : 40;

    // Red Target

    target = this.add.circle(

        width / 2,

        height / 2,

        targetRadius,

        0xff0000

    );

    // Crosshair only for Desktop

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

        if(gameOver) return;

        shoot(pointer, this);

    });

    // Responsive Resize

    window.addEventListener('resize', () => {

        game.scale.resize(

            window.innerWidth,

            window.innerHeight

        );

    });

    // Start Game

    moveTarget();

    startTimer(this);

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

    const bottomSafeArea = isMobile ? 120 : 80;

    const radius = target.radius;

    target.x = Phaser.Math.Between(

        radius + 20,

        width - radius - 20

    );

    target.y = Phaser.Math.Between(

        140,

        height - bottomSafeArea

    );

}

function startTimer(scene){

    scene.time.addEvent({

        delay:1000,

        callback: () => {

            if(gameOver) return;

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

    const width = window.innerWidth;

    const height = window.innerHeight;

    const isMobile = width < 768;

    const resultSize = isMobile ? '28px' : '42px';

    const buttonSize = isMobile ? '26px' : '40px';

    // Result Text

    resultText = scene.add.text(

        width / 2,

        height * 0.32,

        'TIME OVER\n\n' +

        'Final Score: ' + score +

        '\n\nPlay Again?',

        {

            fontSize:resultSize,

            fill:'#00ff99',

            align:'center'

        }

    ).setOrigin(0.5);

    // YES BUTTON

    yesButton = scene.add.text(

        width * 0.35,

        height * 0.68,

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

    // EXIT BUTTON

    exitButton = scene.add.text(

        width * 0.65,

        height * 0.68,

        'EXIT',

        {

            fontSize:buttonSize,

            backgroundColor:'#aa0000',

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

        // YouTube playable

        if(window.self !== window.top){

            window.parent.location.href =
            'https://www.youtube.com';

        }

        // Normal browser

        else{

            window.open('','_self');

            window.close();

        }

    });

}

function restartGame(scene){

    score = 0;

    timeLeft = 60;

    gameOver = false;

    resultText.destroy();

    yesButton.destroy();

    exitButton.destroy();

    scoreText.setText('Score: 0');

    timerText.setText('Time: 60');

    target.setVisible(true);

    moveTarget();

    startTimer(scene);

}