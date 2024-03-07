//----------------------
//canvas.js
//----------------------
var w, width, h, height;
var canvas;

function createCanvas(canvas_name) {
  var body = document.querySelector("body");

  canvas = document.createElement("canvas");
  canvas.setAttribute("id", canvas_name);
  canvas.style.position = "absolute";
  canvas.style.left = "0px";
  canvas.style.top = "0px";
  canvas.style.background = "transparent";

  body.appendChild(canvas);

  var ctx = canvas.getContext("2d");

  resize();
  window.addEventListener("resize", resize, false);

  return ctx;
}

function resize() {
  var canvasList = document.getElementsByTagName("canvas");
  width = w = window.innerWidth;
  height = h = window.innerHeight;

  for (var i = 0; i < canvasList.length; i++) {
    canvasList[i].width = width;
    canvasList[i].height = height;
  }

  console.log("resize: " + w + " : " + h + ".");
}

function dist(x1, y1, x2, y2) {
  x2 -= x1;
  y2 -= y1;
  return Math.sqrt(x2 * x2 + y2 * y2);
}

function getRandom(min, max) {
  return Math.random() * (max - min) + min;
}

Number.prototype.between = function (a, b) {
  var min = Math.min.apply(Math, [a, b]),
    max = Math.max.apply(Math, [a, b]);
  return this > min && this < max;
};

function getRandomArgument(arg1, arg2) {
  const randomIndex = Math.floor(Math.random() * 2);
  return randomIndex === 0 ? arg1 : arg2;
}

//----------------------
//script.js
//----------------------
//max number of particles that can exist one on screen
MAX_NUMER_OF_ENTITIES_PER_ARRAY = 60;

//size of circles
MIN_SIZE = 2;
MAX_SIZE = 2.5;

//distance of lines
MIN_DISTANCE = 40;
MAX_DISTANCE = 150;

//color
BALL_COLOR = " #9199b0";
LINE_COLOR = " #637ab6";

//initial speed of spreading of shapes n >= MIN_SPEED_POSIBLE
CONST_SPEED = 0.3;

SPEED_LEFT = 0.5;
SPEED_RIGHT = 0.5;
SPEED_UP = 0.5;
SPEED_DOWN = 0.5;

MIN_SPEED_POSSIBLE = 0.01;

//make CONST_SPEED to null for individualt speed to take effect
if (CONST_SPEED != null) {
  SPEED_LEFT = CONST_SPEED;
  SPEED_RIGHT = CONST_SPEED;
  SPEED_UP = CONST_SPEED;
  SPEED_DOWN = CONST_SPEED;
}

//speed of shape Decay
MIN_SPEED_OF_DECAY = 0.00001;
MAX_SPEED_OF_DECAY = 0.0001;

//min size of shapes until regenerating
MIN_SIZE_DECAY = 0.4;

// radius around mouse that will make shapes move aside
RADIUS_AROUND_MOUSE = 150;

//how faster will shapes decay around mouse
SPEED_OF_DECAY_INCREASE_AROUD_MOUSE = 50;

//atraction force around mouse (high number = low attraction) n >= 1
ATTRACTION_FORCE = 55;

//maximum opacity of the regions created between shapes 0 < n < 1
MAX_SHAPE_OPACITY = 0.75;

//color of shapes of the geions as rgb values
COLOR_OF_SHAPES = "255,255,255";

//the glabal opacicity of the whole canvas 0 < n < 1
GLOBAL_OPACITY_OF_SPAHES = 0.75;

//Number of layer(specific arrays of dots that will interact with each other)
NUMBER_OF_ARRAYS = 3;

//Every array will have it's elements smoller and smoller
//this coeficent determines how much strong is the shrinking of elements
//(make -1 to desable) n >= 0
COEFICIENT_OF_SMOLNESS = 0;

//bouse of the boerders or teleport to the other border
BOUNCE = false;

//how fast will the shapes disperse when you click (the higher - the slower)
//(make this -1 to go to the default click interaction) n >= 1
//default 35
CLICK_PROPULTION = 35;

//max click propultion speed
MAX_CLICK_PROPUTION_SPEED = 0.5;

//click propultion radius
CLICK_PROPULTION_RADIUS = RADIUS_AROUND_MOUSE * 5;

//other global objects
const mainArray = [];
for (let i = 0; i < NUMBER_OF_ARRAYS; i++) {
  let arr = [];
  mainArray.push(arr);
}
ctx = createCanvas("canvas1");
ctx.globalAlpha = GLOBAL_OPACITY_OF_SPAHES;
let mouse = {
  x: null,
  y: null,
};

window.addEventListener("resize", function () {
  ctx.globalAlpha = GLOBAL_OPACITY_OF_SPAHES;
});

window.addEventListener("mousemove", function (event) {
  mouse.x = event.x + canvas.clientLeft / 2;
  mouse.y = event.y + canvas.clientTop / 2;
});

