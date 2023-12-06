import { functions } from "./functions.js";
import { validators } from "./validators.js";
import { constants } from "./constant.js";

// Execute code when DOM content is fully loaded
document.addEventListener('DOMContentLoaded', () => {

    // Attach submit event listener to the login form
    document.getElementById('login-form').addEventListener('submit', async (event) => {
        try {
            event.preventDefault(); // Prevent the default form submission
            functions.loader('ON'); // Turn on the loader

            // Get the email and password elements
            const mail = document.getElementById('login-email');
            const pass = document.getElementById('login-password');

            // Define validations for email and password
            let validations = {
                '#login-email': [() => validators.isEmpty(mail.value), () => validators.isValidMail(mail.value)],
                '#login-password': [() => validators.isEmpty(pass.value), () => validators.lengthValidator(pass.value)]
            };

            functions.trimFormValues([mail, pass]); // Trim form values
            mail.value = mail.value.toLowerCase(); // Convert email to lowercase

            // Validate form inputs
            if (await validators.validateForm(validations)) {
                // If validation passes, submit the form
                document.getElementById('login-form').submit();
            }

            functions.loader(); // Turn off the loader

        } catch (err) {
            functions.loader(); // Turn off the loader
            functions.showModalErr(constants.GENERAL_ERR); // Show a modal with a general error message
        }
    });
});