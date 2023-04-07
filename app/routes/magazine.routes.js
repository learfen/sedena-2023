const controller = require("../controllers/magazine.controller");
const constants = require("../util/util.constants");
const multer = require('multer');
const path = require('path');
const crypto = require('crypto');
const log = require(__dirname + "/../../log/index");
const jwt = require('jsonwebtoken')
const FS = require('fs')
const baseDir = __dirname.replace("app/routes", constants.UPLOADS_DIR)
const fileLogMagazineStatus = __dirname + '/../../magazine-status.json'
const logMagazineStatus = (req , action) =>{
    let data = FS.existsSync(fileLogMagazineStatus) ? JSON.parse(FS.readFileSync(fileLogMagazineStatus).toString() ) : []
    data.push( {craetedAt:(new Date).toString(), action , ...jwt.decode(req.headers.authorization ?? req.query.token, 'S3CR3TK3YF0RR3F4M#') } )
    FS.writeFileSync( fileLogMagazineStatus , JSON.stringify( data ) )
}

log.write = ()=>{}


// SET STORAGE
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        let ext = path.extname(file.originalname.toLowerCase())
        let galleryRoute = baseDir
        galleryRoute += ext == '.pdf' ? constants.STORAGE_PDF_MAGAZINES : constants.STORAGE_MAGAZINE_COVER_PAGES
        cb(null, galleryRoute)
    },

    filename: function (req, file, cb) {
        let hash = crypto.createHash('md5')
        file.stream.on('data', function (chunk) {
            // console.log("hash.update(chunk)", hash.update(chunk))
        })

        let ext = path.extname(file.originalname.toLowerCase())
        cb(null, file.fieldname + '-' + file.originalname + '-' + Date.now() + ext)
    }
})

const upload = multer({
    storage: storage,
    fileFilter: function (req, file, callback) {
        let ext = path.extname(file.originalname.toLowerCase());
        if (ext !== '.png' && ext !== '.jpg' && ext !== '.jpeg' && ext !== '.pdf') {
            return callback(new Error('Only images are allowed'))
        }
        callback(null, true)
    },
    limits: {
        fileSize: "100MB"
    }
})


const storagePDF = multer.diskStorage({
    destination: function (req, file, cb) {
        let ext = path.extname(file.originalname.toLowerCase())
        let galleryRoute = ext == '.pdf' ? __dirname + "/../public/refam/pdf_magazines" : baseDir + constants.STORAGE_MAGAZINE_COVER_PAGES
        cb(null, galleryRoute)
    },

    filename: function (req, file, cb) {
        let hash = crypto.createHash('md5')
        file.stream.on('data', function (chunk) {
            // console.log("hash.update(chunk)", hash.update(chunk))
        })

        let ext = path.extname(file.originalname.toLowerCase())
        cb(null, file.fieldname + '-' + file.originalname.split(" ").join("_") + '-' + Date.now() + ext)
    }
})

const uploadPDF = multer({
    storage: storagePDF,
    limits: {
        fileSize: 1024 * 1024 * 100,
        fieldSize: 1024 * 1024 * 100
    }
})

// SET STORAGE
const storageMagazineCover = multer.diskStorage({ // TODO refactor getuploader With custom route and file size / format
    destination: function (req, file, cb) {
        let galleryRoute = baseDir + constants.STORAGE_MAGAZINE_COVER_PAGES;
        cb(null, galleryRoute)
    },

    filename: function (req, file, cb) {
        let hash = crypto.createHash('md5')
        file.stream.on('data', function (chunk) {
            // console.log("hash.update(chunk)", hash.update(chunk))
        })

        let ext = path.extname(file.originalname)
        cb(null, file.fieldname + '-' + file.originalname + '-' + Date.now() + ext)
    }
})

const uploadMagazineCover = multer({
    storage: storageMagazineCover,
    fileFilter: function (req, file, callback) {
        let ext = path.extname(file.originalname.toLowerCase());
        if (ext !== '.png' && ext !== '.jpg' && ext && ext !== '.jpeg') {
            return callback(new Error('Only images are allowed'))
        }
        callback(null, true)
    },
    limits: {
        fileSize: constants.IMAGE_FILE_SIZE
    }
})

// SET STORAGE
const storageArticleCover = multer.diskStorage({ // TODO refactor getuploader With custom route and file size / format
    destination: function (req, file, cb) {
        let galleryRoute = baseDir + "pdf_magazines";
        cb(null, galleryRoute)
    },

    filename: function (req, file, cb) {
        let hash = crypto.createHash('md5')
        file.stream.on('data', function (chunk) {
            // console.log("hash.update(chunk)", hash.update(chunk))
        })

        let ext = path.extname(file.originalname.toLowerCase())
        cb(null, file.fieldname + '-' + file.originalname + '-' + Date.now() + ext)
    }
})

