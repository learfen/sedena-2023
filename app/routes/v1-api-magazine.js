const FS = require('fs')
const MULTER = require('multer')

const api = route => '/v1/api/'+route
const stringRandom = (len, an) => {
  len = len == undefined ? 8 : len
  an = an && an.toLowerCase();
  var str = '',
    i = 0,
    min = an == 'a' ? 10 : 0,
    max = an == 'n' ? 10 : 62;
  for (; i++ < len;) {
    var r = Math.random() * (max - min) + min << 0;
    str += String.fromCharCode(r += r > 9 ? r < 36 ? 55 : 61 : 48);
  }
  return str;
}
global.events = {
  articles:{
    create(){
      global.events.magazine.update()
    }
  },
  magazines:{
    create(){},
    update(){}
  }
}
global.folder = {
  user( user ){
    return __dirname + `/../public/medias/${user}/`
  },
  articles( user ){
    return __dirname + `/../public/medias/${user}/articles/`
  },
  articleCovers( user ){
    if( !FS.existsSync( __dirname + `/../public/medias/${user}/articles/`) ) FS.mkdirSync(__dirname + `/../public/medias/${user}/articles/`)
    return __dirname + `/../public/medias/${user}/articles/covers/`
  },
  article( user ){
    if( !FS.existsSync( __dirname + `/../public/medias/${user}/articles/`) ) FS.mkdirSync(__dirname + `/../public/medias/${user}/articles/`)
    return __dirname + `/../public/medias/${user}/articles/covers/`
  },
  articleMedias( user ){
    if( !FS.existsSync( __dirname + `/../public/medias/${user}/articles/`) ) FS.mkdirSync(__dirname + `/../public/medias/${user}/articles/`)
    return __dirname + `/../public/medias/${user}/articles/medias/`
  },
  magazineCovers( user ){
    return __dirname + `/../public/medias/${user}/covers/`
  },
  magazine( user ){
    return __dirname + `/../public/medias/${user}/covers/`
  },
  getter( req ){
    return global.folder[req.query.type]( req.query.token.id )
  }
}

const path = require('path')
const folderFilesValidation = route => {
    route = path.resolve( route )
    if( ! FS.existsSync(route)) FS.mkdirSync(route)
    return route
}

function dateForSave( date ){
	if( date )
		return (new Date( date )).toISOString().split('.')[0]
	return (new Date()).toISOString().split('.')[0]
}

function fileValidation(file , res){
  if ( !file ) throw 'No se selecciono un archivo'
}

global.uploadAssets = MULTER({
  storage: 
      MULTER.diskStorage({
          destination: function (req, file, cb) {
              try{
                  if(req.query.type == undefined) 
                    req.query.type = req.originalUrl.split('?')[0].split('/').pop()
                  folderFilesValidation( global.folder.user( req.query.token.id ) )
                  cb(null, folderFilesValidation( global.folder[req.query.type]( req.query.token.id ) ) ) 
              }catch( error ){
                  console.log('uploadAssets > ', error)
              }
          },
          filename: function (req, file, cb) {
              req.body.fileName = `${stringRandom()}.${file.originalname.split('.').pop()}`
              cb(null, req.body.fileName ) 
          }
      })
  }
)

class Article{
  constructor( data ){
    if(typeof data == 'object'){
      if( data.coverPage )
        data.coverPage = Article.urlCoverNormalize( data.coverPage )
      data.title = data.title ? data.title : 'Sin titulo'
      this.data = data
    }
  }

	static create(user, data , _then , _catch ){
		global.db.article_magazine.create( data )
		.then( resultCreate =>{
      FS.renameSync(
        global.folder.magazine(user) + resultCreate.dataValues.coverPage ,
        global.folder.magazine(user) + resultCreate.dataValues.id 
      )
			FS.writeFileSync( `${ folderFilesValidation( global.folder.articles(user) )}${resultCreate.dataValues.id}.html` , '')
      global.events.articles.create( resultCreate )
			_then( resultCreate )
		 } )
		.catch( error => {
      if(_catch) _catch(error)
      throw 'No se logro crear'
    } )
	}

	static update(user, where, data , _then , _catch ){
		if(typeof where != 'object') where = { id:where , user}
		global.db.article_magazine.update( data , { where } )
		.then( _then )
		.catch( error => {
      if(_catch) _catch(error)
      throw 'No se logro actualizar'
    } )
	}

	static updateContent(user, where, data , _then , _catch ){
		if(typeof where != 'object') where = { id:where , user }
		global.db.article_magazine.update( {date:dateForSave()} , { where })
		.then( resultCreate =>{
			FS.writeFileSync(`${global.folder.articles(user)}${resultCreate.dataValues.id}.html` , data)
			_then( resultCreate )
		 } )
		.catch( error => {
      if(_catch) _catch(error)
      throw 'No se logro guardar'
    } )
	}

