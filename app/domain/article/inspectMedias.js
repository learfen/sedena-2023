
const db = require("../../models");
const { imageCreate , videoCreate } = require(__dirname + '/../media/saveFileInDb.js')

function validMedias( entity , medias , i , next , ids ){
	if( i < medias.length){ 
		db[entity].findOne({where:{name:medias[i]}})
		.then( result => {

			if( result != null) ids.splice( ids.indexOf(medias[i]) , 1 ) 
			else medias[i] = {...result.dataValues , entity}

			validMedias(entity , medias , ++i , next , ids)

		} )
		.catch( error => {
			validMedias(entity , medias , ++i , next , ids)
		} )
	}else{
		next(ids)
	}
}

function mediasCreate( medias , i , create , magazine , next){
	if( i < medias.length){ 
		console.log( 'mediasCreate >> ', {
			fileName:medias[i],
			magazine
		})
		if( create == 'gallery_image'){
			imageCreate({
				fileName:medias[i],
				magazine
			}).then( mediasCreate(medias , ++i , create , magazine , next) )
		}
		if( create == 'video_library'){
			videoCreate({
				fileName:medias[i],
				magazine
			}).then( mediasCreate(medias , ++i , create , magazine , next) )
		}
	}else{
		next()
	}
}

function launchValidMedias( medias , magazine ){
	let mediasImages = medias.filter( media => {
		let ext = media.split('.').pop()
		return ext == 'jpg' || ext == 'jpeg' || ext == 'png'
	})
	validMedias( 'gallery_image' ,  mediasImages , 0 , resultImages =>{

		mediasCreate( resultImages , 0 , 'gallery_image' , magazine , ()=>{

			let mediasVideos = medias.filter( media => {
				if(typeof(media) == 'object') return false
				return media.split('.').pop() == 'mp4'
			} )

			validMedias( 'video_library' ,  mediasVideos, 0 , resultVideos =>{
				
				if(resultVideos.length) mediasCreate( resultVideos , 0 , 'video_library', magazine , ()=>{})
	
			}, [...mediasVideos])

		})

		

	}, [...mediasImages])
}

module.exports = launchValidMedias