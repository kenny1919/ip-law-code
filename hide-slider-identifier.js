// Select all elements with the attribute `slider-identifier`
const sliders = document.querySelectorAll('[slider-identifier]');

// Loop through all the elements
sliders.forEach((slider, index) => {
    // Add the class `is-hidden` to all elements except the first one
    if (index !== 0) {
        slider.classList.add('is-hidden');
    }
});
