document.addEventListener("DOMContentLoaded", () => {
  // --- Десктоп слайдер ---
  const sliderTrack = document.getElementById("slider-track");
  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");
  const pageIndicator = document.getElementById("page-indicator");
  const sliderWrapper = document.querySelector('.slider-wrapper');

  let desktopCurrentIndex;
  let desktopSlideStep;
  let visibleCards;
  let cards;
  let totalCards;

  function initDesktopSlider() {
    desktopSlideStep = getSlideStep();
    visibleCards = Math.floor(sliderWrapper.offsetWidth / desktopSlideStep);
    cards = Array.from(sliderTrack.querySelectorAll(".player-card")).filter(card => !card.classList.contains('clone'));
    totalCards = cards.length;

    // Удаляем старые клоны если есть
    sliderTrack.querySelectorAll('.clone').forEach(clone => clone.remove());

    // Клонируем
    const clonesBefore = cards.slice(-visibleCards).map(card => {
      const clone = card.cloneNode(true);
      clone.classList.add('clone');
      return clone;
    });
    const clonesAfter = cards.slice(0, visibleCards).map(card => {
      const clone = card.cloneNode(true);
      clone.classList.add('clone');
      return clone;
    });

    clonesBefore.forEach(clone => sliderTrack.prepend(clone));
    clonesAfter.forEach(clone => sliderTrack.append(clone));

    cards = sliderTrack.querySelectorAll(".player-card");
    desktopCurrentIndex = visibleCards;
    sliderTrack.style.transition = "none";
    sliderTrack.style.transform = `translateX(-${desktopCurrentIndex * desktopSlideStep}px)`;
    updateIndicator();
  }

  function getSlideStep() {
    const windowWidth = window.innerWidth;
    if (windowWidth <= 768) return 335 + 72;
    return 394 + 20;
  }

  function updateIndicator() {
    let displayIndex = ((desktopCurrentIndex - visibleCards) % totalCards + totalCards) % totalCards + 1;
    pageIndicator.textContent = `${displayIndex} / ${totalCards}`;
  }

  function moveSlider() {
    sliderTrack.style.transition = "transform 0.4s ease-in-out";
    sliderTrack.style.transform = `translateX(-${desktopCurrentIndex * desktopSlideStep}px)`;
    updateIndicator();
  }

  sliderTrack.addEventListener("transitionend", () => {
    if (desktopCurrentIndex >= cards.length - visibleCards) {
      sliderTrack.style.transition = "none";
      desktopCurrentIndex = visibleCards;
      sliderTrack.style.transform = `translateX(-${desktopCurrentIndex * desktopSlideStep}px)`;
    }
    if (desktopCurrentIndex < visibleCards) {
      sliderTrack.style.transition = "none";
      desktopCurrentIndex = cards.length - visibleCards * 2;
      sliderTrack.style.transform = `translateX(-${desktopCurrentIndex * desktopSlideStep}px)`;
    }
  });

  function goToPrev() {
    desktopCurrentIndex--;
    moveSlider();
  }

  function goToNext() {
    desktopCurrentIndex++;
    moveSlider();
  }

  // Автоматическая прокрутка слайдера каждые 4 секунды (десктоп)
  let autoSlideInterval = setInterval(() => {
    desktopCurrentIndex++;
    moveSlider();
  }, 4000);

  // Остановка и перезапуск автопрокрутки при клике на кнопки (десктоп)
  function resetAutoSlide() {
    clearInterval(autoSlideInterval);
    autoSlideInterval = setInterval(() => {
      desktopCurrentIndex++;
      moveSlider();
    }, 4000);
  }

  prevBtn.addEventListener("click", () => {
    goToPrev();
    resetAutoSlide();
  });

  nextBtn.addEventListener("click", () => {
    goToNext();
    resetAutoSlide();
  });

  window.addEventListener("resize", () => {
    initDesktopSlider();
  });

  initDesktopSlider();


  // --- Мобильный слайдер ---
  const slidesWrapper = document.querySelector('.slides-wrapper');
  const slides = document.querySelectorAll('.mobile-slide');
  const dots = document.querySelectorAll('.dot');
  const prevArrow = document.querySelector('.nav-arrow.prev');
  const nextArrow = document.querySelector('.nav-arrow.next');

  let mobileCurrentIndex = 0;
  const slideWidth = 335;
  const gap = 40;

  function updateSlider() {
    const step = slideWidth + gap;
    slidesWrapper.style.transition = "transform 0.4s ease-in-out";
    slidesWrapper.style.transform = `translateX(${-mobileCurrentIndex * step}px)`;

    dots.forEach((dot, index) => {
      dot.classList.toggle('active', index === mobileCurrentIndex);
    });

    prevArrow.classList.toggle('active', mobileCurrentIndex > 0);
    nextArrow.classList.toggle('active', mobileCurrentIndex < slides.length - 1);
  }

  prevArrow.addEventListener('click', () => {
    if (mobileCurrentIndex > 0) {
      mobileCurrentIndex--;
      updateSlider();
      resetMobileAutoSlide();
    }
  });

  nextArrow.addEventListener('click', () => {
    if (mobileCurrentIndex < slides.length - 1) {
      mobileCurrentIndex++;
      updateSlider();
      resetMobileAutoSlide();
    }
  });

  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      mobileCurrentIndex = index;
      updateSlider();
      resetMobileAutoSlide();
    });
  });

  // Автоматическая прокрутка мобильного слайдера каждые 4 секунды
  let mobileAutoSlideInterval = setInterval(() => {
    mobileCurrentIndex++;
    if (mobileCurrentIndex >= slides.length) {
      mobileCurrentIndex = 0;
    }
    updateSlider();
  }, 4000);

  // Функция сброса автопрокрутки мобильного слайдера при взаимодействии
  function resetMobileAutoSlide() {
    clearInterval(mobileAutoSlideInterval);
    mobileAutoSlideInterval = setInterval(() => {
      mobileCurrentIndex++;
      if (mobileCurrentIndex >= slides.length) {
        mobileCurrentIndex = 0;
      }
      updateSlider();
    }, 4000);
  }

  updateSlider();
});
