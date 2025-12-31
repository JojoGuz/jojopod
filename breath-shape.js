let t = 0;

    function setup() {
      let cnv = createCanvas(300, 300);
      cnv.parent("p5-holder");
      // ⚙️ 设置透明背景
      clear();
      noFill();
      stroke(55, 88, 120, 120);
      strokeWeight(1.5);
    }

    function draw() {
      clear(); // 每帧清空（保持透明）
      translate(width / 2, height / 2);

      // 呼吸半径
      let r = 95 + sin(t) * 30;

      beginShape();
      for (let i = 0; i < TWO_PI; i += 0.03) {
        let x = r * cos(i) + 12 * sin(3 * i + t);
        let y = r * sin(i) + 12 * cos(2 * i - t);
        vertex(x, y);
      }
      endShape(CLOSE);

      t += 0.02;
    }