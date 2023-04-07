const out = require(__dirname + '/../util/out')
const db = require(__dirname + '/../models');
const Op = db.Sequelize.Op;
const User = db.user;
const Role = db.role;
const config = require(__dirname + '/../config/auth.config');
const constants = require(__dirname + '/../util/util.constants');
const constantsData = require(__dirname + '/../util/data.constants');
const fs = require('fs')
const ejsLint = require('ejs-lint');
const State = require(__dirname + "/../models/state");

exports.getNotifiactionsScheduled = (req, res) => {
    ejsLint('notificationsscheduled', {})
    res.status(200).render('notificationssheduled');
};


exports.getNotifiactionsEditor = (req, res) => {
    ejsLint('notifications', {})
    res.status(200).render('notifications');
};


function notificationList(req, res) {
  if (res != undefined) {
    res.json({ data: State.open().data });
  }else{
    return State.open();
  }
}

function notificationRolesList( req, res ){
    console.log(constantsData)
    res.json(constantsData.USER_FILTER_DATA.grades)
}

function normalizeDate ( date , mode){
    date = typeof(date) == "object" ? date : new Date(date)
    dateNumber = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate()
    month = (+date.getMonth() + 1) < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1
    hours = date.getHours() < 10 ? `0${date.getHours()}` : date.getHours()
    minutes = date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes()
    if(mode == "str"){
        return `${date.getFullYear()}-${month}-${dateNumber}T${hours}:${minutes}:00`
    }
    return +`${date.getFullYear()}${month}${dateNumber}${hours}${minutes}`
}
function notificationInsertResponseJSON(req, res){
  let result = notificationInsert(req, res )
  if(result.error != undefined)
    res.json( result.error )
}
function notificationInsert(req, res) {
    // en caso de utilizar fuera de la api esta funcion
    if (req.notification != undefined) {
        // si contiene todos los parametros
        if (req.role != undefined) {
            return State.insert({
                notification: req.notification,
                send: 0,
                dateascii: normalizeDate(req.datetime, 'str'),
            });
        }
        return { error: "Error parent payload" };
    } else {
    // si es peticion por api
    if (req.body != undefined) {
        // si contiene todos los parametros
        if (req.body.role != undefined && req.body.notification != undefined) {
          console.log('notification ' , req.body.notification)
            res.json({
                data: State.insert({
                    notification: req.body.notification,
                    send: 0,
                    datetime: normalizeDate(req.body.datetime, 'str'),
                }),
            });
            return { success: true };
        }
        return { error: "Error parent payload" };
        }
    }
    return { error: "Error params" };
}

function notificationUpdate(req, res) {
  // en caso de utilizar fuera de la api esta funcion
  if (req.notification != undefined) {
    // si contiene todos los parametros
    if (req.id != undefined) {
      return State.update( req.id , req.param );
    }
    return { error: "Error parent payload" };
  } else {
    // si es peticion por api
    if (req.body != undefined) {
      // si contiene todos los parametros
      if (req.body.id != undefined && req.body.param != undefined) {
        res.json({ data: State.update( req.body.id , req.body.param ) });
        return { success: true };
      }
      return { error: "Error parent payload" };
    }
  }
  return { error: "Error params" };
}

function notificationDelete(req, res) {
    // en caso de utilizar fuera de la api esta funcion
    if (req.notification != undefined) {
      // si contiene todos los parametros
      if (req.id != undefined) {
        return State.update( req.id , {status:0} );
      }
      return { error: "Error parent payload" };
    } else {
        // si contiene todos los parametros
        if (req.params.id != undefined) {
          res.json({ data: State.update( req.params.id , {status:0}) });
          return { success: true };
        }
        return { error: "Error parent payload" };
    }
  }

function notificationImage(req, res) {
  req.params.file_get = req.params.file_get == undefined ? 'https://refam.sedena.gob.mx/refam/404.png' : req.params.file_get
  let ext = req.params.file_get.split(".")
  res.contentType('image/'+ext[1]);
  res.send( fs.readFileSync( __dirname + "/../public/refam/images/notif/" + req.params.file_get ) )
}

exports.getNotificationImage = notificationImage
exports.getNotifications = notificationList
exports.setNotification = notificationInsert
exports.setNotificationUpdate = notificationUpdate
exports.unsetNotification = notificationDelete

exports.getNotificationsRoles = notificationRolesList

/**
fqLXhipaQkOQMF9vG7EEvR:APA91bHgoJpiQjzvDqd4VcK-t-61FoAnZNpFWCBII1D8d68VV38Xe6-5-s3p3xudpxbM2-WK4RHloajihICVgopDq48sHS1JcghiziEw9DqRPqiOE1KPb5Qmejk3yH9EWkUgU3Jn5Jm-
 */