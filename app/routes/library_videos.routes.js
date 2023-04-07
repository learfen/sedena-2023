const {authJwt} = require("../middleware");
const constants = require("../util/util.constants");
const controller = require("../controllers/library_videos.controller");
const multer = require('multer');
const path = require('path');
const crypto = require('crypto')
const log = require(__dirname + "/../../log/index")

// SET STORAGE
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        let galleryRoute = __dirname.replace("app/routes", "uploads/") + constants.STORAGE_VIDEO_LIBRARY;
        cb(null, galleryRoute)
    },

    filename: function (req, file, cb) {
        let hash = crypto.createHash('md5')
        let hashFile
        file.stream.on('data', function (chunk) {
        })

        file.stream.on('finish', function () {
            hashFile = hash.digest()

            console.log("finish", hashFile)
        })

        let ext = path.extname(file.originalname)
        cb(null, file.originalname + file.fieldname + '-' + Date.now() + ext)
    }
});

const upload = multer({
    storage: storage,
    fileFilter: function (req, file, callback) {
        let ext = path.extname(file.originalname);
        if (ext !== '.mp4'
            && ext !== '.webm'
            && ext !== '.ogg'
            && ext !== '.mpeg') {
            return callback(new Error('Only video files are allowed'))
        }
        callback(null, true)
    },
    limits: {
        fileSize: constants.VIDEO_FILE_SIZE
    }
});


module.exports = function (app) {
    /*
    app.use(function (req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });*/

    app.get("/refam/biblioteca", (req , res) => {
        try {
            controller.getLibrary(req , res)
        } catch (error) {
            log.write( req.originalUrl ,  error )
        }
    });
    app.get("/refam/biblioteca/admin", (req , res) => {
        try {
            controller.getUploadVideoView(req , res)
        } catch (error) {
            log.write( req.originalUrl ,  error )
        }
    });

    app.get("/refam/api/library/all", (req , res) => {
        try {
            controller.getAllLibraryVideos(req , res)
        } catch (error) {
            log.write( req.originalUrl ,  error )
        }
    });
    app.get("/refam/api/library/get", (req , res) => {
        try {
            controller.getLibraryVideo(req , res)
        } catch (error) {
            log.write( req.originalUrl ,  error )
        }
    });
    app.get("/refam/api/library/getPaginationAndData", (req , res) => {
        try {
            controller.getPaginationAndData(req , res)
        } catch (error) {
            log.write( req.originalUrl ,  error )
        }
    });
    app.post("/refam/api/library/getPageData", (req , res) => {
        try {
            controller.getPageData(req , res)
        } catch (error) {
            log.write( req.originalUrl ,  error )
        }
    });
    app.post("/refam/api/library/deleteLibraryVideos", (req , res) => {
        try {
            controller.deleteLibraryVideos(req , res)
        } catch (error) {
            log.write( req.originalUrl ,  error )
        }
    });
    app.delete("/refam/api/library/video/:id", (req , res) => {
        try {
            controller.deleteVideo(req , res)
        } catch (error) {
            log.write( req.originalUrl ,  error )
        }
    });
    //app.get("/refam/api/library/uploadImage", controller.uploadVideo);

    /**
     * Library Videos API
     * **/
    app.post("/refam/api/library/uploadVideo",
        upload.any(),
        controller.uploadVideo);
};

