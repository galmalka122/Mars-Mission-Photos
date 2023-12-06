import { functions } from "./functions.js";
import { validators } from "./validators.js";
import { constants } from "./constant.js";

// Execute code when DOM content is fully loaded
document.addEventListener('DOMContentLoaded', () => {

    // Apply timer to view seconds left
    functions.passwordTimer();

    // Attach submit event listener to the password form
    document.getElementById('password-form').addEventListener('submit', async (event) => {
        try {
            event.preventDefault(); // Prevent the default form submission
            functions.loader('ON'); // Turn on the loader

            // Get the password and confirmation password elements
            const pass = document.getElementById('input-password');
            const pass2 = document.getElementById('input-password2');

            // Define validations for password and confirmation password
            let validations = {
                '#input-password': [() => validators.isEmpty(pass.value), () => validators.lengthValidator(pass.value)],
                '#input-password2': [() => validators.isEmpty(pass2.value), () => validators.isSame(pass.value, pass2.value)]
            };

            functions.trimFormValues([pass, pass2]); // Trim form values

            // Validate form inputs
            if (await validators.validateForm(validations, false)) {
                // If validation passes, submit the form
                document.getElementById('password-form').submit();
            }

            functions.loader(); // Turn off the loader

        } catch (err) {
            functions.loader(); // Turn off the loader
            functions.showModalErr(constants.GENERAL_ERR); // Show a modal with a general error message
        }
    });
});