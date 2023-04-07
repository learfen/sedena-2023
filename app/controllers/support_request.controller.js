const db = require(__dirname + "/../models");
const SupportRequest = db.support_request;
const controllerUtils = require(__dirname + "/util.ctrl");
const constants = require(__dirname + "/../util/util.constants");
const emailConfig = require(__dirname + "/../config/email.config");

const Op = db.Sequelize.Op;

exports.createSupportIssue = (req, res, next) => {
    console.log(" createSupportIssue = ", req.files)
    console.log(" createSupportIssue  req.body.supportModelJsonReqBody = ", req.body.supportModelJsonReqBody)
    const files = req.files
    let fileImagePath = ""
    if (!files) {
        console.log(" filesssss= ", req.files)
        const error = new Error('Debes seleccionar una imagen')
        error.httpStatusCode = 400
        console.log("errorcreateSupportIssue= ", error)
        return next(error)
    } else if (files.length !== 0) {
        fileImagePath = files[0].filename

        console.log("errorcreateSupport FILES = ")
    }

    console.log(" req.body.platform= ", req.body.supportModelJsonReqBody)

    if (!req.body.supportModelJsonReqBody) {
        res.status(500).send(
            {
                message: "Falta campo: supportModelJsonReqBody",
                status: 1
            });
        retur
    }
    let supportIssue = {}
    try {
        supportIssue = JSON.parse(req.body.supportModelJsonReqBody) // todo validate
    } catch (error) {
        console.error(error);
        res.status(500).send(
            {
                message: "Error al parsear el JSON supportModelJsonReqBody" + error.message,
                status: 1
            }
        );
        return
    }
    console.log(" filesPath= ", supportIssue.filesPath)
    console.log(" sendDate= ", supportIssue.sendDate)
    console.log(" attendedDate= ", supportIssue.attendedDate)
    console.log(" solvedDate= ", supportIssue.solvedDate)
    console.log(" clientUserId= ", supportIssue.clientUserId)

    let problemDescription = supportIssue.problemDescription

    //  files.forEach((imageFile, key) => {
    SupportRequest.create({
        problemDescription: problemDescription,
        filesPath: fileImagePath,
        sendDate: req.body.sendDate,
        attendedDate: req.body.attendedDate,
        solvedDate: req.body.solvedDate,
        clientUserId: supportIssue.clientUserId,
        supportUserId: supportIssue.supportUserId,
        appVersion: supportIssue.appVersion,
        platform: supportIssue.platform,
    }).then(supportRequest => {
        console.log("Created", supportRequest.id)

        let emailSupportBodyProblem = emailConfig.getEmailBodyProblem

        emailSupportBodyProblem.problemDescription = problemDescription
        emailSupportBodyProblem.contactSupportId = supportRequest.id
        emailSupportBodyProblem.appVersion = supportIssue.appVersion
        emailSupportBodyProblem.userEmail = supportIssue.clientUserMail
        emailSupportBodyProblem.userEnrollment = supportIssue.clientUserId
        emailSupportBodyProblem.platform = supportIssue.platform

        console.log("emailSupportBodyProblem.", emailSupportBodyProblem)

        let fileImagePathsArray = []
        if (fileImagePath !== "") {
            let fileImageCompletePath = __dirname + "/../../uploads/tmp_support/" + fileImagePath
            console.log("fileImageCompletePath=" + fileImageCompletePath)
            fileImagePathsArray[0] = {path: fileImageCompletePath}
        }

        controllerUtils.sendEmail(emailConfig.EMAIL_TYPE.PROBLEM,
            fileImagePathsArray,
            {},
            emailSupportBodyProblem,
            {})

        res.status(200).send(
            {
                "supportIssues": "supportIssues",
                tCreatedId: supportRequest.id
            })
    })

    //  })
};


exports.getAllSupportIssues = (req, res) => {
    SupportRequest.findAll({
        attributes: {exclude: ['userId']},
    })
        .then(supportIssues => {
            res.status(200).send(
                {
                    "supportIssues": supportIssues,
                }
            );
        })
        .catch(err => {
            console.log(err.message);
            res.status(constants.SERVER_ERROR_500).send({message: err.message + ""});
        });
};


exports.galleryManagment = (req, res) => {
    res.status(200).render('gallery_editor');
};
