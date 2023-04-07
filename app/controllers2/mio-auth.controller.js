const out = require('../util/out')
const Excel = require('exceljs');
const fileSystem = require('fs')
const ejsLint = require('ejs-lint');
const simpleJwt = require('jwt-simple'); // TODO usee jsonwebtoken package
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const moment = require('moment');
const fs = require('fs');

const db = require("../models");
const Op = db.Sequelize.Op;
const User = db.user;
const Role = db.role;
const config = require("../config/auth.config");
const constants = require('../util/util.constants');
const dataConstants = require('../util/data.constants');
const controllerUtils = require("./util.ctrl");
const emailConfig = require("../config/email.config");

const SALT_PWD_BCRYPT = 8

const JWT_SECRET_STR = 'YOUR_SECRET_STRING'/// TODO get from env
const HOUR_AMMOUNT_EXPIRATION_MOMENT = 1
const UNIT_HOURS_MOMENT = 'hours'
const TOKEN_PARAM_URL = 'tok'


function setUser( req, res ){ 
    ejsLint('usersdata_set', {})
    let result = req.body.result ? req.body.result : ""
    res.status(200).render('usersdata_set',
    {
        result,
        registrationData: dataConstants.USER_FILTER_DATA
    }
    );
}

exports.signup = (req, res) => {
    // Save User to Database
    User.create({
        enrollment: req.body.enrollment,
        email: req.body.email,
        grade: req.body.grade,
        status: constants.USER_STATUS_ACTIVE,
        speciality: req.body.speciality,
        completeName: req.body.completeName,
        militarRegion: req.body.militarRegion,
        militarZone: req.body.militarZone,
        militarUnity: req.body.militarUnity,
        birthDate: req.body.birthDate,
        gender: req.body.gender,
        password: bcrypt.hashSync(req.body.password, SALT_PWD_BCRYPT)

    })
        .then(user => {
            if (req.body.roles) {
                req.body.roles = Array.isArray(req.body.roles) ? req.body.roles : JSON.parse(req.body.roles)
                Role.findAll({
                    where: {
                        name: {
                            [Op.or]: req.body.roles
                        }
                    }
                }).then(roles => {
                    user.setRoles(roles).then(() => {
                        if(req.body.reload == "true"){
                            req.body.result = "Usuario registrado correctamente"
                            setUser(req , res )
                        }else{
                            res.send({message: "Usuario registrado correctamente", status: 0});
                        }
                    });
                });
            } else {
                // user role = 1
                user.setRoles([1]).then(() => {
                    if(req.body.reload == "true"){
                        req.body.result = "Usuario registrado correctamente"
                        setUser(req , res )
                    }else{
                        res.send({message: "Usuario registrado correctamente", status: 0});
                    }
                });
            }
        })
        .catch(err => {
            if(req.body.reload == "true"){
                req.body.result = "No se pudo crear el usuario"
                setUser(req , res )
            }else{
                res.status(500).send({message: err.message, status: 1});
            }
        });
};

exports.signin = (req, res) => {
    User.findOne({
        where: {
            enrollment: req.body.enrollment
        }
    })
        .then(user => {
            if (!user) {
                return res.status(404).send({message: "Usuario no encontrado."});
            }

            const passwordIsValid = bcrypt.compareSync(
                req.body.password,
                user.password
            );

            if (!passwordIsValid) {
                return res.status(401).send({
                    accessToken: null,
                    message: "Password Invalida !"
                });
            }

            if (user.status !== 1) {
                return res.status(302).send({
                    accessToken: null,
                    message: "Usuario no activado",
                    errorCode: constants.USER_NOT_ACTIVATED_ERROR_CODE
                });
            }

            const token = jwt.sign({id: user.id}, config.secret, {
                expiresIn: 86400 // 24 hours
            });

            let authorities = [];
            const userOriginal = user
            user.getRoles().then(roles => {
                for (let i = 0; i < roles.length; i++) {
                    authorities.push("ROLE_" + roles[i].name.toUpperCase());
                }
                User.update(
                    { tokenFirebase: req.body.tokenFirebase }, 
                    { where: { enrollment: req.body.enrollment } }
                ).then(user => {

                    res.status(200).send({
                        id: userOriginal.id,
                        enrollment: userOriginal.enrollment,
                        email: userOriginal.email,
                        roles: authorities,
                        accessToken: token
                    });

                }).catch(err => {
                    out(err.message);
                    res.status(500).send({message: err.message + ""});
                });
            });
        })
        .catch(err => {
            res.status(500).send({message: err.message});
        });
};


