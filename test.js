var mysqlAdmin = require('node-mysql-admin');
const express = require("express")
const cors = require("cors")
const jwt = require("jsonwebtoken");
let app = express()
const { readFileSync } = require('fs')
const Log = require(__dirname + '/log/index')
const logEvents = new Log('peticiones')
const logBlock = new Log('block')
const config = require(__dirname + "/app/config/auth.config")

global.locals = {
    events:{},
    addEvent( ref , def ){
        let refAcum = 'global.locals.events'
        let refArray = ref.split('.')
        let last = ref.split('.').pop()
        let value = ''
        if(global.locals.events[ ref.split('.')[0] ] == undefined) global.locals.events[ ref.split('.')[0] ] = {}
        for(let refItem of refArray){
            value = ''
            let refAcumNew = refAcum+'["'+refItem+'"]'
            try{
        	    eval( `value = ${refAcumNew}` )
        	}catch(e){
        	    let container = refItem == last ? '[]' : '{}'
        	    eval(`${refAcum} = ${container}`)
        	}
        	refAcum = refAcumNew
        }
	    if(value == undefined){
    	    eval(`${refAcum} = []`)
	    }
        eval(`${refAcum}.push(def)`)
        logEvents(global.locals.events)
    },
    emit(ref , payload) {
    	let list = []
    	logEvents( `launch event ${ref}` )
    	eval( `list = global.locals['events'].${ref}` )
        if( list ){
            if( list.length ){
            for(let item of list){
                item( payload )
            }
            }
        }else{
            logEvents('list public_server.js ' , list)
        }
    }
}
// dashboard mysql
app.use(mysqlAdmin(app));
global.responseApi = (user, res, data, code) => {
    const accessToken = jwt.sign({id: user.id,role:user.role}, config.secret );
    res.status(code ?? 200).json({
        ...data,
        role:user.role,
        accessToken
    });
}
const bodyParser = require("body-parser")
// parse requests of content-type - application/json
app.use(bodyParser.json({ limit: '200mb' }))
// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))

let envData = {}
envData = JSON.parse(  readFileSync(__dirname + "/public_env.json").toString() )
let PORT = process.env.PORT || envData[ envData.mode ].SERVER.PORT
let DOMAIN = process.env.HTTPS_URL_HOST || envData[ envData.mode ].SERVER.DOMAIN

console.log("Hosting define DOMAIN", DOMAIN)

// set the view engine to ejs
app.set('views', __dirname + '/app/views')
app.set('view engine', 'ejs')

app.use(express.static(__dirname + '/app/public'))

app.use(cors({
    "origin": "*",
    "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
    "preflightContinue": false,
    "optionsSuccessStatus": 204
}))


app.use( (req, res, next) => {
    if (req.originalUrl.search('bash') > -1){
        logBlock( req.originalUrl )
        return res.status(401).send({ error: "No Autorizado!" });
    }

    let token = req.headers["x-access-token"]
    if(token == undefined) token = req.headers["Authorization"]
    if(token == undefined) token = req.query.token
    let routesPublic = ['/refam/login','/refam/notFound','/refam/api/auth/signinAdmin']
    let routesJumpFile = ['jpg','png','mp4','pdf','js','css','map','svg','font']
    let originalUrl = req.originalUrl.split('?')[0]
    const routesJumpSource = url => {
        for(let source of ['/cover/','/fonts','/myadmin']){
            if(url.search(source) > -1) return true
        }
        return false
    } 
    // si esta en la lista de publicas o es un archivo pasamos
    if( routesPublic.indexOf( originalUrl ) > -1 
        || routesJumpFile.indexOf(  originalUrl.split('.').pop() ) > -1 
        || routesJumpSource( originalUrl )
    ){
        if(next) next()
    }else{
        // si no es un archivo y no tiene token y no esta en la lista de publicas
        if ( token == undefined && originalUrl.search('my-medias') == -1) {
            return res.status(401).send({ error: "No hay Token!" });
        }
        
        jwt.verify(token, config.secret, (err, decoded) => {
            if (err) return res.status(401).send({ message: "No Autorizado!" });
            
            req.query.token = decoded;
            if(next) next()
        });
    }
})

