module.exports = (sequelize, { STRING , BOOLEAN }) => {
    return sequelize.define("explorer_media", {
        name: STRING ,
        status: BOOLEAN,
        cover: STRING ,
    });
};
