const db = require(__dirname + "/../../models");
module.exports = (req, res , next ) => {
    db.explorer_media.create({
        name:req.body.name,
        status:1,
        cover:req.body.cover
    })
    .then( album =>{
        if( res !== false){
            res.json({message:"Subido con exito"})
        }else{ next( album.dataValues ) }
    })
    .catch( error =>{
        res.json({error:error.message})
    })
}
