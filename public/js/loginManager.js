import {functions} from "./functions.js";
import {validators} from "./validators.js";
import {constants} from "./constant.js";

document.addEventListener('DOMContentLoaded', () => {

    document.getElementById('login-form').addEventListener('submit', async (event) => {
        try {

            event.preventDefault();
            functions.loader('ON');

            //the password and confirmation password elements
            const mail = document.getElementById('login-email');
            const pass = document.getElementById('login-password');

            //the element + validators
            let validations = {
                '#login-email': [()=>validators.isEmpty(mail.value),()=>validators.isValidMail(mail.value)],
                '#login-password': [()=>validators.isEmpty(pass.value),()=>validators.lengthValidator(pass.value)]
            };

            functions.trimFormValues([mail, pass]);//trim values
               mail.value = mail.value.toLowerCase();
            
            //validate form input
            if (await validators.validateForm(validations))
                document.getElementById('login-form').submit();

            functions.loader();

        } catch (err) {
            functions.loader();
            functions.showModalErr(constants.GENERAL_ERR);
        }
    })
})



