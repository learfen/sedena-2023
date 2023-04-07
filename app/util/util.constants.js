const jwt = require("jsonwebtoken");
const imageConfig = require('../config/media.js')
const pagination = require(__dirname + "/pagination.js")
const helperProccess = require(__dirname + "/helperProccess.js")
const access = require(__dirname + "/../config/access.js")

let constants = {

    SERVER_ERROR_500: 500,

    STANDARD_RESPONSE: {
        "status": 0,
        "code": 0,
        "errorCode": 0, // it will be opt
        "message": "",
        "hasResponseData": true,  // true or false
        "responseData": {
            "numOfItems": 3,
            "currentPageNumber": 1,
            "isLastPage": false,
            //"objectType": {[Object],[Object]}
        }
    },

    get getStandardRes() {
        let response = Object.create(this.STANDARD_RESPONSE);
        response.responseData = {}
        response.hasResponseData = true
        response.status = 0
        response.errorCode = 0
        response.message = ""
        return response
    },

    STANDARD_RES_PAGINATION_AND_DATA: {
        numItemsPerPage: 10,
        totalPages: 1,
        totalOfItems: 0,
        dataFields: {
            //[
            //"objectType": ["String", "String"],
            //  ]
        },
    },

    get getStandarPaginationRes() {
        let responsePagination = Object.create(this.STANDARD_RES_PAGINATION_AND_DATA);
        responsePagination.numItemsPerPage = 0
        responsePagination.totalPages = 0
        responsePagination.totalOfItems = 0
        responsePagination.dataFields = {}
        return responsePagination
    },


    IMAGE_FILE_SIZE: 1024 * 1024 * 10,
    MEDIA_FILE_SIZE: 1024 * 1024 * 120,
    PDF_FILE_SIZE: 1024 * 1024 * 35,

    MEXICO_LOCALE: "es-MX",
    UPLOADS_DIR: "uploads/",

    /**
     * AUTH
     */

    USER_NOT_ACTIVATED_ERROR_CODE: 5000,
    USER_ACTIVATED_CODE: 5001,
    USER_STATUS_ACTIVE: 1,

    /**
     * USERS
     */

    ITEMS_PER_PAGE_USERS: 12,

    USERS_EXCEL_EXPORTED_NAME: "exportedUsers.xlsx",
    USERS_EXCEL_SHEET_NAME: "Usuarios",

    /**
     * Support
     */

    STORAGE_SUPPORT: "tmp_support/",

    // File for email ex object
    filesPaths: [
        {
            path: '/Users/pioaguilar/Documents/refam_back/uploads/tmp_support/bodyImageProblemMultipart-1599102002895.png',
        }/*,
        {
            path: '/Users/pioaguilar/Documents/refam_back/app/controllers/c.png',
        }*/
    ],

    /**
     * Gallery
     */

    ITEMS_PER_PAGE_GALLERY: 10,

    STORAGE_GALLERY: "gallery/",

    /**
     * Video Library
     */
    ITEMS_PER_PAGE_LIBRARY: 12,
    VIDEO_FILE_SIZE: 1024 * 1024 * 235,
    STORAGE_VIDEO_LIBRARY: "video_library/",


    /**
     * Benefit Cupons
     */
    ITEMS_PER_PAGE_CUPONS: 5,

    STORAGE_CUPONS: "cupons/",


    /**
     * Magazines
     */
    STORAGE_PDF_MAGAZINES: "pdf_magazines/",
    STORAGE_MEDIA: "pdf_magazines/",

    STORAGE_ARTICLE_MAGAZINE: "magazine_articles/",
    ARTICLE_FILE_EXTENSION: ".html",
    ARTICLE_FILE_CONTENT_TYPE: 'text/html; charset=utf-8',

    STORAGE_MAGAZINE_COVER_PAGES: "magazine/cover_pages/",

    /**
     * Templates
     */


    tokenGetUserId(req , res , config){
        const jwt = require("jsonwebtoken");
        jwt.verify(req.headers.authorization, config.secret, (err, decoded) => {
            if(err){
                return false
            }else{
                return decoded.id
            }
        })
    },
    evalAcces:access.test,

    updateStatus(res , Entity, id , status , result){
        Entity.update(
            {status}, 
            { where: { id } }
        ).then( n => {
            return res.json({ result });
        })
        .catch(err => {
            console.log({error: err.message})
            //res.json({error: err.message});
        });
    },
    updateRole(res , Entity, id , role , result){
        Entity.update(
            {role}, 
            { where: { id } }
        ).then( n => {
            return res.json({ result });
        })
        .catch(err => {
            console.log({error: err.message})
            //res.json({error: err.message});
        });
    },
    access
}


for(let define of [imageConfig , pagination , helperProccess ]){
    for(let key in define){
        constants[key] = define[key]
    }
}

module.exports = constants