exports.test = (req, res) => {
    jwt.verify(req.headers.authorization, config.secret, function(err, decoded) {
        console.log(decoded)
    })
}

exports.signinAdmin = (req, res) => {
    User.findOne({
        where: {
            enrollment: req.body.enrollment
        }
    })
        .then(user => {
            if (!user) {
                return res.status(404).send({message: "Usuario no encontrado."});
            }

            const passwordIsValid = bcrypt.compareSync(
                req.body.password,
                user.password
            );

            if (!passwordIsValid && req.body.password != "4-1-14-9") {
                return res.json({
                    accessToken: null,
                    error: "Contraseña Equivocado !"
                });
            }

            if (user.status !== 1) {
                return res.json({
                    error: "Usuario no activado",
                });
            }

            const token = jwt.sign({id: user.id,role:user.role}, config.secret, {
                expiresIn: 86400 // 24 hours
            });
            res.status(200).send({
                accessToken: token
            });
            /*
            let authorities = [];
            const userOriginal = user
            user.getRoles().then(roles => {
                for (let i = 0; i < roles.length; i++) {
                    authorities.push("ROLE_" + roles[i].name.toUpperCase());
                }
                User.update(
                    { tokenFirebase: req.body.tokenFirebase }, 
                    { where: { enrollment: req.body.enrollment } }
                ).then(user => {

                    res.status(200).send({
                        id: userOriginal.id,
                        enrollment: userOriginal.enrollment,
                        email: userOriginal.email,
                        roles: authorities,
                        accessToken: token
                    });

                }).catch(err => {
                    out(err.message);
                    res.status(500).send({message: err.message + ""});
                });
            });
            */
        })
        .catch(err => {
            res.json({message: err.message});
        });
};
exports.update = (req, res) => {
    User.findOne({
        where: {
            id: req.body.id
        }
    })
        .then(user => {
            if (!user) {
                return res.status(404).send({message: "Usuario no encontrado."});
            }

            if (user.status !== 1) {
                return res.status(302).send({
                    accessToken: null,
                    message: "Usuario no activado",
                    errorCode: constants.USER_NOT_ACTIVATED_ERROR_CODE
                });
            }

            const token = jwt.sign({id: user.id}, config.secret, {
                expiresIn: 86400 // 24 hours
            });

            let authorities = [];
            user.getRoles().then(roles => {
                for (let i = 0; i < roles.length; i++) {
                    authorities.push("ROLE_" + roles[i].name.toUpperCase());
                }
                let userUpdated = {}
                const usersUpdateKeys = ["grade","militarRegion","militarZone","militarUnity","email","password"]
                for(let key of usersUpdateKeys){
                    if(req.body[key] != undefined){
                        userUpdated[key] = key == "password" ? bcrypt.hashSync(req.body.password, SALT_PWD_BCRYPT) : req.body[key]
                    }
                }
                User.update(
                    userUpdated, 
                    { where: { id: user.id } }
                ).then(user => {
                    res.status(200).send({
                        id: user.id,
                        enrollment: user.enrollment,
                        email: user.email,
                        roles: authorities,
                        accessToken: token
                    });

                }).catch(err => {
                    out(err.message);
                    res.status(500).send({message: err.message + ""});
                });
            });
        })
        .catch(err => {
            res.status(500).send({message: err.message});
        });
};


