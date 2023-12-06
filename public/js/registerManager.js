import { functions } from "./functions.js";
import { api } from "./api.js";
import { validators } from "./validators.js";
import { constants } from "./constant.js";

// Execute code when DOM content is fully loaded
document.addEventListener('DOMContentLoaded', () => {

    // Attach submit event listener to the first register form
    document.getElementById('first-register-form').addEventListener('submit', async (event) => {
        try {
            // Get form elements
            const mail = document.getElementById('email-register'); // Email element
            const name = document.getElementById('first-name'); // First name element
            const surname = document.getElementById('last-name'); // Last name element

            functions.trimFormValues([mail, name, surname]); // Trim form values
            functions.loader('ON'); // Turn on the loader
            event.preventDefault(); // Prevent the default form submission

            // Validations to check
            let validations = {
                '#first-name': [() => validators.isEmpty(name.value), () => validators.isLetters(name.value)],
                '#last-name': [() => validators.isEmpty(surname.value), () => validators.isLetters(surname.value)],
                '#email-register': [
                    () => validators.isEmpty(mail.value),
                    () => validators.isValidMail(mail.value),
                    () => api.mailCheckAPI(mail.value.toLowerCase())
                ]
            };

            // Validate all form inputs
            if (await validators.validateForm(validations)) {
                event.target.submit(); // Submit the form if validations pass
            }

            functions.loader(); // Turn off the loader

        } catch (err) {
            functions.loader(); // Turn off the loader
            if (err.body) {
                functions.showModalErr(constants.GENERAL_ERR); // Show a modal with a general error message
            }
        }
    });
});