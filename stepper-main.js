// Ensure that stepper-validation.js is loaded before this script
// Select all elements with the attribute `slider-navigation="next"`
const nextButtons = document.querySelectorAll('[slider-navigation="next"]');

// Variable to store the current journey path
let currentJourneyPath = [];

// Function to validate all previous steps
function validateAllPreviousSteps(currentStepper) {
    const allSteppers = document.querySelectorAll('[slider-identifier]');
    let allValid = true;

    // Loop through each stepper up to the current one
    for (const stepper of allSteppers) {
        if (stepper === currentStepper) break;

        // Validate the step
        const isValid = validateCurrentStep(stepper);

        // If any step is invalid, prevent moving to the next step
        if (!isValid) {
            allValid = false;
            stepper.classList.remove('is-hidden'); // Reveal the step if invalid
            stepper.scrollIntoView({ behavior: 'smooth' }); // Scroll to the invalid step
            break; // Stop further validation if an invalid step is found
        }
    }

    return allValid;
}

// Add a click event listener to each 'next' button
nextButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Find the last visible stepper (the one without `.is-hidden` that appears last in the DOM)
        const visibleSteppers = document.querySelectorAll('[slider-identifier]:not(.is-hidden)');
        const currentStepper = visibleSteppers[visibleSteppers.length - 1];

        // Validate all previous steps before proceeding
        const allPreviousValid = validateAllPreviousSteps(currentStepper);

        if (!allPreviousValid) {
            return; // Prevent moving to the next step if any previous step is invalid
        }

        // Validate the current step
        const isValid = validateCurrentStep(currentStepper);

        // If the step is not valid, return early and don't proceed to the next step
        if (!isValid) return;

        // Get the destination from the current stepper's `slider-destination` attribute
        const nextDestination = currentStepper.getAttribute('slider-destination');

        if (nextDestination === 'multi') {
            // Handle the special case where the next destination is 'multi'
            const multiStepper = document.querySelector('[slider-destination="multi"]');

            // Find the active radio button (the one with the `w--redirected-checked` class)
            const activeRadio = multiStepper.querySelector('.w--redirected-checked');

            if (activeRadio) {
                // Get the journey path from the active radio input's `slider-journey` attribute
                currentJourneyPath = activeRadio.closest('label').getAttribute('slider-journey').split(',').map(step => step.trim());

                // Reveal the first step in the journey path
                const nextStepper = document.querySelector(`[slider-identifier="${currentJourneyPath[0]}"]`);
                if (nextStepper) {
                    nextStepper.classList.remove('is-hidden');
                    nextStepper.scrollIntoView({ behavior: 'smooth' });

                    // Trigger a click on the step header-wrapper if it exists
                    const stepHeaderWrapper = nextStepper.querySelector('.step_header-wrapper');
                    if (stepHeaderWrapper) {
                        stepHeaderWrapper.click();
                    }
                }
            }
        } else {
            // Find the next stepper by matching the `slider-identifier` with the `slider-destination` value
            const nextStepper = document.querySelector(`[slider-identifier="${nextDestination}"]`);

            // Show the next stepper without hiding the current one
            if (nextStepper) {
                nextStepper.classList.remove('is-hidden');
                nextStepper.scrollIntoView({ behavior: 'smooth' });

                // Trigger a click on the step header-wrapper if it exists
                const stepHeaderWrapper = nextStepper.querySelector('.step_header-wrapper');
                if (stepHeaderWrapper) {
                    stepHeaderWrapper.click();
                }

                // Check if the current step is the last one that has `slider-wized-request`
                const nextHiddenStepperIndex = currentJourneyPath.indexOf(nextStepper.getAttribute('slider-identifier')) + 1;
                const nextHiddenStepper = document.querySelector(`[slider-identifier="${currentJourneyPath[nextHiddenStepperIndex]}"]`);

                if (nextHiddenStepper && nextHiddenStepper.hasAttribute('slider-wized-request')) {
                    const nextButton = document.querySelector('[slider-navigation="next"]');
                    const submitButton = document.querySelector('[slider-navigation="submit"]');
                    if (nextButton) {
                        nextButton.classList.add('is-hidden');
                    }
                    if (submitButton) {
                        submitButton.classList.remove('is-hidden');

                        // Set the custom text on the submit button
                        const generateButtonLabel = nextHiddenStepper.getAttribute('slider-generate-button-label');
                        const generateResultsLabel = submitButton.querySelector('[wized="demo_generateResultsLabel"]');

                        if (generateResultsLabel) {
                            generateResultsLabel.textContent = generateButtonLabel;
                        }

                        // Add functionality to the submit button
                        submitButton.addEventListener('click', () => {
                            const requestName = nextHiddenStepper.getAttribute('slider-wized-request');

                            // Execute the Wized request
                            window.Wized = window.Wized || [];
                            window.Wized.push(async (Wized) => {
                                try {
                                    const result = await Wized.requests.execute(requestName);
                                } catch (error) {
                                    // Handle the error (optional)
                                } finally {
                                    // Reveal the next step after the request completes (success or failure)
                                    nextHiddenStepper.classList.remove('is-hidden');
                                    nextHiddenStepper.scrollIntoView({ behavior: 'smooth' });

                                    // Trigger a click on the step header-wrapper if it exists
                                    const stepHeaderWrapper = nextHiddenStepper.querySelector('.step_header-wrapper');
                                    if (stepHeaderWrapper) {
                                        stepHeaderWrapper.click();
                                    }

                                    // Check if this is the last step with `slider-wized-request` in the journey path
                                    if (!nextHiddenStepper.hasAttribute('slider-wized-request') || currentJourneyPath[currentJourneyPath.length - 1] === nextHiddenStepper.getAttribute('slider-identifier')) {
                                        const navigationWrapper = document.querySelector('[wized="demo_stepNavigation_wrapper"]');
                                        if (navigationWrapper) {
                                            navigationWrapper.classList.add('is-hidden');
                                        }
                                    }

                                    // Toggle buttons for the next steps without `slider-wized-request`
                                    const furtherStepsExist = nextHiddenStepperIndex + 1 < currentJourneyPath.length;
                                    if (furtherStepsExist) {
                                        const nextButton = document.querySelector('[slider-navigation="next"]');
                                        const submitButton = document.querySelector('[slider-navigation="submit"]');
                                        if (submitButton) {
                                            submitButton.classList.add('is-hidden');
                                        }
                                        if (nextButton) {
                                            nextButton.classList.remove('is-hidden');
                                        }
                                    }
                                }
                            });
                        }, { once: true }); // Ensure the click event is only added once
                    }
                } else {
                    // If the next hidden step doesn't have `slider-wized-request`, just show the next step normally
                    const nextButton = document.querySelector('[slider-navigation="next"]');
                    const submitButton = document.querySelector('[slider-navigation="submit"]');
                    if (submitButton) {
                        submitButton.classList.add('is-hidden');
                    }
                    if (nextButton) {
                        nextButton.classList.remove('is-hidden');
                    }
                }
            }
        }
    });
});