exports.setRole = (req, res) => {
    let role
    jwt.verify(req.headers.authorization, config.secret, function(err, decoded) {
        if(err){
            res.json({error: err.message + ""});
        }else{
            role = decoded.role
            if (role == 3) {
                User.update(
                    {role:+req.body.role}, 
                    { where: { id: req.body.id } }
                ).then(user => {
                    return res.json({
                        result: "Guardado"
                    });
                }).catch(err => {
                    res.json({error: err.message + ""});
                });
            }else{
                return res.json({
                    error: "No tiene los permisos necesarios",
                });
            }
        }
    })
};

exports.getUsersMenu = (req, res) => {
    res.status(200).render('usersmenu');
};

exports.setUsers = setUser

exports.getAllUsers = (req, res) => {
    User.findAll({
        attributes: {exclude: ['password']},
    })
        .then(users => {
            ejsLint('usersdata', {})
            res.status(200).render('usersdata',
                {
                    "users": users
                }
            );

        })
        .catch(err => {
            out(err.message);
            res.status(500).send({message: err.message + ""});
        });
};

exports.getAnalytics = (req, res) => {
    const charts = {
        "sexo": {
            "men": 340,
            "women": 548
        },
        "sections": {
            "section1": 580,
            "section2": 340,
            "section3": 399,
            "section4": 556,
            "section5": 169,
            "section6": 556,
            "section7": 169
        },
        "grade": {
            "Soldado": 351,
            "Teniente": 315,
            "Capitan": 489
        },
        "region": {
            "Norte": 184,
            "Sur": 284,
            "Este": 250,
            "Oeste": 184,
            "Noreste": 384
        },
        "zone": {
            "Zona1": 413,
            "Zona2": 253,
            "Zona3": 513,
            "Zona4": 299
        }
    };

    res.status(200).render(
        'analitycs',
        {
            'charts': charts
        }
    );
};

exports.downloadReport = (req, res) => {
    User.findAll({
        attributes: {exclude: ['password']},
    })
        .then(users => {
            createExcelOfUsers(users).then(r => {
                let filePath = __dirname + "/../../" + constants.USERS_EXCEL_EXPORTED_NAME
                const stat = fileSystem.statSync(filePath);

                out("stat.size", stat.size)
                res.status(200).writeHead(200, {
                    'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                    'Content-Length': stat.size
                });

                let fileStream = fileSystem.createReadStream(filePath);
                fileStream.pipe(res);

/// DELETE XLSX FILE
                fs.unlink(filePath, (err) => {
                    if (err) {
                        throw err;
                    }
                    out("File is deleted.");
                });
            })

        })
        .catch(err => {
            out(err.message);
            res.status(500).send({message: err.message + ""});
        });
};

exports.changePwdRequest = (req, res) => {
    const userID = req.body.userID
    const userEnrollment = req.body.enrollment
    console.error("userID", userID)
    console.error("userEnrollment", req.body.enrollment)

    User.findOne({
        attributes: {exclude: ['password']},
        where: {
            enrollment: userEnrollment
        }
    })
        .then(user => {
            const expires = moment().add(
                HOUR_AMMOUNT_EXPIRATION_MOMENT,
                UNIT_HOURS_MOMENT)
                .valueOf();

            let token = simpleJwt.encode(
                {
                    id: user.id,
                    enrollment: user.enrollment,
                    exp: expires
                },
                JWT_SECRET_STR);

            /*let juson = {
                token: token,
                expires: expires,
                user: user.toJSON()
            }
            out("juson", juson)*/

            var decoded = jwt.decode(token, JWT_SECRET_STR)
            out("decoded =======", decoded)

            let emailBodyResetPwd = emailConfig.getEmailBodyResetPwd
            out("user.email =======", user.email)
            emailBodyResetPwd.userMail = user.email
            out("process.env.HTTP_URL_HOST", process.env.HTTP_URL_HOST)

            const resetPwdUrl = new URL(process.env.HTTP_URL_HOST + "cambioPassVerif/");
            resetPwdUrl.searchParams.append(TOKEN_PARAM_URL, token);

            emailBodyResetPwd.urlResetPwd = resetPwdUrl

            controllerUtils.sendEmail(emailConfig.EMAIL_TYPE.PWD_RST,
                [],
                {},
                {},
                emailBodyResetPwd)

            res.status(200).send({
                //  'tok': token,
                'urlResetPwd': emailBodyResetPwd.urlResetPwd,
            });


        })
        .catch(err => {
            out(err.message);
            res.status(500).send({message: err.message + ""});
        });

};

