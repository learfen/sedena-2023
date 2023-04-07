const out = require(__dirname + '/../util/out')
const Excel = require('exceljs');
const { statSync , createReadStream , existsSync , unlink , unlinkSync , readFileSync , writeFileSync } = require('fs')
const ejsLint = require('ejs-lint');
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const moment = require('moment');

const db = require(__dirname + "/../models");
const sequelize = require('sequelize')
const Op = db.Sequelize.Op;
const User = db.user;
const Role = db.role; //  
const config = require(__dirname + "/../config/auth.config");
const constants = require(__dirname + '/../util/util.constants');
const dataConstants = require(__dirname + '/../util/data.constants');
const controllerUtils = require("./util.ctrl");
const emailConfig = require(__dirname + "/../config/email.config");
const { article_magazine } = require(__dirname + '/../models');

const SALT_PWD_BCRYPT = 8
const fileReportUsers = __dirname + '/exportedUsers.xlsx' 
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

async function count( Entity , where ){
    let { count } = await Entity.findAndCountAll({ where })
    return { count }
}

exports.tables = ( req, res )=> {
    if(req.params.name){
        db[ req.params.name ].findAll().then( data => {
            if(data.length > 0){
                res.json( { header:Object.keys(data[0].dataValues) , data} )
            }else{
                res.json( {header:[] , data:[] })
            }
        })
    }else{
        let db2 = Object.assign( {}, db )
        delete db2.sequelize
        let result = {}
        for(let model of Object.keys(db2)){
            if(db2[model].tableAttributes)
                result[model] = Object.keys( db2[model].tableAttributes ).slice(0,-2)
        }
        res.json( result )
    }
}

exports.tablesUpdate = ( req, res )=> {
    if(req.params.name){
        let data = JSON.parse(req.body.value)
        db[ req.params.name ].update( data , {where:{ id:req.params.id }}).then( data => {
            res.json( {result:'ok'} )
        }).catch( res => {
            res.json({error:res.message})
        })
    }
}

exports.tablesInsert = ( req, res )=> {
    const model = req.params.name
    if(model){
        let data = {id:null}
        for( let key of Object.keys( db[model].tableAttributes )){
            data[key] = req.body[key]
        }
        db[ model ].create( data ).then( result => {
            res.json( result )
        }).catch( res => {
            res.json({error:res.message})
        })
    }
}

exports.loginEmailConfirm = ( req , res ) => {
    if(req.query.isSite == undefined){
        res.send('<script>setTimeout(()=>{location.href="https://refam.sedena.gob.mx/refam/api/auth/emailConfirm/'+req.params.token+'?isSite=true" , 1000})</script>')
    }else{
            let data = jwt.verify(req.params.token, JWT_SECRET_STR)
            if(data == null){
                console.log('Error token registro , ', req.params.token , data)
            }
            const responseError =  message =>{
                req.body.result = message
                if(req.body.reload == "true"){
                    setUser(req , res )
                }else{
                    res.json({ message:"Error "+message });
                }
            }
            const create = (req, res, data) => {
                User.create( data )
                .then(user => {
                    if(req.body.reload == "true"){
                        req.body.result = "Usuario registrado correctamente"
                        ejsLint('signUpSuccess', {})
                        res.status(200).render('signUpSuccess', {})
                    }else{
                        //res.send({message: "Usuario registrado correctamente", status: 0});
                        //req.body.result = "Usuario registrado correctamente"
                        ejsLint('signUpSuccess', {})
                        res.status(200).render('signUpSuccess', {})
                        
                    }
                })
                .catch(err => {
                    responseError("Error al guardar en la base de datos, "+err.message)
                });
            }
            if( data.email )
                User.findOne({where:{email:data.email}})
                    .then( resultEmail => {
                        if(resultEmail == null){
                            User.findOne({where:{enrollment:data.enrollment}})
                                .then(resultEnrollment => {
                                    if(resultEnrollment == null){
                                        create( req , res , data)
                                    }else{
                                        responseError("No se pudo crear el usuario, matricula en uso")
                                    }
                                }).catch( error => {
                                    responseError("No se pudo buscar(matricula) en los usuarios "+error.message)
                                })
                        }else{
                            responseError("No se pudo crear el usuario, email en uso")
                        }
                    }).catch( error => {
                        responseError("No se pudo buscar("+data.enrollment+") en los usuarios "+error.message)
                    })
            else
                    res.json({error:'El token no funciona'})
    }
}