window.addEventListener("click", function (event) {
  console.log("cick: " + mouse.x + " : " + mouse.y);
  for (let j = 0; j < NUMBER_OF_ARRAYS; j++) {
    for (let i = 0; i < mainArray[j].length; i++) {
      shape = mainArray[j][i];

      if (CLICK_PROPULTION <= -1) {
        if (shape.distance < RADIUS_AROUND_MOUSE * 20) {
          if (Math.sign(shape.speedX) != Math.sign(shape.dx))
            shape.speedX = -shape.speedX;

          if (Math.sign(shape.speedY) != Math.sign(shape.dy))
            shape.speedY = -shape.speedY;

          if (shape.x.between(mouse.x + 20, mouse.x - 20)) shape.speedX = 0;

          if (shape.y.between(mouse.y + 20, mouse.y - 20)) shape.speedY = 0;
        }
      } else {
        if (shape.distance < CLICK_PROPULTION_RADIUS) {
          let forceDirectionX = shape.dx / shape.distance;
          let forceDirectionY = shape.dy / shape.distance;

          let force =
            (CLICK_PROPULTION_RADIUS - shape.distance) /
            CLICK_PROPULTION_RADIUS;

          let dirX =
            -(forceDirectionX * force * shape.lineLengh) / CLICK_PROPULTION;
          let dirY =
            -(forceDirectionY * force * shape.lineLengh) / CLICK_PROPULTION;

          if (shape.distance < RADIUS_AROUND_MOUSE * 2 + shape.size) {
            if (
              dirX < -MAX_CLICK_PROPUTION_SPEED ||
              dirX > MAX_CLICK_PROPUTION_SPEED
            ) {
              if (Math.sign(dirX) == -1)
                shape.speedX = -MAX_CLICK_PROPUTION_SPEED;
              else shape.speedX = MAX_CLICK_PROPUTION_SPEED;
            }
            if (
              dirY < -MAX_CLICK_PROPUTION_SPEED ||
              dirY > MAX_CLICK_PROPUTION_SPEED
            ) {
              if (Math.sign(dirY) == -1)
                shape.speedY = -MAX_CLICK_PROPUTION_SPEED;
              else shape.speedY = MAX_CLICK_PROPUTION_SPEED;
            }
          }
        }
      }
    }
  }
});

class Shape {
  constructor(options) {
    this.x = getRandom(1, w);
    this.y = getRandom(1, h);

    let min_size, max_size, min_speed_of_decay, max_speed_of_decay;

    try {
      min_size = options.min_size;
    } catch (e) {
      min_size = MIN_SIZE;
    }

    try {
      max_size = options.max_size;
    } catch (e) {
      max_size = MAX_SIZE;
    }

    this.size = getRandom(min_size, max_size);

    // this.speedX=getRandom(-SPEED_LEFT, SPEED_RIGHT);
    this.speedX = getRandomArgument(
      getRandom(-SPEED_LEFT, -MIN_SPEED_POSSIBLE),
      getRandom(MIN_SPEED_POSSIBLE, SPEED_RIGHT)
    );
    // this.speedY=getRandom(-SPEED_UP, SPEED_DOWN);
    this.speedY = getRandomArgument(
      getRandom(-SPEED_UP, -MIN_SPEED_POSSIBLE),
      getRandom(MIN_SPEED_POSSIBLE, SPEED_DOWN)
    );

    this.color = BALL_COLOR;

    //todo: maybe adding density
    this.lineLengh = getRandom(MIN_DISTANCE, MAX_DISTANCE);

    try {
      min_speed_of_decay = options.min_speed_of_decay;
    } catch (e) {
      min_speed_of_decay = MIN_SPEED_OF_DECAY;
    }

    try {
      max_speed_of_decay = options.max_speed_of_decay;
    } catch (e) {
      max_speed_of_decay = MAX_SPEED_OF_DECAY;
    }

    this.speedOfDecay = getRandom(min_speed_of_decay, max_speed_of_decay);
  }

  update() {
    let dx = mouse.x - this.x;
    let dy = mouse.y - this.y;
    let distance = Math.hypot(dx, dy);

    this.distance = distance;
    this.dx = dx;
    this.dy = dy;

    let forceDirectionX = dx / distance;
    let forceDirectionY = dy / distance;

    //the closer the stronger the pull
    let force = (RADIUS_AROUND_MOUSE - distance) / RADIUS_AROUND_MOUSE;
    if (force < 0) force = 0;

    this.dirX = (forceDirectionX * force * this.lineLengh) / ATTRACTION_FORCE;
    this.dirY = (forceDirectionY * force * this.lineLengh) / ATTRACTION_FORCE;

    if (distance < RADIUS_AROUND_MOUSE + this.size) {
      this.size -= this.speedOfDecay * SPEED_OF_DECAY_INCREASE_AROUD_MOUSE;

      this.x += this.dirX + this.speedX;
      this.y += this.dirY + this.speedY;

      //event horizon radius
      if (distance < RADIUS_AROUND_MOUSE / 10 + this.size) {
        this.size = MIN_SIZE_DECAY;
      }
    } else {
      this.x += this.speedX;
      this.y += this.speedY;
    }

    this.size -= this.speedOfDecay;
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.closePath();
  }
}

