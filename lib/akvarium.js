'use strict';

//const spriteW = 189
//const spriteH = 97
//const spriteSubW = 682
//const spriteSubH = 365
//const spriteBubbleW = 27
//const spriteBubbleH = 20
var numFish = 100;
var fishChokSpeed = 60;

/*
const spriteProps = {
    subOffsetX: 378,
    bubbleOffsetX: 1742
}
*/

var fishes = [];
//var shoals = []
var sub = {};
var bubbles = [];
var ctx;
var canvas;
var sprite;
var frameCount = 0;

function init() {
    console.log("hej");
    Settings.load();
    if (Settings.count) {
        myRange.value = Settings.count;
        numFish = Math.round(logSlider(myRange.value));
    }
    window.addEventListener('resize', resizeCanvas, false);
    loadSprites();
    canvas = document.getElementsByTagName('canvas')[0];
    ctx = canvas.getContext('2d');
    resizeCanvas();
}

function loadSprites() {
    sprite = new Image();
    sprite.onload = function () {
        start();
    };
    sprite.src = 'sprite.png';
}

function start() {
    initFish();
    initSub();
    //initShoals()
    setInterval(draw, 50);
    draw();
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    frameCount++;
    drawFishes();
    drawSub();
    drawBubbles();
    //drawShoals()
}

function initFish() {
    fishes = [];
    for (var i = 0; i < numFish; i++) {
        var fish = createFish();
        fishes.push(fish);
    }
}

function initSub() {
    var dataSub = spriteData.sub[0];
    sub = {};
    sub.x = -1000;
    sub.y = randInt(20, canvas.height - dataSub.h);
    sub.dir = 0;
    sub.speed = 5;
    sub.index = 0;
    sub.propelIndex = 0;
    sub.periskopIndex = 0;
}

function addBubble(x, y) {
    var bubble = createBubble(x, y);
    bubbles.push(bubble);
}

function createBubble(x, y) {
    var bubble = {};
    bubble.x = x;
    bubble.y = y;
    return bubble;
}

function createFish() {
    var dataFish = spriteData.fish[0];
    var fish = {};
    var fishIndex = randInt(0, 9);
    fish.index = fishIndex;
    fish.x = randInt(0, canvas.width - dataFish.w);
    fish.y = randInt(-dataFish.h, canvas.height);
    fish.dir = randInt(0, 1);
    fish.startSpeed = [20, 15, 12, 10, 8, 5, 3, 2, 1, 12][fishIndex] + (10 - 5 * Math.random());
    fish.expSpeed = [0.9, 0.91, 0.92, 0.93, 0.94, 0.95, 0.93, 0.93, 0.9, 0.9][fishIndex] + 0.03 * Math.random();
    fish.lowSpeedLimit = [5, 0.5, 5, 1, 5, 1, 0.1, 2, 0.01, 1][fishIndex];
    fish.speed = fish.startSpeed;
    return fish;
}

function drawFishes() {
    var dataFish = spriteData.fish[0];
    fishes.forEach(function (fish, index) {

        //switch dir
        if (fish.x < -(200 + dataFish.w)) {
            fish.dir = 0;
            fish.y = randInt(-dataFish.h, canvas.height);
        } else if (fish.x > canvas.width + dataFish.w + 200) {
            fish.dir = 1;
            fish.y = randInt(-dataFish.h, canvas.height);
        }

        //move
        fish.speed *= fish.expSpeed;
        fish.x += fish.dir == 0 ? fish.speed : -fish.speed;
        if (fish.speed < fish.lowSpeedLimit) {
            fish.speed = fish.startSpeed;
        }

        var dataIndex = 2 * fish.index + fish.dir;
        var data = spriteData.fish[dataIndex];
        ctx.drawImage(sprite, data.x, data.y, data.w, data.h, fish.x, fish.y, data.w, data.h);
    });
}

function drawSub() {
    var dataSub = spriteData.sub[sub.dir];

    //change direction
    if (sub.x < -(500 + dataSub.w)) {
        sub.dir = 0;
        sub.y = randInt(20, canvas.height - dataSub.h);
    } else if (sub.x > canvas.width + dataSub.w + 500) {
        sub.dir = 1;
        sub.y = randInt(20, canvas.height - dataSub.h);
    }

    //emit bubble
    if (frameCount % 10 === 0) {
        var xOffset = sub.dir == 0 ? 525 : dataSub.w - 525;
        addBubble(sub.x + xOffset, sub.y + 110);
    }

    sub.propelIndex = (sub.propelIndex + 1) % 3;

    //periskop 
    sub.periskopIndex = (sub.periskopIndex + 0.5) % 10;
    var dataIndexPeriskop = 2 * Math.floor(sub.periskopIndex) + sub.dir;
    var dataPeriskop = spriteData.periskop[dataIndexPeriskop];
    var xOffset = sub.dir == 0 ? 335 : dataSub.w - dataPeriskop.w - 335;
    ctx.drawImage(sprite, dataPeriskop.x, dataPeriskop.y, dataPeriskop.w, dataPeriskop.h, sub.x + xOffset, sub.y + 9, dataPeriskop.w, dataPeriskop.h);

    //propel
    sub.propelIndex = (sub.propelIndex + 1) % 3;
    var dataIndexPropel = 2 * Math.floor(sub.propelIndex) + sub.dir;
    var dataPropel = spriteData.propel[dataIndexPropel];
    var xOffset = sub.dir == 0 ? 19 : dataSub.w - dataPropel.w - 19;
    ctx.drawImage(sprite, dataPropel.x, dataPropel.y, dataPropel.w, dataPropel.h, sub.x + xOffset, sub.y + 120, dataPropel.w, dataPropel.h);

    //move sub
    sub.x += sub.dir == 0 ? sub.speed : -sub.speed;

    //draw sub
    ctx.drawImage(sprite, dataSub.x, dataSub.y, dataSub.w, dataSub.h, sub.x, sub.y, dataSub.w, dataSub.h);
}

function drawBubbles() {
    bubbles.forEach(function (bubble, index) {
        bubble.y -= 10;
        bubble.x += 10 * (Math.random() - 0.5);
        if (bubble.y < -20) {
            bubbles.splice(index, 1);
        }
        var data = spriteData.bubble[0];
        ctx.drawImage(sprite, data.x, data.y, data.w, data.h, bubble.x, bubble.y, data.w, data.h);
    });
}

function scareFish(x) {
    var dataFish = spriteData.fish[0];
    for (var i = 0; i < fishes.length; i++) {
        var fish = fishes[i];
        fish.dir = fish.x + dataFish.w / 2 < x ? 1 : 0;
        fish.speed = fishChokSpeed;
    }
}

function adjustFishCount(count) {
    var diff = count - fishes.length;

    if (diff > 0) {
        for (var i = 0; i < diff; i++) {
            var fish = createFish();
            fishes.push(fish);
        }
    }

    if (diff < 0) {
        fishes.splice(diff);
    }
}

function clicked(e) {
    scareFish(e.clientX);
}

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

function randInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min);
}

/* convert a sliders linear value to log */
function logSlider(value) {
    // value will be between 0 and 100
    var minp = 0;
    var maxp = 100;

    // The result should be between 10 an 5000
    var minv = Math.log(10);
    var maxv = Math.log(5000);

    // calculate adjustment factor
    var scale = (maxv - minv) / (maxp - minp);

    return Math.exp(minv + scale * (value - minp));
}

function sliderChange(e) {
    var count = Math.round(logSlider(myRange.value));
    Settings.count = myRange.value;
    Settings.save();
    adjustFishCount(count);
}