function loginEmailQuestion ( req , res , token){
    let emailData = {}
    emailData['userMail'] = req.body.email
    
    emailData['body'] = `<a href="https://refam.sedena.gob.mx/refam/api/auth/emailConfirm/${token}"><img width="100%" style="max-width:100vw" height="auto" src="https://refam.sedena.gob.mx/refam/images/confirm-email.jpg"> <hr> En caso de no ver la imagen haz click ---> <b>AQUI</b> <--- para confirmar registro </a>`
    /*
    controllerUtils.sendEmail("validEmail",
        [],
        {},
        {},
        emailData)
    */
        let fileEmail = __dirname + '/emailsToSend/passwordChange_' + idTemporal() + '.json'
        writeFileSync(fileEmail , JSON.stringify({
            to:req.body.email,
            html:emailData['body']
        }))
    res.send({message:" < Porfavor revisé su email > "})
}

exports.signup= async (req, res) => {
    const create = () => {
        birthDate = req.body.birthDate ?? (new Date).toISOString()
        gender = req.body.gender ? req.body.gender.toLowerCase() : '*'
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
            birthDate,
            gender,
            status:1,
            password: bcrypt.hashSync(req.body.password, SALT_PWD_BCRYPT),
            role:3,
            os:''
        })
        .then(user => {
            if(req.body.reload == "true"){
                req.body.result = "Usuario registrado correctamente"
                setUser(req , res )
            }else{
                res.send({message: "Usuario registrado correctamente", status: 0});
            }
        })
        .catch(err => {
            responseError("Error al guardar en la base de datos, "+err.message)
        });
    }
    const responseError =  message =>{
        req.body.result = message
        if(req.body.reload == "true"){
            setUser(req , res )
        }else{
            res.json({ message:"Error "+message });
        }
    }
    // Save User to Database
    const signupExecute = () => {
        birthDate = req.body.birthDate ?? (new Date).toISOString()
        gender = req.body.gender ? req.body.gender.toLowerCase() : '*'
        /*
        count( User , { status:1 } ). then ( countResult => {
            if( countResult.count > 1 ){
                
            }else{
                responseError("No se pudo crear el usuario esta es una prueba para 250 usuarios y se ha llegado al limite")
            }
        }).catch( error => {
            responseError("No se pudo buscar en los usuarios "+error.message)
        })
        */
        User.findOne({where:{email:req.body.email}})
        .then( resultEmail => {
            if(resultEmail == null ){
                User.findOne({where:{enrollment:req.body.enrollment}})
                .then(resultEnrollment => {
                    const fileSignup = __dirname + '/signupFindResult.json'
                    let fileSignupContent = ''
                    if(existsSync( fileSignup )) fileSignupContent = readFileSync(fileSignup).toString() 
                    writeFileSync( fileSignup , `
                        ${fileSignupContent} 

                        ${req.body.enrollment}>${req.body.email}> resultFind: ${JSON.stringify( resultEnrollment )}
                    `)
                    if(resultEnrollment == null){
                        let token = ()=>{
                            return jwt.sign(
                                {
                                    enrollment: req.body.enrollment,
                                    email: req.body.email,
                                    grade: req.body.grade,
                                    status: constants.USER_STATUS_ACTIVE,
                                    speciality: req.body.speciality,
                                    completeName: req.body.completeName,
                                    militarRegion: req.body.militarRegion,
                                    militarZone: req.body.militarZone,
                                    militarUnity: req.body.militarUnity,
                                    birthDate,
                                    gender,
                                    password: bcrypt.hashSync(req.body.password, SALT_PWD_BCRYPT),
                                    role:"3",
                                },
                                JWT_SECRET_STR);
                        }

                        let index = 0;
                        while ( index < 3 && index > -1 ) {
                            try{
                                let token_ = token()
                                jwt.verify(token_, JWT_SECRET_STR)
                                loginEmailQuestion( req , res , token_)
                                index = -1
                            }catch(error){
                                console.log('Error al generar el token : ' , error )
                                index++
                            }
                        }

                    }else{
                        responseError("No se pudo crear el usuario, matricula en uso")
                    }
                }).catch( error => {
                    responseError("No se pudo buscar(matricula) en los usuarios "+error.message)
                })
            }else{
                responseError("No se pudo crear el usuario, email en uso")
            }
        }).catch( error => {
            responseError("No se pudo buscar(email) en los usuarios "+error.message)
        })
    }
    req.body.enrollment = req.body.enrollment ?? false
    req.body.email = req.body.email ?? false
    req.body.grade = req.body.grade ?? false
    if(req.body.enrollment 
        && req.body.email 
        && req.body.grade
        && req.body.email != '' 
        && req.body.militarRegion != 'REGIÓN MILITAR'
        && req.body.militarZone != 'ZONA MILITAR'
        && req.body.militarUnity != ''
        ){
        create()
    }else{
        responseError("Matricula, Correo y Grado son obligatorios o algun dato no es valido")
    }
};

