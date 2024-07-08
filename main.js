var swiper = new Swiper(".swiper", {
  slidesPerView: 3.5,
  spaceBetween: 30,
  loop: true,

  direction: getDirection(),
  pagination: {
    el: ".swiper-mix-match-pagination",
  },
  on: {
    resize: function () {
      swiper.changeDirection(getDirection());
    },
  },
});
new Swiper(".feedblack", {
  slidesPerView: 3,
  spaceBetween: 30,
  freeMode: true,
  direction: getDirection(),
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },
  breakpoints: {
    768: {
      centeredSlides: false,
    },
  },
});
// new Swiper(".mix-match", {
//   slidesPerView: 1,
//   spaceBetween: 30,

// });
// new Swiper(".mySwiper", {
//   loop: true,
//   pagination: {
//     el: ".swiper-pagination",
//     clickable: true,
//   },
//   navigation: {
//     nextEl: ".swiper-button-next",
//     prevEl: ".swiper-button-prev",
//   },
// });
function getDirection() {
  var windowWidth = window.innerWidth;
  var direction = window.innerWidth <= 760 ? "vertical" : "horizontal";

  return direction;
}
