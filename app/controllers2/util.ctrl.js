const constants = require("../util/util.constants");
const emailConfig = require("../config/email.config");
const email = require(__dirname + '/../../email.js')()

const sendEmail = (emailType,
                   filesPath,
                   subject,
                   emailBodyProblem,
                   emailBodyResetPwd,
                   html,
                   to) => {

    //console.log("emailType", emailType)
    //console.log("emailBodyResetPwd", emailBodyResetPwd)
    let platformSubject
    let htmlEmailBody
    let mailTo

    if (emailType === emailConfig.EMAIL_TYPE.PROBLEM) { // PROBLEM
        mailTo = emailConfig.SUPPORT_TEMPORAL_EMAIL
        platformSubject = emailConfig.EMAIL_SUBJECT_ANDROID
        if (emailBodyProblem.platform === emailConfig.SUPPORT_PLATFORM_IOS)
            platformSubject = emailConfig.SUPPORT_PLATFORM_IOS
        htmlEmailBody =
            `
        <p> ID de ticket:<b>  ${emailBodyProblem.contactSupportId} </b></p>
        <p> Versión de la App: <b> ${emailBodyProblem.appVersion}</b> </p>
        <p> Matrícula: <b> ${emailBodyProblem.userEnrollment}</b> </p>
        <p> Email: <b> ${emailBodyProblem.userEmail}</b> </p>
        <p> Descripción del problema:  <b>${emailBodyProblem.problemDescription}</b> </p>
     `
     let x = 1
     for(let img of filesPath){
        htmlEmailBody += `<a href="${img.path}">Abrir imagen ${x}</a>`
        x++
     }
    } else if (emailType === emailConfig.EMAIL_TYPE.PWD_RST) {  //PASSWORD RESET
        platformSubject = "Restablecimiento de contraseña"
        mailTo = emailBodyResetPwd.userMail
        let urlResetPwd = emailBodyResetPwd.urlResetPwd
        htmlEmailBody =
            `
                <h2> <b>  Restablecimiento de contraseña App REFAM</b></h2>
                <p> Para restablecer tu contraseña entra al siguiente enlace: <b> Sólo válido durante una hora</b></p>
                <p>  <a href="${urlResetPwd}" >${urlResetPwd}</a></p>
            `
    }else if (emailType == "validEmail"){
        platformSubject = "REFAM validación de email"
        mailTo = emailBodyResetPwd.userMail
        htmlEmailBody = emailBodyResetPwd.body
    }
    
    let mailOptions = {
        user: emailConfig.SUPPORT_TEMPORAL_EMAIL,
        pass: emailConfig.ENV_SECRET,
        subject: platformSubject,
        to: mailTo,
        html: htmlEmailBody,
        files: [], 
        text: emailConfig.EMAIL_SUBJECT_TEXT_HINT,                 // Set filenames to attach (if you need to set attachment filename in email, see example below
    }

    if (emailType === emailConfig.EMAIL_TYPE.PWD_RST
        || filesPath.length === 0) {
        delete mailOptions.files
    }
    // gmail
    /*
    const send = require('gmail-send')(mailOptions);
    send({
        text: emailConfig.EMAIL_SUBJECT_TEXT_HINT,
    }, (error, result, fullResult) => {
        if (error) console.error(error , fullResult);
        // if (fullResult) console.error(fullResult);
        console.log(result , fullResult);
    })
    // grupoid
    */
   console.log({mailOptions})
    return email('tls' , mailTo , mailOptions)
};

const capitalize = (s) => {
    if (typeof s !== 'string') return ''
    return s.charAt(0).toUpperCase() + s.slice(1)
}

exports.sendEmail = sendEmail;
exports.capitalize = capitalize;