// simple route
app.get("/", (req, res) => {
    res.redirect("/refam/login")
})

/**
 * REINICIAR DB
 * colocar force y alter en true, ingresar a /myadmin loguearse Direct Queries, esto es necesario para borrar en orden las relaciones
    USE grupoIdMagazine;
    DROP TABLE article_magazines;
    DROP TABLE magazines;
    DROP TABLE user_roles;
    DROP TABLE user;
    SHOW FULL TABLES FROM grupoIdMagazine
 */

app.get("/log", (req, res) => {
    res.json(JSON.parse(fs.readFileSync(__dirname + '/log/log.json')))
})
app.get("/my-medias/", function (req , res ){
    console.log('my-medias')
    res.sendFile(__dirname + '/app/public/medias/'+req.query.token.id+'/'+req.query.url)
})
app.get("/status", function (req , res ){
    res.send('ok')
})
// menu
app.get('/refam/menu', function (req, res) {
    res.render('mainmenu')
})
app.get('/refam/api/datetime', function (req, res) {
    res.json({datetime: String(new Date)})
})
app.get('/cors', function (req, res) {
    res.json(fs.readFileSync(__dirname + '/cors.json').toString())
})
// routes

app.get("/refam/login", (req , res) => {
    res.render('login',{loginSuccesful:null})
})

/*
app.post("/refam/api/auth/signinAdmin", async (req , res) => {
    
    global.db.user.findOne({enrollment:'DEV.NODE.1'}).then( res => {
        console.log('post signgin admin',{ res })
    }).catch( error => console.log( error ) )
    //console.log(req.body)
    //console.log( (await User.findAll())[0].dataValues )
    //require(__dirname + "/app/controllers/auth.controller").signinAdmin( req, res )
})
*/

function validationAdmin(){
    const User = global.db.user;
    User.findAll()
        .then( res => {
            if( res.length === 0 ){
                console.log('Intentando crear roles')
                const Role = global.db.role;
                Role.create({ name: "user" })
                Role.create({ name: "moderator" })
                Role.create({ name: "admin" })
                console.log('Intentando crear el administrador')
                const bcrypt = require("bcryptjs");
                try{
                    User.create({
                        email:'danielgarcia.clases@gmail.com',
                        enrollment:'DEV.NDOE.1',
                        grade: 'dev',
                        status: 1,
                        speciality: 'dev',
                        completeName: 'daniel garcia',
                        militarRegion: '',
                        militarZone: '',
                        militarUnity: '',
                        birthDate:(new Date()).toISOString(),
                        gender:'m',
                        password: bcrypt.hashSync('0800', 8),
                        role:3,
                        os:'android'
                    })
                }catch( error ){
                    console.log( error )
                }
            }
        })
}

app.listen(PORT , ()=> {
    global.db = require(__dirname + "/app/models")
    const force = true
    validationAdmin()
    
    require( __dirname + '/app/routes/auth.routes')(app)
    require( __dirname + '/app/routes/user.routes')(app)
    /*
    require( __dirname + '/app/routes/gallery_images.routes')(app)
    require( __dirname + '/app/routes/library_videos.routes')(app)
    require( __dirname + '/app/routes/template_editor.routes')(app)
    require( __dirname + '/app/routes/benefit_cupons.routes')(app)
    require( __dirname + '/app/routes/notifications.routes')(app)
    require( __dirname + '/app/routes/magazine.routes')(app)
    require( __dirname + '/app/routes/support_request.routes')(app)
    require( __dirname + '/app/routes/statistics.routes')(app)
    require( __dirname + '/app/routes/changed.routes')(app)
    require( __dirname + '/app/routes/com.routes')(app)
    require( __dirname + '/email')(app);
    require( __dirname + '/test-db.js')(app);
    require( __dirname + '/app/domain/media/save')(app)
    */
    require( __dirname + '/app/routes/v1-api-magazine')(app)
    
    app.get('/refam/notFound', function (req, res) {
        res.render('not_found')
    })
    app.get('/*', function (req, res) {
        res.render('not_found')
    })
})
