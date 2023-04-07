//const setTZ = require('set-tz')
//setTZ('America/Mexico_City')
const express = require("express")
const bodyParser = require("body-parser")
const cors = require("cors")
const app = express()
const fs = require('fs')
//const dotenv = require('dotenv').config()
const path = require("path") 
//const morgan = require("morgan")
const force = false
const log = require(__dirname + '/log/index')
//const Log = require(__dirname + '/log/index')
//const logRequest = new Log('request')
//const logRequestCount = new Log('requestCount')
//const logPeticiones = new Log('peticiones')
// command analizer 
// create a write stream (in append mode)
//var accessLogStream = fs.createWriteStream(path.join(__dirname, 'morgan-access.log'), { flags: 'a' })
// setup the logger
//app.use(morgan('combined', { stream: accessLogStream }))

let params = {}
for(let arg of process.argv){
    let commandString = arg.split('=')
    if(commandString.length > 1){
        for(let partString of arg.split(" ")){
            let partArray = partString.split("=")
            if(partArray.length > 1)
                params[partArray[0].toLowerCase()] = partArray[1]
        }
    }
}

let envData = {}
if(params.port == undefined){
     envData = JSON.parse( fs.readFileSync(__dirname + "/public_env.json").toString() )
     params.port = envData[ envData.mode ].SERVER.PORT
     params.domain = envData[ envData.mode ].SERVER.DOMAIN
}
let PORT = process.env.PORT || params.port
let DOMAIN = process.env.HTTPS_URL_HOST || params.domain

const CLIENT_BODY_MAX_SIZE = '200mb'

const corsOptions = {
    origin: '*' 
};

console.log("Hosting define DOMAIN", DOMAIN)

app.use(express.static(__dirname + '/app/public'))


app.use(function (req, res, next) {
    /*res.setHeader('X-Frame-Options', 'SAMEORIGIN') // No. 3 Clickjacking: X-Frame-Options header missing
    // se agrega el header con valor SAMEORIGIN para solo permitir frames del mismo origen
    //No. 5 Content Security Policy (CSP) not implemente
    //  Se agrega el header para la politica de segiuridad
    //  No. 6 Insecure Referrer Policy
    res.setHeader('X-Frame-Options', 'SAMEORIGIN',)
    let domainCorsAdd = '#domain# #domain#:443 #domain#:80 #domain#:3001 #domain#:3002'
    if(envData.mode == 'dev')
        domainCorsAdd = domainCorsAdd
            .replace('#domain#',DOMAIN+':'+envData[ envData.mode ].SERVER.PORT)
    domainCorsAdd = domainCorsAdd
        .split('#domain#')
        .join(DOMAIN)
        app.disable('x-powered-by')
        let politics = `default-src \'unsafe-inline\' \'unsafe-eval\' \'self\' localhost 40.86.102.251\:\* ;img-src \'self\' data: picsum.photos i.picsum.photos;font-src \'self\' localhost\:\* localhost refam.sedena.gob.mx\:\*;style-src \'self\' localhost\:\* localhost 10.10.1.177:* 10.10.1.177\:\* 10.10.1.101:* 10.10.1.101\:\* 10.10.1.104:* 10.10.1.104\:\* 10.10.1.105:* 10.10.1.105\:\* 10.10.1.106:* 10.10.1.106\:\* 10.10.1.120:* 10.10.1.120\:\* 10.10.1.121:* 10.10.1.121\:\* refam.sedena.gob.mx\:\* \'unsafe-inline\'`
        /*
        console.log( 'default-src \'unsafe-inline\' \'unsafe-eval\' \'self\' '+ domainCorsAdd +' code.jquery.com cdnjs.cloudflare.com maxcdn.bootstrapcdn.com cdn.jsdelivr.net unpkg.com fonts.gstatic.com picsum.photos html2canvas.hertzen.com 40.86.102.251:* ; ' +
        'img-src \'self\' data: picsum.photos i.picsum.photos;' +
        'font-src \'self\' fonts.gstatic.com unpkg.com cdnjs.cloudflare.com;' +
        'font-src \'self\' http://localhost:3000/ http://localhost/ http://localhost/* http://localhost:3000/* ;'+
        'style-src \'self\' http://localhost:3000/ http://localhost/ http://localhost/* http://localhost:3000/* \'unsafe-inline\'')
        
    res.setHeader('Content-Security-Policy', politics)*/
    if(next) next()
})
app.use(cors(corsOptions))


