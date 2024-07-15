// drigging scroll x
const scroll_dragging = document.querySelector(".scroll_dragging");
let checkMouseDow = false;
let startMouse = 0;

scroll_dragging.addEventListener("mousedown", (e) => {
  checkMouseDow = true;
  startMouse = e.clientX;
  scroll_dragging.style.cursor = "pointer";
});

scroll_dragging.addEventListener("mouse", () => {});

scroll_dragging.addEventListener("mouseleave", () => {
  checkMouseDow = false;
});
scroll_dragging.addEventListener("mousemove", (e) => {
  if (!checkMouseDow) return;
  scroll_dragging.scrollLeft += startMouse - e.clientX;
});

// filter
const sale1 = document.querySelector("#sale1");
console.log(sale1.disabled);

const sale2 = document.querySelector(".sale2");
sale2.addEventListener("click", () => {
  console.log(sale1.disabled);
});
