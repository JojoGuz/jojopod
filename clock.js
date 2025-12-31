let t = 0;
let dots = [];
let lastSecond = -1;

function setup() {
  let cnv = createCanvas(300, 300);
  cnv.parent("p5-holder");
  angleMode(DEGREES);

  clear();           // 透明背景
  strokeCap(ROUND); // 指针更柔和
}

function draw() {
  clear();
  translate(width / 2, height / 2);
  rotate(-90);

  let now = new Date();
  let h = now.getHours();
  let m = now.getMinutes();
  let s = now.getSeconds();

  let baseColor = color(55, 88, 120, 160);

  // =====================
  // Hour hand
  // =====================
  stroke(baseColor);
  strokeWeight(5);
  push();
  rotate(map(h % 12 + m / 60, 0, 12, 0, 360));
  line(0, 0, 48, 0);
  pop();

  // =====================
  // Minute hand
  // =====================
  strokeWeight(3);
  push();
  rotate(map(m + s / 60, 0, 60, 0, 360));
  line(0, 0, 72, 0);
  pop();

  // =====================
  // Second hand
  // =====================
  stroke(55, 88, 120, 110);
  strokeWeight(1.5);
  push();
  rotate(map(s, 0, 60, 0, 360));
  line(0, 0, 90, 0);
  pop();

  // 中心锚点
  noStroke();
  fill(55, 88, 120, 180);
  circle(0, 0, 4);

  // =====================
  // Breathing dots
  // =====================
  if (s !== lastSecond) {
    dots.push({
      angle: random(360),
      radius: random(60, 90),
      life: random(180, 300),
      decay: random(1.2, 2.2),
      size: random(2, 6.5)
    });
    lastSecond = s;
  }

  for (let i = dots.length - 1; i >= 0; i--) {
    let d = dots[i];
    let x = d.radius * cos(d.angle);
    let y = d.radius * sin(d.angle);

    noStroke();
    fill(55, 88, 120, d.life);
    circle(x, y, d.size);

    d.life -= d.decay;
    if (d.life <= 0) dots.splice(i, 1);
  }

  t += 0.01; // 只在 p5 内部使用
}
