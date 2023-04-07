const db = require(__dirname + "/../../models");
class Navegate{
    static pushImagesInFolder( folders , images ){
        images = Object.values( images ).map( image => image.dataValues )
        folders = Object.values( folders ).map( folder => folder.dataValues )
        let foldersResponseNulls = {}
        let foldersResponse = {'0':{id:0,status:1 , name:'Otros' , medias:[] , cover:''}}

        for(let item of folders){
            foldersResponse[ item.id.toString() ] = { ...item , medias:[] }
        }
        images.forEach( image => {
            if(foldersResponse[image.explorerId])
                if(foldersResponse[image.explorerId.toString()])
                    foldersResponse[image.explorerId.toString()].medias.push( image )
                else
                    foldersResponse['0'].medias.push( image )
            else
                foldersResponse['0'].medias.push( image )
        })
        if( folders.length > 0 && folders[0].id == 0) return foldersResponse[0]
        return foldersResponse
    }
    static findImages( res , folders , where){
        db.gallery_image.findAll({ where })
        .then( images => {
            if( where.explorerId )
                db.library_video.findAll({ where })
                    .then( videos => {
                        if( where.explorerId )
                            res.json( Navegate.pushImagesInFolder( folders , [...images , ...videos] )[where.explorerId] )
                        else
                            res.json( Navegate.pushImagesInFolder( folders , [...images , ...videos] ) )
                    })
            else
                res.json( Navegate.pushImagesInFolder( folders , images ) )
        })
    }
    static folderOpen( req , res ){
        console.log('id ', req.params.id  ) 
        if( req.params.id == '0' ){
            let folder = {dataValues:{status:true , name:'Galería Fotográfica' , medias:[] , cover:'' , id:0}}
            Navegate.findImages(res , [ folder ] , {status:true , magazine:"0" , explorerId:null } )
        }else{
            db.explorer_media.findOne({ where:{status:1 , id:req.params.id} })
                .then( folder => {
                    if( folder )
                        Navegate.findImages(res , [ folder ] , {status:"1" , magazine:"0" , explorerId:req.params.id } )
                    else
                        res.json({message:'Error: Carpeta no encontrada'})
                })
                .catch(err => {
                    res.json({message: err.message + ""});
                });
        }
    }
    static all(req, res , imagesList ){
        db.explorer_media.findAll({ where:{status:1} })
            .then( folders => {
                if(req.query['unsorted'] != undefined)
                    folders.push( {dataValues:{status:true , name:'Galería Fotográfica' , medias:[] , cover:'coverOthers.png' , id:0}} )

                if( imagesList )
                    Navegate.findImages(res , folders , {status:"1" , magazine:"0"} )
                else
                    res.json( folders.map( folder => folder.dataValues ) )
            })
            .catch(err => {
                res.json({message: err.message + ""});
            });
    }
}

module.exports = (req, res) => {
    if(req.params.id != undefined){
        if(req.params.id == '*') Navegate.all(req, res , true)
        else Navegate.folderOpen(req, res)
    }else{
        Navegate.all(req, res , false)
    }
};