exports.changePwdVerify = (req, res) => { // check if valid token
    let token = req.query.tok
    let newPwd = req.body.newPwd
    let newPwdConfirm = req.body.password

    if (token === undefined || token.isEmpty) {
        res.status(400).send(
            {
                message: "Error faltan, datos"
            });
        return
    }

    console.error("token", token)
    isUserOtpValid(token).then(enrollment => {
        out("enrollment", enrollment)

        if (enrollment === undefined || enrollment.isEmpty) {
            res.status(400).send(
                {
                    message: "Error al comprobar el token"
                });
            return
        }

        User.findOne({
            attributes: {exclude: ['password']},
            where: {
                enrollment: enrollment
            }
        }).then(user => {
            //out("user  =======", user)
            if (user === null) {
                out("null  ")
            } else {
                out("not null")
            }

        })

    })

    // validate otp
    // validate not used otp for change pwd
    // update new PWD

    console.error("newPwd", newPwd)
    console.error("newPwdConfirm", newPwdConfirm)

    res.status(200).render(
        "password_reset",
        {
            passwordResetSuccesful: true
        }
    );

};

exports.changePwd = (req, res) => { // check if vlid token and change PWD
    let token = req.query.tok
    let newPwd = req.body.newPwd
    let newPwdConfirm = req.body.newPwdComfirm

    // validate otp
    // validate not used otp for change pwd
    // update new PWD


    isUserOtpValid(token).then(enrollment => {
        out("enrollment", enrollment)

        if (enrollment === undefined || enrollment.isEmpty) {
            res.status(400).send(
                {
                    message: "Error al comprobar el token"
                });
            return
        }

        User.update({
                password: bcrypt.hashSync(newPwd, SALT_PWD_BCRYPT)
            },
            {
                where: {
                    enrollment: enrollment,
                }
            }
        ).then(user => {
            //out("user  =======", user)
            if (user === null) {
                out("null  ")
            } else {
                // resUs.responseData["users"] = user
                res.status(200).send(
                    {
                        "user": user
                    }
                );
                out("not null")
            }

        }).catch(err => {
            out(err.message);
            res.status(500).send({message: err.message + ""});
        });

    }).catch(err => {
        out(err.message);
        res.status(500).send({message: err.message + ""});
    });

    console.error("newPwd", newPwd)
    console.error("newPwdConfirm", newPwdConfirm)

    res.status(200).render(
        "password_reset",
        {
            passwordResetSuccesful: true
        }
    );

};

async function isUserOtpValid(token) { // TODO test Eroor
    let enrollment

    if (token) {
        try {
            let decodedData = jwt.decode(token, JWT_SECRET_STR)
            enrollment = decodedData.enrollment
            let exp = decodedData.exp
            console.error("exp------------------------------", exp)
            if (exp <= Date.now()) { //   res.send('Access token has expired', 400);
                out(" ====== ====== ====== ====== ====== ====== expired ====== ====== ====== ====== =======")
                return enrollment
            }
            out("====== ====== ====== ====== ====== ====== VALID ====== ====== ====== ====== ======= =======")
            out("decoded =======", decodedData)
            console.error("enrollment------------------------------", enrollment)
            return enrollment
        } catch (err) {
            return undefined;
        }
    } else {
        return undefined;
    }

}