// set the view engine to ejs
app.set('views', __dirname + '/app/views')
app.set('view engine', 'ejs')


// use res.render to load up an ejs view file


// parse requests of content-type - application/json
app.use(bodyParser.json(
    {
        limit: CLIENT_BODY_MAX_SIZE
    }
))

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded(
    {
        extended: true
    }
))
// database
const db = require(__dirname + "/app/models")

//db.sequelize.col('users.grade')
db.sequelize.sync({ force , alter:false }).then(()=>{
    
    if (force == true) {
        db.role.create({
            id: 1,
            name: "user"
        })

        db.role.create({
            id: 2,
            name: "moderator"
        })

        db.role.create({
            id: 3,
            name: "admin"
        })
    }
})
const Op = db.Sequelize.Op;
const User = db.user;
const Role = db.role;
User.findOne({where:{enrollment:'DEV.NODE.1'}})
.then( res => {
    if( !res ){
        const bcrypt = require("bcryptjs");
        User.create({
            email:'danielgarcia.clases@gmail.com',
            enrollment:'DEV.NDOE.1',
            grade: 'dev',
            status: true,
            speciality: 'dev',
            completeName: 'daniel garcia',
            militarRegion: '',
            militarZone: '',
            militarUnity: '',
            birthDate:(new Date()).toISOString(),
            gender:'m',
            password: bcrypt.hashSync('0800', 8),
            role:0,
            os:'android'
        })
    }
})

// force: true will drop the table if it already exists
// db.sequelize.sync({force: true}).then(() => {
//   console.log('Drop and Resync Database with { force: true }')
//   initial()
// })

app.get("/log", (req, res) => {
    res.json(JSON.parse(fs.readFileSync(__dirname + '/log/log.json')))
})

app.get("/", (req, res) => {
    res.redirect("/refam/login")
})

// routes
require( __dirname + '/app/routes/auth.routes')(app)
require( __dirname + '/app/routes/user.routes')(app)
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

const Media = require(__dirname + '/app/domain/images/thumbs');
app.get('/refam/thumb', (req, res) => {
    if(req.query.src) {
       let image = new Media(req.query.src);
       image.thumb(req, res);
    } else {
        res.sendStatus(403);
    }
});

app.get("/test-http", function (req , res ){
    res.send('Hola soy el editor')
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

app.get('/*', function (req, res) {
    log.write(req.originalUrl)
    res.redirect('/refam/notFound')
})

if( envData.mode == 'prod' && 1 == 0){
    try {
        const https = require('https')
        //const http = require('http')
        const options = {
            key: fs.readFileSync(__dirname + '/4f5323ba461d39b8.key'),
            cert: fs.readFileSync(__dirname + '/4f5323ba461d39b8.crt')
            //            ca: fs.readFileSync(__dirname + '/gd_bundle-g2-g1.crt')
        }
        https.createServer(options, app).listen(PORT)
        //serverByClusters( { options, app , PORT, protocol:https })

    } catch (error) {
        console.log('ERROR $$ ' , error.message)
    }
}else{
    const http = require('http')
    http.createServer({}, app).listen(PORT)
}

/*
if( envData.mode == 'dev'){
    const http = require('http')
    http.createServer({}, app).listen(PORT)
}
*/
function serverByClusters({ protocol , PORT , app , options}){
    console.log(`Ejecutandose en el puerto: ${PORT}`)
    if(!PORT || !Object.keys(options)){
      console.log("error en los datos del server " , PORT , options )
      return false
    }
    const cluster = require('cluster');
    const numCPUs = require('os').cpus().length; //number of CPUS

    if (cluster.isMaster) {
    // Fork workers.
    for (var i = 0; i < numCPUs; i++) {
        cluster.fork();    //creating child process
    }

    //on exit of cluster
    cluster.on('exit', (worker, code, signal) => {
        if (signal) {
            console.log(`worker was killed by signal: ${signal}`);
        } else if (code !== 0) {
            console.log(`worker exited with error code: ${code}`);
        } else {
            console.log('worker success!');
        }
    });
    } else {
        // Workers can share any TCP connection
        // In this case it is an HTTP server
        protocol.createServer(options, app).listen(PORT);
    }
    /*
    console.log(app._router.stack.map( item => {
        if(item['route'] != undefined)
            console.log(item.route.path , Object.keys(item.route.methods) )
    }))
    */
}
