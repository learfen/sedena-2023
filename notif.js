const fs = require('fs')
const admin = require('firebase-admin');
// database
const db = require(__dirname + "/app/models");

var serviceAccount = JSON.parse( fs.readFileSync(__dirname + "/serviceAccount.json") )
serviceAccount.credential = JSON.parse( fs.readFileSync(__dirname + "/credential.json") )
admin.initializeApp({ credential: admin.credential.cert(serviceAccount.credential) });

const dbFirebase = admin.firestore();
const settings = {timestampsInSnapshots: true};
dbFirebase.settings(settings);

function sendDevice( grade , message ){
    //console.log( "= = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = " )
    //console.log("Enviar grade = " , grade )
    const User = db.user;
    User.findAll({where:{ grade , status:1 }})
    .then( users => {
        users.map( user => {
            if( user.dataValues.tokenFirebase ){
                //console.log( "Enviando a >> ", user.dataValues.completeName, ": " , user.dataValues.tokenFirebase)
                console.log("Intentando enviar ... ")
                admin.messaging().sendToDevice( user.dataValues.tokenFirebase , message)
                .then((response) => {
                    //console.log({response})
                })
                .catch((error) => {
                    log(error);
                });
            }
        })
    })

}

function notificationStore( data ){
	let fileNotification = __dirname + '/dbNotifications.json'
	if( data != undefined ) fs.writeFileSync( fileNotification, JSON.stringify( data ) )
	return JSON.parse( fs.readFileSync(fileNotification).toString() )
}

function log( data ){
	let logFile = __dirname + '/notifResult.json'
    let stored = JSON.parse( fs.readFileSync(logFile).toString() )
    delete data.image
	if( stored != undefined ) fs.writeFileSync( logFile, JSON.stringify( [ ...stored , {[new Date()]:data} ] ) )
	else fs.writeFileSync( logFile, JSON.stringify( data ) )
}

setInterval(() => {

    try {
        
        let fileNotificationData = notificationStore()

        let data = Object.values(fileNotificationData.data).filter( item => ( item.state == 1 && item.send == 0 ) )
        for(let k in data){
            let { role , icon , title , body } = data[k].notification
            fileNotificationData.data[data[k].id].send = 1
            sendDevice( role , {
                data: {
                    time: data[k].datetime.split('T')[1],
                    image: icon
                },
                notification: { title , body, image: icon }
            })
        }

        notificationStore( fileNotificationData )

    } catch (error) {
        log( error )
    }
} , 30000 )