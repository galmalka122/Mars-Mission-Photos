// Module to create HTML elements for the application
export const createElements = (function () {

    /**
     * Creates the inner HTML string with information about the saved photo
     * @param index - Index of the saved photo
     * @param photoData - Data of the saved photo
     * @returns {string} - The inner HTML string
     */
    const savedPhotoLineHtml = function (index, photoData) {
        return `
<div class="row savedPhotos">
    <div class="col-auto">
        <button type="button" class="btn-close delete-photo" aria-label="Close" data-delete-id="${photoData.photoID}" id="${photoData.photoID}"></button>
    </div>
    <div class="col">
        <p class="h6" id="saved-images${index}">
            ${index}.<a href="${photoData.url}" target="_blank">Image id: ${photoData.photoID}</a>
        </p>
        <p class="h6 px-2">Earth date: ${photoData.earthDate}, Sol: ${photoData.sol}, Camera: ${photoData.camera}</p>
    </div>
</div>`;
    }

    /**
     * Creates both slide button and carousel item HTML string based on the photo object
     * @param index - The photo's index for carousel position
     * @param photo - The photo object
     * @returns {{item: string, list: string}} - The inner HTML elements
     */
    const carouselHtml = function (index, photo) {
        return {
            list: `
<button type="button" data-bs-target="#photoCarousel" data-bs-slide-to="${index}" 
    ${parseInt(index) === 0 ? `class="active" aria-current="true"` : ``} 
    aria-label="Slide ${index}">
</button>
            `,
            item: `
<div class="carousel-item${parseInt(index) === 0 ? ` active` : ``}">
    <img src="${photo.url}" class="d-block img-responsive w-100" alt="mars-photo number ${index}">
    <div class="carousel-caption d-block ">
        <h3>${photo.camera}</h3>
        <h3>${photo.earthDate}</h3>
        <button class="btn btn-primary full-size-carousel" data-carousel-url="${photo.url}" type="button">Full size</button>
    </div>
</div>`}
}

    /**
     * Generates inner HTML card for each photo fetched
     * Generates a message alert inner HTML if no photos are fetched
     * @param data - Array of photo data
     * @returns {string} - The inner HTML
     */
    const generateCardsHTML = function (data) {
        let res = "";
        if (data.length === 0)
            return cardHtml();

        for (const photo of data)
            res += cardHtml(photo);

        return res;
    }

    /**
     * Generates inner HTML for each photo
     * @param photo - The photo data object
     * @returns {string} - The inner HTML string
     */
    const cardHtml = function (photo = null) {
        if (photo === null) {
            return `
<div class="row justify-content-center">
    <div class="alert alert-warning col-auto" role="alert">
        <h3 class="text-center" style="color: brown">No images found</h3>
    </div>
</div>`;
        }
        return `
<div class="card border-primary m-auto mb-3" id="${photo.id}" data-earth-date="${photo["earth_date"]}" 
    data-sol="${photo.sol}" data-camera="${photo.camera.name}" style="width: 18rem;">
    <img class="card-img-top img-thumbnail" src="${photo["img_src"]}" 
        alt="Earth date:${photo["earth_date"]} Sol:${photo.sol} Camera:${photo.camera.name} 
        mission:${photo["rover"].name}" style="width: 18rem; height: 18rem">
    <div class="card-body">
        <h6 class="card-title">Earth date: ${photo["earth_date"]}</h6>
        <h6 class="card-title">Sol: ${photo.sol}</h6> 
        <h6 class="card-title">Camera: ${photo.camera.name}</h6>
        <h6 class="card-title">Mission: ${photo["rover"].name}</h6>
        <div class="pb-3">
            <button class="btn btn-primary card-save-button" type="button">Save</button>
            <button class="btn btn-primary card-full-size" data-url="${photo["img_src"]}" type="button">Full size</button>
        </div>
    </div>
</div>`;
    }

    /**
     * Generates inner HTML for an error message
     * @param error - The error message
     * @returns {string} - The inner HTML string for the error
     */
    const errorHtml = function (error) {
        return `
<div class="row justify-content-center css-off">
    <div class="col-auto mt-2 css-off">
        <div class="alert alert-danger css-off" role="alert" %>
            ${error}
        </div>
    </div>
</div>`;
    }

    // Exposing functions
    return {
        errorHtml: errorHtml,
        generateCardsHTML: generateCardsHTML,
        cardHtml: cardHtml,
        carouselHtml: carouselHtml,
        savedPhotoLineHtml: savedPhotoLineHtml
    }

}).call(this)
