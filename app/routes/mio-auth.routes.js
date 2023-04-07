const {verifySignUp} = require("../middleware");
const controller = require("../controllers/auth.controller");
const multer = require('multer');
const path = require('path');

const constants = require("../util/util.constants");

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
});

const uploadb = multer({
    storage: storageb,
    fileFilter: function (req, file, callback) {
        let ext = path.extname(file.originalname);
        if (ext !== '.xls' && ext !== '.xlsx' && ext !== '.XLS' && ext !== '.XLSX') {
            return callback(new Error('Sólo se permiten extensiones .XLS ó XLSX'))
        }
        callback(null, true)
    },
    limits: {
        fileSize: constants.IMAGE_FILE_SIZE
    }
});


module.exports = function (app) {
    app.use(function (req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });

    app.post(
        "/refam/api/auth/signup",
        [
            verifySignUp.checkDuplicateUsernameOrEmail,
            verifySignUp.checkRolesExisted
        ],
        controller.signup
    );

    app.post("/refam/api/auth/signin", controller.signin);
    app.post("/refam/api/auth/setUser", controller.update);
    app.post("/refam/api/auth/signinAdmin", controller.signinAdmin);
    app.post("/refam/api/auth/setRole", controller.setRole);
    app.post("/refam/api/auth/test", controller.test);

    app.get("/refam/api/auth/getRegistrationData", controller.getRegistrationData);
    app.get("/refam/api/auth/getAllUsers", controller.getAllUsers);

    app.get("/refam/notFound", controller.getNotFound);
    app.get("/refam/login", controller.getLoginPage);
    app.post("/refam/login", controller.doLoginAdminPage);
    app.get("/templates", controller.getMobileTemplates);

// Ruta para agregar usuario
    app.get('/refam/usuarios/agregar', controller.getUsersUploader)

    app.post('/refam/usuarios/agregar',
        uploadb.any(),
        controller.addUsersWithExcel);


    app.get('/templates1', function (req, res) {
        res.render('templates_magazine_1');
    })
    app.get('/templates2', function (req, res) {
        res.render('templates_magazine_2');
    })
    app.get('/templates3', function (req, res) {
        res.render('templates_magazine_3');
    })
    app.get('/templates4', function (req, res) {
        res.render('templates_magazine_4');
    })
    app.get('/templates5', function (req, res) {
        res.render('templates_magazine_5');
    })
    app.get('/templates6', function (req, res) {
        res.render('templates_magazine_6');
    })
    app.get('/templates7', function (req, res) {
        res.render('templates_magazine_7');
    })
    app.get('/templates8', function (req, res) {
        res.render('templates_magazine_8');
    })
    app.get('/templates9', function (req, res) {
        res.render('templates_magazine_9');
    })
    app.get('/templates10', function (req, res) {
        res.render('templates_magazine_10');
    })
    app.get('/templates11', function (req, res) {
        res.render('templates_magazine_11');
    })
    app.get('/templates12', function (req, res) {
        res.render('templates_magazine_12');
    })
    app.get('/templates13', function (req, res) {
        res.render('templates_magazine_13');
    })
    app.get('/templates14', function (req, res) {
        res.render('templates_magazine_14');
    })
    app.get('/templates15', function (req, res) {
        res.render('templates_magazine_15');
    })
    app.get('/templates16', function (req, res) {
        res.render('templates_magazine_16');
    })
    app.get('/templates17', function (req, res) {
        res.render('templates_magazine_17');
    })

};
