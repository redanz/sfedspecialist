document.addEventListener("DOMContentLoaded", () => {
  const year = document.getElementById("year");
  if (year) {
    year.textContent = new Date().getFullYear();
  }

  const carousel = document.querySelector(".testimonial-carousel");
  if (!carousel) return;

  const track = carousel.querySelector(".carousel-track");
  const slides = Array.from(track.querySelectorAll(".carousel-slide"));
  const prevBtn = carousel.querySelector('[data-dir="prev"]');
  const nextBtn = carousel.querySelector('[data-dir="next"]');
  const dotsContainer = carousel.querySelector(".carousel-dots");

  if (!slides.length) return;

  let current = 0;

  // Build dots based on slide count
  slides.forEach((_, idx) => {
    const dot = document.createElement("button");
    dot.className = "carousel-dot";
    dot.type = "button";
    dot.setAttribute("aria-label", `Go to testimonial ${idx + 1}`);
    dot.addEventListener("click", () => goTo(idx));
    dotsContainer.appendChild(dot);

  // Scroll reveal for elements with .reveal
  const revealEls = document.querySelectorAll(".reveal");
  if (revealEls.length) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target); // animate only once
          }
        });
      },
      {
        threshold: 0.15,             // fire when ~15% visible
      }
    );

    revealEls.forEach((el) => observer.observe(el));
  }
  });

  const dots = Array.from(dotsContainer.querySelectorAll(".carousel-dot"));

  const goTo = (index) => {
    current = (index + slides.length) % slides.length;
    track.style.transform = `translateX(-${current * 100}%)`;
    dots.forEach((dot, idx) => {
      dot.classList.toggle("is-active", idx === current);
    });
  };

  const handlePrev = () => goTo(current - 1);
  const handleNext = () => goTo(current + 1);

  if (prevBtn) prevBtn.addEventListener("click", handlePrev);
  if (nextBtn) nextBtn.addEventListener("click", handleNext);

  // Keyboard support for accessibility
  carousel.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") handlePrev();
    if (e.key === "ArrowRight") handleNext();
  });

  // Swipe support for mobile
  let touchStartX = 0;
  let touchEndX = 0;
  let isDragging = false;

  const carouselWindow = carousel.querySelector(".carousel-window");
  if (carouselWindow) {
    carouselWindow.addEventListener("touchstart", (e) => {
      touchStartX = e.touches[0].clientX;
      touchEndX = touchStartX; // Initialize to same position
      isDragging = true;
    }, { passive: true });

    carouselWindow.addEventListener("touchmove", (e) => {
      if (isDragging) {
        touchEndX = e.touches[0].clientX;
      }
    }, { passive: true });

    carouselWindow.addEventListener("touchend", () => {
      if (!isDragging) return;
      isDragging = false;

      const swipeThreshold = 50; // Minimum distance for a swipe
      const diff = touchStartX - touchEndX;

      if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0) {
          // Swipe left - go to next
          handleNext();
        } else {
          // Swipe right - go to previous
          handlePrev();
        }
      }

      // Reset
      touchStartX = 0;
      touchEndX = 0;
    });
  }

  goTo(0);
});

// Contact form handling
const contactForm = document.querySelector(".contact-form");
if (contactForm) {
  contactForm.addEventListener("submit", (e) => {
    // Update _replyto field with the email from the form
    const emailInput = contactForm.querySelector('input[name="email"]');
    const replyToField = contactForm.querySelector('input[name="_replyto"]');
    
    if (emailInput && replyToField && emailInput.value) {
      replyToField.value = emailInput.value;
    }
    
    // Don't prevent default - let Formspree handle it
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    
    if (submitBtn) {  // Add this check
      const originalText = submitBtn.textContent;
      
      // Show loading state
      submitBtn.textContent = "Sending...";
      submitBtn.disabled = true;
      
      // Reset button after a delay (Formspree will redirect/refresh)
      setTimeout(() => {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
      }, 3000);
    }
  });
}