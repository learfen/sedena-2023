module.exports = (sequelize, Sequelize) => {
    const Grade = sequelize.define("grade", {
        name: {
            type: Sequelize.STRING
        },
        status: {
            type: Sequelize.BOOLEAN
        }
    });

    return Grade;
};
