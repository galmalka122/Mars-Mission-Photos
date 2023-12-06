export const validators = (function () {

    /**
     * checks if value has only letters
     * @param value
     * @returns {{isValid: boolean, message: string}} - validation status + message
     */
    const isLetters = function (value) {
        return {
            isValid: /^[a-zA-Z]+$/.test(value),
            message: 'input should include only letters'
        }
    }

    /**
     * checks if value is empty
     * @param value
     * @returns {Promise<{isValid: boolean, message: string}>} - validation status + message
     */
    const isEmpty = async function (value) {
        return {
            isValid: value !== undefined && value !== '' && value !== null,
            message: 'Input required here'
        };
    }

    /**
     * checks if a mail is correct format
     * @param mail - the mail value
     * @returns {Promise<{isValid: boolean, message: string}>} - validation status + message
     */
    const isValidMail = async function (mail) {
        return {
            isValid: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(mail),
            message: 'Please insert a valid mail'
        };
    }

    /**
     * creates a Date object by the user's dates input for date verification. if the date isn't valid
     * (for example 30-02) the date object that created in this function won't be the same as user's input
     * @param date - the user's date input
     * @returns {string} - a date string
     */
    let getRealDate = async function (date) {

        let realDate = new Date(date.toString());
        let YYYY = realDate.getFullYear();
        let MM = (realDate.getMonth() + 1 < 10 ? '0' + (realDate.getMonth() + 1)
            : realDate.getMonth() + 1)
        let DD = (realDate.getDate() < 10 ? '0' + realDate.getDate()
            : realDate.getDate());

        return (YYYY + '-' + MM + '-' + DD);
    }

    /**
     * checks if value is sol format
     * @param date - date value
     * @returns {boolean} - validation status
     */
    const isSol = function (date) {
        return /^([0-9])+$/.test(date);
    }

    /**
     * checks if value is date format
     * @param date - date value
     * @returns {boolean} - validation status
     */
    const isDate = function (date) {
        return /^([0-9]{4})-([0-9]{2})-([0-9]{2})$/.test(date) && date === getRealDate(date);
    }

    /**
     * validates the input date pattern and verify it's within the mission's operation range
     * @param date - the input date
     * @param missionData - the mission to check date
     * @returns {{isValid: boolean, message: string}|{isValid: (boolean|boolean), message: string}} - validation status
     * + message
     */
    const dateValidation = async function (date, missionData) {

        if (missionData !== undefined) {
            if (isSol(date)) {
                return {
                    isValid: date < missionData.max_sol,
                    message: `the sol you've selected must be smaller than ${missionData.max_sol}`
                };
            }

            if (isDate(date)) {
                return {
                    isValid: (date < missionData.max_date && date > missionData.landing_date),
                    message: `the mission you've selected requires date ${date > missionData.landing_date ?
                        `before ${missionData.max_date}` : `after ${missionData.landing_date}`}`
                };
            }
        }
        return {
            isValid: isSol(date) || isDate(date),
            message: 'please enter a valid sol or earth date'
        }
    }


    /** creates an error message if input isn't valid and returns the validation state
     * @param inputElement - the input value
     * @param validateFunc - the function for validation
     * @returns {boolean|*} - the final validation state
     */
    const validateInput = async (inputElement, validateFunc) => {
        let errorElement = inputElement.nextElementSibling; // the error message div
        let v = await validateFunc()// call the validation function
        errorElement.innerHTML = v.isValid ? '' : v.message;// display the error message
        v.isValid ? inputElement.classList.remove("is-invalid") : inputElement.classList.add("is-invalid");
        return v.isValid;
    }

    /**
     * runs on each query found and validates by functions sent
     * @param nodeAndValidatorArray - a query:function object to perform validations
     * @param checkAll - indicates if validation should stop for first failure
     * @returns {Promise<boolean>} - a boolean to inform if all inputs are valid
     */
    const validateForm = async (nodeAndValidatorArray, checkAll = true) => {
        let v = true;//for node check
        for (const [query, functions] of Object.entries(nodeAndValidatorArray)) {
            let vf = true;//for each function check
            for (const func of functions) {
                vf = vf && await validateInput(document.querySelector(query), func);
                if (!vf) break;
            }
            v = v && vf
            if (!!v && !checkAll) {
                break;
            }
        }
        return !!v;
    }

    /**
     * checks the password length
     * @param value - the value to check
     * @returns {Promise<{isValid: boolean, message: string}>} - validation status + message
     */
    const lengthValidator = async function (value) {
        return {
            isValid: value !== undefined && value.length > 7,
            message: 'Password length must be 8 or more characters'
        }
    }

    /**
     * checks if 2 password strings matches
     * @param value - the first value
     * @param secValue - the second value
     * @returns {Promise<{isValid: boolean, message: string}>} - validation status + message
     */
    const isSame = async function (value, secValue) {
        return {
            isValid: value === secValue,
            message: 'Your password and confirmation password must match'
        };
    }


    return {
        isLetters: isLetters,
        isSol: isSol,
        isDate: isDate,
        isEmpty: isEmpty,
        isValidMail: isValidMail,
        dateValidation: dateValidation,
        lengthValidator: lengthValidator,
        isSame: isSame,
        validateForm: validateForm,
    }

}).call(this)
