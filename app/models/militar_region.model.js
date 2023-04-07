module.exports = (sequelize, Sequelize) => {
    const MilitarRegion = sequelize.define("militar_region", {
        name: {
            type: Sequelize.STRING
        },
        status: {
            type: Sequelize.BOOLEAN
        }
    });

    return MilitarRegion;
};
