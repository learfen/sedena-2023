const out = require('../util/out')
const db = require("../models");
const Op = db.Sequelize.Op;
const User = db.user;
const constants = require('../util/util.constants');
const log = require(__dirname + "/../../log/index")

async function count( Entity , where ){
    let { count } = await Entity.findAndCountAll({ where })
    return { count }
}


async function usersCount (req , res) {
    let man = await count(User ,{status:{[Op.gte]:1 , gender:"Masculino"}} )
    let woman = await count(User ,{status:{[Op.gte]:1 , gender:"Femenino"}} )
    res.json({ man , woman })
}

module.exports = function (app) {
    
    app.get("/refam/api/statistics", ( req , res) => {
        try {
            usersCount(req , res)
        } catch (error) {
            log.write( req.originalUrl ,  error )
        }
    });

}