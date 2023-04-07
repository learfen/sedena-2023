const { existsSync , mkdirSync , readFileSync , writeFileSync } = require('fs')

module.exports = class Log{
    constructor(file){
        this.file = file + '.html'
    }
    filePath(){
        let now = (new Date).toISOString().slice(0 , 13)
        return `${this.folderPath( now )}${this.file}` 
    }
    folderPath(){
        let now = (new Date).toISOString().slice(0 , 13)
        return `${__dirname}/logs/${now}/` 
    }
    read(){
        if( existsSync( this.folderPath() ) ){
            if( existsSync( this.filePath() ) ) return readFileSync(this.filePath()).toString()
            return ""
        }
        mkdirSync( this.folderPath() )
        return ""
    }
    write( data ){
        writeFileSync(this.filePath(), this.read() + `<div><b>${(new Date).toISOString()}</b><p>${typeof data == 'string' ? data : JSON.stringify( data )}</p></div>
`)
    }
}