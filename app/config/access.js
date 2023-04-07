const auth = require(__dirname + "/../config/auth.config.js")
const media = require(__dirname + "/../configCustom/media.json")
const access = require(__dirname + "/../configCustom/access.json")

const config = { auth , media , access }

function navAccess( url ){
	let value = null
	let entityName = null
	let result = access
	let urlArray = url.split('.')
	for(let itemUrl of urlArray){
		result = result[itemUrl]
		entityName = entityName == null ? itemUrl : entityName
	}
	return { entityName , value , roles:access.list }
}

function isValidAccess( url , role ){
	let  accessData = navAccess( url )
	if( accessData.value == null) return false
	return ( accessData.value.indexOf(role) > -1 ) 
}

module.exports = {
	navAccess,
	isValidAccess,
    async test( req, res , configEntity , evalAccess , msg){

		const jwt = require('jsonwebtoken')
		let token = req.query['token'] == undefined ? req.headers.authorization : req.query.token
        return await jwt.verify( token, config.auth.secret, (err, decoded) => {
            if(err){
				if(typeof res.json == 'function')
	                res.json({error: err.message + ""});
            }else{
				configEntity = typeof configEntity != "string" ? configEntity : config[configEntity]
				role = decoded.role
				let result = null
				result = typeof evalAccess == "function" ? result = evalAccess( role ) : isValidAccess(evalAccess , role )
				if ( result == true) {
					return true
				}
				
            }
			return false
        })
    }
}