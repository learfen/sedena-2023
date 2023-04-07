const config = require("../config/db.config.js");
const dotenv = require('dotenv').config();

const Sequelize = require("sequelize");
const sequelize = new Sequelize(
    config.DB,
    config.USER, //config.USER,
    config.PASSWORD,
    {
        host:"localhost",
        dialect: "mysql",
        "logging": false,
        pool: {
            max: config.pool.max,
            min: config.pool.min,
            acquire: config.pool.acquire,
            idle: config.pool.idle
        }
    }
)

sequelize.sync().then(function(){
    console.log("DB connection sucessful.");
    }, function(err){
    // catch error here
    console.log(err);
    
    });

/*
const sequelize = new Sequelize(
    config.DB,
    config.USER, //config.USER,
    config.PASSWORD,
    {
        host: config.HOST,
        port: config.port,
        dialect: config.dialect,
        operatorsAliases: 0,

        pool: {
            max: config.pool.max,
            min: config.pool.min,
            acquire: config.pool.acquire,
            idle: config.pool.idle
        }
    }
);
*/
const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.user = require("../models/user.model.js")(sequelize, Sequelize);
db.role = require("../models/role.model.js")(sequelize, Sequelize);
db.gallery_image = require("../models/gallery_image.model.js")(sequelize, Sequelize);
db.library_video = require("../models/library_video.model")(sequelize, Sequelize);
db.benefit_cupon = require("../models/benefit_cupon.model.js")(sequelize, Sequelize);
db.support_request = require("../models/support_request.model.js")(sequelize, Sequelize);
db.grade = require("../models/grade.model.js")(sequelize, Sequelize);
db.militar_zone = require("../models/militar_zone.model.js")(sequelize, Sequelize);
db.militar_region = require("../models/militar_region.model.js")(sequelize, Sequelize);
db.pdf_magazine = require("../models/pdf_magazine.model.js")(sequelize, Sequelize);
db.article_magazine = require("../models/article_magazine.model.js")(sequelize, Sequelize);
db.magazine = require("../models/magazine.model.js")(sequelize, Sequelize);


/*
db.article_magazine.belongsToMany(db.magazine, {
    through: "magazine_articles",
    foreignKey: "articleId",
    otherKey: "magazineId"
});
*/

db.article_magazine.belongsTo( db.magazine ,{ 
    foreignKey: 'id'
})
db.magazine.hasMany( db.article_magazine , {foreignKey:'magazineId'})


db.role.belongsToMany(db.user, {
    through: "user_roles",
    foreignKey: "roleId",
    otherKey: "userId"
});

db.user.belongsToMany(db.role, {
    through: "user_roles",
    foreignKey: "userId",
    otherKey: "roleId"
});

db.support_request.belongsTo(db.user, {
    through: "user_support_requests",
    foreignKey: "supportId",
    otherKey: "userId"
});

db.ROLES = ["user", "admin"]; // tabla falsa para completar los roles

module.exports = db;
