import {functions} from "./functions.js";
import {validators} from "./validators.js";
import {constants} from "./constant.js";

document.addEventListener('DOMContentLoaded', () => {

    functions.passwordTimer();//apply timer to view seconds left

    document.getElementById('password-form').addEventListener('submit', async (event) => {
        try {
            event.preventDefault();
            functions.loader('ON');

            //the password and confirmation password elements
            const pass = document.getElementById('input-password');
            const pass2 = document.getElementById('input-password2');

            //the element + validators
            let validations = {
                '#input-password': [()=>validators.isEmpty(pass.value),()=>validators.lengthValidator(pass.value)],
                '#input-password2': [()=>validators.isEmpty(pass2.value),()=>validators.isSame(pass.value, pass2.value)]
            };

            functions.trimFormValues([pass, pass2]);//trim values

            //validate form input
            if (await validators.validateForm(validations,false))
                document.getElementById('password-form').submit();

            functions.loader();

        } catch (err) {
            functions.loader();
            functions.showModalErr(constants.GENERAL_ERR);
        }
    })
})



