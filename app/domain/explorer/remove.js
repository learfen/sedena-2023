const db = require(__dirname + "/../../models");
module.exports = (req, res) => {
    let id = req.params.id
    db.gallery_image.update({status:0},{
        where:{explorerId:id},
    })                  
    .then(()=>{
        db.library_video.update({status:0},{
            where:{explorerId:id},
        })                  
        .then(()=>{
            db.explorer_media.update({status:0},{
                where:{ id },
            })
            .then(()=>{
                res.json({message:"Carpeta eliminada"})
            })
            .catch( error =>{
                res.json({error:error.message})
            })
        })
        .catch( error =>{
            res.json({error:error.message})
        })
    })
    .catch( error =>{
        res.json({error:error.message})
    })
}
