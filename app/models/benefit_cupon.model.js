module.exports = (sequelize, Sequelize) => {
    const BenefitCupon = sequelize.define("benefit_cupon", {
        description: {
            type: Sequelize.STRING
        },
        enterprise: {
            type: Sequelize.STRING
        },
        status: {
            type: Sequelize.BOOLEAN
        },
        startDate: {
            type: Sequelize.STRING
        },
        endDate: {
            type: Sequelize.STRING
        },
        cuponImage: {
            type: Sequelize.STRING
        },
        iconImage: {
            type: Sequelize.STRING
        }
    });

    return BenefitCupon;
};
