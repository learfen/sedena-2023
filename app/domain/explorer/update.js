const db = require(__dirname + "/../../models");
module.exports = (req, res) => {
    let data = {}    
    for(let key of req.body.keys ){
        data[key] = req.body[key]
        if(key == 'cover')
            db.gallery_image.update({status:0}, {where:{name:req.body.cover}} ) 
    }
    db.explorer_media.update( data , {where:{id:req.params.id}} )
    .then(()=>{
        res.json({message:"Subido con exito"})
    })
    .catch( error =>{
        res.json({error:error.message})
    })
}
