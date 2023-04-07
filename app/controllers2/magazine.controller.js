//const setTZ = require('set-tz')
//setTZ('America/Mexico_City')
const ejsLint = require('ejs-lint');
const moment = require('moment');
const fs = require('fs');
const cartoonDefaultName = 'Sargento No.'

const db = require("../models");
global.db = db
const Op = db.Sequelize.Op;
const PdfMagazineModel = db.pdf_magazine;
const ArticleMagazineModel = db.article_magazine;
const MagazineModel = db.magazine;

const controllerUtils = require("./util.ctrl");
const path = require('path')
const config = require("../config/auth.config");
const constants = require('../util/util.constants');

const inspectMedia = require(__dirname + '/../domain/article/inspectMedias.js')
const STORAGE_ARTICLE_PATH = __dirname + "/../../uploads/" + constants.STORAGE_ARTICLE_MAGAZINE

const URL_ARTICLES_COVER = "/refam/api/magazine/getCoverOfArticle/?imageName="
const folder = data => {
    let folder = {}
    folder.articles = __dirname + `/../public/medias/${data.token.id}/articles/`
    folder.magazineCovers = __dirname + `/../public/medias/${data.token.id}/covers/`
    folder.articleCovers = __dirname + `/../public/medias/${data.token.id}/articles/covers/`

	for(let route of Array.from( Object.values(folder) ) ){
		if( ! fs.existsSync(route)){
			fs.mkdirSync(route)
		}
	}
}

class Article{
	create(data , _then , _catch ){
		global.db.magazine.update( data , {where:{ id }})
		.then( resultCreate =>{
			fs.writeFileSync(folder(data).articles + '/' + resultCreate.dataValues.id + '.html' , '')
			_then( resultCreate )
		 } )
		.catch( _catch )
	}
	update(id, data , _then , _catch ){
		if(typeof where != 'object') where = { id:where }
		global.db.magazine.update( data , { where } )
		.then( _then )
		.catch( _catch )
	}
	updateContent(where, data , _then , _catch ){
		if(typeof where != 'object') where = { id:where }
		global.db.magazine.update( {date:dateForSave()} , { where })
		.then( resultCreate =>{
			fs.writeFileSync(folder(data).articles + '/' + resultCreate.dataValues.id + '.html' , data)
			_then( resultCreate )
		 } )
		.catch( _catch )
	}

	remove(id, _then , _catch ){
		global.db.magazine.update( {status:false} , {where:{ id }})
		.then( resultCreate =>{
			fs.rename(folder(data).articles + '/' + resultCreate.dataValues.id + '.html' , folder(data).articles + '/_' + resultCreate.dataValues.id + '.html')
			_then( resultCreate )
		 } )
		.catch( _catch )
	}
}

class Magazine{
	create(data , _then , _catch ){
		global.db.magazine.update( data , {where:{ id }})
		.then( _then )
		.catch( _catch )
	}
	update(id, data , _then , _catch ){
		global.db.magazine.update( data , {where:{ id }})
		.then( _then )
		.catch( _catch )
	}

	remove(id, _then , _catch ){
		global.db.magazine.update( {status:false} , {where:{ id }})
		.then( _then )
		.catch( _catch )
	}
}

function dateForSave( date ){
	if( date )
		return (new Date( date )).toISOString().split(".")[0]
	return (new Date()).toISOString().split(".")[0]
	if( date )
		return String(moment(date).subtract(0, 'hours').format()).slice(0,19);
	return String(moment().subtract(0, 'hours').format()).slice(0,19);
}

function clearLink(result){

	let count = 0
	while( result.split('link').length > 1 && count < 100){
		count++
		let arrayClearLink = result.split(`<link`)
		if(arrayClearLink.length > 1){
			result = arrayClearLink[0] + arrayClearLink[1].split(`/>`)[1]
		}
	}
	return result + `
	<script src="/refam/javascript/editor_publish_main.js"></script>`
}

function articleInsertDb( res , article , articleIdName ){
	ArticleMagazineModel.create({
			title:article.title,
			date:dateForSave(),
			status: 1,
			htmlFile: articleIdName,
			category: article.category,
			coverPage: article.coverPage,
			magazineId:+article.magazineId,
			visite:0
		}
	).then(articleNew => {
		res.status(200).json(
			{
				result: "Registro Creado",
				articleId: articleNew.id
			}
		);
	}).catch( err => {
		res.status(200).json({ error : "Error al guardar en la base de datos , "+err.message})
	})
}

function articleUpdateDb( res , data , where ){
	console.log('update article ',  data, where )
	ArticleMagazineModel.update( data, where )
	.then(articleMagazine => {
		if(res != null){
			res.json(
				{
					message: "Registro Actualizado",
					articleId: articleMagazine.id,
					status: 1
				}
			)
		}
	}).catch( err => {
		if( res != null)
			res.json({ error : "Error al guardar en la base de datos , "+err.message})
		else console.log(err)
	})
}

