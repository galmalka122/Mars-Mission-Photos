import { api } from './api.js';
import { functions } from './functions.js';

// Execute code when DOM content is fully loaded
document.addEventListener('DOMContentLoaded', async () => {
    try {
        // Get data about rovers
        await api.getRoversData();

        // Get the carousel element
        const carouselNode = document.getElementById('photo-carousel');

        // Attach listeners to delete buttons
        functions.attachListeners('click', '.btn-close.delete-photo', event =>
            api.deletePhoto(event));

        // Attach listeners to full size carousel buttons
        functions.attachListeners('click', `.full-size-carousel`, (event) => {
            window.open(event.target.dataset.carouselUrl, "_blank");
        });

        // Attach listeners to search photos button
        functions.attachListeners('click', '#confirm', async (event) => {
            functions.loader('ON');
            event.preventDefault();
            await api.fetchPhotos();
            functions.loader();
        });

        // Attach listeners to slides buttons + clear list button
        functions.attachListeners('click', '#clear-saved-list', (event) => api.deletePhoto(event));
        functions.attachListeners('click', '#slide-stop', () => carouselNode.style.display = 'none');
        functions.attachListeners('click', '#slide-start', () => {
            if (carouselNode.querySelectorAll('.carousel-item').length > 0)
                carouselNode.style.display = 'block';
        });
    } catch (err) {
        functions.loader();
    }
});