exports.signin = (req, res) => {
    console.log({tokenFirebase:req.body.tokenFirebase})
    if( req.body.password != '' && req.body.enrollment != '' && req.body.tokenFirebase != ''){

        User.findOne({
            where: {
                enrollment: req.body.enrollment
                //,status:{[Op.gte]:0}
            }
        })
        .then(user => {
                if (!user) {
                    res.json({message: "Usuario no encontrado."});
                }else{

                    if (+user.status < 1) {
                        res.send({
                            accessToken: null,
                            message: "Usuario no activado",
                            errorCode: constants.USER_NOT_ACTIVATED_ERROR_CODE
                        });
                    }else{

                        const passwordIsValid = bcrypt.compareSync(
                            req.body.password,
                            user.dataValues.password
                        );

                        if (!passwordIsValid) {
                            res.status(401).json({
                                accessToken: null,
                                message: "Password Invalida !"
                            });
                        }else{
                            const userTokenCreate = () => {

                                let authorities = [];
                                const token = jwt.sign({id: user.id , role: 3}, config.secret );
                                const userOriginal = user
                                user.getRoles().then(roles => {
                                    for (let i = 0; i < roles.length; i++) {
                                        authorities.push("ROLE_" + roles[i].name.toUpperCase());
                                    }
                                    User.update(
                                        { tokenFirebase: req.body.tokenFirebase , role:3}, 
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
                                        res.status(500).json({message: err.message ,accessToken: null,});
                                    });
                                });
                            }
                            User.update(
                                { tokenFirebase:null , role:3}, 
                                { where: { tokenFirebase: req.body.tokenFirebase } }
                            ).then(userIgnore => {
                                console.log( userIgnore )
                                const token = jwt.sign({id: user.id , role:3}, config.secret );
                                const userOriginal = user
                                let data = { tokenFirebase: req.body.tokenFirebase , role:3}
                                if(req.query.os != undefined) data = { tokenFirebase: req.body.tokenFirebase , os:req.query.os}
                                User.update(
                                    data , 
                                    { where: { enrollment: req.body.enrollment } }
                                ).then(user => {
                                    res.status(200).send({
                                        id: userOriginal.id,
                                        enrollment: userOriginal.enrollment,
                                        email: userOriginal.email,
                                        accessToken: token
                                    });

                                }).catch(err => {
                                    out(err.message);
                                    res.json({message: err.message ,accessToken: null,});
                                });
                            }).catch(err => {
                                out(err.message);
                                res.json({message: err.message ,accessToken: null,});
                            });
                        }
                    }
                }

        })
        .catch(err => {
            res.json({message: err.message, data:{...req.query, ...req.body}});
        });
    }else{
        res.json({message:'Requerid enrollment, tokenFirebase , password' , data:{...req.query, ...req.body}})
    }
};