function articleCreateFile(res , article , cb) {
	let articleFile = article.magazineId + "-" + Date.now()
	let filePath = STORAGE_ARTICLE_PATH + articleFile + constants.ARTICLE_FILE_EXTENSION
	fs.writeFileSync(filePath , `
		<!DOCTYPE html>
		<html lang="en" dir="ltr">
			<head>
			<meta name='viewport' content='width=device-width, user-scalable=yes'>
			<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
			</head>
			<body></body>
		</html>`)
	res.json({result:"Archivo Creado"})
		/*
	fs.writeFileSync(filePath+".log", "[]") // creamos para log
	if(cb != undefined){
		cb( res, article, articleFile )
	}else{
		res.status(200).json({result:"Archivo Creado"})
	}*/
};

const getHtmlArticle = article => {
	let pathFile = STORAGE_ARTICLE_PATH + article.dataValues.htmlFile + constants.ARTICLE_FILE_EXTENSION
	if(!fs.existsSync(pathFile)) pathFile = STORAGE_ARTICLE_PATH + article.magazineId + '/' + article.dataValues.htmlFile + constants.ARTICLE_FILE_EXTENSION
	return fs.readFileSync( pathFile ).toString()
}

const inspect = async (where) => {
	let article = await db.article_magazine.findOne({ where })
	let html = getHtmlArticle( article )
	html = html.split('fileid')
	html.splice(0,1)
	medias = html.map(media => 'fileid' + media.split('"')[0].split(';')[0].split(')')[0])
	inspectMedia( medias , article.dataValues.magazineId)
	return 'inspect execute'
}


function emitArticleUpdated( where , res ){
	inspect(where)
	db.article_magazine.findOne({ where })
	.then( ({dataValues}) => {
		console.log('magazine update', {htmlFiles:(new Date).toISOString()}, {where:{id:dataValues.magazineId}} )
		db.magazine.update( {htmlFiles:(new Date).toISOString()}, {where:{id:dataValues.magazineId}} )
			.then( magazine => console.log('magazine updated ' , magazine))
			.catch( error => console.log('magazine error' , error))
	})
	articleUpdateDb( res , {date:dateForSave(),updatedAt:dateForSave()}, { where })
	//locals.emit('article.updated', {where , data:{date:(new Date).toISOString().split('.')[0]}, res })
}

function articleUpdateFile(req, res, file, html , updatedDb){
	let fileArticle = STORAGE_ARTICLE_PATH+file+".html"
	if(fs.existsSync(fileArticle)){
		fs.unlinkSync(fileArticle)
		fs.writeFileSync(fileArticle , `
			<!DOCTYPE html>
			<html lang="es" dir="ltr">
				<head><meta name='viewport' content='width=device-width, user-scalable=yes'>
				<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
				</head>
				<body>${html}</body>
			</html>`
		)
		emitArticleUpdated( {htmlFile:file} , res)

	}else{
		res.json({error:"Archivo no encontrado"})
	}
}

const auth = require(__dirname + "/../config/auth.config.js")
const jwt = require('jsonwebtoken')
function access( req , success , error ){
	try {
		let token = req.query.token ?? req.headers.authorization
		if( !token ) error({message:'Token no encontrado'})
		var decoded = jwt.verify(token, auth.secret)
		success( decoded )
	  } catch(err) {
		// err
		error(err)
	  }
}
exports.postedMagazine = (req, res) => {
	access( req , ({role}) =>{ 
		if ( role == 2 || role == 3)
			constants.updateStatus(res, req.body.pdf ? PdfMagazineModel : MagazineModel, req.params.id , 3 , "Publicada")

		else res.json({error:"requiere nivel 2 o 3 (Editores/Administradores)"})
	},
	({message}) => res.json({error:message})
	)
}
exports.controlMagazine = (req, res) => {
	access( req , ({role}) =>{ 
		if ( role == 1 || role == 3)
			constants.updateStatus(res, req.body.pdf ? PdfMagazineModel : MagazineModel, req.params.id , 2 , "Esperando ser revisada")
		
		else res.json({error:"requiere nivel 1 (Solo escritores)"})
	},
	({message}) => res.json({error:message})
	)
}
exports.editedMagazine = (req, res) => {
	access( req , ({role}) =>{ 
		if ( role == 2 || role == 3)
		constants.updateStatus(res, req.body.pdf ? PdfMagazineModel : MagazineModel, req.params.id , 1 , "Enviada a revisión")
		
		else res.json({error:"requiere nivel 2 o 3 (Editores/Administradores)"})
	},
	({message}) => res.json({error:message})
	)
}

exports.deleteMagazine = (req, res) => {
	access( req , ({role}) =>{ 
		if ( role == 3)
		constants.updateStatus(res, req.body.pdf ? PdfMagazineModel : MagazineModel, req.params.id , 0 , "Eliminada")
		
		else res.json({error:"requiere nivel 3 (Administradores)"})
	},
	({message}) => res.json({error:message})
	)
}

