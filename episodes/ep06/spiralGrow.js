// spiralGrow.js
function spiralGrowSketch(p) {
  let size;
  const totalSpirals = 11;
  let spirals = [];

  // 每条螺线的参数
  class Spiral {
    constructor(w, h) {
      this.cx = w/2 + p.random(-w/3, w/3);
      this.cy = h/2 + p.random(-h/3, h/3);
      this.radius = p.random(2,5);
      this.growth = p.random(1.005, 1.025);
      this.rotations = p.random(4,6);
      this.degStep = p.int(p.random([6,8,12]));
      this.baseStroke = p.random(0.6, 2.3);
      this.h1 = p.random(0,360);
      this.h2 = (this.h1 + p.random(40,200)) % 360;
      this.s1 = p.random(40,100);
      this.s2 = p.random(30,95);
      this.b1 = p.random(60,100);
      this.b2 = p.random(30,100);
      this.a1 = p.random(60,180);
      this.a2 = p.random(20,140);
      this.currentDeg = 0;
      this.px = this.cx + this.radius;
      this.py = this.cy;
      this.done = false;
    }

    drawStep() {
      if(this.done) return;

      const deg = this.currentDeg + this.degStep;
      if(deg > 360 * this.rotations) {
        this.done = true;
        return;
      }

      const t = deg / (360 * this.rotations);
      const hCol = p.lerp(this.h1, this.h2, t);
      const sCol = p.lerp(this.s1, this.s2, t);
      const bCol = p.lerp(this.b1, this.b2, t);
      const aCol = p.lerp(this.a1, this.a2, t);
      const sw = this.baseStroke * p.random(0.85,1.15);

      p.stroke(hCol, sCol, bCol, aCol);
      p.strokeWeight(sw);
      p.strokeCap(p.ROUND);

      const aRad = p.radians(deg);
      const x = this.cx + this.radius * p.cos(aRad);
      const y = this.cy + this.radius * p.sin(aRad);

      p.line(this.px, this.py, x, y);

      this.radius *= this.growth;
      this.px = x;
      this.py = y;
      this.currentDeg += this.degStep;
    }
  }

  p.setup = function() {
    const parent = p._userNode || p.canvas?.parentNode;
    size = parent.clientWidth;
    const c = p.createCanvas(size, size);
    c.parent(parent);

    p.background(10,15,30);
    p.noFill();
 //   p.colorMode(p.HSB,360,100,100,255);
 //   p.background(225, 60, 18);

    for(let i=0;i<totalSpirals;i++){
      spirals.push(new Spiral(size,size));
    }
  };

  p.draw = function() {
    let allDone = true;
    for(let s of spirals){
      if(!s.done){
        s.drawStep();
        allDone = false;
      }
    }
    if(allDone){
      p.noLoop(); // 全部画完，停止 draw
    }
  };

  p.windowResized = function(){
    const parent = p.canvas.parentNode;
    size = parent.clientWidth;
    p.resizeCanvas(size,size);
    // 如果窗口改变，需要重新生成静态封面
    spirals = [];
    for(let i=0;i<totalSpirals;i++){
      spirals.push(new Spiral(size,size));
    }
 //   p.colorMode(p.HSB,360,100,100,255);
 //   p.background(225, 60, 18);
    p.background(10,15,30);
    p.noFill();
  };
}
