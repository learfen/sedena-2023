module.exports = (sequelize, Sequelize) => {
    const MilitarZone = sequelize.define("militar_zone", {
        name: {
            type: Sequelize.STRING
        },
        status: {
            type: Sequelize.BOOLEAN
        }
    });

    return MilitarZone;
};