const uploadArticleCover = multer({
    storage: storageArticleCover,
    fileFilter: function (req, file, callback) {
        let ext = path.extname(file.originalname.toLowerCase());
        if (ext !== '.png' && ext !== '.jpg' && ext && ext !== '.jpeg') {
            return callback(new Error('Only images are allowed'))
        }
        callback(null, true)
    },
    limits: {
        fileSize: constants.IMAGE_FILE_SIZE
    }
})


module.exports = function (app) {
    app.get("/refam/revistas", (req, res) => { 
        try{
            controller.getMagazines(req, res)
        }catch( error ){
            log.write(req.originalUrl ,   error.message )
        }
    })
    app.get("/refam/api/revistas/cartoon", (req, res) => { 
        try{
            controller.getCartoon(req, res)
        }catch( error ){
            log.write(req.originalUrl ,   error.message )
        }
    })
    app.get("/magazine-media/exists/:file/:magazine" , (req, res) => {
        try{
            controller.mediaExists(req, res , req.params.file, req.params.magazine)
        }catch( error ){
            log.write(req.originalUrl ,   error.message )
        }

    })
    app.get("/refam/revistas/nueva", (req, res) => { 
        try{
            controller.getPdfMagazineUploader(req, res)
        }catch( error ){
            log.write(req.originalUrl ,   error.message )
        }
    })

    /**
     * API PDF MAGAZINES
    } * */
    app.post("/refam/api/magazine/getAllPdfMagazine", (req, res) => { 
        try{
            controller.getAllPdfMagazines(req, res)
        }catch( error ){
            log.write(req.originalUrl ,   error.message )
        }
    })
    app.get("/refam/api/magazine/getMagazineCoverPage", (req, res) => { 
        try{
            controller.getMagazineCoverPage(req, res)
        }catch( error ){
            log.write(req.originalUrl ,   error.message )
        }
    })
    app.get("/refam/api/magazine/getPdfMagazine", (req, res) => { 
        try{
            controller.getPdfMagazine(req, res)
        }catch( error ){
            log.write(req.originalUrl ,   error.message )
        }
    } )
    app.post("/refam/api/magazine/uploadPdfMagazine",
        uploadPDF.any(),
        controller.postUploadPdfMagazine
    )
    app.post("/refam/api/magazine/searchMagazineByDate", (req, res) => { 
        try{
            controller.postSearchPdfOrHtmlMagazineByDate(req, res)
        }catch( error ){
            log.write(req.originalUrl ,   error.message )
        }
    })
    /**
     * API HTML ARTICLES
    } * */
    app.post("/refam/api/magazine/postCreateMagazine",
        uploadMagazineCover.any(),
        controller.postCreateMagazine
    )
    app.post("/refam/api/magazine/postAddHtmlArticle",
        global.uploadAssets.single('fileid'),
        controller.postAddHtmlArticle
    )
    app.post("/refam/api/article/push/:magazine",  upload.single('fileid'), (req, res) => { 
        try{
            controller.articlePush(req, res)
        }catch( error ){
            log.write(req.originalUrl ,   error.message )
        }
    })
    //app.post("/refam/api/cover/article/:id") //  __dirname + "/../../uploads/pdf_magazines/" + imageName
    app.post("/refam/api/magazine/getMagazineHtmlArticle", (req, res) => { 
        try{
            controller.getMagazineHtmlArticle(req, res)
        }catch( error ){
            log.write(req.originalUrl ,   error.message )
        }
    })
    app.post("/refam/api/magazine/getMagazineHtmlArticleById", (req, res) => { 
        try{
            controller.getMagazineHtmlArticleById(req, res)
        }catch( error ){
            log.write(req.originalUrl ,   error.message )
        }
    })
    app.get("/refam/api/magazine/getArticlesFromMagazine/:id", (req, res) => { 
        try{
            controller.getArticlesFromMagazine(req, res)
        }catch( error ){
            log.write(req.originalUrl ,   error.message )
        }
    })
    app.get("/refam/api/magazine/getMagazineHtmlArticleById", (req, res) => { 
        try{
            controller.getMagazineHtmlArtById(req, res)
        }catch( error ){
            log.write(req.originalUrl ,   error.message )
        }
    })
    app.get("/refam/api/magazine/getMagazineHtmlArticleByIdJSON", (req, res) => { 
        try{
            controller.getMagazineHtmlArtByIdJSON(req, res)
        }catch( error ){
            log.write(req.originalUrl ,   error.message )
        }
    })
    app.get("/refam/api/magazine/getAllMagazineHtmlArticles", (req, res) => { 
        try{
            controller.getAllMagazineHtmlArticles(req, res)
        }catch( error ){
            log.write(req.originalUrl ,   error.message )
        }
    })
    app.post("/refam/api/magazine/postGetArticlesByMagId", (req, res) => { 
        try{
            controller.postGetArticlesByMagId(req, res)
        }catch( error ){
            log.write(req.originalUrl ,   error.message )
        }
    })
    app.get("/refam/api/magazine/getHtmlMagazineByID", (req, res) => { 
        try{
            controller.getHtmlMagazineByID(req, res)
        }catch( error ){
            log.write(req.originalUrl ,   error.message )
        }
    })
    app.get("/refam/api/magazine/getCoverOfArticle", (req, res) => { 
        try{
            controller.getCoverOfArticle(req, res)
        }catch( error ){
            log.write(req.originalUrl ,   error.message )
        }
    })
    app.get("/refam/api/magazine/getCoverOfMagazine", (req, res) => { 
        try{
            controller.getCoverOfMagazine(req, res)
        }catch( error ){
            log.write(req.originalUrl ,   error.message )
        }
    })
    app.get("/refam/api/magazine/getByDate/:magazineYear/:magazineMonth", (req, res) => { 
        try{
            controller.getMagazineByDate(req, res)
        }catch( error ){
            log.write(req.originalUrl ,   error.message )
        }
    })
    app.post("/refam/api/magazine/setHtml/:article", (req, res) => { 
        try{
            controller.setHtml(req, res)
        }catch( error ){
            log.write(req.originalUrl ,   error.message )
        }
    })
    app.get("/refam/api/magazine/getHtmlMagazineByIDEdit", (req, res) => { 
        try{
            controller.getHtmlMagazineByIDEdit(req, res)
        }catch( error ){
            log.write(req.originalUrl ,   error.message )
        }
    })
    app.get("/refam/api/magazine/getHtmlMagazineByIDEdit/:article", (req, res) => { 
        try{
            controller.getTemplateEditorIdArticle(req, res)
        }catch( error ){
            log.write(req.originalUrl ,   error.message )
        }
    })
    app.get("/refam/api/magazine/getLastMagazine", (req, res) => { 
        try{
            controller.getLastMagazine(req, res)
        }catch( error ){
            log.write(req.originalUrl ,   error.message )
        }
    })
    app.get("/refam/api/magazine/getLast", (req, res) => { 
        try{
            controller.getMagazineLast(req, res)
        }catch( error ){
            log.write(req.originalUrl ,   error.message )
        }
    })
    app.get("/refam/api/magazine/getAll", (req, res) => { 
            controller.getAll(req, res)
    })
    app.get("/refam/api/magazine/postedCover", (req, res) => { 
        try{
            controller.getMagazinesPostedCover(req, res)
        }catch( error ){
            log.write(req.originalUrl ,   error.message )
        }
    })
    app.delete("/refam/api/magazine/:id", (req, res) => { 
        logMagazineStatus(req)
        try{
            controller.deleteMagazine(req, res)
        }catch( error ){
            log.write(req.originalUrl ,   error.message )
        }
    })
    app.delete("/refam/api/magazine/article/:id", (req, res) => { 
        logMagazineStatus(req , 'delete-article')
        try{
            controller.deleteArticle(req, res)
        }catch( error ){
            log.write(req.originalUrl ,   error.message )
        }
    })
    app.post("/refam/api/magazine/posted/:id", (req, res) => { 
        logMagazineStatus(req , 'posted')
        try{
            controller.postedMagazine(req, res)
        }catch( error ){
            log.write(req.originalUrl ,   error.message )
        }
    })
    app.post("/refam/api/magazine/control/:id", (req, res) => { 
        logMagazineStatus(req , 'control')
        try{
            controller.controlMagazine(req, res)
        }catch( error ){
            log.write(req.originalUrl ,   error.message )
        }
    })
    app.post("/refam/api/magazine/edited/:id", (req, res) => { 
        logMagazineStatus(req , 'edited')
        try{
            controller.editedMagazine(req, res)
        }catch( error ){
            log.write(req.originalUrl ,   error.message )
        }
    })
    app.post("/refam/api/magazine/delete/:id", (req, res) => { 
        logMagazineStatus(req , 'delete')
        try{
            controller.deleteMagazine(req, res)
        }catch( error ){
            log.write(req.originalUrl ,   error.message )
        }
    })
    app.post("/refam/api/article/visite/:id/:user", (req, res) => { 
        try{
            controller.articleVisite(req, res)
        }catch( error ){
            log.write(req.originalUrl ,   error.message )
        }
    })
    app.post("/refam/api/magazineDate/", (req, res) => { 
        try{
            controller.magazineDateUpdate(req, res)
        }catch( error ){
            log.write(req.originalUrl ,   error.message )
        }
    })
    app.post("/refam/api/magazineNumber/", (req, res) => { 
        try{
            controller.magazineNumberUpdate(req, res)
        }catch( error ){
            log.write(req.originalUrl ,   error.message )
        }
    })
};
