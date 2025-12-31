let bgT = 0;

function updateBackground() {
  let color1 = `oklch(85% 0.14 ${70 + Math.sin(bgT * 0.2) * 50})`;
  let color2 = `oklch(85% 0.14 ${210 + Math.cos(bgT * 0.5) * 40})`;

  document.body.style.background =
    `linear-gradient(to bottom, ${color1}, ${color2})`;

  bgT += 0.01;
}

// 30ms ≈ 33fps，已经很温柔了
setInterval(updateBackground, 30);