exports.deleteArticle = (req, res) => {
	if(constants.evalAcces( req , res , config , role =>{ return (role == 1) } , "requiere nivel 1 (Solo escritores)"))
		constants.updateStatus(res, ArticleMagazineModel, req.params.id , 0 , "Eliminado")
}


exports.articlePush = ( req, res ) => {
	if(constants.evalAcces( req , res , config , role =>{ return (role == 1) } , "requiere nivel 1 (Solo escritores)"))
		articleCreateFile( res , {coverPage:req.file.filename,date:"",title:"",html:"",category:req.body.category, magazineId:req.params.magazine} , articleInsertDb)
}

exports.articleVisite = ( req, res ) => {
	ArticleMagazineModel.findOne({where:{id:req.params.id}})
	.then ( article => {
		articleUpdateDb(res, { visite:++article.dataValues.visite } , {where:{ id:req.params.id }} )
	})
}

exports.setHtml = (req, res) => {
	if(
		constants.evalAcces( 
			req , 
			{json:null} , 
			config , 
			role =>{ 
				return (role == 1) 
			} , 
			"requiere nivel 1 (Solo escritores)")
	)
	console.log('article updated ' )

	articleUpdateFile(req, res, req.body.articleIdSaveFile , req.body.htmlNew , true)
}


// codigo anterior
exports.getMagazinesPostedCover = (req, res) => { ///
	ejsLint('magazine', {})

	PdfMagazineModel.findAll(
		{
			where: {
				status:3
			}
		})
		.then(pdfMagazines => {
				MagazineModel.findAll().then(magazines => {

					// TODO change
					let result = []
					magazines.forEach((magazine, key) => {
						result.push({title:magazine.title,coverPage:"/refam/api/magazine/getCoverOfMagazine/?imageName=" +magazine["coverPage"], id:magazine.id, type:"html"})
					});
					pdfMagazines.forEach((magazine, key) => {
						result.push({title:magazine.title,coverPage:"/refam/api/magazine/getCoverOfMagazine/?imageName=" +magazine["coverPage"], id:magazine.id, type:"pdf"})
					});

					res.status(200).json([ result.sort(constants.orderDesc) ]);
				}).catch(err => {
					res.status(500).send({message: err.message + ""});
				});

			}
		)
		.catch(err => {
			console.log(err.message);
			res.status(500).send({message: err.message + ""});
		});

}

exports.getMagazines = (req, res) => { ///
	ejsLint('magazine', {})
	PdfMagazineModel.findAll({where:{status:{[Op.gte]:1}}})
		.then(pdfMagazines => {
				MagazineModel.findAll({where:{status:{[Op.gte]:1}}}).then(magazines => {

					// TODO change
					magazines.forEach((magazine, key) => {
						magazine.titleText = magazine.title
						magazine.dateOrder = (new Date(magazine.date)).toISOString().split("T")[0]
						let date = moment(Number(magazine.date)) //FIXME  It not will be necessary
						if (!date.isValid()) {
							date = moment(magazine.date, "YYYY-MM-DD")
						}
						magazine.date = controllerUtils.capitalize(
							date
								.locale(constants.MEXICO_LOCALE)
								.format('MMMM YYYY')
						);
					});

					for(let magazine of pdfMagazines){
						let options = { year: 'numeric', month: 'long'};
						let title = new Date(magazine.date).toLocaleDateString("es-ES", options).toUpperCase()
						magazine.title = magazine.title == '' ? title : magazine.title
						magazine.type = 'pdf'
						magazine.data = magazine.pdf
						magazine.file = magazine.pdf.replace('/refam/pdf_magazines/','')
						if( typeof magazine.status == "boolean"){
							magazine.status = magazine.status ? "1" : "0"
						}
					}

					for(let magazine of magazines){
						magazine.type = 'html'
						if( typeof magazine.status == "boolean"){
							magazine.status = magazine.status ? "1" : "0"
						}
						magazine.data = "api/magazine/getHtmlMagazineByID?magazineId="+magazine.id
					}
					let size = [...magazines, ...pdfMagazines].length
					let cantPerPage = 6
					let pagination = constants.page(req)
					let last = size / cantPerPage
					if(last >= 1){
						last = last > parseInt(last) ? parseInt(last) + 1 : parseInt(last)
					}else{
						last = 0
					}
					res.status(200).render(
						'magazine',
						{
							magazines:constants.evalPage(
								pagination, 
								[...magazines , ...pdfMagazines ].sort(constants.orderDesc),
								cantPerPage // cant per page 
							),
							page:pagination.page,
							next:pagination.next,
							prev:pagination.prev,
							size,
							last,
							paginationText:`${(+pagination.page + 1)} de ${(last + 1)}`
						});
				}).catch(err => {
					console.log("error " , err.message);
					res.status(500).send({message: err.message + ""});
				});

			}
		)
		.catch(err => {
			console.log("error " , err.message);
			res.status(500).send({message: err.message + ""});
		});

}

