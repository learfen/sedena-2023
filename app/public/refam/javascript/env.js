//const ENVIROMENT = "production"
const ENVIROMENT = "development"
const SERVER_URL_DEV = "http://localhost:3000/refam/"
//const SERVER_URL_PROD = "https://refam.sedena.gob.mx/refam/"
const SERVER_URL_PROD = "/refam/"
const API_ENDPOINT = "api/"
const DEBUG = true

function getServerUrl() {
    if (ENVIROMENT === "development")
        return SERVER_URL_DEV
    else
        return SERVER_URL_PROD
}

function getApiUrl() {
    return getServerUrl() + API_ENDPOINT
}
