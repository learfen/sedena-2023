const controller = require("../controllers/notifications.controller");

module.exports = function (app) {

    app.get("/google23ace7204eddf470.html", (req, res) => {
        res.send( fs.readFileSync(__dirname + '/../public/refam/google23ace7204eddf470.html').toString() )
    });
    app.get("/refam/notificacionesAdmin", controller.getNotifiactionsEditor);
    app.get("/refam/notificaciones", controller.getNotifiactionsScheduled);
    app.get("/refam/api/notificacionesRoles", controller.getNotificationsRoles);
    
    app.get("/refam/api/notificaciones", controller.getNotifications);
    app.post("/refam/api/notificaciones", controller.setNotification);
    app.put("/refam/api/notificaciones", controller.setNotificationUpdate);
    
    app.delete("/refam/api/notificaciones/:id", controller.unsetNotification);
    
    const multer = require('multer');
    const fs = require('fs');
    const State = require(__dirname + "/../models/state");
    var storage = multer.diskStorage({
        destination: function (req, file, cb) {
          cb(null, __dirname + '/../public/refam/images/notif/')
        },
        filename: function (req, file, cb) {
            let ext = file.originalname.split(".")
            let filename = Date.now() + "." + ext[ext.length - 1]
            req.body['fileUp'] = filename
            cb(null, filename )
        }
    })
    
    var upload = multer({ storage })
    app.post('/refam/api/notificacionesImage', upload.single('icon'), (req, res) => {
        let icon = "https://"+req.headers.host + "/refam/images/notif/"+req.body.fileUp
        State.update(req.body.id , {"notification.icon":icon})
        res.json({data:{ icon }})
    })
    app.get('/refam/api/notificacionesImage/:file_get', controller.getNotificationImage)
};