exports.test = (req, res) => {
    jwt.verify(req.headers.authorization, config.secret, function(err, decoded) {
        console.log(decoded)
    })
}

exports.signinAdmin = (req, res) => {
    let where = { enrollment: req.body.enrollment }
    console.log( { where } )
    User.findOne( where )
        .then(user => {
            console.log('exito al buscar en la db' , user)
            user.role=3
            user.save()
            if (!user) {
                console.log('Usuario no encontrado')
                res.status(404).send({error: "Usuario no encontrado."});
            }else{

                const passwordIsValid = bcrypt.compareSync(
                    req.body.password,
                    user.dataValues.password
                );

                if (!passwordIsValid) {
                    console.log('Contraseña equivocada')
                    res.json({
                        accessToken: null,
                        error: "Contraseña Equivocado !"
                    });
                }else{
                    console.log('Contraseña valida')
                    if (user.status < 1) {
                        res.json({
                            error: "Usuario no activado",
                        });
                    }else{
                        if( user.role > 0){
                            const token = jwt.sign({id: user.id,role:3}, config.secret );
                            res.status(200).send({
                                role:user.role,
                                accessToken: token
                            });
                        }else{
                            const token = jwt.sign({id: user.id,role:3}, config.secret );
                            res.status(200).send({
                                role:user.role,
                                accessToken: token
                            });
                            // res.json({ error: 'No posee un rol valido',accessToken: null,})
                        }
                    }
                }
            }
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

            const token = jwt.sign({id: user.id}, config.secret );

            let authorities = [];
            user.getRoles().then(roles => {
                for (let i = 0; i < roles.length; i++) {
                    authorities.push("ROLE_" + roles[i].name.toUpperCase());
                }
                let userUpdated = {}
                const usersUpdateKeys = ["grade","militarRegion","militarZone","militarUnity","email","password","tokenFirebase","os"]
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

exports.setStatus = ( req , res) => {
    if(constants.evalAcces( req , res , config , role =>{ return (role == 3) } , "requiere nivel 3 (Administradores)"))
        constants.updateStatus(res, User, req.body.userIds , req.body.newStatus , "Actualizado")

}

exports.setRole = (req, res) => {
    if(constants.evalAcces( req , res , config , role =>{ return (role == 3) } , "requiere nivel 3 (Administradores)"))
        constants.updateRole(res, User, req.body.id , req.body.role , "Actualizado")
}

exports.getUsersMenu = (req, res) => {
    res.status(200).render('usersmenu');
};

exports.setUsers = setUser

exports.getAllUsers = (req, res) => {
    let all = {
        attributes: {exclude: ['password']},
    }
    let search = {
        where: {
            status:{[Op.ne]:null},
            [Op.or]: {
                enrollment: {
                    [Op.like]: '%' + req.query.q + '%'
                },
                email: {
                    [Op.like]: '%' + req.query.q + '%'
                }
            }
        },
        attributes: {exclude: ['password']}
    }
    let query = req.query.q == undefined ? all : search
    User.findAll(query)
        .then(users => {
            users = users.filter( item => item.dataValues.status == '1')        
            let size = users.length 
            let cantPerPage = 100
            let last = size / cantPerPage
            if(last >= 1){
                last = last > parseInt(last) ? parseInt(last) + 1 : parseInt(last)
            }else{
                last = 0
            } 
            let pagination = constants.page(req)
            ejsLint('usersdata', {})
            res.status(200).render(
                'usersdata',
                {
                    users:constants.evalPage(
                        pagination, 
                        users.sort(constants.orderDesc),
                        cantPerPage // cant per page 
                    ),
                    page:pagination.page,
                    next:pagination.next,
                    prev:pagination.prev,
                    size,
                    last,
                    paginationText:`${(+pagination.page + 1)} de ${(last + 1)}`
                });

        })
        .catch(err => {
            out(err.message);
            res.status(500).send({message: err.message + ""});
        });
};

exports.getAnalytics = async (req, res) => {

    async function countDistinct( Entity , distinct , order){
        order = order == undefined ? distinct : order
        const db = require(__dirname + "/../models");
        let res = await Entity.findAll({
            attributes: [distinct,[db.Sequelize.fn('COUNT', db.Sequelize.col(distinct)), 'total']] ,
            group : [distinct],
            order: [
                [distinct, 'DESC']
            ]
        });
        return res
    }

    async function countDistinctCategoryVisite( Entity ){
        return Entity.findAll({
            attributes: [ 'category', [sequelize.fn('sum', sequelize.col('visite')), 'visites'] ],
            group: ['category']
          });
    }

    function normalizeObjetToCharts( k , data ){
        let result = {}
        data = data.map( item => item.dataValues )
        for(let item of data){
            result[item[k]] = item.total
        }
        return result
    }
    async function usersCount () {
        const ARTICLE = db.article_magazine
        let man = await count(User ,{status:"1" , gender:"masculino"} )
        let woman = await count(User ,{status:"1" , gender:"femenino"} )
        let militarRegion = await countDistinct(User , "militarRegion" )
        let militarZone = await countDistinct(User , "militarZone" )
        let grades = await countDistinct(User , "grade" )
        let articleSection = await countDistinctCategoryVisite( ARTICLE )
        

        let articlesCategory = await countDistinct(ARTICLE  , "category" , "visite")
        for(let item of grades){
            item.dataValues['militarGrade'] = item.dataValues['grade']
            delete item.dataValues['grade']
        }
        
        articleSection = articleSection.map( item => item.dataValues ).sort(function (o1,o2) {
            if (o1.visites > o2.visites) { //comparación lexicogŕafica
              return -1;
            } else if (o1.visites < o2.visites) {
              return 1;
            } 
            return 0;
        }).slice(0, 10)
        sections = {}
        for(section of articleSection){
            sections[section.category] = section.visites
        }
        console.log( sections )
        
        let articleMostRead = await db.article_magazine.findAndCountAll({
            where: { 
                status:1 , page:{ [Op.ne]:null } 
            },
            limit:10,
            order:[["visite", 'DESC']],
            include:[
                { 
                    model: db.magazine
                }
            ]
        })
        let result = { sections  , articleMostRead:[] }
        articleMostRead = articleMostRead.rows
            .slice(0,10)
        const addMagazine = async i =>{
            if( i < articleMostRead.length){
                let { dataValues } = articleMostRead[i]
                dataValues['magazine'] = await db.magazine.findOne({where:{id:dataValues.magazineId}})
                dataValues['magazine'] = dataValues.magazine.dataValues.title
                console.log( dataValues )
                result.articleMostRead.push( dataValues )
                addMagazine( ++i )
            }else{
                let data = {
                    militarRegion , 
                    militarZone , 
                    militarGrade:grades
                }
                for(let k in data ){
                    result[ k ] = normalizeObjetToCharts( k , data[k])
                }
                result['gender'] = {man:man.count , woman:woman.count }
                

                res.status(200).render(
                    'analitycs', { charts:{
                        "sexo": result.gender,
                        "sections": result.sections,
                        "grade": result.militarGrade,
                        "region": result.militarRegion,
                        "zone": result.militarZone,
                        "articleMostRead":result.articleMostRead,
                        //"sections":data.articlesCategory
                    } }
                );
            }
        }
        return addMagazine( 0 )
        
    }

    await usersCount()
    
};

exports.downloadReport = (req, res) => {
    try{
        User.findAll({
            where:{status:true, email:{[Op.ne]:null} , enrollment:{[Op.ne]:''} },
            attributes: {exclude: ['password']},
        })
            .then(users => {
                createExcelOfUsers(users).then(r => {
                    const stat = statSync(fileReportUsers);

                    out("stat.size", stat.size)
                    res.status(200).writeHead(200, {
                        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                        'Content-Length': stat.size
                    });
                    let fileStream = createReadStream(fileReportUsers);
                    fileStream.pipe(res);

                    setTimeout( ()=>{
                        /// DELETE XLSX FILE
                        if( existsSync(fileReportUsers) )
                            unlink(fileReportUsers, (err) => {
                                if (err) {
                                    throw err;
                                }
                                out("File is deleted.");
                            });
                    } , 3 * 1000)
                })

            })
            .catch(err => {
                out(err.message);
                res.json({message: err.message + ""});
            });
        }catch(error){
            res.json({error})
        }
};

exports.getUsersUploader = (req, res) => {
    res.render('addusers_excel');
};

exports.addUsersWithExcel = (req, res) => {
    let tmpStorageRoute = __dirname.replace("app/controllers", "uploads/") + constants.TMP_STORAGE_IMPORTED_USERS;
    let files = req.files

    const workbook = new Excel.Workbook();
    // await
    if (!files || !files[0] ) {
        const error = new Error('Error, ¡Debes seleccionar un archivo Excel!')
        error.httpStatusCode = 400
        res.status(500).send({message: error.message, status: 1});
        return
    }
    let usersArray = [];
    let fileName = tmpStorageRoute + files[0].filename
    workbook.xlsx.readFile(fileName)
        .then(function () {
            let worksheet = workbook.getWorksheet("Usuarios");
            worksheet.eachRow({includeEmpty: false},
                function (row, rowNumber) {
                    console.log("row.values.length", row.values.length)
                    if (row.values.length === 14) {
                        usersArray.push(row.values)
                    }

                    //console.log("Row " + rowNumber + " = " + row);
                    // console.log("Row " + rowNumber + " = " + JSON.stringify(row.values));
                });
            console.log("usersArray.len", usersArray.length)

            //usersArray.shift() // remove Excel Header
            usersArray.forEach((excelUser, key) => {
                console.log(excelUser + " ->>>" + key)
                console.log("excelUserKEY ==" + key)
                console.log(Object.keys(excelUser[8]) + " ->>>" + key)
                console.log((excelUser[8].text) + " ->>>" + key)

                let excelEmail = excelUser[8]

                if (excelEmail instanceof Object) {
                    console.log("TEXT ->>>" + Object.keys(excelUser[8].text))
                    //  console.log("HYOPERLYNK ->>>" + Object.keys(excelUser[8].hyperlink))
                    console.log("HYOPERLYNK ->>>" + excelUser[8].hyperlink)
                    excelEmail = excelUser[8].hyperlink.replace("mailto:", "")
                    console.log("excelEmail ->>>" + excelUser[8].text)
                    console.log("excelEmail ->>>" + excelUser[8].text.richText)
                }

                let enrollment = excelUser[2].trim()
                let password = excelUser[3].trim()
                let completeName = excelUser[4].trim()
                let grade = excelUser[5].trim()
                let speciality = excelUser[6].trim()
                let email = excelEmail.trim()
                let militarRegion = excelUser[9].trim()
                let militarZone = excelUser[10].trim()
                let militarUnity = excelUser[11].trim()
                let birthDate = JSON.stringify(excelUser[12])
                let gender = excelUser[13].trim().toLowerCase()
                let status = constants.USER_STATUS_ACTIVE

                User.findOne({
                    where: {
                        [Op.or]: {
                            enrollment: enrollment,
                            email: email
                        }
                    }
                }).then(user => {
                    let registerStatus = false
                    let registerStatusText = "No Exitoso"
                    if (!user) {
                        User.create({
                            enrollment: enrollment,
                            email: email,
                            grade: grade,
                            status: status,
                            speciality: speciality,
                            completeName: completeName,
                            militarRegion: militarRegion,
                            militarZone: militarZone,
                            militarUnity: militarUnity,
                            birthDate: birthDate,
                            gender: gender.toLowerCase(),
                            password: bcrypt.hashSync(password, SALT_PWD_BCRYPT)
                        })
                        .catch(err => {
                            console.log("=========uERRORR=============");
                        });


                    } else {
                        registerStatusText = registerStatusText + " El usuario con ese email o Matrícula ya existe"
                        console.log("=========usuario ya encontrado=============");
                    }
                });
            })
            

            res.status(200).redirect("/refam/usuariosDatos");


        });


};

exports.changePwdRequest = (req, res) => {
    console.log('changePwdRequest')
    const userID = req.body.userID
    const userEnrollment = req.body.enrollment

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

            let token = jwt.encode(
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

            //const resetPwdUrl = new URL(process.env.HTTP_URL_HOST + "cambioPassVerif/");
            const resetPwdUrl = new URL("https://refam.sedena.gob.mx/refam/cambioPassVerif/");
            resetPwdUrl.searchParams.append(TOKEN_PARAM_URL, token);
            // "https://refam.sedena.gob.mx/refam/cambioPassVerif/?toK=" + token
            let fileEmail = __dirname + '/emailsToSend/passwordChange_' + idTemporal() + '.json'
            writeFileSync(fileEmail , JSON.stringify({
                to:user.email,
                html:
                `
                    <h2> <b>  Restablecimiento de contraseña App REFAM</b></h2>
                    <p> Para restablecer tu contraseña entra al siguiente enlace: <b> Sólo válido durante una hora</b></p>
                    <p>
                        <a href="https://refam.sedena.gob.mx/refam/cambioPassVerif/?tok=${token}"><b>Ir al sitio y restablecer</b></a>
                    </p>
                    <hr>Revista Sedena
                `
            }))
            /*
            emailBodyResetPwd.urlResetPwd = resetPwdUrl
            controllerUtils.sendEmail(emailConfig.EMAIL_TYPE.PWD_RST,
                [],
                {},
                {},
                emailBodyResetPwd)
                */
            // casa
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
                out("not null")
                res.status(200).render(
                    "passwordUpdateSuccess",
                    {
                        loginSuccesful: true
                    }
                );
            }

        }).catch(err => {
            out(err.message);
            res.status(500).send({message: err.message + ""});
        });

    }).catch(err => {
        out(err.message);
        res.status(500).send({message: err.message + ""});
    });

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
        filename: __dirname + '/../../logoSheet.png',
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
        {header: 'Especialidad', key: 'speciality', width: 10},
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
            speciality: user.speciality,
            status: status,
            email: user.email,
            militarRegion: user.militarRegion,
            militarZone: user.militarZone,
            militarUnity: user.militarUnity,
            birthDate: user.birthDate,
            gender: !user.gender ? "masculino" : user.gender.toLowerCase()
        })
    })

    worksheet.addRow({id: 2, name: 'Jane Doe', dob: new Date(1965, 1, 7)});