function drawConections(i, arr) {
  for (let j = i + 1; j < arr.length; j++) {
    shape1 = arr[i];
    shape2 = arr[j];
    distance_1_2 = dist(shape1.x, shape1.y, shape2.x, shape2.y);

    //draw conections
    if (distance_1_2 <= shape2.lineLengh) {
      ctx.beginPath();
      ctx.strokeStyle = LINE_COLOR;
      ctx.lineWidth = 1 - distance_1_2 / shape2.lineLengh;
      ctx.moveTo(shape1.x, shape1.y);
      ctx.lineTo(shape2.x, shape2.y);
      ctx.stroke();
      ctx.closePath();

      //draw shapes in between 3 points
      for (let t = j + 1; t < arr.length; t++) {
        shape3 = arr[t];
        distance_2_3 = dist(shape2.x, shape2.y, shape3.x, shape3.y);
        distance_1_3 = dist(shape1.x, shape1.y, shape3.x, shape3.y);
        if (
          distance_2_3 <= shape3.lineLengh &&
          distance_1_3 <= shape3.lineLengh
        ) {
          ctx.beginPath();
          normalisedShapeOpacity =
            1 -
            Math.max(
              distance_1_2 / shape2.lineLengh,
              distance_2_3 / shape3.lineLengh,
              distance_1_3 / shape3.lineLengh
            );
          normalisedMaxShapeOpacity = 1 - MAX_SHAPE_OPACITY;
          ctx.fillStyle =
            "rgba(" +
            COLOR_OF_SHAPES +
            "," +
            (normalisedShapeOpacity - normalisedMaxShapeOpacity) +
            ")";
          ctx.moveTo(shape1.x, shape1.y);
          ctx.lineTo(shape2.x, shape2.y);
          ctx.lineTo(shape3.x, shape3.y);
          ctx.fill();
          ctx.closePath();
        }
      }
    }
  }
}

function drawShapes(arr, arrIndex) {
  let shapesToRemove = [];

  for (let i = 0; i < arr.length; i++) {
    arr[i].update();
    arr[i].draw();
    drawConections(i, arr);

    if (BOUNCE == false) {
      if (arr[i].x >= w) arr[i].x = 1;
      if (arr[i].x <= 0) arr[i].x = w - 1;

      if (arr[i].y >= h) arr[i].y = 1;
      if (arr[i].y <= 0) arr[i].y = h - 1;
    } else {
      if (arr[i].x >= w || arr[i].x <= 0) {
        arr[i].speedX = -arr[i].speedX;
      }

      if (arr[i].y >= h || arr[i].y <= 0) {
        arr[i].speedY = -arr[i].speedY;
      }
    }

    if (
      arr[i].x >= w + 2 ||
      arr[i].x <= -2 ||
      arr[i].y >= h + 2 ||
      arr[i].y <= -2 ||
      arr[i].size <= MIN_SIZE_DECAY
    ) {
      shapesToRemove.push(i);
    }
  }

  for (let i = shapesToRemove.length - 1; i >= 0; i--) {
    arr.splice(shapesToRemove[i], 1);
    arr.push(
      new Shape({
        min_size: MIN_SIZE / arrIndex,
        max_size: MAX_SIZE / arrIndex,
        min_speed_of_decay: MIN_SPEED_OF_DECAY / arrIndex,
        max_speed_of_decay: MAX_SPEED_OF_DECAY / arrIndex,
      })
    );
  }
}

function init() {
  for (let i = 0; i < NUMBER_OF_ARRAYS; i++) {
    let index;
    if (COEFICIENT_OF_SMOLNESS <= -1) index = 1;
    else index = i + 1 + COEFICIENT_OF_SMOLNESS;

    let min_size = MIN_SIZE / index;
    let max_size = MAX_SIZE / index;
    let min_speed_of_decay = MIN_SPEED_OF_DECAY / index;
    let max_speed_of_decay = MAX_SPEED_OF_DECAY / index;
    for (let j = 0; j < MAX_NUMER_OF_ENTITIES_PER_ARRAY; j++) {
      mainArray[i].push(
        new Shape({
          min_size: min_size,
          max_size: max_size,
          min_speed_of_decay: min_speed_of_decay,
          max_speed_of_decay: max_speed_of_decay,
        })
      );
    }
  }
  console.log(mainArray);
}
init();

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let i = 0; i < NUMBER_OF_ARRAYS; i++) {
    let index;
    if (COEFICIENT_OF_SMOLNESS <= -1) index = 1;
    else index = i + 1 + COEFICIENT_OF_SMOLNESS;

    drawShapes(mainArray[i], index);
  }
  requestAnimationFrame(animate);
}
animate();
