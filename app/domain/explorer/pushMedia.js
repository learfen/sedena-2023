const db = require(__dirname + "/../../models");
module.exports = (req, res) => {
    let explorerId = req.query.explorerId ?? 0
    let Entity = req.query.type == 'img' ? db.gallery_image : db.library_video
    console.log( { explorerId },{
        where:{id:req.params.id},
    } )    
    Entity.update({ explorerId },{
        where:{id:req.params.id},
    })
    .then( ( r ) =>{
        console.log( r )
        res.json({message:"Carpeta actualizada"})
    })
    .catch( error =>{
        console.log( error )
        res.json({error:error.message})
    })
}
