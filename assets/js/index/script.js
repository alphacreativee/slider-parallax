const slides = [
  {
    tag: "Website",
    marquee: "Eclipse Interactive Art Portfolio",
    image: "./assets/images/1.jpg",
  },
  {
    tag: "Website",
    marquee: "Creative Digital Experience",
    image: "./assets/images/2.jpg",
  },
  {
    tag: "Website",
    marquee: "Modern Web Solutions",
    image: "./assets/images/3.jpg",
  },
  {
    tag: "Website",
    marquee: "Interactive Design Studio",
    image: "./assets/images/4.jpg",
  },
  {
    tag: "Website",
    marquee: "Innovative Web Platform",
    image: "./assets/images/5.jpg",
  },
];

gsap.registerPlugin(ScrollTrigger);
document.addEventListener("DOMContentLoaded", () => {
  let activeSlideIndex = 0;
  let prevProgress = 0;
  let isAnimatingSlide = false;
  let triggerDestroyed = false;
  const lenis = new Lenis();

  lenis.on("scroll", ScrollTrigger.update);

  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });

  gsap.ticker.lagSmoothing(0);

  const initialSlide = document.querySelector(".carousel .slide");
  gsap.set(initialSlide, {
    clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
  });
  gsap.set(initialSlide.querySelector(".slide-img img"), {
    y: "0%",
  });

  initMarqueeAnimation(initialSlide.querySelector(".marquee-container h1"));

  function updateProgressBars(progress) {
    const progressBars = document.querySelectorAll(".progress-bar");
    progressBars.forEach((bar, index) => {
      const barProgress = Math.min(Math.max(progress * 5 - index, 0), 1);
      bar.style.setProperty("--progress", barProgress);
    });
  }

  function initMarqueeAnimation(h1Element) {
    const text = h1Element.textContent;
    h1Element.textContent = text + " " + text + " " + text;
    gsap.to(h1Element, {
      x: "-33.33%",
      duration: 10,
      ease: "linear",
      repeat: -1,
      rotation: 0.01,
    });
  }

  function createAndAnimationSlide(index, isScrollingForward) {
    const carousel = document.querySelector(".carousel");
    if (!carousel) return;
    const currentSlide = carousel.querySelector(".carousel .slide");
    if (!currentSlide) {
      isAnimatingSlide = false;
      return;
    }

    const slideData = slides[index];
    const newSlide = document.createElement("div");
    newSlide.className = "slide";
    newSlide.innerHTML = `
      <div class="slide-img">
        <img src="${slideData.image}" alt="" />
      </div>
      <div class="slide-copy">
        <div class="slide-tag">
          <p>${slideData.tag}</p>
        </div>
        <div class="slide-marquee">
          <div class="marquee-container">
            <h1>${slideData.marquee}</h1>
          </div>
        </div>
      </div>`;

    initMarqueeAnimation(newSlide.querySelector(".marquee-container h1"));
    const currentSlideImg = currentSlide.querySelector(".slide-img img");
    const currentSlideCopy = currentSlide.querySelector(".slide-copy");

    if (!currentSlideImg || !currentSlideCopy) {
      isAnimatingSlide = false;
      return;
    }

    // Kill existing animations
    gsap.killTweensOf(currentSlide);
    gsap.killTweensOf(currentSlideImg);
    gsap.killTweensOf(currentSlideCopy);

    const newSlideImg = newSlide.querySelector(".slide-img img");
    const newSlideCopy = newSlide.querySelector(".slide-copy");

    if (isScrollingForward) {
      // Forward scroll animation (slide comes from bottom)
      gsap.set(newSlide, {
        clipPath: "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)",
      });
      gsap.set(newSlideImg, { y: "25%" });
      gsap.set(newSlideCopy, { y: "100%" });

      carousel.appendChild(newSlide);

      // Animate new slide in
      gsap.to(newSlide, {
        clipPath: "polygon(0% 100%, 100% 100%, 100% 0%, 0% 0%)",
        duration: 1,
        ease: "power4.out",
      });
      gsap.to(newSlideImg, {
        y: "0%",
        duration: 1,
        ease: "power4.out",
      });
      gsap.to(newSlideCopy, {
        y: "0%",
        duration: 1,
        ease: "power4.out",
      });

      // Animate current slide out (to top)
      gsap.to(currentSlide, {
        clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)",
        duration: 1,
        ease: "power4.out",
        onComplete: () => {
          if (currentSlide.parentNode) {
            currentSlide.remove();
          }
          isAnimatingSlide = false;
        },
        onInterrupt: () => {
          isAnimatingSlide = false;
        },
      });
      gsap.to(currentSlideImg, {
        y: "-25%",
        duration: 1,
        ease: "power4.out",
      });
      gsap.to(currentSlideCopy, {
        y: "-100%",
        duration: 1,
        ease: "power4.out",
      });
    } else {
      // Backward scroll animation (slide comes from top)
      gsap.set(newSlide, {
        clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)",
      });
      gsap.set(newSlideImg, { y: "-25%" });
      gsap.set(newSlideCopy, { y: "-100%" });

      carousel.insertBefore(newSlide, currentSlide);

      // Animate new slide in
      gsap.to(newSlide, {
        clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
        duration: 1,
        ease: "power4.out",
      });
      gsap.to(newSlideImg, {
        y: "0%",
        duration: 1,
        ease: "power4.out",
      });
      gsap.to(newSlideCopy, {
        y: "0%",
        duration: 1,
        ease: "power4.out",
      });

      // Animate current slide out (to bottom)
      gsap.to(currentSlide, {
        clipPath: "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)",
        duration: 1,
        ease: "power4.out",
        onComplete: () => {
          if (currentSlide.parentNode) {
            currentSlide.remove();
          }
          isAnimatingSlide = false;
        },
        onInterrupt: () => {
          isAnimatingSlide = false;
        },
      });
      gsap.to(currentSlideImg, {
        y: "25%",
        duration: 1,
        ease: "power4.out",
      });
      gsap.to(currentSlideCopy, {
        y: "100%",
        duration: 1,
        ease: "power4.out",
      });
    }
  }

  const scrollTrigger = ScrollTrigger.create({
    trigger: ".carousel",
    start: "top top",
    end: `+=${window.innerHeight * 15}px`,
    pin: true,
    pinSpacing: true,
    scrub: 1,
    onUpdate: (self) => {
      if (triggerDestroyed) return;

      const progress = self.progress;
      updateProgressBars(progress);

      if (isAnimatingSlide) {
        return;
      }

      const isScrollingForward = progress > prevProgress;
      const targetSlideIndex = Math.min(Math.floor(progress * 5), 4);

      // Only trigger animation if slide index actually changed
      if (targetSlideIndex !== activeSlideIndex) {
        isAnimatingSlide = true;
        try {
          createAndAnimationSlide(targetSlideIndex, isScrollingForward);
          activeSlideIndex = targetSlideIndex;
        } catch (err) {
          console.error("Animation error:", err);
          isAnimatingSlide = false;
        }
      }

      prevProgress = progress;
    },
    onKill: () => {
      triggerDestroyed = true;
    },
  });
});
