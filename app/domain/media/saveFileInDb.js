const fs = require("fs");
const db = require("../../models");
const GalleryImage = db.gallery_image;
const VideoLibrary = db.video_library;

const constants = require("../../util/util.constants");
const config = require("../../config/auth.config");
const path = require("path");

const Op = db.Sequelize.Op;
//locals.addEvent('image.create' , function( payload ){} )
//locals.addEvent('video.create' , function( payload ){} )
module.exports = {
	imageCreate( { fileName , magazine } ){
		//locals.emit('image.create', {} )
		let file = __dirname + '/../../../uploads/gallery/' + magazine + '/' + fileName
		console.log(file)
		if(fs.existsSync(file) ){ 
			file = fs.statSync( file)
			return GalleryImage.create({
				name: fileName,
				size: file.size,
				date: (new Date).toISOString().split('.')[0],
				status: true,
				category: 'unsorted',
				route: '/uploads/gallery/',
				magazine
			});
		}
	},
	videoCreate({ fileName , magazine }){
		//locals.emit('video.create' , {} )
		let file = fs.statSync( __dirname + '/../../../uploads/video_library/' + magazine + '/' +  fileName)
		if(fs.existsSync(file) ){ 
			file = fs.statSync( file)
			VideoLibrary.create({
				name: fileName,
				size: file.size,
				date: (new Date).toISOString().split('.')[0],
				status: true,
				magazine ,
				category: 'unsorted',
				route: '/uploads/video_library/'
			});
		}
	},
}