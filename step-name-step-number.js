// Select the elements with the `next-step-label` and `next-step-number` attributes
const nextStepLabelElement = document.querySelector('[next-step-label]');
const nextStepNumberElement = document.querySelector('[next-step-number]');

// Find all `.horizontal-slide_wrapper` elements
const slideWrappers = document.querySelectorAll('.horizontal-slide_wrapper');

// Function to update the next-step-label and next-step-number based on the current visible slide
function updateNextStepLabelAndNumber() {
    slideWrappers.forEach((slideWrapper, index) => {
        if (!slideWrapper.classList.contains('is-hidden')) {
            const nextSlide = slideWrappers[index + 1];
            if (nextSlide) {
                const stepHeaderElement = nextSlide.querySelector('[step-header]');
                if (stepHeaderElement) {
                    nextStepLabelElement.textContent = stepHeaderElement.textContent;

                    // Update the next-step-number with the step number of the next slide
                    const nextStepNumber = index + 2; // Since index is 0-based and step numbers start from 1
                    nextStepNumberElement.textContent = `STEP ${nextStepNumber}`;
                }
            }
        }
    });
}

// Initial call to set the next-step-label and next-step-number based on the first visible slide
updateNextStepLabelAndNumber();

// Setting up a MutationObserver to watch for changes in the class attribute of each slide
slideWrappers.forEach(slideWrapper => {
    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            if (mutation.attributeName === 'class') {
                // Call the function to update the next-step-label and next-step-number whenever a slide's class changes
                updateNextStepLabelAndNumber();
            }
        });
    });

    // Start observing the class attribute for changes
    observer.observe(slideWrapper, { attributes: true });
});
