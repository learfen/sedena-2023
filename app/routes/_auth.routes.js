const {verifySignUp} = require(__dirname + "/../middleware")
const controller = require(__dirname + "/../controllers/auth.controller")
const multer = require('multer')
const path = require('path')
const db = require(__dirname + "/../models")
const Op = db.Sequelize.Op;
const fs = require('fs')
const log = require(__dirname + "/../../log/index")

function clearLink(result){
	let count = 0
	while( result.split('link').length > 1 && count < 100){
		count++
		let arrayClearLink = result.split(`<link`)
		if(arrayClearLink.length > 1){
			result = arrayClearLink[0] + arrayClearLink[1].split(`/>`)[1]
		}
    }
    console.log(result)
	return result + `
	<link href="/refam/css/style.css" ref="stylesheet" data-highlightable="1"/>
	<link rel="stylesheet" href="/refam/css/fontsCustom.css" data-highlightable="1"/>`
}
const constants = require(__dirname + "/../util/util.constants")

// SET STORAGE
const storageb = multer.diskStorage({
    destination: function (req, file, cb) {
        let cuponsStorageRoute = __dirname.replace("app/routes", "uploads/") + constants.TMP_STORAGE_IMPORTED_USERS;
        cb(null, cuponsStorageRoute)
    },

    filename: function (req, file, cb) {
        file.stream.on('data', function (chunk) {
        })

        file.stream.on('finish', function () {
        })

        let ext = path.extname(file.originalname)
        cb(null, "importedUsers" + '-' + file.originalname + '-' + Date.now() + ext) // TODO
    }
})

const uploadb = multer({
    storage: storageb,
    fileFilter: function (req, file, callback) {
        let ext = path.extname(file.originalname)
        if (ext !== '.xls' && ext !== '.xlsx' && ext !== '.XLS' && ext !== '.XLSX') {
            return callback(new Error('Sólo se permiten extensiones .XLS ó XLSX'))
        }
        callback(null, true)
    },
    limits: {
        fileSize: constants.IMAGE_FILE_SIZE
    }
})


