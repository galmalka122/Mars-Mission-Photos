import {api} from './api.js';
import {functions} from './functions.js';

document.addEventListener('DOMContentLoaded', async () => {

    try {

        await api.getRoversData();//get rovers data

        const carouselNode = document.getElementById('photo-carousel');//the carousel element

        //attach listeners tp delete buttons
        functions.attachListeners('click', '.btn-close.delete-photo', event =>
            api.deletePhoto(event));

        //attach listeners to full size carousel buttons
        functions.attachListeners('click', `.full-size-carousel`, (event) => {
            window.open(event.target.dataset.carouselUrl, "_blank");
        });

        //attach listeners to search photos button
        functions.attachListeners('click', '#confirm', async(event) => {
            functions.loader('ON');
            event.preventDefault();
            await api.fetchPhotos();
            functions.loader();
        });
        //attach listeners to slides buttons + clear list button
        functions.attachListeners('click', '#clear-saved-list', (event) => api.deletePhoto(event));
        functions.attachListeners('click', '#slide-stop', () => carouselNode.style.display = 'none');
        functions.attachListeners('click', '#slide-start', () => {
            if (carouselNode.querySelectorAll('.carousel-item').length > 0)
                carouselNode.style.display = 'block';
        });
    }
    catch(err){
        functions.loader();
    }

})