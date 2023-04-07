const controller = require(__dirname + "/../controllers/template_editor.controller");
const db = require(__dirname + "/../models");
const fs = require("fs");
const constants = require(__dirname + "/../util/util.constants");
const urlVideos = namefile => '/refam/api/library/get?videoName='+namefile
const urlImages = namefile => '/refam/api/gallery/get?imageName='+namefile

const multer = require('multer');
const path = require('path');
const baseDir = __dirname.replace("app/routes", constants.UPLOADS_DIR)

const validImages = [".webp",".png",".jpg",".pdf",".gif"]
const validVideos = [".mp4"]
const valid = [...validImages , ...validVideos]
function isValidImage(file){
    return validImages.indexOf( '.'+file.originalname.toLowerCase().split('.').pop() ) > -1
}

function isValidVideo(file){
    return validVideos.indexOf( '.'+file.originalname.toLowerCase().split('.').pop() ) > -1
}

function isValidMedia(file){
    return valid.indexOf( '.'+file.originalname.toLowerCase().split('.').pop() ) > -1
}
const tError = payload => {

}
function randomString(len, an) {
    len = len == undefined ? 8 : len
    an = an && an.toLowerCase();
    var str = "",
      i = 0,
      min = an == "a" ? 10 : 0,
      max = an == "n" ? 10 : 62;
    for (; i++ < len;) {
      var r = Math.random() * (max - min) + min << 0;
      str += String.fromCharCode(r += r > 9 ? r < 36 ? 55 : 61 : 48);
    }
    return str;
}
  
global.uploadAssets = multer({
    storage: 
        multer.diskStorage({
            destination: function (req, file, cb) {
                try{
                    let folder = __dirname + "/../public/medias/" + req.body.magazineId ?? '0' + '/'
                    if(req.query.coverArticle != undefined){
                        folder = baseDir + constants.STORAGE_PDF_MAGAZINES
                    }
                    if(req.query.coverMagazine != undefined){
                        folder = baseDir + constants.STORAGE_MAGAZINE_COVER_PAGES
                    }
                    if(req.query.magazine != undefined){
                        folder += "/" + req.body.magazineId + "/"
                    }
                    if(!fs.existsSync(folder)){
                        fs.mkdirSync(folder)
                    }
                    cb(null, folder) 
                }catch( error ){
                    console.log('uploadAssets > ', error)
                }
            },
            filename: function (req, file, cb) { 
                req.body.fileName = randomString() + '.' + file.originalname.split('.').pop()
                cb(null, req.body.fileName ) 
            }
        })/*,
        fileFilter: function (req, file, callback) {
            if( !file ) 
                return callback(new Error('Ningun archivo recibido'))
            if ( ! isValidMedia(file))
                return callback(new Error('Solo imagenes(webp,png,jpg,jpeg,pdf,gif) o videos(mp4)'))
            
            callback(null, true)
        },
        limits: { fileSize: constants.MEDIA_FILE_SIZE }*/
    }
)


