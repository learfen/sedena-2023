const multer = require('multer')
const db = require(__dirname + '/../../models');
const explorerSet = require(__dirname + '/../explorer/set');
const Image = db.gallery_image;
const Video = db.library_video;
const path = require('path')

function validExtension( rules , ext ){
    return ( rules.indexOf( ext ) > -1 )
}

const dirsValids = {
    gallery:{
        path:__dirname + '/../../../uploads/gallery/',
        rules:[
            {name:'gif',size:'5MB'},
            {name:'png',size:'15MB'},
            {name:'jpg',size:'15MB'},
            {name:'jpeg',size:'15MB'}
        ]
    },
    library:{
        path:__dirname + '/../../public/refam/video/',
        rules:[ {name:'mp4',size:'30MB'} ]
    }
}

function validExtension( dir, extensionFile ){
    return dirsValids[dir].rules.map(rule => rule.name).indexOf( extensionFile )
}

function validLimit( dir, extensionFile , file ){
    console.log( file )
    let resultValidExtension = validExtension( dir , path.extname( file.originalname ) )
    if( resultValidExtension > -1)
        return dirsValids[req.query.dir].rules[extensionValid( req )] 
}

function randomString ( length , type ) {
	length = length == undefined ? 6 : length
	var result           = '';
	var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789abcdefghijklmnopqrstuvwxyz0123456789';
	characters = type == 'number' ? "0123456789" : characters
	characters = type == 'letters' ? "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz" : characters
	var charactersLength = characters.length;
	for ( var i = 0; i < length; i++ ) {
	   result += characters.charAt(Math.floor(Math.random() * charactersLength));
	}
	return result;
}

function createNameFile( file ){
    return ('fileid-' + Date.now() + '-'
         + randomString() 
         + path.extname(file.originalname)).toLowerCase()
}

// SET STORAGE
const storage = multer.diskStorage({
    destination(req, file, cb) { cb(null, dirsValids[req.query.dir].path ) },
    filename(req, file, cb) { cb(null,  createNameFile( file ) ) }
})

const upload = multer({
    storage: storage,
    fileFilter(req, file, callback) {
        let dirs = dirsValids[ req.query.dir ]
        let resultValidExtension = validExtension( req.query.dir , path.extname( file.originalname ) )
        if ( resultValidExtension > -1 ) {
            return callback(new Error('No es un tipo permitido'+dirs.rules.map(rule => rule.name).join(',')))
        }
        if ( validLimit( req.query.dir, resultValidExtension , file ) > -1 ) {
            return callback(new Error('Excede el tamaño permitido '+dirs.rules.map(rule => `${rule.name}:${rule.size}`).join(',')))
        }
        callback(null, true)
    }
})


function uploadImage (req, res, next) {
    const files = req.files
    if (!files) res.json({ error:'Debes seleccionar una imagen' }) 
    else{
        files.forEach((imageFile, key) => {
                let mediaData = {}
                let Entity = Image
                if( req.query.dir == 'gallery'){
                    mediaData = {
                            name: imageFile.filename.toLowerCase(),
                            size: imageFile.size,
                            date: imageFile.size,
                            status: true,
                            category: imageFile.destination,
                            route: imageFile.destination,
                            magazine:req.query.magazine ?? 0,
                            explorerId:req.query.album ?? ''
                        }
                }
                if( req.query.dir == 'library'){
                    Entity = Video
                    mediaData = {
                            name: imageFile.filename.toLowerCase(),
                            size: imageFile.size,
                            date: imageFile.size,
                            status: true,
                            category: imageFile.destination,
                            route: imageFile.destination,
                            magazine:req.query.magazine ?? 0,
                            explorerId:req.query.album ?? ''
                        }
                }
                const saveMedia = album =>{
                    if( album != undefined ) {
                        mediaData.explorerId = album.id
                    }
                    Entity.create(mediaData)
                    .then( media => res.json({success:true , media:media.dataValues }) )
                    .catch( error => res.json({ error }) )
                }

                if( mediaData.explorerId == 'new'){
                    explorerSet({body:{cover:mediaData.name.toLowerCase(), name:'Nuevo'}} , false , saveMedia)
                }else saveMedia()
            }
        )
    }
}

module.exports = app => {
    /* queries = 'dir' , 'album' , 'magazine' */
    app.post('/refam/api/media/save', upload.any(), uploadImage)
}
