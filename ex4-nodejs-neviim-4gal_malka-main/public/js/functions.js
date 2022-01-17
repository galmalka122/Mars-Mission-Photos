import {createElements} from "./createElements.js";

export const functions = (() => {

    /**
     * checks the promise status for errors
     * @param response - the response from fetch
     * @param handler - the handler function
     * @returns {Promise<never>|Promise<unknown>} - returns the resolved promise if ok else returns error
     */
    const fetchStatus = async (response, handler = ()=>{}) => {
        if (response.status >= 200 && response.status < 300)
            return Promise.resolve(response);

        //handle the error status
        handler();
        throw new Error();



    }

    /**
     * attach listener for all queries
     * @param event - the event which the listener will attach to
     * @param query - the queries which the listener will attach to
     * @param listenerFunction - the function to run when event fired
     */
    const attachListeners = (event, query, listenerFunction) => {

        for (const b of document.querySelectorAll(`${query}`))
            b.addEventListener(event, listenerFunction);
    }

    /**
     * remove listener to all queries
     * @param event - the event to remove from the listener
     * @param query - the queries to remove from the listener
     * @param listenerFunction - the function to remove from the listener
     */
    const removeListeners = function (event, query, listenerFunction) {

        for (const b of document.querySelectorAll(`${query}`))
            b.removeEventListener(event, listenerFunction);
    }

    /**
     * turns the spinner element on or off
     * @param on - null indicates to turn the spinner off, otherwise turn on
     */
    const loader = function (on = null) {

        const loaderNode = document.querySelector('.spinner-border.loader-center'); //the loader Node

        loaderNode.style.display = on ? 'block' : 'none'; //show/hide loader
        document.body.style.opacity = on ? '0.2' : '1.0'; //blur/brighten page body
    }

    /**
     * creates the information modal body by the error caught and opens it on the page
     * @param err - the body information
     */
    function showModalErr(err) {

        const modalERR = document.getElementById('err-modal'); // the error modal element
        document.getElementById('err-body').innerText = err; // plant the error string on the modal
        let modalInstance;
        modalInstance = new bootstrap.Modal(modalERR); // create the modal instance
        modalInstance.show(); // show the modal
    }

    /**
     * trims all form values
     * @param formElement - the form element
     */
    function trimFormValues(formElement) {

        formElement.forEach(element => {
            element.value = element.value.trim();
        })
    }

    /**
     * creates a timer to indicate when the password step timer is ending
     */
    const passwordTimer = function () {

        let TIMER = document.getElementById('countdown');//the timer element
        const timeCookie = document.cookie.split(/[\s=;]+/);//splits the cookie's values to extract time

        //if no time cookie found
        if (timeCookie.length === 1) {

            location.replace('/register')
        } else {

            let currTime = new Date().getTime();//current time
            let seconds = (timeCookie[timeCookie.findIndex((element) => element === 'passwordTimer') + 1]
                - currTime) / 1000;// estimated time to end password
            seconds = parseInt(seconds);
            //interval to handle like timer
            setInterval(
                function () {

                    seconds -= 1;

                    if (seconds < 10) {

                        TIMER.style.color = 'red';
                    }
                    if (TIMER.style.display === 'none') TIMER.style.display = 'block';

                    TIMER.innerHTML =
                        `${seconds} ${seconds > 1 ? 'seconds' : 'second'} to complete this step`; // update timer div

                    if (seconds <= 0) {
                        clearInterval();
                        location.replace('/register');
                    }
                }, 1000);
        }
    }

    const nasaFetchHandler = function(){

        document.getElementById('nasa-search').innerHTML =
            createElements.errorHtml(`Due to nasa servers problem the search is currently unavailable.
            please try refreshing the page. if the problem continue please try again later`);
        showModalErr("NASA servers are not available right now, please try again later");
    }

    const apiFetchHandler = function(status){
        if(status === 404 || status === 500)
            document.getElementById('logout').submit();
        if(status === 401)
            location.replace('/login');
    }


    return {
        apiFetchHandler: apiFetchHandler,
        nasaFetchHandler: nasaFetchHandler,
        fetchStatus: fetchStatus,
        passwordTimer: passwordTimer,
        showModalErr: showModalErr,
        loader: loader,
        attachListeners: attachListeners,
        removeListeners: removeListeners,
        trimFormValues: trimFormValues
    }

}).call(this)