exports.getMagazineCoverPage = (req, res) => {
	let imageName = req.query.imageName

	let filePath = __dirname + "/../../uploads/pdf_magazines/" + imageName
	let ext = filePath.split(".")
	res.writeHead(200, {
		'Content-Type': 'image/'+ext[ext.length - 1],
		'Content-Length': stat.size
	});
	res.sendFile(filePath)
	/*
	const stat = fs.statSync(filePath);
	let ext = filePath.split(".")
	res.writeHead(200, {
		'Content-Type': 'image/'+ext[ext.length - 1],
		'Content-Length': stat.size
	});

	let fileStream = fs.createReadStream(filePath);
	fileStream.pipe(res);
	*/

};


exports.getPdfMagazine = (req, res) => {
	let imageName = req.query.pdfName

	let filePath = __dirname + "/../public/refam/pdf_magazines/" + imageName
	const stat = fs.statSync(filePath);

	res.writeHead(200, {
		'Content-Type': 'application/pdf',
		'Content-Length': stat.size
	});

	let fileStream = fs.createReadStream(filePath);
	fileStream.pipe(res);

};


exports.getPdfMagazineUploader = (req, res) => {
	ejsLint('new_pdf_magazine', {})
	res.status(200).render('new_pdf_magazine');
};

/**
 * Magazines in PDF
 * **/
exports.postUploadPdfMagazine = (req, res) => {
	const files = req.files
	if (!files || !files[0] || !files[1] || files.length !== 2) {
		const error = new Error('Debes seleccionar una imagen para la revista')
		error.httpStatusCode = 400
		return next(error)
	}

	let date = req.body.date 
	let monthYear = controllerUtils.capitalize(moment().locale(constants.MEXICO_LOCALE).format('MMMM yyyy'))
	let pdf = files[0] // pdf
	let coverPage = files[1] // coverPage
	let status = req.body.status === "on"
	let data = {
		title: req.body.title,
		date,
		status,
		pdf: "/refam/pdf_magazines/"+pdf.filename.split(" ").join("_"),
		coverPage: "/refam/api/magazine/getCoverOfMagazine?imageName="+coverPage.filename
	}
	PdfMagazineModel.create( data )
	.then( ()=>{
		let statesPDF = JSON.parse( fs.readFileSync(__dirname + '/../../uploads/pdf_magazines/updated') )
		statesPDF.push( {pdf:data.pdf.split('/').pop() , coverPage:data.coverPage.split('=').pop() , url:'changed/files/' , mark:statesPDF.mark } )
		statesPDF.mark += 1
		fs.writeFileSync(__dirname + '/../../uploads/pdf_magazines/updated', JSON.stringify( statesPDF ) )
		res.status(200).redirect("/refam/revistas");
	})
	.catch( ( error )=> {
		console.log( {error} )
		res.json( data , error )
	})

};


// Todo filter by year and active
exports.getAllPdfMagazines = (req, res) => {

	PdfMagazineModel.findAll(/*{
		attributes: {exclude: ['size']},
	}*/)
		.then(pdfMagazines => {
			// console.log(pdfMagazines)
			res.status(200).send(
				{
					"pdfMagazines": pdfMagazines
				}
			);
		})
		.catch(err => {
			console.log("error ", err.message);
			res.status(500).send({message: err.message + ""});
		});
};


/**
 * Magazine Articles in HTML
 *
 **/


exports.postCreateMagazine = (req, res) => {
	let title = req.body.title
	let date = req.body.date
	let category = req.body.category

	let files = req.files
	let coverImageFile = ""
	if (!files) {
		const error = new Error('Debes seleccionar una imagen')
		error.httpStatusCode = 400
		console.log("errorcreateSupportIssue= ", error)
		res.status(500).send("Error");

		//return next(error)
	}
	coverImageFile = files[0].filename

	if (!date || date === "date") {
		date = (new Date()).toISOString().split(".")[0]
	}else{
		date = (new Date(date)).toISOString().split(".")[0]
	}

	MagazineModel.create({
			title,
			date,
			status: 1,
			category,
			coverPage: coverImageFile,
		}
	).then(magazine => {
		res.json({
			result:{
				magazineId: magazine.id,
				id: magazine.id,
				title: magazine.title,
				status: 1
			}
		})
	})
};


