module.exports = {
    /**
     * Email Env Config
     */
     //SUPPORT_TEMPORAL_EMAIL: "refam@grupo-id.com.mx",
     //ENV_SECRET: 'Hp;X~Vn[;%*N', // TODO it will come from evn
    SUPPORT_TEMPORAL_EMAIL: "soportebackofficeapp@gmail.com",
    ENV_SECRET: 's0mepass#', // TODO it will come from evn
  
    //SUPPORT_TEMPORAL_EMAIL: "refammx01@gmail.com",
    //ENV_SECRET: 'REFAMmX001', // TODO it will come from evn

    EMAIL_SUBJECT_ANDROID: "Soporte App REFAM - Android",
    EMAIL_SUBJECT_IOS: "Soporte App REFAM - iOS",
    SUPPORT_PLATFORM_AND: "AND",
    SUPPORT_PLATFORM_IOS: "IOS",
    EMAIL_SUBJECT_TEXT_HINT: "Solicitud a soporte",

    EMAIL_TYPE: {
        PROBLEM: "PROBLEM",
        PWD_RST: "PWD_RST"
    },

    EMAIL_BODY_PROBLEM: {
        "contactSupportId": 0,
        "appVersion": "",
        "userEnrollment": "",
        "userEmail": "",
        "problemDescription": "",
        "platform": "",
    },

    get getEmailBodyProblem() {
        let emailBodyProblem = Object.create(this.EMAIL_BODY_PROBLEM);
        emailBodyProblem.contactSupportId = 0
        emailBodyProblem.appVersion = ""
        emailBodyProblem.userEnrollment = ""
        emailBodyProblem.userEmail = ""
        emailBodyProblem.problemDescription = ""
        emailBodyProblem.platform = ""
        return emailBodyProblem
    },

    EMAIL_BODY_RESET_PWD: {
        "userId": 0,
        "userMail": "",
        "urlResetPwd": "",
    },

    get getEmailBodyResetPwd() {
        let emailBodyResetPwd = Object.create(this.EMAIL_BODY_RESET_PWD);
        emailBodyResetPwd.userId = 0
        emailBodyResetPwd.userMail = ""
        emailBodyResetPwd.urlResetPwd = ""
        return emailBodyResetPwd
    },

}