module.exports = app => {

    app.post(
        "/refam/api/auth/signup",
        /*
        [
            verifySignUp.checkDuplicateUsernameOrEmail,
            verifySignUp.checkRolesExisted
        ]*/
        (req ,res ) => {
            try {
                controller.signup(req , res)
            } catch (error) {
                log.write( req.originalUrl ,  error )
            }
    })

    app.post(
        "/refam/api/auth/signup2",
        /*
        [
            verifySignUp.checkDuplicateUsernameOrEmail,
            verifySignUp.checkRolesExisted
        ]*/
        (req ,res ) => {
            try {
                controller.signup2(req , res)
            } catch (error) {
                log.write( req.originalUrl ,  error )
            }
    })

    app.get("/refam/api/tables/", 
        (req ,res ) => {
            try {
                controller.tables(req , res)
            } catch (error) {
                log.write( req.originalUrl ,  error )
            }
    })
    app.get("/refam/api/tables/:name", 
        (req ,res ) => {
            try {
                controller.tables(req , res)
            } catch (error) {
                log.write( req.originalUrl ,  error )
            }
    })
    app.post("/refam/api/tables/new/:name", 
        (req ,res ) => {
            try {
                controller.tablesInsert(req , res)
            } catch (error) {
                log.write( req.originalUrl ,  error )
            }
    })
    app.post("/refam/api/tables/:name/:id", 
        (req ,res ) => {
            try {
                controller.tablesUpdate(req , res)
            } catch (error) {
                log.write( req.originalUrl ,  error )
            }
    })

    app.get('/refam/browser/', function (req, res) {
        res.send(fs.readFileSync(__dirname + "/../public/refam/browser-magazine.html").toString())
    })

    app.get('/refam/browser/magazine/', function (req, res) {
        db.magazine.findAll({where:{status:{[Op.gte]:1}}})
        .then( articles => res.json(articles))
        .catch( error => res.json({error}))
    })

    app.get('/refam/browser/magazine/:id', function (req, res) {
        db.article_magazine.findAll({where:{magazineId:req.params.id,status:"1"}})
        .then( articles => res.json(articles))
        .catch( error => res.json({error}))
    })

    app.get('/refam/browser/article/:file', function (req, res) { 
        fs.readFileSync(__dirname + "/../../uploads/magazine_articles/"+req.params.file).toString()
        /*
        res.send(
            clearLink(
                fs.readFileSync(__dirname + "/../../uploads/magazine_articles/"+req.params.file).toString()
                )
        )*/
    })
    app.post("/refam/api/auth/signin", (req , res) => {
        console.log('post')
        try {
            controller.signin( req, res )
        } catch (error) {
            log.write( req.originalUrl ,  error )
        }
    })
    app.get( "/refam/api/auth/emailConfirm/:token", (req , res) => {
        try {
            controller.loginEmailConfirm( req, res )
        } catch (error) {
            log.write( req.originalUrl ,  error )
        }
    })
    app.get( "/refam/api/auth/emailConfirm2/:token", (req , res) => {
        try {
            controller.loginEmailConfirm2( req, res )
        } catch (error) {
            log.write( req.originalUrl ,  error )
        }
    })
    app.post("/refam/api/auth/setUser", (req , res) => {
        try {
            controller.update( req, res )
        } catch (error) {
            log.write( req.originalUrl ,  error )
        }
    })
    app.post("/refam/api/auth/signinAdmin", (req , res) => {
        try {
            controller.signinAdmin( req, res )
        } catch (error) {
            log.write( req.originalUrl ,  error )
        }
    })
    app.post("/refam/api/auth/setRole", (req , res) => {
        try {
            controller.setRole( req, res )
        } catch (error) {
            log.write( req.originalUrl ,  error )
        }
    })
    app.post("/refam/api/auth/test", (req , res) => {
        try {
            controller.test( req, res )
        } catch (error) {
            log.write( req.originalUrl ,  error )
        }
    })
    app.get('/usuarios/eliminarPermanente/:enrollment' , (req , res ) => controller.cleanAccount(req , res) )
    app.get("/refam/api/auth/getRegistrationData", (req , res) => {
        try {
            controller.getRegistrationData( req, res )
        } catch (error) {
            log.write( req.originalUrl ,  error )
        }
    })
    app.get("/refam/api/auth/getAllUsers", (req , res) => {
        try {
            controller.getAllUsers( req, res )
        } catch (error) {
            log.write( req.originalUrl ,  error )
        }

    })
    app.get("/refam/notFound", (req , res) => {
        try {
            controller.getNotFound( req, res )
        } catch (error) {
            log.write( req.originalUrl ,  error )
        }
    })
    app.get("/refam/login", (req , res) => {
        try {
            controller.getLoginPage( req, res )
        } catch (error) {
            log.write( req.originalUrl ,  error )
        }
    })
    app.post("/refam/login", (req , res) => {
        try {
            controller.doLoginAdminPage( req, res )
        } catch (error) {
            log.write( req.originalUrl ,  error )
        }
    })
    app.get("/templates", (req , res) => {
        try {
            controller.getMobileTemplates( req, res )
        } catch (error) {
            log.write( req.originalUrl ,  error )
        }
    })

// Ruta para agregar usuario
    app.get('/refam/usuarios/agregar', (req , res) => {
        try {
            controller.getUsersUploader( req, res )
        } catch (error) {
            log.write( req.originalUrl ,  error )
        }
    })

    app.post('/refam/usuarios/agregar',
        uploadb.any(),
        controller.addUsersWithExcel)


    app.get('/templates1', function (req, res) {
        res.render('templates_magazine_1')
    })
    app.get('/templates2', function (req, res) {
        res.render('templates_magazine_2')
    })
    app.get('/templates3', function (req, res) {
        res.render('templates_magazine_3')
    })
    app.get('/templates4', function (req, res) {
        res.render('templates_magazine_4')
    })
    app.get('/templates5', function (req, res) {
        res.render('templates_magazine_5')
    })
    app.get('/templates6', function (req, res) {
        res.render('templates_magazine_6')
    })
    app.get('/templates7', function (req, res) {
        res.render('templates_magazine_7')
    })
    app.get('/templates8', function (req, res) {
        res.render('templates_magazine_8')
    })
    app.get('/templates9', function (req, res) {
        res.render('templates_magazine_9')
    })
    app.get('/templates10', function (req, res) {
        res.render('templates_magazine_10')
    })
    app.get('/templates11', function (req, res) {
        res.render('templates_magazine_11')
    })
    app.get('/templates12', function (req, res) {
        res.render('templates_magazine_12')
    })
    app.get('/templates13', function (req, res) {
        res.render('templates_magazine_13')
    })
    app.get('/templates14', function (req, res) {
        res.render('templates_magazine_14')
    })
    app.get('/templates15', function (req, res) {
        res.render('templates_magazine_15')
    })
    app.get('/templates16', function (req, res) {
        res.render('templates_magazine_16')
    })
    app.get('/templates17', function (req, res) {
        res.render('templates_magazine_17')
    })
    return app
}
