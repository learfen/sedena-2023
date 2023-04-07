
const db = require(__dirname + '/app/models');
const User = db.user;
const limit = 20
const status = 1
module.exports = app => {
    const { grade , page } = req.params
    User.findAndCountAll({
        where: { grade , status , tokenFirebase: {[db.Sequelize.Op.ne]:null} },
        order: ['completeName'],
        limit ,
        offset: page * limit,
    }).then( result => {
        result.rows = [ ...result.rows.map( item => item.dataValues.tokenFirebase ) ]
        let pages = parseInt(result.count / limit)
        result.pages = pages % 2 > 0 ? pages + 1 : pages 
        console.log({ page , ...result , pageItems:result.rows.length })
    }).catch( error => console.log( error ) )
}