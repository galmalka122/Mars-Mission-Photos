import { createElements } from './createElements.js';
import { validators } from './validators.js';
import { constants } from './constant.js';
import { functions } from "./functions.js";

// Object to store data about rovers fetched from NASA's API
let roversData = {};

// API module containing various functions for interacting with the server
export const api = (function () {
    
    /**
     * AJAX function to check if an email is already registered
     * @param {string} mail - The email value
     * @returns {Promise} - Validation status + message
     */
    const mailCheckAPI = async function (mail) {
        functions.loader('ON');
        const result = await fetch(`/register/mailCheck?email=${mail}`, {
            method: 'POST'
        });
        await functions.fetchStatus(result, () => { location.replace('/register') });
        functions.loader();
        return await result.json();
    }


        /**
         * Function to fetch photos from NASA's API
         * @returns {Promise} - If resolved: a JSON object with all photos data, if rejected: raises an error
         */
        const fetchPhotos = async function () {

            const date = document.getElementById('dateInput'); //the date form element
            const mission = document.getElementById('roverInput'); //the mission form element
            const camera = document.getElementById('cameraInput'); //the camera form element
            const photosNode = document.getElementById('photos-search-result'); //the search results section

            functions.loader('ON');
            functions.trimFormValues([date, mission, camera]);//trim values

            //validations to check
            let validations = {
                '#roverInput': [()=>validators.isEmpty(mission.value)],
                '#dateInput': [()=>validators.isEmpty(date.value),
                    ()=> validators.dateValidation(date.value, roversData[mission.value])],
                '#cameraInput': [()=>validators.isEmpty(camera.value)]
            }

            //validate form inputs
            if (await validators.validateForm(validations)) {

                //create the fetch url
                let apiString = `${constants.API_REQUEST_STRING}/${mission.value}`;
                if (validators.isSol(date.value)) {
                    apiString += `/photos?sol=${date.value}`;
                } else {
                    apiString += `/photos?earth_date=${date.value}`;
                }
                apiString += `&camera=${camera.value}&${constants.API_KEY}`;

                //fetch the photos
                const result = await fetch(apiString)
                await functions.fetchStatus(result,functions.nasaFetchHandler);
                const list = await result.json();
                photosNode.innerHTML = createElements.generateCardsHTML(list["photos"]);
                functions.attachListeners('click', '.card-full-size', (event) => {
                    window.open(event.target.dataset.url, "_blank");
                });

                functions.attachListeners('click', '.card-save-button', async (event) => {
                    await api.savePhoto(event)
                });
                functions.loader();

            }
        }

        /**
         * Function to fetch data about NASA's rovers
         * @returns {Promise} - Updates the module rovers data object
         */
        const getRoversData = async function () {

            functions.loader('ON');
            //fetch rovers data
            let roversFetchData = await fetch(`${constants.API_REQUEST_STRING}?${constants.API_KEY}`);
            await functions.fetchStatus(roversFetchData,functions.nasaFetchHandler);
            roversFetchData = await roversFetchData.json();
            roversFetchData = roversFetchData["rovers"];


            /*extract data for each rover*/
            for (let i = 0; i < roversFetchData.length; i++) {

                const cameras = [];//to collect mission's cameras name

                for (const camera in roversFetchData[i].cameras) {

                    cameras.push(roversFetchData[i].cameras[camera].name)
                }

                roversData[roversFetchData[i].name] = {
                    'landing_date': roversFetchData[i].landing_date,
                    'max_sol': roversFetchData[i].max_sol,
                    'max_date': roversFetchData[i].max_date,
                    'cameras': cameras
                };
            }
            functions.loader();

        }

        /**
         * Function to add a photo to the saved list
         * @param {Event} event - The saved button click event
         * @returns {Promise} - Updates the saved list and the server
         */
        async function savePhoto(event) {

            functions.loader('ON');
            const photoNode = event.target.closest('.card'); //the button parent card element

            /*create a photo data object*/
            const data = {
                url: photoNode.querySelector('.card-img-top').src,
                photoID: photoNode.id,
                earthDate: photoNode.dataset.earthDate,
                sol: photoNode.dataset.sol,
                camera: photoNode.dataset.camera
            }

            /*add photo to saved list*/
            const result = await fetch('/nasaAPI/addPhoto', {
                method: 'PUT', body: JSON.stringify(data), headers: {
                    "Content-Type": "application/json"
                }
            })
            await functions.fetchStatus(result, ()=>functions.apiFetchHandler(result.status));

            const answer = await result.json();

            if (answer === false) {
                functions.loader();
                functions.showModalErr('This image has already been saved.');
            }

            else
                await refreshSavedList();
        }


        /**
         * Function to refresh the HTML list of saved photos
         * @returns {Promise} - Updates the HTML list
         */
        const refreshSavedList = async function () {


            const savedNode = document.getElementById('saved-images'); //the saved image section

            /*get and extract all saved photos from db*/
            const result = await fetch('/nasaAPI/getPhotos');
            await functions.fetchStatus(result, ()=>functions.apiFetchHandler(result.status));

            const list = await result.json();

            /*remove listeners from carousel and delete buttons*/
            functions.removeListeners('click', `.btn-close.delete-photo`, deletePhoto);
            functions.removeListeners('click', `.full-size-carousel`, (event) => {
                window.open(event.target.dataset.url, "_blank");
            });

            /*remove html for saved list + carousel*/
            document.querySelector('#saved-images').innerHTML = '';//saved list
            document.querySelector(`.carousel-indicators`).innerHTML = '';//carousel indicators
            document.querySelector(`.carousel-inner`).innerHTML = '';//carousel items

            /*create saved list line and carousel for each saved photos*/
            list.forEach((element, index) => {
                savedNode.innerHTML += createElements.savedPhotoLineHtml(index + 1, element);
                const htmlCarousel = createElements.carouselHtml(index, element);
                document.querySelector('.carousel-indicators').innerHTML += htmlCarousel.list;
                document.querySelector('.carousel-inner').innerHTML += htmlCarousel.item;
            });

            /*attach listeners*/
            functions.attachListeners('click', `.btn-close.delete-photo`, deletePhoto);
            functions.attachListeners('click', `.full-size-carousel`, (event) => {
                window.open(event.target.dataset.carouselUrl, "_blank");
            });
            functions.loader();

        }

        /**
         * Function to delete a saved photo from the saved list
         * @param {Event} event - The saved photo remove button/clear list button
         * @returns {Promise} - Updates the server and HTML list
         */
        const deletePhoto = async function (event) {

            functions.loader('ON');
            //check if the button was for specific photo or for clear list
            let body = event.target.id === 'clear-saved-list' ? {} : {photoID: parseInt(event.target.id)};

            //delete from db
            const result = await fetch('/nasaAPI/deletePhoto', {
                method: 'DELETE', body: JSON.stringify(body), headers: {
                    "Content-Type": "application/json"
                }
            })
            await functions.fetchStatus(result,()=>functions.apiFetchHandler(result.status));
            await refreshSavedList();//refresh html list
            let savedDetails = document.querySelector('#saved-images')//the saved photos list
                .querySelectorAll(`.h6:not(.px-2)`);

            //close carousel slider if no photos in saved list
            if (savedDetails.length === 0 || event.target.id === 'clear-saved-list') {
                document.querySelector('#photo-carousel').style.display = 'none';
            }
            functions.loader();
        }

        return {
            mailCheckAPI:mailCheckAPI,
            fetchPhotos: fetchPhotos,
            getRoversData: getRoversData,
            refreshSavedList: refreshSavedList,
            savePhoto: savePhoto,
            deletePhoto: deletePhoto,
        }
    }
).call(this)
