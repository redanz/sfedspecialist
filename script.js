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

  goTo(0);
});