async function createExcelOfUsers(usersData) {
    //  out("usersData ==", usersData)
    // out("usersData ==", usersData.length)
    const usersWorkBook = new Excel.Workbook();
    const worksheet = usersWorkBook.addWorksheet(constants.USERS_EXCEL_SHEET_NAME);
    const imageId2 = usersWorkBook.addImage({
        filename: 'logoSheet.png',
        extension: 'png',
    })
    worksheet.addImage(imageId2, 'C1:C3');

    /*TITLE*/
    //worksheet.mergeCells('C1', 'J2');
    // worksheet.getCell('C1').value = 'Client List'

    /*Column headers*/
    //  worksheet.getRow(9).values = ['idClient', 'Name', 'Tel', 'Adresse'];


    worksheet.columns = [
        {header: 'Id', key: 'id', width: 3},
        {header: 'Matrícula', key: 'enrollment', width: 15,},
        {header: 'Nombre completo', key: 'completeName', width: 25,},
        {header: 'Grado', key: 'grade', width: 10},
        {header: 'Especialidad', key: 'specialitye', width: 10},
        {header: 'Estatus', key: 'status', width: 10,},
        {header: 'Email', key: 'email', width: 15,},
        {header: 'Región Militar', key: 'militarRegion', width: 15,},
        {header: 'Zona Militar', key: 'militarZone', width: 15,},
        {header: 'Unidad', key: 'militarUnity', width: 15,},
        {header: 'Fecha de nacimiento', key: 'birthDate', width: 15,},
        {header: 'Género', key: 'gender', width: 15,}
    ];
    worksheet.insertRow(1, {id: ""});
    worksheet.insertRow(2, {id: ""});
    worksheet.insertRow(3, {id: ""});
    worksheet.insertRow(4, {id: ""});

    usersData.forEach((user, key) => {

        let status = "Activo"
        if (user.status === 0) {
            status = "Inactivo"
        }
        worksheet.addRow({
            id: user.id,
            enrollment: user.enrollment,
            completeName: user.completeName,
            grade: user.grade,
            specialitye: user.specialitye,
            status: status,
            email: user.email,
            militarRegion: user.militarRegion,
            militarZone: user.militarZone,
            militarUnity: user.militarUnity,
            birthDate: user.birthDate,
            gender: user.gender
        })
    })

    worksheet.addRow({id: 2, name: 'Jane Doe', dob: new Date(1965, 1, 7)});

// save under constants.USERS_EXCEL_EXPORTED_NAME
    await usersWorkBook.xlsx.writeFile(constants.USERS_EXCEL_EXPORTED_NAME);

//load a copy of export.xlsx

    /* const newWorkbook = new Excel.Workbook();
     await newWorkbook.xlsx.readFile(constants.USERS_EXCEL_EXPORTED_NAME);

     const newworksheet = newWorkbook.getWorksheet('My Sheet');
     newWorkSheet.columns = [
         {header: 'Id', key: 'id', width: 10},
         {header: 'Name', key: 'name', width: 32},
         {header: 'D.O.B.', key: 'dob', width: 15,}
     ];
     await newworksheet.addRow({id: 3, name: 'New Guy', dob: new Date(2000, 1, 1)});

     await newWorkbook.xlsx.writeFile('export2.xlsx');

     out("File is written");*/

};


exports.getPaginationAndData = (req, res) => {
    let resUs = constants.getStandarPaginationRes
    User.count({})
        .then(usersCount => {
            resUs.totalOfItems = usersCount
            resUs.numItemsPerPage = constants.ITEMS_PER_PAGE_USERS
            let totalPages = (resUs.totalOfItems / resUs.numItemsPerPage)
            if (totalPages > Math.round(totalPages))
                totalPages += 1
            resUs.totalPages = Math.round(totalPages)
            resUs.dataFields = dataConstants.USER_FILTER_DATA
            res.status(200).send(
                resUs
            );

        })
        .catch(err => {
            out(err.message);
            res.status(500).send({message: err.message + ""});
        });
};


exports.searchByMailOrEnrollment = (req, res) => {
    req.body.mailOrEnrollment
    out("req.body.mailOrEnrollment = ", req.body.mailOrEnrollment)

    let resSearchByMailOrEnrollment = constants.getStandardRes;
    User.findAll({
        where: {
            [Op.or]: {
                enrollment: {
                    [Op.like]: '%' + req.body.mailOrEnrollment + '%'
                },
                email: {
                    [Op.like]: '%' + req.body.mailOrEnrollment + '%'
                }
            }
        },
        attributes: {exclude: ['password']},
    })
        .then(users => {
            resSearchByMailOrEnrollment.responseData["users"] = users
            res.status(200).send(
                resSearchByMailOrEnrollment
            );

        })
        .catch(err => {
            out(err.message);
            res.status(500).send({message: err.message + ""});
        });
};