exports.postAddHtmlArticle = (req, res) => {
	const file = req.file
	let fileImagePath = ""
	if ( !file ) {
		const error = new Error('Debes seleccionar una imagen')
		error.httpStatusCode = 400
		console.log("errorcreateSupportIssue= ", error)
		res.status(500).send({message:'Debes seleccionar una imagen.'+ error.message + ""});
	}else{
		let magazineId = req.body.magazineId
		let articleId = 1
		let coverPageFileName = file.filename
		let articleDate = Date.now()
		let articleIdName = magazineId + "-" + articleDate
		let articleFileName = articleIdName + '.html'
		let filePath = STORAGE_ARTICLE_PATH + `${articleFileName}`
        if(!fs.existsSync(STORAGE_ARTICLE_PATH + `${req.body.magazineId}`)){
            fs.mkdirSync(STORAGE_ARTICLE_PATH + `${req.body.magazineId}`)
        }
		fs.writeFileSync(filePath , '<h3>Soy un nuevo articulo</h3>')
		global.db.article_magazine.create({
				title: req.body.title,
				date: dateForSave(),
				category: req.body.category,
				htmlFile: articleIdName,
				magazineId: magazineId,
				coverPage: coverPageFileName,
				status: true,
				visite:0
		}).then(articleMagazine => {
			articleId = articleMagazine.id
			
			inspect({htmlFile:articleIdName})
			res.status(200).json(
				{
					message: "Artículo creado correctamente",
					articleId: articleId,
					status: 0
				}
			);
		})
		.catch(err => {
			console.log(err.message);
			res.status(500).send({message: "Error al guardar en la base de datos."+err.message + ""});
		});
	}
};

exports.getAllMagazineHtmlArticles = (req, res) => {
	ArticleMagazineModel.findAll({status:1})
		.then(atrticlesMagazine => {
			res.status(200).send(
				{
					"atrticlesMagazine": atrticlesMagazine
				}
			);
		})
		.catch(err => {
			console.log(err.message);
			res.status(500).send({message: err.message + ""});
		});
};


exports.postGetArticlesByMagId = (req, res) => {
	let magazineId = req.body.magazineId

	ArticleMagazineModel.findAll({
			order: [ ['page', 'ASC'] ],
			where: {
				magazineId: magazineId , status:1
			}
		}
	)
		.then(atrticlesMagazine => {
			res.status(200).send(
				{
					"atrticlesMagazine": atrticlesMagazine
				}
			);
		})
		.catch(err => {
			console.log(err.message);
			res.status(500).send({message: err.message + ""});
		});
};


exports.getHtmlMagazineByID = (req, res) => {
	let magazineId = req.query.magazineId

	MagazineModel.findOne({
			where: {
				id: magazineId
			}
		}
	).then(magazine => {
		ArticleMagazineModel.findAll({
				where: {
					magazineId: magazineId
				}
			}
		)
			.then(atrticlesMagazine => {
				res.status(200).render(
					"magazine_html_detail",
					{
						"magazine": magazine,
						"atrticlesMagazine": atrticlesMagazine
					}
				);
			})
			.catch(err => {
				console.log(err.message);
				res.status(500).send({message: err.message + ""});
			});

	});
};


exports.getArticlesFromMagazine = (req, res) => {
	let id = req.params.id

	MagazineModel.findOne({
			where: { id }
		}
	).then(magazine => {

		ArticleMagazineModel.findAll({
			order: [ ['page', 'DESC'] ],
			where: {
				magazineId: id , status:1
			}
		})
			.then(articlesMagazine => {
				res.json({
					result:{
						magazine,
						"articles": articlesMagazine
						.filter( item => item.status == true )
						.map( item => { 
							item.coverPage = item.coverPage.search('refam') == -1 ? URL_ARTICLES_COVER+item.coverPage : item.coverPage 
							return item
						})
					}
				})
			})
			.catch(err => {
				res.status(500).send({message: err.message + ""});
			});

	});
};

exports.getHtmlMagazineByIDEdit = (req, res) => {

	let magazineId = req.query.magazineId

	MagazineModel.findOne({
			where: {
				id: magazineId
			}
		}
	).then(magazine => {
		ArticleMagazineModel.findAll({
				order: [ ['page', 'ASC'] ],
				where: { magazineId: magazineId }
		})
		.then(articlesMagazine => {
			let articles = []
			for(let article of articlesMagazine){
				if(article.status > 0){
					let articleGet = article.dataValues
					
					let page = fs.readFileSync(__dirname + '/../../uploads/magazine_articles/'+articleGet["htmlFile"]+".html").toString()
					let pageCutStart = page.split("<body>")
					articleGet["html"] = pageCutStart.length > 1 ? pageCutStart[1].split("</body>")[0] : pageCutStart[0]
					if(req.query['editor'] === undefined){
						articleGet["html"] = articleGet["html"].replace('/refam/css','assets/css').replace('/refam/css','assets/css')
						articleGet["html"] = clearLink( articleGet["html"] )
					}
					articleGet["coverPage"] = URL_ARTICLES_COVER + articleGet["coverPage"]
					articles.push(articleGet)
				}
			}
			res.status(200).json({ magazine , articles})
		})
		.catch(err => {
			console.log(err.message);
			res.status(500).send({message: err.message + ""});
		});

	});
};

