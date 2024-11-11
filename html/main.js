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
  breakpoints: {
    240: {
      slidesPerView: 1.5,
      spaceBetween: 10,
    },
    640: {
      slidesPerView: 2,
      spaceBetween: 20,
    },
    768: {
      slidesPerView: 2.5,
      spaceBetween: 40,
    },
    998: {
      slidesPerView: 2.5,
      spaceBetween: 20,
    },
    1024: {
      slidesPerView: 3.5,
      spaceBetween: 50,
    },
  },
});
new Swiper(".feedblack", {
  slidesPerView: 1,
  spaceBetween: 10,
  freeMode: true,
  direction: getDirection(),
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },
  breakpoints: {
    240: {
      slidesPerView: 1,
      spaceBetween: 0,
    },
    640: {
      slidesPerView: 1.5,
      spaceBetween: 20,
    },
    768: {
      slidesPerView: 2,
      spaceBetween: 30,
    },
    938: {
      slidesPerView: 2.5,
      spaceBetween: 40,
    },
    1024: {
      slidesPerView: 3,
      spaceBetween: 50,
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
var swiper = new Swiper(".mySwiper", {
  slidesPerView: 1,
  spaceBetween: 30,
  loop: true,
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },
  breakpoints: {
    240: {
      slidesPerView: 2,
      spaceBetween: 10,
    },
    640: {
      slidesPerView: 2,
      spaceBetween: 20,
    },
    768: {
      slidesPerView: 2,
      spaceBetween: 40,
    },
    898: {
      slidesPerView: 3,
      spaceBetween: 40,
    },
    1024: {
      slidesPerView: 4,
      spaceBetween: 50,
    },
  },
});
var swiper = new Swiper(".voucher", {
  slidesPerView: 1,
  spaceBetween: 10,
  loop: true,
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },
  breakpoints: {
    // 140: {
    //   slidesPerView: 1,
    //   spaceBetween: 10,
    // },
    768: {
      slidesPerView: 1.5,
      magrin: 20,
      spaceBetween: 20,
    },
    918: {
      slidesPerView: 2,
      spaceBetween: 50,
      magrin: 20,
    },
    1024: {
      slidesPerView: 3,
      magrin: 20,
      spaceBetween: 50,
    },
  },
});
function getDirection() {
  var windowWidth = window.innerWidth;
  var direction = window.innerWidth <= 760 ? "vertical" : "horizontal";

  return direction;
}