const uploadApp = multer({
    storage:  multer.diskStorage({
        destination(req, fileDestination, cb) {
            console.log({ fileDestination })
            cb(null, __dirname + "/../../uploads/cert")
        },
        filename(req, file, callback) {
            callback(null, file.originalname)
        }
    }),
    fileFilter(req, file, callback) {
        if( !file ) 
            return callback(new Error('Ningun archivo recibido'))
        callback(null, true)
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
    });
    */
    var uploadTest = multer({ storage: multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, `${process.cwd()}/uploads/`) // proccess global
        },
        filename: (req, file, cb) => {
            cb(null,  '.' + file.originalname.split('.')[file.originalname.split('.').length - 1].toLowerCase())
        }
    }) });
    // Export routes
    module.exports = function (app, router) {
        router.post('/fileupload', upload.single('avatar'), (req, res, next) => {
            res.status(200).json({message: `File uploaded successfully on '${process.cwd()}/uploads/${req.file.filename}`});
        });
        return router;
    }
    app.get("/refam-editor-test/", (req, res)=>{
        res.send(fs.readFileSync(__dirname+ '/test.html').toString())
    })
    app.post("/refam-editor-test/", uploadTest.single('fileid'), (req, res, next) => {
        if (!req.files) {
            res.json({error:"Escoje un archivo"})
        }else{
            res.json({success:'editor'})
        }
    })
    app.get("/refam/editor/:id", (req, res)=>{
        controller.getTemplateEditorId(req, res)
    });
    app.get("/refam/editor/:id/:article", (req, res)=>{
        if(req.query.token)
            controller.getTemplateEditorIdArticle(req, res)
        else
            controller.getTemplateEditorId(req, res)
    });
    app.get('/refam/api/fonts' , (req, res) => {
            try {
                let files = fs.readdirSync(__dirname+'/../public/refam/fontsCustom/');
                let listFont = []
                let filesResult = []
                for (let index = 0; index < files.length; index++) {
                    if(listFont.indexOf(files[index].split('.')[0]) == -1){
                        listFont.push(files[index].split('.')[0])
                        filesResult.push(index)
                    }
                }
                listFont = []
                for(let index of filesResult){
                    listFont.push(files[index])
                }
                listFont = listFont.map( item => `/refam/fontsCustom/${item}`)
                res.json(listFont)
            } catch (err) {
                console.log(err);
            }
    })
    app.get('/templates/:id', function (req, res) {
        if(req.params.id == "all"){
            fs.readdir(__dirname + "/../public/refam/templates/", (err, files) => {
                files = files.map( file => {
                    return {coverPage:'/refam/templates/'+file,htmlFile:'/templates/'+file.replace('templete','').replace('.png','')}
                })
                res.json(files)
            });
        }else{
            res.render('templates_magazine_'+req.params.id);
        }
    })
    app.get("/refam/upload/cert" , (req, res) => {
        res.send(`
            <h3>Subir CERTIFICADO</h3>
            <form method="post" action="/refam/upload/cert/" enctype="multipart/form-data">
                <input name="fileapp" type="file"> | <button type="submit">Subir</button>
            </form>
        `)
    })
    app.post("/refam/upload/cert/",  uploadApp.single('fileapp'), (req, res, next) => {
        res.send(` GUARDADO `)
    })

    app.get("/refam/download/app",  (req, res, next) => {
        res.send(`
            <a href="itms-services://?action=download-manifest&url=https://refam.sedena.gob.mx/refam/dist/manifest.plist" id="text"> Descargar nuestra aplicación </a>
        `)
    })

    app.get("/refam/dist/manifest.plist", (req, res, next) => {
        res.set('Content-Type', 'text/html')
        res.send( fs.readFileSync(__dirname + "/../public/refam/dist/manifest.plist").toString() )
    })

    app.get('/v1/magazines/my/', (req, res) => {
        global.db.magazine.findAll().then( magazines => {
            res.json( magazines )
        }).catch( error => console.log(error) )
    })
    
    app.post("/refam/upload/editor/",  global.uploadAssets.single('fileid'), (req, res, next) => {
        const file = req.file
        if (!file) {
            console.log({error:"Escoje un archivo"})
            res.json({error:"Escoje un archivo"})
            return false
        }
        if (!isValidMedia(file)) {
            console.log({error:"Escoje un archivo valido"})
            res.json({error:"Escoje un archivo valido"})
            return false
        }
        let route = "/medias/" + req.query.token.id + '/' + file.filename

        if(isValidImage(file)){
            let imageCreate = {
                name: file.filename,
                size: file.size,
                date: (new Date()).toISOString().split(".")[0],
                status: true,
                category:req.query.token.id,
                route,
                magazine:req.query.magazine == undefined ? 0 : req.query.magazine
            }
            global.db.gallery_image.create(imageCreate).then( async img => {
                res.json({success:{
                    id:img.dataValues.id,
                    src: route 
                }})
            })
        }
        
    } );

    function updateEntity(res, entities , id , key , val){
        let validUpdate = ["src","date","status","page","coverPage","magazineId","title","route"]
        if(validUpdate.indexOf(key)>-1){
            if(key == "status" && val == 0){
                res.json({error:"No puede editar este atributo"})
                return 
            }
            let data = {}
            data[key] = val
            entities.update( data , {where:{ id }} )
            .then( entity => { res.json({result:"Actualizado"}) } )
            .catch(err => { res.json({error:"No se pudo actualizar"}) } )
        }else{
            res.json({error:"No puede editar este atributo"})
        }
    }

    app.post("/refam/editor/article/update/:id/:key/:val", (req, res)=>{
        updateEntity( res, db.article_magazine , req.params.id, req.params.key , req.params.val)
    });

    app.post("/refam/editor/magazine/update/:id/:key/:val", (req, res)=>{
        updateEntity( res, db.magazine , req.params.id, req.params.key , req.params.val)
    });

    app.post("/refam/editor/video/update/:id/:key/:val", (req, res)=>{
        updateEntity( res, db.library_video , req.params.id, req.params.key , req.params.val)
    });

    app.get("/refam/api/medias", (req, res) => {
        let where = req.query.magazine ? { status:true,magazine:req.query.magazine } : { status:true }
        db.gallery_image.findAll({
            order: [ ['id', 'DESC'] ],
            where
            })
            .then(galleryImages => {
                galleryImages = galleryImages
                    .map( item => { return { type: 'image', id:item.id, src: urlImages((item.magazine > 0 ? item.magazine + "/" : "") + item.name), height: 'auto', width: "280px" } } )
                
                db.library_video.findAll({
                    order: [ ['id', 'DESC'] ],
                    where
                })
                .then(galleryVideos => {
                    galleryVideos = galleryVideos
                        .map( item => { return { type: 'video', id:item.id, route:item.route, src: urlVideos((item.magazine > 0 ? item.magazine + "/" : "") + item.name), height: 'auto', width: "280px" } } ) 
                    res.json({result:[...galleryImages , ...galleryVideos]})
                })
                .catch(err => {
                    res.json({message: err.message + ""});
                });
            })
            .catch(err => {
                res.json({message: err.message + ""});
            });
    })
};