exports.getTemplateEditorIdArticle = (req, res) => {
	let magazineId = req.query.magazineId
	let articleId = req.params.article

	MagazineModel.findOne({
			where: {
				id: magazineId
			}
		}
	).then(magazine => {
		ArticleMagazineModel.findAll({
				where: { magazineId: magazineId , status:1}
		})
		.then(articlesMagazine => {
			let articles = []
			for(let article of articlesMagazine){
				let articleGet = article.dataValues
				if(articleGet.status > 0){
					articleGet["coverPage"] = "/refam/api/magazine/getCoverOfArticle/?imageName=" + articleGet["coverPage"]
					if(articleGet.id == articleId){
						let file_article = __dirname + "/../../uploads/magazine_articles/"+articleGet.htmlFile+".html"
						if(fs.existsSync(file_article)){
							let page = fs.readFileSync(file_article).toString()
							let pageCutStart = page.split("<body>")
							if(pageCutStart.length > 1){
								pageCutEnd = pageCutStart[1].split("</body>")
							}
							articleGet["gjs-html"] = pageCutStart.length > 1 ? pageCutStart[1].split("</body>")[0] : pageCutStart[0]
							
							if(req.query['editor'] === undefined){
								articleGet["gjs-html"] = articleGet["gjs-html"].replace('/refam/css','assets/css').replace('/refam/css','assets/css')
							}
						}else{
							articleGet["gjs-html"] = "archivo no encontrado " + file_article
						}
					}
					articles.push(articleGet)
				}
			}
			res.status(200).json({ magazine , articles})
		})
		.catch(err => {
			console.log(err.message);
			res.status(500).send({message: err.message + ""});
		});

	});
};

exports.getAll = (req, res) => {
	MagazineModel.findAll({where:{status:{[Op.gte]:1}}})
	.then( results => {
		let magazines = []
		for(let result of results){
			if(result.status > 0){
				let magazine = result
				magazine["coverPage"] = "/refam/api/magazine/getCoverOfMagazine/?imageName=" + magazine["coverPage"]
				magazines.push(magazine)
			}
		}
		res.status(200).json( magazines.sort(constants.orderDesc) )
	})
	.catch(err => {
		res.status(500).send({message: err.message + ""});
	});
};

exports.getCoverOfArticle = (req, res) => {
	let imageName = req.query.imageName

	let filePath = path.join(__dirname, "/../../uploads/pdf_magazines/", imageName )
	if(fs.existsSync( filePath )) res.sendFile(filePath)
	else res.sendFile(path.join(__dirname , '/../public/refam/404.png'))
};

exports.getCoverOfMagazine = (req, res) => {
	let imageName = req.query.imageName

	let filePath = path.resolve(__dirname + "/../../uploads/" + constants.STORAGE_MAGAZINE_COVER_PAGES + imageName)
		
	if(fs.existsSync( filePath )) res.sendFile(filePath)
	else res.sendFile(path.join(__dirname , '/../public/refam/404.png'))

};

exports.getMagazineHtmlArticle = (req, res) => {
	let articleName = req.body.articleName
	ArticleMagazineModel.findAll()
		.then(atrticlesMagazine => {
			let filePath = STORAGE_ARTICLE_PATH + articleName + constants.ARTICLE_FILE_EXTENSION
			const stat = fs.statSync(filePath);
			res.status(200).writeHead(200, {
				'Content-Type': constants.ARTICLE_FILE_CONTENT_TYPE,
				'Content-Length': stat.size
			});

			let fileStream = fs.createReadStream(filePath);
			fileStream.pipe(res);

		})
		.catch(err => {
			console.log(err.message);
			res.status(500).send({message: err.message + ""});
		});

};

exports.getMagazineHtmlArticleById = (req, res) => {
	let articleId = req.body.articleId
	ArticleMagazineModel.findOne(
		{
			where: {
				id: articleId,
			}
		}
	).then(atrticlesMagazine => {
		let articleName = atrticlesMagazine.htmlFile
		let filePath = STORAGE_ARTICLE_PATH + articleName + constants.ARTICLE_FILE_EXTENSION
		const stat = fs.statSync(filePath);
		res.status(200).writeHead(200, {
			'Content-Type': constants.ARTICLE_FILE_CONTENT_TYPE,
			'Content-Length': stat.size
		});

		let fileStream = fs.createReadStream(filePath);
		fileStream.pipe(res);

	})
		.catch(err => {
			console.log(err.message);
			res.status(500).send({message: err.message + ""});
		});

};

exports.getMagazineHtmlArtById = (req, res) => {
    try{
        let articleId = req.query.articleId
    	ArticleMagazineModel.findOne(
    		{
    			where: {
    				id: articleId,
    			}
    		}
    	).then(atrticlesMagazine => {
    		let articleName = atrticlesMagazine.htmlFile
    		let filePath = STORAGE_ARTICLE_PATH + articleName + constants.ARTICLE_FILE_EXTENSION
    		const stat = fs.statSync(filePath);
    		res.status(200).writeHead(200, {
    			'Content-Type': constants.ARTICLE_FILE_CONTENT_TYPE,
    			'Content-Length': stat.size
    		});
    
    		let fileStream = fs.createReadStream(filePath);
    		fileStream.pipe(res);
    
    	})
    		.catch(err => {
    			console.log(err.message);
    			res.status(500).send({message: err.message + ""});
    		});
	}catch(error){ console.log(error) }

};

