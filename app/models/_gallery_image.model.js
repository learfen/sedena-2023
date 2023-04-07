module.exports = (sequelize, Sequelize) => {
    const GalleryImage = sequelize.define("gallery_image", {
        name: {
            type: Sequelize.STRING
        },
        size: {
            type: Sequelize.DOUBLE
        },
        date: {
            type: Sequelize.STRING
        },
        status: {
            type: Sequelize.BOOLEAN
        },
        category: {
            type: Sequelize.STRING
        },
        route: {
            type: Sequelize.STRING
        },
        magazine: {
            type: Sequelize.INTEGER
        }
    });

    return GalleryImage;
};
