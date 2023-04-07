const AXIOS_TOMEOUT = 2000


const GET_GALLERY_IMAGE_API_ENDPOINT = "gallery/get?imageName="

function getLoadGalleryImgEndpoint() {
    return getApiUrl() + GET_GALLERY_IMAGE_API_ENDPOINT
}

