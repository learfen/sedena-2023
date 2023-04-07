const DB = require(__dirname + "/../models/index");
const FS = require("fs");
const PATH = require('path')
const moment = require('moment')

const folderChildren = pathFolder => {
	let folders = []
	let itemFolder = FS.readdirSync(__dirname + pathFolder)
	for(let item of itemFolder){
		
		if(! FS.lstatSync( __dirname + pathFolder + "/" + item).isFile())
			folders.push( pathFolder + "/" + item )
	}
	return folders
}

function folders (type) {
	let folders = {
		img:[
			'/../../uploads/gallery',
			'/../../uploads/magazine/cover_pages',
			'/../../uploads/pdf_magazines',
			'/../../uploads/cover_pages',
			'/../../uploads/cupons',
			'/../../uploads/tmp_support',
			'/../public/refam/portadas',
			...folderChildren('/../../uploads/gallery' ),
		],
		pdf:[
			'/../public/refam/pdf_magazines',
			'/../../uploads/pdf_magazines',
		],
		video:[
			'/../public/refam/video',
			'/../../uploads/video_library',
			...folderChildren('/../public/refam/video' ),
			...folderChildren('/../../uploads/video_library' ),
		]
	}
	return folders[type]
}

function lastChangedFunction( data ){
	data['lastChanged'] = (new Date(data['updatedAt']))
		.toISOString()
		.replace('T','')
		.slice(2 , 14).split('.')[0]
		.split('-').join('')
		.split(':').join('')
	return data 
}

function findAndRespondeFile(req , res) {
	//console.log(  req.params.attr , ' ---  ', (req.params.attr == 'htmlFile') )
	if(req.params.attr == 'htmlFile') req.params.fileName = req.params.fileName + '.html'
	let ext = (req.params.attr == 'htmlFile') ? 'html' : req.params.fileName.split('.').pop()
	ext = ext.toLowerCase()
	if(ext == 'html'){
		let file = PATH.resolve( __dirname + '/../../uploads/magazine_articles/'+req.params.fileName  )
		if(FS.existsSync( file )) res.send( FS.readFileSync(file).toString() )
		else res.send("404")
	}else{
		const find = ( folders, file  , next , i) => {
			i = i == undefined ? 0 : i
			if( i < folders.length ){
				let url = PATH.join(__dirname,folders[i] , file)
				let thumb = PATH.join(__dirname,folders[i] , "thumb_"+file)
				//console.log(`¿Encontrado? ${FS.existsSync( url )} >> ${url} \n\n` )
				if(FS.existsSync( thumb )) next( thumb )
				else{
					if(FS.existsSync( url )) next( url )
					else find(folders, file , next , ++i)
				}
			}else{
				next(PATH.join( __dirname , '/../public/refam/404.png'))
			}
		}
		find(
			folders( ext == 'mp4' ? 'video' : ( (ext == 'pdf') ? 'pdf' : 'img' ) ), 
			req.params.fileName , result => {
				if(typeof result == 'string') res.sendFile(result)
				else res.send(result.error)
			}
		)
	}
}

function responseTables(req , res , tables){
		const response = (result , key , val) => {
			result[key] = val
			return result
		}
		const rows = (tables, i , result) => {
			result = result == undefined ? {} : result
			i = i == undefined ? 0 : i
			if( i < tables.length){
				//let dateNew = moment(new Date(req.params.date)).subtract(2 , 'h').format().slice(0 , 19)
				let dateNew = new Date(req.params.date)
				let where = {updatedAt:{[DB.Sequelize.Op.gte]:dateNew}}
				if( tables[i] == 'gallery_image' || tables[i] == 'library_video' )
					where = {updatedAt:{[DB.Sequelize.Op.gte]:dateNew}}
				if( tables[i] == 'article_magazine'){
					where = {date:{[DB.Sequelize.Op.gte]:dateNew}}
				}
				let table = tables[i]
				DB[table].findAll({where})
					.then( resultFind => {
						resultFind = resultFind.map( item => {
							item = item.dataValues
							if(table == 'magazine' || table == 'article_magazine'){
								let ext = String(item.coverPage).split('.').pop()
								item['ref'] = `${table}/${item.id}`
								if( table == 'article_magazine' )
									item.ref += '/htmlFile'
								item.cover = {ref:`${table}/${item.id}/coverPage`, ext , magazineId:item.id , status:true, album:'cover',description:item.coverPage}
							}else{
								item['ref'] = `${table}/${item.id}/name`
							}
							item = lastChangedFunction( item )
							return item
						})
						console.log(tables , tables[i] )
						rows( tables , ++i , response( result , table , resultFind) )
					})
					.catch( error => {
						console.log(tables , tables[i] , error )
						rows( tables , ++i , result )
					} )
			}else{
				console.log( result )
				res.json( result )
			}
		}
		rows( tables )
}


function downloadFileAsIdContainer(req , res){
	DB[req.params.table].findOne({where:{id:req.params.id } })
		.then( resultFind => {
			findAndRespondeFile( {params:{fileName:resultFind.dataValues[req.params.attr] , attr:req.params.attr}} , res )
		})
		.catch( error => console.log('Error ',{table:req.params.table , where:{id:req.params.id } , error } ) )
}

module.exports = app => {
	app.get('/updated/medias/:date' , (req , res ) => { 
		responseTables(req, res , [
			"gallery_image",
			"library_video",
			//"pdf_magazine"
		] )
	})
    app.get('/updated/magazine/:date' , (req , res ) => {
		responseTables(req, res , [
			"magazine",
			"article_magazine"
		])
	})
    // localhost:3000/changed/files/image-undefined-1598041780321.jpg
	app.get('/changed/files/:fileName' , findAndRespondeFile)

	app.get('/updated/pdf/:mark' , (req,res) =>{
		let data = JSON.parse( FS.readFileSync( __dirname + '/../../uploads/pdf_magazines/updated') )
		if( data.mark > +req.params.mark){
			let result = []
			for(let pdf of data.files){
				if( pdf.mark > +req.params.mark ) result.push( pdf )
			}
			return res.json( { result , mark: data.mark } )
		}
		res.json( {result:[] , mark:req.params.mark} )
	} )
	
	app.get('/changed/downloadFile/:table/:id/:attr/' , downloadFileAsIdContainer)
    return app
	
}