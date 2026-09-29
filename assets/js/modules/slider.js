export function initSlider() {
  const line = document.querySelector(".slider__line");
  const lineWrapper = document.querySelector(".slider__line-wrapper");
  const paginationItems = document.querySelectorAll(".slider__pagination-item");
  const originalSlides = Array.from(
    line.querySelectorAll(".slider__slide-item:not(.clone)"),
  );

  if (!line || originalSlides.length === 0) {
    console.error("Slider: elements not found");
    return;
  }

  let slides = [];
  let currentIndex = 1;
  let previousActiveIndex = 0;
  let isTransitioning = false;
  let touchStartX = 0;
  let touchEndX = 0;
  let slideWidth = 0;

  // Clone
  function cloneSlides() {
    const firstSlide = originalSlides[0];
    const lastSlide = originalSlides[originalSlides.length - 1];

    const firstClone = firstSlide.cloneNode(true);
    const lastClone = lastSlide.cloneNode(true);

    firstClone.classList.add("clone");
    lastClone.classList.add("clone");

    line.insertBefore(lastClone, firstSlide);
    line.appendChild(firstClone);
  }

  // Size
  function calculateSlideWidth() {
    slideWidth = lineWrapper.offsetWidth;

    slides.forEach(function (slide) {
      slide.style.width = slideWidth + "px";
      slide.style.minWidth = slideWidth + "px";
      slide.style.flex = "0 0 " + slideWidth + "px";
    });
  }

  function setPosition() {
    const offset = -currentIndex * slideWidth;
    line.style.transform = "translateX(" + offset + "px)";
  }

  // Nav
  function next() {
    if (isTransitioning) return;

    isTransitioning = true;
    currentIndex++;
    setPosition();
    updatePagination("next");
  }

  function prev() {
    if (isTransitioning) return;

    isTransitioning = true;
    currentIndex--;
    setPosition();
    updatePagination("prev");
  }

  function goToSlide(index) {
    if (isTransitioning) return;

    const direction = index > previousActiveIndex ? "next" : "prev";

    isTransitioning = true;
    currentIndex = index + 1;
    setPosition();
    updatePagination(direction);
  }

  // Pagination
  function getActiveIndex() {
    let activeIndex = currentIndex - 1;

    if (activeIndex < 0) {
      activeIndex = originalSlides.length - 1;
    } else if (activeIndex >= originalSlides.length) {
      activeIndex = 0;
    }

    return activeIndex;
  }

  function updatePagination(direction) {
    const activeIndex = getActiveIndex();
    const prevIndex = previousActiveIndex;

    if (prevIndex === activeIndex) return;

    const prevItem = paginationItems[prevIndex];
    const newItem = paginationItems[activeIndex];

    paginationItems.forEach(function (item) {
      item.classList.remove("active", "exit-right", "prepare-right");
    });

    if (direction === "next") {
      newItem.classList.add("prepare-right");

      requestAnimationFrame(function () {
        requestAnimationFrame(function () {
          newItem.classList.remove("prepare-right");
          newItem.classList.add("active");
        });
      });
    } else if (direction === "prev") {
      prevItem.classList.add("exit-right");
      newItem.classList.add("active");

      setTimeout(function () {
        prevItem.classList.add("no-transition");
        prevItem.classList.remove("exit-right");

        requestAnimationFrame(function () {
          requestAnimationFrame(function () {
            prevItem.classList.remove("no-transition");
          });
        });
      }, 450);
    }

    previousActiveIndex = activeIndex;
  }

  // Carousel
  function handleTransitionEnd() {
    isTransitioning = false;

    if (currentIndex === 0) {
      line.style.transition = "none";
      currentIndex = originalSlides.length;
      setPosition();

      setTimeout(function () {
        line.style.transition = "transform 0.4s ease";
      }, 10);
    } else if (currentIndex === slides.length - 1) {
      line.style.transition = "none";
      currentIndex = 1;
      setPosition();

      setTimeout(function () {
        line.style.transition = "transform 0.4s ease";
      }, 10);
    }
  }

  // Swipes
  function handleTouchStart(e) {
    touchStartX = e.touches[0].clientX;
  }

  function handleTouchMove(e) {
    touchEndX = e.touches[0].clientX;
  }

  function handleTouchEnd() {
    const diff = touchStartX - touchEndX;
    const threshold = slideWidth * 0.2;

    if (Math.abs(diff) > threshold) {
      if (diff > 0) {
        next();
      } else {
        prev();
      }
    }
  }

  function bindEvents() {
    const btnLeft = document.getElementById("slider-btn-left");
    const btnRight = document.getElementById("slider-btn-right");

    if (btnLeft) {
      btnLeft.addEventListener("click", () => prev());
    }

    if (btnRight) {
      btnRight.addEventListener("click", () => next());
    }

    paginationItems.forEach(function (item, index) {
      item.addEventListener("click", () => goToSlide(index));
    });

    line.addEventListener("transitionend", () => handleTransitionEnd());

    line.addEventListener("touchstart", function (e) {
      handleTouchStart(e);
    });

    line.addEventListener("touchmove", function (e) {
      handleTouchMove(e);
    });

    line.addEventListener("touchend", () => handleTouchEnd());

    window.addEventListener("resize", function () {
      calculateSlideWidth();
      line.style.transition = "none";
      setPosition();

      setTimeout(function () {
        line.style.transition = "transform 0.4s ease";
      }, 10);
    });
  }

  cloneSlides();
  slides = Array.from(line.children);
  calculateSlideWidth();

  line.style.transition = "none";
  setPosition();

  requestAnimationFrame(function () {
    requestAnimationFrame(function () {
      line.style.transition = "transform 0.4s ease";
    });
  });

  bindEvents();
}
