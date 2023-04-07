const {authJwt} = require("../middleware")
const constants = require("../util/util.constants")
const controller = require("../controllers/gallery_images.controller")
const multer = require('multer')
const path = require('path')
const crypto = require('crypto')
const log = require(__dirname + "/../../log/index")
//const hash = crypto.createHash('md5')

// SET STORAGE
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        let galleryRoute = __dirname.replace("app/routes", "uploads/") + constants.STORAGE_GALLERY;
        cb(null, galleryRoute)
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

        cb(null, file.fieldname + '-' + Date.now() + '.jpg')
    }
})

const upload = multer({
    storage: storage,
    fileFilter: function (req, file, callback) {
        let ext = path.extname(file.originalname)
        if (ext !== '.webp' && ext !== '.png' && ext !== '.jpg' && ext !== '.gif' && ext !== '.jpeg') {
            return callback(new Error('Only images are allowed'))
        }
        callback(null, true)
    },
    limits: {
        fileSize: constants.IMAGE_FILE_SIZE
    }
})


module.exports = function (app) { 

    app.get("/refam/api/gallery/getPaginationAndData", (req , res)=>{ 
        try {
            controller.getPaginationAndData(req , res)
        } catch (error) {
            log.write( req.originalUrl ,  error )
        }
    })
    app.post("/refam/api/gallery/getPageData", (req , res)=>{ 
        try {
            controller.getPageData(req , res)
        } catch (error) {
            log.write( req.originalUrl ,  error )
        }
    })
    app.post("/refam/api/gallery/deleteGalleryImages", (req , res)=>{ 
        try {
            controller.deleteGalleryImages(req , res)
        } catch (error) {
            log.write( req.originalUrl ,  error )
        }
    })
    app.delete("/refam/api/gallery/image/:id", (req , res)=>{ 
        try {
            controller.deleteImage(req , res)
        } catch (error) {
            log.write( req.originalUrl ,  error )
        }
    })

    app.get("/refam/api/gallery/uploadImage", (req , res)=>{ 
        try {
            controller.galleryManagment(req , res)
        } catch (error) {
            log.write( req.originalUrl ,  error )
        }
    })
    app.get("/refam/api/gallery/all", (req , res)=>{ 
        try {
            controller.getAllGalleryImages(req , res)
        } catch (error) {
            log.write( req.originalUrl ,  error )
        }
    })
    app.get("/refam/api/gallery/get", (req , res)=>{ 
        try {
            controller.getGalleryImage(req , res)
        } catch (error) {
            log.write( req.originalUrl ,  error )
        }
    })
    app.get("/refam/api/gallery/explorer", (req , res)=>{ 
        try {
            controller.navegate(req , res)
        } catch (error) {
            log.write( req.originalUrl ,  error )
        }
    })
    app.get("/refam/api/gallery/explorer/:id", (req , res)=>{ 
        try {
            controller.navegate(req , res)
        } catch (error) {
            log.write( req.originalUrl ,  error )
        }
    })
    app.get("/refam/galeria", (req , res)=>{ 
        try {
            controller.getGalleryList(req , res)
        } catch (error) {
            log.write( req.originalUrl ,  error )
        }
    })
    
    /*      res.render('users', function (err, html) {
              res.send({
                  status: "xyz",
                  timestamp: new Date(),
                  htmlContent: html
              })
          })
      })*/
    app.post("/refam/api/gallery/uploadImage", upload.any(), controller.uploadImage)
    app.get("/refam/galeria1", function (req, res) {
        const images = [
            {"route": "https://placehold.it/245x245"},
            {"route": "https://placehold.it/245x245"},
            {"route": "https://placehold.it/245x245"},
            {"route": "https://placehold.it/245x245"},
            {"route": "https://placehold.it/245x245"},
            {"route": "https://placehold.it/245x245"},
            {"route": "https://placehold.it/245x245"},
            {"route": "https://placehold.it/245x245"},
            {"route": "https://placehold.it/245x245"},
            {"route": "https://placehold.it/245x245"},
            {"route": "https://placehold.it/245x245"},
            {"route": "https://placehold.it/245x245"}
        ];
        res.render('gallery', {images})
    })
};

