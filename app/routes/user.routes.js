const {authJwt} = require("../middleware");
const controller = require("../controllers/user.controller");
const authController = require("../controllers/auth.controller");

const log = require(__dirname + "/../../log/index")

module.exports = function (app) {
    
    app.get("/refam/api/test/all", controller.allAccess);

    app.get(
        "/refam/api/test/user",
        authJwt.verifyToken,
        controller.userBoard
    );

    app.get(
        "/refam/api/test/mod",
        [authJwt.verifyToken, authJwt.isModerator],
        controller.moderatorBoard
    );


    app.get(
        "/refam/api/test/admin",
        [authJwt.verifyToken, authJwt.isAdmin],
        controller.adminBoard
    );

    // Todo Change this to a usersDataController
    app.get('/refam/usuarios', (req , res) =>{
        try{
            authController.getUsersMenu(req , res)
        }catch( error ){
            log.write(req.originalUrl , error )
        }
    });
    app.get('/refam/usuariosDatos', (req , res) =>{
        try{
            authController.getAllUsers(req , res)
        }catch( error ){
            log.write(req.originalUrl , error )
        }
    });
    app.get('/refam/usuariosRegristro', (req , res) =>{
        try{
            authController.setUsers(req , res)
        }catch( error ){
            log.write(req.originalUrl , error )
        }
    });
    app.post('/refam/usuariosRegristro', (req , res) =>{
        try{
            authController.signup(req , res)
        }catch( error ){
            log.write(req.originalUrl , error )
        }
    });
    app.get('/refam/estadisticas', (req , res) =>{
        try{
            authController.getAnalytics(req , res)
        }catch( error ){
            log.write(req.originalUrl , error )
        }
    });

    app.get('/refam/api/users/getPaginationAndData', (req , res) =>{
        try{
            authController.getPaginationAndData(req , res)
        }catch( error ){
            log.write(req.originalUrl , error )
        }
    });
    app.post('/refam/api/users/getPageData', (req , res) =>{
        try{
            authController.getPageData(req , res)
        }catch( error ){
            log.write(req.originalUrl , error )
        }
    });

    app.get('/refam/api/users/get', (req , res) =>{
        try{
            authController.getAllUsers(req , res)
        }catch( error ){
            log.write(req.originalUrl , error )
        }
    });
    app.post('/refam/api/users/searchByMailOrEnrollment', (req , res) =>{
        try{
            authController.searchByMailOrEnrollment(req , res)
        }catch( error ){
            log.write(req.originalUrl , error )
        }
    });
    app.get('/refam/api/users/searchByField', (req , res) =>{
        try{
            authController.searchByField(req , res)
        }catch( error ){
            log.write(req.originalUrl , error )
        }
    });

    app.post('/refam/api/users/setUsersStatus', (req , res) =>{
        try{
            authController.updateUsersStatus(req , res)
        }catch( error ){
            log.write(req.originalUrl , error )
        }
    });
    app.post('/refam/api/users/deleteUser', (req , res) =>{
        try{
            authController.deleteUser(req , res)
        }catch( error ){
            log.write(req.originalUrl , error )
        }
    });
    app.post('/refam/api/users/downloadReport', (req , res) =>{
        try{
            authController.downloadReport(req , res)
        }catch( error ){
            log.write(req.originalUrl , error )
        }
    });

    /**
     * AUTH API
     * **/
    app.post(
        '/refam/api/auth/changePwdRequest',
        (req , res) =>{
            try{
                authController.changePwdRequest(req , res)
            }catch( error ){
                log.write(req.originalUrl , error )
            }
        }
    );
    app.get(
        '/refam/cambioPassVerif',
        (req , res) =>{
            try{
                authController.changePwdVerify(req , res)
            }catch( error ){
                log.write(req.originalUrl , error )
            }
        }
    );

    app.post(
        '/refam/cambioPassVerif',
        (req , res) =>{
            try{
                authController.changePwd(req , res)
            }catch( error ){
                log.write(req.originalUrl , error )
            }
        }
    );
    app.get('/refam/accesoActualizado' , (req , res) =>{ res.render('passwordUpdateSuccess') })

    /*      res.render('users', function (err, html) {
              res.send({
                  status: "xyz",
                  timestamp: new Date(),
                  htmlContent: html
              });
          });
      });*/
    return app

};
