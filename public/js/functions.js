// Module with utility functions
import { createElements } from "./createElements.js";

export const functions = (() => {

    /**
     * Checks the promise status for errors
     * @param response - The response from fetch
     * @param handler - The handler function
     * @returns {Promise<never>|Promise<unknown>} - Returns the resolved promise if ok, otherwise throws an error
     */
    const fetchStatus = async (response, handler = () => {}) => {
        if (response.status >= 200 && response.status < 300)
            return Promise.resolve(response);

        // Handle the error status
        handler();
        throw new Error();
    }

    /**
     * Attaches listener for all queries
     * @param event - The event which the listener will attach to
     * @param query - The queries which the listener will attach to
     * @param listenerFunction - The function to run when the event is fired
     */
    const attachListeners = (event, query, listenerFunction) => {
        for (const b of document.querySelectorAll(`${query}`))
            b.addEventListener(event, listenerFunction);
    }

    /**
     * Removes listener from all queries
     * @param event - The event to remove from the listener
     * @param query - The queries to remove from the listener
     * @param listenerFunction - The function to remove from the listener
     */
    const removeListeners = function (event, query, listenerFunction) {
        for (const b of document.querySelectorAll(`${query}`))
            b.removeEventListener(event, listenerFunction);
    }

    /**
     * Turns the spinner element on or off
     * @param on - Null indicates to turn the spinner off, otherwise turn on
     */
    const loader = function (on = null) {
        const loaderNode = document.querySelector('.spinner-border.loader-center'); // The loader Node

        loaderNode.style.display = on ? 'block' : 'none'; // Show/hide loader
        document.body.style.opacity = on ? '0.2' : '1.0'; // Blur/brighten page body
    }

    /**
     * Creates the information modal body by the error caught and opens it on the page
     * @param err - The body information
     */
    function showModalErr(err) {
        const modalERR = document.getElementById('err-modal'); // The error modal element
        document.getElementById('err-body').innerText = err; // Plant the error string on the modal
        let modalInstance;
        modalInstance = new bootstrap.Modal(modalERR); // Create the modal instance
        modalInstance.show(); // Show the modal
    }

    /**
     * Trims all form values
     * @param formElement - The form element
     */
    function trimFormValues(formElement) {
        formElement.forEach(element => {
            element.value = element.value.trim();
        })
    }

    /**
     * Creates a timer to indicate when the password step timer is ending
     */
    const passwordTimer = function () {
        let TIMER = document.getElementById('countdown'); // The timer element
        const timeCookie = document.cookie.split(/[\s=;]+/); // Splits the cookie's values to extract time

        // If no time cookie found
        if (timeCookie.length === 1) {
            location.replace('/register')
        } else {
            let currTime = new Date().getTime(); // Current time
            let seconds = (timeCookie[timeCookie.findIndex((element) => element === 'passwordTimer') + 1] - currTime) / 1000; // Estimated time to end password
            seconds = parseInt(seconds);

            // Interval to handle like a timer
            setInterval(function () {
                seconds -= 1;

                if (seconds < 10) {
                    TIMER.style.color = 'red';
                }

                if (TIMER.style.display === 'none') TIMER.style.display = 'block';

                TIMER.innerHTML = `${seconds} ${seconds > 1 ? 'seconds' : 'second'} to complete this step`; // Update timer div

                if (seconds <= 0) {
                    clearInterval();
                    location.replace('/register');
                }
            }, 1000);
        }
    }

    /**
     * Handler for NASA fetch errors
     */
    const nasaFetchHandler = function () {
        document.getElementById('nasa-search').innerHTML =
            createElements.errorHtml(`Due to NASA servers problem, the search is currently unavailable.
            Please try refreshing the page. If the problem continues, please try again later.`);
        showModalErr("NASA servers are not available right now, please try again later");
    }

    /**
     * Handler for API fetch status
     * @param status - The status code
     */
    const apiFetchHandler = function (status) {
        if (status === 404 || status === 500)
            document.getElementById('logout').submit();
        if (status === 401)
            location.replace('/login');
    }

    // Exposing functions
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

}).call(this);
