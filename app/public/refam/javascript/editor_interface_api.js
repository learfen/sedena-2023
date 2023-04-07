const fs = require('fs');

function folderList(pathFolder){

    let files = []
	let folders = []
	let itemFolder = fs.readdirSync(__dirname + pathFolder)
	for(let item of itemFolder){
		if(fs.lstatSync(__dirname + pathFolder + item).isFile())
			files.push(item)
		else
			folders.push(item)
	}
    console.log( {files , folders } )
	return {files , folders }
}

let path = "/app/public/magazine/"
let itemsPath = folderList(path)
let fileList = []

if( itemsPath.folders.length > 0)
    for(let magazineId of itemsPath.folders){
        let route = path + magazineId + "/pages/"
	    let { folders } = folderList( route )
        for(let id of folders ){
	        fileList.push({ id , magazineId , html:fs.readFileSync( __dirname + route + id + "/index.html").toString()})
        }
    }

console.log(fileList)


