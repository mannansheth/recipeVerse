// GENERAL VARIABLES
var cnv;
var score, points = 0;
var lives, x = 0;
var isPlay = false;
var gravity = 0.1;
var sword;
var fruit = [];
var fruitsList = ['apple', 'banana', 'peach', 'strawberry', 'watermelon', 'boom'];
var fruitsImgs = [], slicedFruitsImgs = [];
var livesImgs = [], livesImgs2 = [];
var boom, spliced, missed, over, start; // sounds
// var button, startButton;
// var timer;
// var counter = 60;
// var seconds, minutes;
// var timerValue = 60;

function preload(){

    // LOAD SOUNDS
    boom = loadSound('sounds/boom.mp3');
    spliced = loadSound('sounds/splatter.mp3');
    missed = loadSound('sounds/missed.mp3');
    start = loadSound('sounds/start.mp3');
    over = loadSound('sounds/over.mp3');
    boom.setVolume(0);
    spliced.setVolume(0);
    missed.setVolume(0);
    start.setVolume(0);
    over.setVolume(0);

    // LOAD IMAGES
    for(var i=0; i<fruitsList.length-1; i++){
        slicedFruitsImgs[2*i] = loadImage('images/'+ fruitsList[i] + '-1.png');
        slicedFruitsImgs[2*i + 1] = loadImage('images/'+ fruitsList[i] + '-2.png');
    }
    for(var i=0; i<fruitsList.length; i++){
        fruitsImgs[i] = loadImage('images/'+ fruitsList[i] + '.png');
    }
    for(var i=0; i<3; i++){
        livesImgs[i] = loadImage('images/x'+ (i+1) + '.png');
    }
    for(var i=0; i<3; i++){
        livesImgs2[i] = loadImage('images/xx'+ (i+1) + '.png');
    }
    bg = loadImage('images/background.jpg');
    foregroundImg = loadImage('images/home-mask.png');
    fruitLogo = loadImage('images/fruit.png');
    ninjaLogo = loadImage('images/ninja.png');
    scoreImg = loadImage('images/score.png');
    newGameImg = loadImage('images/new-game.png');
    fruitImg = loadImage('images/fruitMode.png');
    gameOverImg = loadImage('images/game-over.png');
}

function setup() {
    
    cnv = createCanvas(650,600);
    sword = new Sword(color("#FFFFFF"));
    frameRate(60);
    score = 0;
    lives = 3;

}

function draw(){
    clear();
    background(bg);

    image(this.foregroundImg, 0, 0, 800, 350);
    image(this.fruitLogo, 40, 20, 358, 195);
    image(this.ninjaLogo, 420, 50, 318, 165);
    image(this.newGameImg, 310, 360, 200, 200);
    image(this.fruitImg, 365, 415, 90, 90);
    
    cnv.mouseClicked(check);
    if(isPlay){
        game();
    }
    //     if (timerValue >= 60) {
    //         text("0:" + timerValue, width / 2, height / 2);
    //     }
    //     if (timerValue < 60) {
    //         text('0:0' + timerValue, width / 2, height / 2);
    //     }
}

function check(){ // Check for game start
    if( !isPlay && (mouseX > 300 && mouseX < 520 && mouseY > 350 && mouseY < 550)){
        start.play();
        isPlay = true;
    }
}

function game(){
    clear();
    background(bg);
    if(mouseIsPressed){ // Draw sword
        sword.swipe(mouseX, mouseY);
    }
    if(frameCount % 5 === 0){
        if(noise(frameCount) > 0.69){
            fruit.push(randomFruit()); // Display new fruit
        }
    }
    points = 0
    for(var i=fruit.length-1; i>=0; i--){
        fruit[i].update();
        fruit[i].draw();
        if(!fruit[i].visible){
            if(!fruit[i].sliced && fruit[i].name != 'boom'){ // Missed fruit
                image(this.livesImgs2[0], fruit[i].x, fruit[i].y - 120, 50, 50);
                missed.play();
                lives--;
                x++;
            }
            if(lives < 1 ){ // Check for lives
                gameOver();
            }
            fruit.splice(i,1);
        }else{
            if(fruit[i].sliced && fruit[i].name == 'boom'){ // Check for bomb
                boom.play()
                gameOver();
            }
            if(sword.checkSlice(fruit[i]) && fruit[i].name != 'boom'){ // Sliced fruit
                spliced.play();
                points++;
                fruit[i].update();
                fruit[i].draw();
            }
        }
    }
    if(frameCount % 2 === 0 ){
        sword.update();
    }
    sword.draw();
    score += points;
    drawScore();
    drawLives();  
}

function drawLives(){

    image(this.livesImgs[0], width - 110, 20, livesImgs[0].width, livesImgs[0].height);
    image(this.livesImgs[1], width - 88, 20, livesImgs[1].width, livesImgs[1].height);
    image(this.livesImgs[2], width - 60, 20, livesImgs[2].width, livesImgs[2].height);
    if(lives <= 2 ){
        image(this.livesImgs2[0], width - 110, 20, livesImgs2[0].width, livesImgs2[0].height);
    }
    if(lives <= 1){
        image(this.livesImgs2[1], width - 88, 20, livesImgs2[1].width, livesImgs2[1].height);
    }
    if(lives === 0){
        image(this.livesImgs2[2], width - 60, 20, livesImgs2[2].width, livesImgs2[2].height);
    }
}

function drawScore(){
    image(this.scoreImg, 10, 10, 40, 40);
    textAlign(LEFT);
    noStroke();
    fill(255,147,21);
    textSize(50);
    text(score, 50, 50);
}

function gameOver() {
    noLoop();
    over.play();
    clear();
    background(bg);
    image(this.gameOverImg, 155, 260, 490, 85);
    lives = 0;
    
    button = createButton("Reset");
    button.position(450, 350);
    button.mousePressed(resetSketch);
}

// timer = createP("timer");
// setInterval(timeIt, 1000);

// textAlign(CENTER);
// setInterval(timeIt, 1000);

//   if (timerValue == 0) {
//     text('game over', width / 2, height / 2 + 15);
//   }
// fruit.push(new Fruit(random(width),height,3,"#FF00FF",random()));
function resetSketch() {
    // Clear background
    clear();
    background(bg);

    // Reset game state variables
    score = 0;
    lives = 3;
    fruit = []; // Clear existing fruit objects
    isPlay = false;

    // Remove reset button
    button.remove();

    // Restart game loop
    loop();
}
// function timeIt() {
//     console.log("time");
//     if (timerValue > 0) {
//         console.log(timerValue);
//         timerValue--;
//         textAlign(CENTER);
//         noStroke();
//         fill(255,147,21);
//         textSize(50);
//         text(timerValue, 200, 250);
//     }
//   }