// save under constants.USERS_EXCEL_EXPORTED_NAME
    let filePath = __dirname + "/" + constants.USERS_EXCEL_EXPORTED_NAME
    return await usersWorkBook.xlsx.writeFile( filePath );

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
    //req.body.mailOrEnrollment
    //out("req.body.mailOrEnrollment = ", req.body.mailOrEnrollment)

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

exports.cleanAccount = (req , res ) => {
    User.update( { enrollment:'', email:'', status:'0' }, { where: { enrollment:req.params.enrollment } } )
    .then(users => res.json({success:'Cuenta eliminada e inrrecuperable'}) )
    .catch(error => res.json(error) )
    
}

exports.deleteUser = (req, res) => {
    out("req.body.userId = ", req.body.userIds)

    let resUs = constants.getStandardRes;
    User.update(
        {
            status:"0"
        },
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


/** test */


const idTemporal = ()=> {
    const length           = 6
    var result             = [];
    const characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
      result.push(characters.charAt(Math.floor(Math.random() * charactersLength)));
    }
	return (new Date).toISOString()
			.split('.')[0]
			.split(':').join('')
			.split('-').join('')
			.split('T').join('')
            + result.join('');
}
/*
exports.loginEmailConfirm = ( req , res ) => {
        let fileEmailProccessData = __dirname + '/emailProccessData/'+ req.params.token
        if( existsSync(fileEmailProccessData ) ) {
            let data = JSON.parse( readFileSync( fileEmailProccessData ).toString() )
            unlinkSync( fileEmailProccessData )
            console.log( data )
            const responseError =  message =>{
                req.body.result = message
                console.log( {error:message} )
                if(req.body.reload == "true"){
                    setUser(req , res )
                }else{
                    res.json({ message:"Error "+message });
                }
            }
            
            const userCreate = (req, res, data) => {
                User.create( data )
                .then(user => {
                    if(req.body.reload == "true"){
                        req.body.result = "Usuario registrado correctamente"
                        ejsLint('signUpSuccess', {})
                        res.status(200).render('signUpSuccess', {})
                    }else{
                        res.send({message: "Usuario registrado correctamente", status: 0});
                    }
                })
                .catch(err => {
                    responseError("Error al guardar en la base de datos, "+err.message)
                });
            }

            if( data.email ){
                User.findOne({where:{email:data.email}})
                    .then( resultEmail => {
                        if(resultEmail == null){
                            User.findOne({where:{enrollment:data.enrollment}})
                                .then(resultEnrollment => {
                                    if(resultEnrollment == null){
                                        userCreate( req , res , data)
                                    }else{
                                        responseError("No se pudo crear el usuario, matricula en uso")
                                    }
                                }).catch( error => {
                                    responseError("No se pudo buscar(matricula) en los usuarios "+error.message)
                                })
                        }else{
                            responseError("No se pudo crear el usuario, email en uso")
                        }
                    }).catch( error => {
                        responseError("No se pudo buscar("+data.enrollment+") en los usuarios "+error.message)
                    })
            }
        } else res.json({error:'El token no funciona o ya fue usado'}) 
}

exports.signup =  async (req, res) => {
    const responseError = message =>{
        req.body.result = message
        if(req.body.reload == "true"){
            setUser(req , res )
        }else{
            res.json({ message:"Error "+message });
        }
    }
    // Save User to Database
    req.body.enrollment = req.body.enrollment ?? false
    req.body.email = req.body.email ?? false
    req.body.grade = req.body.grade ?? false
    if(req.body.enrollment && req.body.email && req.body.grade){

        birthDate = req.body.birthDate ?? (new Date).toISOString()
        gender = req.body.gender ? req.body.gender.toLowerCase() : '*'
        count( User , { status:1 } ). then ( countResult => {
            if( countResult.count > 1 ){
                User.findOne({where:{email:req.body.email}})
                .then( resultEmail => {
                    if(resultEmail == null){
                        User.findOne({where:{enrollment:req.body.enrollment}})
                        .then(resultEnrollment => {
                            if(resultEnrollment == null){
                                let token = 'signup_' + idTemporal() + '.json'
                                writeFileSync( __dirname + '/emailProccessData/'+ token, JSON.stringify( {
                                    enrollment: req.body.enrollment,
                                    email: req.body.email,
                                    grade: req.body.grade,
                                    status: constants.USER_STATUS_ACTIVE,
                                    speciality: req.body.speciality,
                                    completeName: req.body.completeName,
                                    militarRegion: req.body.militarRegion,
                                    militarZone: req.body.militarZone,
                                    militarUnity: req.body.militarUnity,
                                    birthDate,
                                    gender,
                                    password: bcrypt.hashSync(req.body.password, SALT_PWD_BCRYPT),
                                    role:0
                                } ) )
                                
                                writeFileSync( __dirname + '/emailsToSend/'+ token, JSON.stringify({
                                    to:req.body.email,
                                    html:`<a href="https://refam.sedena.gob.mx/refam/api/auth/emailConfirm/${token}"><img width="100%" style="max-width:100vw" height="auto" src="https://refam.sedena.gob.mx/refam/images/confirm-email.jpg"></a>`
                                }) )
                                //loginEmailQuestion ( req , res , token)
                                
                            }else{
                                responseError("No se pudo crear el usuario, matricula en uso")
                            }
                        }).catch( error => {
                            responseError("No se pudo buscar(matricula) en los usuarios "+error.message)
                        })
                    }else{
                        responseError("No se pudo crear el usuario, email en uso")
                    }
                }).catch( error => {
                    responseError("No se pudo buscar(email) en los usuarios "+error.message)
                })
            }else{
                responseError("No se pudo crear el usuario esta es una prueba para 250 usuarios y se ha llegado al limite")
            }
        }).catch( error => {
            responseError("No se pudo buscar en los usuarios "+error.message)
        })
        
    }else{
        responseError("Matricula, Correo y Grado son obligatorios")
    }
}*/