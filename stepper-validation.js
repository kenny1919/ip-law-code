// stepper-validation.js

// Global validation function to check if all required fields are filled
function validateCurrentStep(currentStepper) {
    const mandatoryFields = currentStepper.querySelectorAll(
        'input[required], textarea[required], input[type="checkbox"][required], input[type="radio"][required]'
    );
    let isValid = true; // Assume the step is valid initially

    mandatoryFields.forEach(field => {
        let errorElement = null;
        let errorTextElement = null;

        if (field.type === 'radio' || field.type === 'checkbox') {
            // For radio buttons and checkboxes, check the entire group
            const fieldGroup = currentStepper.querySelectorAll(`input[name="${field.name}"]`);
            const anyChecked = Array.from(fieldGroup).some(input => input.checked);

            fieldGroup.forEach(input => {
                errorElement = input.closest('label').querySelector('.w-checkbox-input, .w-form-formradioinput');
                errorTextElement = input.closest('.checkbox-wrapper, .step_field-wrapper').querySelector('[wized="demo_step_errorText"]');

                if (errorElement) {
                    if (anyChecked) {
                        errorElement.classList.remove('is-error');
                    } else {
                        errorElement.classList.add('is-error');
                        if (errorTextElement) {
                            errorTextElement.classList.remove('is-hidden');
                        }
                        isValid = false;
                    }
                }

                // Add an event listener to remove the error when the user selects a checkbox or radio button
                input.addEventListener('change', () => {
                    const relatedErrorElement = input.closest('label').querySelector('.w-checkbox-input, .w-form-formradioinput');
                    if (input.checked) {
                        if (relatedErrorElement) {
                            relatedErrorElement.classList.remove('is-error');
                        }
                        if (errorTextElement) {
                            errorTextElement.classList.add('is-hidden');
                        }
                    }
                });
            });
        } else {
            // For other input types and text areas, use the slider-error-element attribute
            if (field.hasAttribute('slider-error-element')) {
                errorElement = field.closest('[slider-error-element]');
            } else {
                errorElement = field; // Fallback to the field itself
            }

            // Find the error text element closest to the field
            errorTextElement = field.closest('.step_field-wrapper').querySelector('[wized="demo_step_errorText"]');

            if (!field.value.trim()) {
                isValid = false;
                if (errorElement) {
                    errorElement.classList.add('is-error');
                }
                if (errorTextElement) {
                    errorTextElement.classList.remove('is-hidden');
                }
            } else {
                if (errorElement) {
                    errorElement.classList.remove('is-error');
                }
                if (errorTextElement) {
                    errorTextElement.classList.add('is-hidden');
                }
            }

            // Add an event listener to remove the error when the user inputs text
            field.addEventListener('input', () => {
                if (field.value.trim()) {
                    if (errorElement) {
                        errorElement.classList.remove('is-error');
                    }
                    if (errorTextElement) {
                        errorTextElement.classList.add('is-hidden');
                    }
                }
            });
        }
    });

    return isValid; // Return true if valid, false otherwise
}
