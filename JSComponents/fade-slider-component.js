export function injectFadeSlider(container) {   // afterElement = document.querySelector('header') - previous parameter
    //const fadeSlider = document.createElement('div');
    //fadeSlider.className = 'banner-fade-slider';
    const fadeSlider = container;
    fadeSlider.innerHTML = `
            <img src="./Pictures/Slide1.jpg" class="slide active">
            <img src="./Pictures/Slide2.jpg" class="slide">
            <img src="./Pictures/Slide3.jpg" class="slide">
            <img src="./Pictures/Slide4.jpg" class="slide">

            <button class="prev">&#10094;</button>
            <button class="next">&#10095;</button>
    `;

    //afterElement.insertAdjacentElement('afterend', fadeSlider);

    const slides = fadeSlider.querySelectorAll('.slide');
    let current = 0;
    let intervalId = null;

    function showSlide(index) {
        slides.forEach((slide, i) => {
            slide.classList.toggle('active', i === index);
        });
    }

    function nextSlide() {
        current = (current + 1) % slides.length;
        showSlide(current);
    }

    function previousSlide() {
        current = (current - 1 + slides.length) % slides.length;
        showSlide(current);
    }

    function startInterval() {
        clearInterval(intervalId);
        intervalId = setInterval(nextSlide, 3000);
    }

    fadeSlider.querySelector('.next').addEventListener('click', () => {
        nextSlide();
        clearInterval(intervalId);
    });

    fadeSlider.querySelector('.prev').addEventListener('click', () => {
        previousSlide();
        clearInterval(intervalId);
    });

    fadeSlider.addEventListener('mouseenter', () => {
        clearInterval(intervalId);
    });

    fadeSlider.addEventListener('mouseleave', () => {
        startInterval();
    });

    startInterval(); // Auto start
}