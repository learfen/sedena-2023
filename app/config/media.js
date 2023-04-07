const config = require(__dirname + "/../configCustom/media.json")
const valid = [...config.valid.images , ...config.valid.videos]

module.exports = {
	url:{
		thumb( file ){
			return config.storage.image + file 
		},
		img( file ){
			return config.storage.image + file 
		},
		pdf( file ){
			return config.storage.pdf + file 
		},
		video( file ){
			return config.storage.video + file 
		}
	},
	isValid:{
		img(file){
			return config.valid.images.indexOf( path.extname(file.originalname) ) > -1
		},
		video(file){
			return config.valid.videos.indexOf( path.extname(file.originalname) ) > -1
		},
		media(file){
			return valid.indexOf( path.extname(file.originalname) ) > -1
		},
		list:valid,
		error(){
			const messages = {
				"es":" Solo se permiten los archivos de tipo"
			}
			return messages[constants.lang] +" "+ valid.toString()
		}
	},
	limits:{
		img:1024 * 1024 * config.limit.image,
		video:1024 * 1024 * config.limit.video,
		pdf:1024 * 1024 * config.limit.pdf,
		error(){
			const messages = {
				"es":"Archivo demasiado grande, los tamaños permitidos son"
			}
			let output = ""
			for(let k of config.limits){
				output += "<" + k +" : "+ config.limits[k] + "MB >"
			}
			return messages[constants.lang] +" "+ output
		}
	}
}