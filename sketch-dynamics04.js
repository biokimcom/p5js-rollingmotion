var cirX=300,cirR=100;
var groundY=500;
var gAng =0 ; //ground slope angle
var angv = 0; // rotating angular speed (rad/frame), 1/60 =0.01666
let sliderv;
let pause = false; 
var preX0=0, preY0=0, preX1=0, preY1=0;
var p0,p1,p2,p02c;
var direction=1;
var hidecircle = false;
let v1_v;
var spdX0,spdY0,spdX1,spdY1;

function setup() {
  createCanvas(1200, 700);
  
  let x = cirX*cos(radians(gAng)) - (cirR)*sin(radians(gAng));
  let y = groundY - (cirX*sin(radians(gAng)) + (cirR)*cos(radians(gAng)));
  car = new makeCircle(x,y,cirR*2);

  sliderv = createSlider(0, 0.5, 0,0.01);
  sliderv.position(20, 50);
  sliderv.style('width', '150px');
  
  var drawButton1 = createButton("Reset");
  drawButton1.position(400,50);
  drawButton1.mousePressed(resetSketch);
    
  input = createInput();
  input.position(350, 50);
  input.style('width','40px');
  input.value(0);
  
  var drawButton2 = createButton("Pause or Resume");
  drawButton2.position(500,50);
  drawButton2.mousePressed(pauseOrresume);
  
  var drawButton3 = createButton("Clockwise");
  drawButton3.position(500,100);
  drawButton3.mousePressed(Clockwise);
  
  var drawButton4 = createButton("Counter-Clockwise");
  drawButton4.position(350,100);
  drawButton4.mousePressed(CounterClockwise);
    
  checkbox = createCheckbox('Hide Circle', false);
  checkbox.position(600,100);
  checkbox.changed(HideCircle);
    
  gAng
}

function resetSketch() {
  background(245);
  gAng = input.value();
  let x = cirX*cos(radians(gAng)) - (cirR)*sin(radians(gAng));
  let y = groundY - (cirX*sin(radians(gAng)) + (cirR)*cos(radians(gAng)));
  car = new makeCircle(x,y,cirR*2);
  
  sliderv.remove();
  sliderv = createSlider(0, 0.5, 0,0.01);
  sliderv.position(20, 50);
  sliderv.style('width', '150px');
    
  pause = false;
  spdX0=0; spdY0=0; spdX1=0, spdY1=0;
}

function pauseOrresume() {
  if (pause) {
    pause = false;
  } else {
    pause = true;
  }
}

function Clockwise() {
  direction =1;
}
function CounterClockwise() {
  direction=-1;
}

function HideCircle() {
 if (this.checked()) {
    hidecircle = true;
  } else {
    hidecircle = false;
  }
}

function draw() {
  background(245);
  
  strokeWeight(0.5); stroke(0);
  text('Dynamics: programmed by JKim',10,690);
  text('Angular Speed',30,45); 
  text('Ground Angle',340,45); 
  text('Just before the disk touches ground, its veloicy (blue arrow) is', 500,600);
  text('directed downward. Just after contact, its velocity is directed upward:',500,620);
  text('It accelerates upward as it leaves the ground',500,640);
  
  strokeWeight(2); stroke(0);
  line(0,groundY,width,groundY-tan(radians(gAng))*width);
  
  angv = sliderv.value()/20;

  if (car.x >=width-cirR || car.x <= cirR) {
    direction = -1*direction;
  }
  
  if (!pause) {
    car.roll(angv*direction);
    strokeWeight(0.5);
    text('Ready...', 500,45);
    
    spdX0 = car.x - preX0; spdY0 = car.y-preY0;
    spdX1 = p02c.x -preX1; spdY1 = p02c.y - preY1;
  
    v1_v = createVector(spdX0*50,spdY0*50);
      
    preX0 = car.x; preY0 = car.y;
    preX1 = p02c.x;
    preY1 = p02c.y;
      console.log(preX1,preY1);
      
  } else{
    strokeWeight(0.5);  
    text('Paused...', 500,45);      
  }

  car.display(0,2);
 
  drawArrow(p0,v1_v,'red');

  drawArrow(p02c,createVector(spdX1*60,0),'blue');
  drawArrow(p02c,createVector(0,spdY1*60),'blue');
}


class makeCircle {
  constructor(px,py,pd) {
    this.x = px;
    this.y = py;
    this.dx = 0;
    this.dy = 0;
    this.d = pd;
    this.ang = 0; //current angular displacement
  }

  roll(angv) {
    //this.x = px;
    //this.y = py;
    this.ang = this.ang + angv;
    this.dx = sqrt(cirR*cirR*angv*angv/(1+tan(radians(gAng))));
    this.dy = this.dx*tan(radians(gAng));
    if (angv >= 0) {
      this.x = this.x + this.dx;
      this.y = this.y - this.dy;
    } else {
      this.x = this.x - this.dx;
      this.y = this.y + this.dy;
    }
      
    p0 = createVector(this.x,this.y);
    p1 = createVector(-cirR*sin(radians(gAng)),-cirR*cos(radians(gAng)));
    p2 = createVector(cirR*sin(radians(gAng)),cirR*cos(radians(gAng)));
    p02c = createVector(this.x-cirR*sin(this.ang-radians(gAng)),this.y+cirR*cos(this.ang-radians(gAng)));
  }
  

  display(pstroke,pstrokeweight) {
    stroke(pstroke); strokeWeight(pstrokeweight);
    if (!hidecircle) { 
        circle(this.x, this.y, this.d);
    }
    push();
    translate(this.x,this.y);
    rotate(this.ang);
    line(p1.x,p1.y,p2.x,p2.y);
    pop();
  }
}


function drawArrow(base, vec, myColor) {
  push();
  stroke(myColor);
  strokeWeight(3);
  fill(myColor);
  translate(base.x, base.y);
  line(0, 0, vec.x, vec.y);
  rotate(vec.heading());
  let arrowSize = 3;
  translate(vec.mag() - arrowSize, 0);
  triangle(0, arrowSize / 2, 0, -arrowSize / 2, arrowSize, 0);
  pop();
}