module.exports = (sequelize, { INTEGER , STRING }) => {
    return sequelize.define("magazines", {
        title:STRING,
        date: STRING,
        status:INTEGER,
        htmlFiles:STRING,
        coverPage:STRING,
        category:STRING,
        seo:STRING,
        pages:INTEGER,
        user:INTEGER
    });
};
