'use strict'
const {authJwt} = require("../middleware");
const controller = require("../controllers/support_request.controller");
const multer = require('multer');
const path = require('path');
const crypto = require('crypto')
const constants = require("../util/util.constants")
//const hash = crypto.createHash('md5');

// SET STORAGE
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        let supportStorageRoute = __dirname + '/../public/refam/' + constants.STORAGE_SUPPORT;
        cb(null, supportStorageRoute)
    },

    filename: function (req, file, cb) {
        let hash = crypto.createHash('md5')
        let hashFile
        file.stream.on('data', function (chunk) {
            // hash.update(chunk)
            /// console.log("hash.update(chunk)", hash.update(chunk))
            //  hash = hash.digest()
        })

        file.stream.on('finish', function () {
            hashFile = hash.digest()

            console.log("finish", hashFile)
            /*  cb(null, {
                  destination: destination,
                  filename: filename,
                  path: finalPath,
                  size: outStream.bytesWritten,
                  hash: hash.digest('hex')
              })*/
        })
        let ext = path.extname(file.originalname)
        cb(null, file.fieldname + '-' + Date.now() + ext)
    }
});

const upload = multer({
    storage: storage,
    fileFilter: function (req, file, callback) {
        let ext = path.extname(file.originalname);
        if (ext !== '.png' && ext !== '.jpg' && ext !== '.gif' && ext !== '.jpeg') {
            return callback(new Error('Only images are allowed'))
        }
        callback(null, true)
    },
    limits: {
        fileSize: constants.IMAGE_FILE_SIZE
    }
});


module.exports = function (app) {

    app.post("/refam/api/support/createSupportIssue", upload.any(), (req , res)=>{
        console.log('route support/createSupportIssue')
        try {
            controller.createSupportIssue(req , res)
        } catch (error) {
            log.write( req.originalUrl ,  error )
        }
    });
    app.get("/refam/api/support/getAll", (req , res)=>{
        try {
            controller.getAllSupportIssues(req , res)
        } catch (error) {
            log.write( req.originalUrl ,  error )
        }
    });


};