exports.getMagazineHtmlArtByIdJSON = (req, res) => { 
	try{
	    let articleId = req.query.articleId
    	ArticleMagazineModel.findOne(
    		{
    			order: [ ['page', 'DESC'] ],
    			where: {
    				id: articleId,
    			}
    		}
    	).then(articlesMagazine => {
    		let articleName = articlesMagazine.htmlFile
    		let filePath = STORAGE_ARTICLE_PATH + articleName + constants.ARTICLE_FILE_EXTENSION
    		let page = fs.readFileSync(filePath).toString()
    		let pageCutStart = page.split("<body>")
    		let result = pageCutStart.length > 1 ? pageCutStart[1].split("</body>")[0] : pageCutStart[0]
    		if(result.search('link ') == -1){
    			result += `
    			<link rel="stylesheet" href="/refam/css/fontCustom.css">
    			<link rel="stylesheet" href="/refam/css/style.css">
    			`
    		}
    		if(req.query['editor'] === undefined){
    			result = result.replace('/refam/css','/assets/css').replace('/refam/css','/assets/css')
    			result = clearLink(result)
    		}
    		res.json({result , articleName})
    	})
    		.catch(err => {
    			console.log(err.message);
    			res.status(500).send({message: err.message + ""});
    		});
	}catch(error){ console.log(error) }

};

exports.getLastMagazine = (req, res) => {
	MagazineModel.findOne({
		order: [ ['id', 'DESC'] ],
		where:{ status:3 }
	}).then(magazine => {
		res.json(magazine)
	})
	/*
	return 
	let magazineId = 1

	MagazineModel.count({})
		.then(magazinessCount => {
			MagazineModel.findAll().then(magazines => {
				let lastIndex = magazinessCount - 1
				magazineId = magazines[lastIndex].id

				ArticleMagazineModel.findAll({
						order: [ ['page', 'ASC'] ],
						where: {
							magazineId: magazineId
						}
					}
				)
					.then(articlesMagazine => {

						res.status(200).send(
							{
								magazineId,
								articlesMagazine
							}
						);
					})
					.catch(err => {
						console.log(err.message);
						res.status(500).send({message: err.message + ""});
					});

			});
		})
		.catch(err => {
			console.log(err.message);
			res.status(500).send({message: err.message + ""});
		});
	*/
};


exports.postSearchPdfOrHtmlMagazineByDate = (req, res) => {
	let magazineMonth = req.body.magazineMonth
	let magazineYear = req.body.magazineYear
	let montInMommentFormat = magazineMonth - 1
	if (montInMommentFormat < 0) {
		res.status(500).send(
			{
				message: "Mes incorrecto"
			});
	}

	let magazinesFound = []

	MagazineModel
		.findAll() // TODO refactor query to db
		.then(magazines => {
			magazines
				.forEach((magazine, key) => {
					if(magazine.status > 0){
						let date = magazine.date
						if (date && date !== "date") {
							let dateMomment = moment(Number(date)).locale(constants.MEXICO_LOCALE)
							let m = dateMomment.month()
							let y = dateMomment.year()

							if (m === montInMommentFormat
								&& y === magazineYear) {
								magazinesFound.push(magazine)
							}
						}
					}
				})

			res.status(200).send(
				{
					magazinesFound,
				}
			);
		})
		.catch(err => {
			console.log(err.message);
			res.status(500).send({message: err.message + ""});
		});

};


exports.getMagazineByDate = (req, res) => {
	let magazineMonth = +req.params.magazineMonth < 10  ? `0${+req.params.magazineMonth}` : req.params.magazineMonth
	let magazineYear = +req.params.magazineYear < 10 ? `0${+req.params.magazineYear}` : req.params.magazineYear

	let count = 0
	let results = []
	function prepareSend(magazines, typeSrc){
		for(let magazine of magazines){
			magazine.dataValues["typeSrc"] = typeSrc
			results.push(magazine)
		}
		count++
		if(count == 2){
			res.status(200).send(
				{
					"magazinesFound": results.map( magazine => {
						if(magazine['pdf'] != undefined)
						magazine.pdf = 'https://refam.sedena.gob.mx:3002/magazinePDF/'+magazine.pdf.split('/').pop()
						return magazine
					} ),
				}
			)
		}
	}

	
	PdfMagazineModel
	.findAll() // TODO refactor query to db
		.then(magazines => {
			let magazinesFound = []
			magazines
				.forEach((magazine, key) => {
					if (magazineMonth == magazine.date.split('-')[1] && magazineYear == magazine.date.split('-')[0] ) {
						magazinesFound.push(magazine)
					}
				})
				prepareSend(magazinesFound, 'pdf')
			
		})
		.catch(err => {
			console.log(err.message);
			res.status(500).send({message: err.message + ""});
		});

		
	MagazineModel
		.findAll() // TODO refactor query to db
		.then(magazines => {
			let magazinesFound = []
			magazines
				.forEach((magazine, key) => {
					if (magazineMonth == magazine.date.split('-')[1] && magazineYear == magazine.date.split('-')[0] ) {
						magazinesFound.push(magazine)
					}
				})

				prepareSend(magazinesFound, 'html')
		})
		.catch(err => {
			console.log(err.message);
			res.status(500).send({message: err.message + ""});
		});

};

