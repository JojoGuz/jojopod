/* 🎨 过滤功能 */
const buttons = document.querySelectorAll("nav button");
const cards = document.querySelectorAll(".card");

buttons.forEach(btn => {
  btn.addEventListener("click", () => {
    buttons.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");

    const filter = btn.dataset.filter;
    cards.forEach(card => {
      if (filter === "all" || card.dataset.type === filter) {
        card.classList.remove("hide");
      } else {
        card.classList.add("hide");
      }
    });
  });
});

/*有时 p5 会在容器未完全渲染时初始化（宽度取不到），可以在 main.js 里稍微延迟一下：*/
window.addEventListener('load', () => {
  const target = document.querySelector('#p5cover-ep6');
  if (target) {
    setTimeout(() => new p5(spiralGrowSketch, target), 100);
  }
});
