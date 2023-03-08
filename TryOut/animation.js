const slider = document.querySelector(".slider");
const prevBtn = document.getElementById("prev-btn");
const nextBtn = document.getElementById("next-btn");

let currentSlide = 0;
let sliderTexts = Array.from(document.querySelectorAll(".slider-text"));

function showSlide(n) {
    // If the slide index is out of bounds, wrap around to the other end of the slider
    if (n >= sliderTexts.length) {
        n = 0;
    } else if (n < 0) {
        n = sliderTexts.length - 1;
    }

    // Hide the current slide
    sliderTexts[currentSlide].classList.remove("active");
    sliderTexts[currentSlide].classList.add(
        n < currentSlide ? "previous" : "next"
    );

    // Show the new slide
    sliderTexts[n].classList.remove(n < currentSlide ? "next" : "previous");
    sliderTexts[n].classList.add("active");

    // Update the current slide index
    currentSlide = n;
}

// Initialize the slider by hiding all slides except the first one
sliderTexts.forEach((text, index) => {
    if (index !== 0) {
        text.classList.add("previous");
    } else {
        text.classList.add("active");
    }
});

// Handle click events for the previous and next buttons
prevBtn.addEventListener("click", () => {
    let prevSlide = currentSlide - 1;
    if (prevSlide < 0) {
        prevSlide = sliderTexts.length - 1;
    }
    showSlide(prevSlide);
});

nextBtn.addEventListener("click", () => {
    let nextSlide = currentSlide + 1;
    if (nextSlide >= sliderTexts.length) {
        nextSlide = 0;
    }
    showSlide(nextSlide);

    // If we just wrapped around to the beginning, hide the last slide
    if (nextSlide === 0) {
        sliderTexts[sliderTexts.length - 1].classList.add("previous");
    }
});
