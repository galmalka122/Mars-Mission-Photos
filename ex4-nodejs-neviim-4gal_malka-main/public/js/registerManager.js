import {functions} from "./functions.js";
import {api} from "./api.js";
import {validators} from "./validators.js";
import {constants} from "./constant.js";

document.addEventListener('DOMContentLoaded', () => {

    document.getElementById('first-register-form').addEventListener('submit', async (event) => {

        try {

            const mail = document.getElementById('email-register');//the mail element
            const name = document.getElementById('first-name');//the first name element
            const surname = document.getElementById('last-name');//the last name element

            functions.trimFormValues([mail, name, surname]);//trim all form values
            functions.loader('ON');
            event.preventDefault();

            //validations to check
            let validations = {

                '#first-name': [()=>validators.isEmpty(name.value),()=>validators.isLetters(name.value)],
                '#last-name': [()=>validators.isEmpty(surname.value),()=>validators.isLetters(surname.value)],
                '#email-register': [()=>validators.isEmpty(mail.value), ()=>validators.isValidMail(mail.value),
                    ()=>api.mailCheckAPI(mail.value.toLowerCase())]
            };

            //validate all form input
            if (await validators.validateForm(validations))
                event.target.submit();

            functions.loader();

        } catch (err) {
            functions.loader();
            if(err.body)
                functions.showModalErr(constants.GENERAL_ERR);
        }
    })

})






