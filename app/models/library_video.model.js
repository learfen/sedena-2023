module.exports = (sequelize, Sequelize) => {
    const LibraryVideo = sequelize.define("library_video", {
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
        type: {
            type: Sequelize.STRING
        },
        magazine: {
            type: Sequelize.INTEGER
        },
        explorerId: {
            type: Sequelize.INTEGER
        }
    });

    return LibraryVideo;
};
