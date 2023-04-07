const fs = require('fs')
const db = require(__dirname + '/../models');
const User = db.user;
const limit = 400
const status = 1
const fileStorage = __dirname + '/../../dbNotifications.json'

const getUsers = (req , res) => {
    let { attr , value , page } = req.query
    value = typeof value == 'object' ? '' : value
    if( attr && value && page ){
        User.findAndCountAll({
            where: { [attr]: value , status , tokenFirebase: {[db.Sequelize.Op.ne]:null} },
            order: ['completeName'],
            limit ,
            offset: page * limit,
        }).then( result => {
            //result.rows = [ ...result.rows.map( item => item.dataValues.tokenFirebase ) ]
            result.rows = [ ...result.rows.map( item => {
                return {"os":item.dataValues.os , "tokenFirebase":item.dataValues.tokenFirebase} 
            }) ]
            let pages = parseInt(result.count / limit)
            result.pages = pages % 2 > 0 ? pages + 1 : pages 
            res.json({ page , ...result , pageItems:result.rows.length })
        }).catch( error => res.json( error ) )
    }else{
        res.json({error:'Params error'})
    }
}

const getNotif = (req , res) => {
    res.json(
        Object
            .values(notificationStore().data)
    )
}

function notificationStore( notifications ){
    if( notifications != undefined){
        notifications.data = Object.values(notifications.data).filter( item => ( item.state == 1 ) )
        /*
        if( notifications.data.length > 8 ){
            notifications.data.splice(notifications.data.length - 8, notifications.data.length)
        }*/
    }
	let fileNotification = fileStorage
	if( notifications != undefined ) fs.writeFileSync( fileNotification, JSON.stringify( notifications ) )
	return JSON.parse( fs.readFileSync(fileNotification).toString() )
}

const confirmNotif = (req , res) => {
    let fileNotificationData = notificationStore()
    if( req.params.id != undefined ){
        for(let key in fileNotificationData.data){
            if(fileNotificationData.data[key].id == req.params.id) fileNotificationData.data[key].send = 1
        }
        notificationStore( fileNotificationData )
    }
    res.json( fileNotificationData )
    
}

function getEmails(req , res){
    const {readdirSync , readFileSync , renameSync } = require('fs')
    const path = require('path')
    let directoryPath = path.join( __dirname, '/../controllers/emailsToSend' )
    const files = readdirSync(directoryPath).filter(item => item.split('.').length > 1).filter(item=>item.split('send_').length == 1)
    let result = []
    for(let emailFile of files.slice(0,10)){
        const file = path.join( directoryPath, emailFile )
        let email = {id:emailFile.split('.')[0] , ...JSON.parse( readFileSync( file ).toString() ) }
        renameSync( file  , path.join( directoryPath, 'send_' + emailFile ))
        result.push( email )
    }
    res.json( result )
}

// console.log( confirmNotif )
module.exports = app => {
    app.get('/com/notif' , getNotif )
    app.get('/com/users' , getUsers )
    app.delete('/com/notif/:id' , confirmNotif )
    app.get('/com/emails' , getEmails )
    
}