exports.mediaExists = ( req , res, name, magazine) => {
	const table = (name.split('.').pop().toLowerCase() == 'mp4') ? "library_video" : "gallery_image"
	db[table].findOne({where:{name , status:true , magazine}})
	.then( result => {
		if(result == null ) res.json({success:{status:false}})
		else{
			res.json({success:{status:result.dataValues.status}})
		}
	})
	.catch( error => res.json({error:error.message}))
}

exports.getCartoon = ( req , res ) =>{
	PdfMagazineModel
	.findAll({
		where:{
			status:3,
			title:{ [Op.like]:cartoonDefaultName+"%" }
		},
		order: [ ['date', 'DESC'] ],
		limit:12
	})
	.then( magazines => {
		res.json( magazines.map( magazine => {
			magazine = magazine.dataValues
			if(magazine['pdf'] != undefined)
			magazine.pdf = 'https://refam.sedena.gob.mx:3002/magazinePDF/'+magazine.pdf.split('/').pop()
			return magazine
		} ) )
	})
	.catch( error => {
		res.json( error )
	})
}


exports.magazineNumberUpdate = (req, res) => {
	PdfMagazineModel.update({name:cartoonDefaultName+req.body.number}, {
		where:{ id:req.body.id }
	}).then(magazine => {
		res.json(magazine)
	})
}

exports.magazineDateUpdate = (req, res) => {
	const Entity = req.body.type == 'pdf' ? PdfMagazineModel : MagazineModel
	Entity.update({date:(new Date( req.body.date )).toISOString().split("T")[0]}, {
		where:{ id:req.body.id }
	}).then(magazine => {
		res.json(magazine)
	})
}

exports.getMagazineLast = (req, res) => {
	let count = 0
	let results = []
	let titles = []
	function prepareSend(magazines){
		for(let magazine of magazines){
			let magazineClone = Object.assign({} , magazine.dataValues)
			magazineClone["typeSrc"] = magazineClone.pdf ? 'pdf' : 'html'
			let date = moment(Number(magazineClone.date))
			if (!date.isValid()) {
				date = moment(magazineClone.date, "YYYY-MM-DD")
			}
			magazineClone.title = magazineClone.title=='' ? controllerUtils.capitalize(
				date
					.locale(constants.MEXICO_LOCALE)
					.format('MMMM YYYY')
			) : magazineClone.title;
			if(titles.indexOf( magazineClone.title ) == -1){
				titles.push(magazineClone.title)
				magazineClone["order"] = magazineClone["date"].split('T')[0].replace('-','').replace('-','')
				results.push(magazineClone)
			}
		}
		
		results.sort( function ( a, b ) { return +b.order - +a.order; } );
		let magazinesFound = []
		for (let index = 0; index < 12 && index < results.length; index++) {
			magazinesFound.push(results[index])
		}
		res.status(200).send( { magazinesFound:magazinesFound.map( magazine => {
			if(magazine['pdf'] != undefined)
			magazine.pdf = 'https://refam.sedena.gob.mx:3002/magazinePDF/'+magazine.pdf.split('/').pop()
			return magazine
		} ) } )
	}

	
	PdfMagazineModel
	.findAll({
		where:{
			status:3,
			title:{ [Op.notLike]:cartoonDefaultName+"%" }
		},
		order: [ ['date', 'DESC'] ],
		limit:12
	}) // TODO refactor query to db 
		.then(magazinesFoundPdf => {
			// si aun no son 12 revistas
			if(count < 2){
				MagazineModel
				.findAll({
					where:{
						status:3
					},
					order: [ ['date', 'DESC'] ],
					limit:13
				}) // TODO refactor query to db
				.then(magazinesFoundHTML => {
					magazinesFoundHTML = [...magazinesFoundHTML.slice(1)]
					prepareSend([...magazinesFoundPdf , ...magazinesFoundHTML])
				})
				.catch(err => {
					console.log("Error : ", err.message);
					res.status(500).send({message: err.message + ""});
				});
			}
			
		})
		.catch(err => {
			console.log("Error : ", err.message);
			res.status(500).send({message: err.message + ""});
		});


};
