module.exports = (sequelize, {STRING , INTEGER , BOOLEAN}) => {
    const ArticleMagazine = sequelize.define("article_magazine", {
        title: STRING,
        date: STRING,
        status: BOOLEAN,
        htmlFile: STRING,
        coverPage: STRING,
        category: STRING,
        page: INTEGER,
        magazineId: INTEGER,
        visite: INTEGER,
        user:INTEGER
    });

    return ArticleMagazine;
};
