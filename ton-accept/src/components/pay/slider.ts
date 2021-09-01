/* eslint-disable */
// @ts-nocheck
export const general = () => {
  const slides = document.getElementsByClassName("slide");
  const counter = document.getElementsByClassName("count")[0];
  const sliderNav = document.getElementsByClassName("slider-nav")[0];

  if (slides.length > 1) {
    let currentSlide = 0;
    let countCurrent = 1;

    function changeSlide(dir) {
      const nextSlide =
        dir === "prev"
          ? currentSlide - 1 < 0
            ? slides.length - 1
            : currentSlide - 1
          : currentSlide + 1 === slides.length
          ? 0
          : currentSlide + 1;

      for (let i = 0; i < slides.length; i++) {
        slides[currentSlide].classList.remove("show");
        slides[nextSlide].classList.add("show");
      }

      currentSlide = nextSlide;
      countCurrent = currentSlide + 1;
      counter.textContent = `${countCurrent}/${slides.length}`;
    }

    const next = document.getElementsByClassName("next")[0];
    const prev = document.getElementsByClassName("prev")[0];

    next.addEventListener("click", function () {
      changeSlide("next");
    });
    prev.addEventListener("click", function () {
      changeSlide("prev");
    });
  } else if (sliderNav) {
    sliderNav.remove();
  }

  const currencies = document.getElementsByClassName("currency");

  for (let i = 0; i < currencies.length; i++) {
    currencies[i].addEventListener(
      "click",
      function () {
        for (let k = 0; k < currencies.length; k++) {
          if (i !== k) {
            currencies[k].classList.remove("selected");
          }
        }
        if (currencies[i]) {
          currencies[i].classList.toggle("selected");
        }
      },
      false
    );
  }
};
