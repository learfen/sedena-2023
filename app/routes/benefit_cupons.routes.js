const constants = require("../util/util.constants");
const {authJwt} = require("../middleware");
const controller = require("../controllers/benefit_cupons.controller");
const multer = require('multer');
const path = require('path');
const crypto = require('crypto')
const log = require(__dirname + "/../../log/index")
//const hash = crypto.createHash('md5');

// SET STORAGE
const storageb = multer.diskStorage({
    destination: function (req, file, cb) {
        let cuponsStorageRoute = __dirname.replace("app/routes", "uploads/") + constants.STORAGE_CUPONS;
        cb(null, cuponsStorageRoute)
    },

    filename: function (req, file, cb) {
        let hash = crypto.createHash('md5')
        let hashFile
        file.stream.on('data', function (chunk) {
            // hash.update(chunk)
            //  console.log("hash.update(chunk)", hash.update(chunk))
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

        cb(null, file.fieldname + '-' + Date.now() + '.png')
    }
});

const uploadb = multer({
    storage: storageb,
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
    var upload = multer({dest: 'uploads/'})


    app.post("/api/cupons/uploadImage",
        uploadb.any(),
        controller.uploadCupon);

    /*   var cpUpload = upload.fields([{ name: 'avatar', maxCount: 1 }, { name: 'gallery', maxCount: 8 }])
       app.post('/api/cupons/uploadImage', cpUpload, function (req, res, next) {
           // req.files is an object (String -> Array) where fieldname is the key, and the value is array of files
           //
           // e.g.
           //  req.files['avatar'][0] -> File
           //  req.files['gallery'] -> Array
           //
           // req.body will contain the text fields, if there were any
       })*/


    /**
     *
     uploadb.fields([{
            name: 'imageCupon', maxCount: 1
        }, {
            name: 'subtitles', maxCount: 1
        }])
     */


    //app.post("/refam/api/cupons/createCupon", controller.createCupon);
    app.get('/refam/api/cupons/getPaginationAndData', (req , res) => {
        try {
            controller.getPaginationAndData( req , res )
        } catch (error) {
            log.write( req.originalUrl ,  error )
        }
    });
    app.post('/refam/api/cupons/getPageData', (req , res) => {
        try {
            controller.getPageData( req , res )
        } catch (error) {
            log.write( req.originalUrl ,  error )
        }
    });
    app.post("/refam/api/cupons/deleteBenfitCupons", (req , res) => {
        try {
            controller.deleteBenfitCupons( req , res )
        } catch (error) {
            log.write( req.originalUrl ,  error )
        }
    });


    app.get("/refam/api/cupons/all", (req , res) => {
        try {
            controller.getAllCupons( req , res )
        } catch (error) {
            log.write( req.originalUrl ,  error )
        }
    });
    app.get("/refam/api/cupons/get", (req , res) => {
        try {
            controller.getCuponImage( req , res )
        } catch (error) {
            log.write( req.originalUrl ,  error )
        }
    });
    app.get("/refam/beneficios", (req , res) => {
        try {
            controller.cuponList( req , res )
        } catch (error) {
            log.write( req.originalUrl ,  error )
        }
    });
    app.get("/refam/beneficiosAdmin", (req , res) => {
        try {
            controller.cuponManagment( req , res )
        } catch (error) {
            log.write( req.originalUrl ,  error )
        }
    });
    app.delete('/refam/api/cupon/:id' , (req , res) => {
        try {
            controller.cuponDelete( req , res )
        } catch (error) {
            log.write( req.originalUrl ,  error )
        }
    } )

};