	static remove(user, where, _then , _catch ){
		if(typeof where != 'object') where = { id:where , user }
		global.db.article_magazine.update( {status:false} , { where } )
		.then( resultCreate =>{
			FS.rename( `${global.folder.articles(user)}${resultCreate.dataValues.id}.html` , `${global.folder.articles(user)}/_${resultCreate.dataValues.id}.html`)
			_then( resultCreate )
		 } )
		.catch( error => {
      if(_catch) _catch(error)
      throw 'No se logro eliminar'
    } )
	}

  static urlCoverNormalize( url ){
    return url.search('refam') == -1 ? '/refam/api/magazine/getCoverOfArticle/?imageName='+url : url
  }
}

class Magazine{
	static create(user, data , _then , _catch ){
		global.db.magazine.create( data )
		.then( resultCreate => {
      FS.renameSync(
        global.folder.magazine(user) + resultCreate.dataValues.coverPage ,
        global.folder.magazine(user) + resultCreate.dataValues.id 
      )
      global.events.magazines.create( resultCreate )
      if(_then) _then(resultCreate)
    } )
		.catch( error => {
      if(_catch) _catch(error)
      throw 'No se logro crear'
    } )
	}

	static update(user, where, data , _then , _catch ){
		if(typeof where != 'object') where = { id:where , user }
		global.db.magazine.update( data , { where })
		.then( _then )
		.catch( error => {
      if(_catch) _catch(error)
      throw 'No se logro actualizar'
    } )
	}

	static remove(user, where, _then , _catch ){
		if(typeof where != 'object') where = { id:where , user }
		global.db.magazine.update( {status:false} , { where })
		.then( _then )
		.catch( error => {
      if(_catch) _catch(error)
      throw 'No se logro eliminar'
    } )
	}

  static articles( id , _then , _catch ){
      global.db.magazine.findOne({where: { id }}).then(magazine => {    
        global.db.article_magazine.findAll({
          order: [ ['page', 'DESC'] ],
          where: { magazineId: id , status:true }
        })
        .then(articlesMagazine => {
            _then({
              result:{
                ...magazine,
                articles: articlesMagazine.map( item => (new Article(item)).data )
              }
            })
          })
          .catch( _catch );
    
      })
      .catch( _catch );
  }
}


module.exports = app => {

  /**
   * MAGAZINES
   */
  
  app.post(
    api('magazine'),
    global.uploadAssets.single('fileid'),
    (req, res) => {
      let user = req.query.token.id
      let file = global.folder.getter( req ) + req.file.filename
      try{
        fileValidation(req.file, res)
        let { title , seo , date } = req.body
        if( !title ) {
          if(FS.existsSync( file )){
            FS.unlinkSync( file )
          }
          throw 'Titulo, categoria no pueden estar vacios'
        }
        Magazine.create(user, {
          title,
          date,
          seo,
          category:'',
          user,
          status: 1,
          coverPage: req.file.filename,
        } , magazine => global.apiResponse(req.query.token, res, {success:{ id:magazine.dataValues.id }}, 201) )
  
      }
      catch( error ){
        if(FS.existsSync( file )){
          FS.unlinkSync( file )
        }
        global.apiResponse(req.query.token, res, {error:error.message}, 500)
      }
    }
  )
  
  app.get(api('magazines') , (req , res ) => {
    global.db.magazine.findAll({where:{user:req.query.token.id}})
    .then( success => global.apiResponse(req.query.token, res, { success }) )
    .catch( error => global.apiResponse(req.query.token, res, { error }) )
  })

  app.get(api('magazine/:id') , (req, res) => {
    Magazine.articles( req.params.id , 
      json => res.json(json) , 
      error => res.json(error)
    )
  })

  /**
   * ARTICLES
   */

  app.post(
    api('article'),
    global.uploadAssets.single('fileid'),
    (req, res) => {
      let file = global.folder.getter( req ) + req.file.filename
      try{
        fileValidation(req.file, res)
        let { magazineId , category , title , page } = req.body
        if( !title || !category || !magazineId ) {
          if(FS.existsSync( file )) FS.unlinkSync( file )
          throw 'Titulo, categoria, revista no pueden estar vacios'
        }
        Article.create({
          title: req.body.title,
          date: dateForSave(),
          category: req.body.category,
          magazineId,
          status: true,
          visite:0,
          user:req.query.token.id,
          htmlFile: '',
          page ,
          coverPage: ''
        } , article => global.apiResponse(req.query.token, res, {success:{ id:article.dataValues.id }}), 201)
  
      }
      catch( error ){
        if(FS.existsSync( file )) FS.unlinkSync( file )
        global.apiResponse(req.query.token, res, {error:error.message}, 500)
      }
    }
  )

  app.get(api('articles') , (req , res ) => {
    global.db.article_magazine.findAll({where:{user:req.query.token.id}})
    .then( success => global.apiResponse(req.query.token, res, { success }) )
    .catch( error => global.apiResponse(req.query.token, res, { error }) )
  })
}