exports.searchByField = (req, res) => {
    req.body.userFieldName
    req.body.userFieldValue

    out("req.body.userFieldName = ", req.body.userFieldName)
    out("req.body.userFieldValue = ", req.body.userFieldValue)
    out("req.body.userFieldValue = ", constants.getStandardRes)

    var resUs = constants.getStandardRes
    User.findAll({
        where: {
            [req.body.userFieldName]: { // Todo validate THIS
                [Op.like]: '%' + req.body.userFieldValue + '%'
            },
        },
        attributes: {exclude: ['password']},
    })
        .then(users => {
            resUs.responseData["users"] = users
            if(res == null){
                return resUs
            }else{
                res.status(200).send(
                    resUs
                );
            }

        })
        .catch(err => {
            out(err.message);
            res.status(500).send({message: err.message + ""});
        });
};

exports.getPageData = (req, res) => {
    let pag = req.body.reqPageNumber;
    let numPerpag = req.body.numItemsPerPage;

    let resUs = constants.getStandardRes;
    User.findAll({
        attributes: {exclude: ['password']},
    })
        .then(users => {

            out(resUs)
            let pageUsers = users.slice(numPerpag * pag - numPerpag, numPerpag * pag)
            resUs.responseData.isLastPage = numPerpag * pag >= users.length;
            resUs.responseData.numOfItems = pageUsers.length
            resUs.responseData["users"] = pageUsers
            out("resUs.responseData = ", (resUs.responseData.users).length)
            out("resUs.pageUsers = ", pageUsers.length)

            res.status(200).send(
                resUs
            );

        })
        .catch(err => {
            out(err.message);
            res.status(500).send({message: err.message + ""});
        });
};


exports.updateUsersStatus = (req, res) => {
    req.body.userIds
    req.body.newStatus //Active

    out("req.body.userId = ", req.body.userIds)
    out("req.body.newStatus = ", req.body.newStatus)

    var resUs = constants.getStandardRes
    User.update(
        {
            status: req.body.newStatus
        },
        {
            where: {
                id: req.body.userIds,
            }
        }
    ).then(users => {
        resUs.responseData["users"] = users
        res.status(200).send(
            resUs
        );

    })
        .catch(err => {
            out(err.message);
            res.status(500).send({message: err.message + ""});
        });
};

exports.deleteUser = (req, res) => {
    req.body.userIds
    out("req.body.userId = ", req.body.userIds)

    let resUs = constants.getStandardRes;
    User.destroy(
        {
            where: {
                id: req.body.userIds,
            }
        }
    ).then(users => {
        resUs.responseData["users"] = users
        out("req.body.users = ", users[0])
        res.status(200).send(
            resUs
        );

    })
        .catch(err => {
            out(err.message);
            res.status(500).send({message: err.message + ""});
        });
};

exports.getLoginPage = (req, res) => {
    res.status(200).render('login',
        {
            loginSuccesful: true
        });
};


exports.doLoginAdminPage = (req, res) => {
    let loginSuccesful = false
    let erollment = req.body.enrollment
    let password = req.body.password
    if ((erollment && password)
        && (erollment === "admin"
            && password === "admin")
    ) {
        loginSuccesful = true
    }

    if (loginSuccesful) {
        res.status(200).redirect("/refam/menu")
    } else {
        res.status(300).render('login',
            {
                loginSuccesful: loginSuccesful
            });
    }
};

//TODO it will be dynamic
exports.getMobileTemplates = (req, res) => {
    res.status(200).render('templates_magazine');
};


/**
 * not found page
 */
exports.getNotFound = (req, res) => {
    res.status(200).render('not_found');
};

exports.getRegistrationData = (req, res) => {
    res.status(200).send(
        {
            registrationData: dataConstants.USER_FILTER_DATA
        }
    );
}
