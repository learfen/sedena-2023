module.exports = (sequelize, Sequelize) => {
    const PdfMagazine = sequelize.define("pdf_magazine", {
        title: {
            type: Sequelize.STRING
        },
        date: {
            type: Sequelize.STRING
        },
        status: {
            type: Sequelize.BOOLEAN
        },
        pdf: {
            type: Sequelize.STRING
        },
        coverPage: {
            type: Sequelize.STRING
        }
    });

    return PdfMagazine;
};
