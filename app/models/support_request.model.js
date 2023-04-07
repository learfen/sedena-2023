module.exports = (sequelize, Sequelize) => {
    const SupportRequest = sequelize.define("support_request", {
        problemDescription: {
            type: Sequelize.STRING
        },
        filesPath: {
            type: Sequelize.STRING
        },
        sendDate: {
            type: Sequelize.STRING
        },
        attendedDate: {
            type: Sequelize.STRING
        },
        solvedDate: {
            type: Sequelize.STRING
        },
        clientUserId: {
            type: Sequelize.STRING
        },
        supportUserId: {
            type: Sequelize.STRING
        },
        appVersion: {
            type: Sequelize.STRING
        },
        platform: {
            type: Sequelize.STRING
        }
    });

    return SupportRequest;
};
