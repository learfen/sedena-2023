'use strict';

const PATH = require('path');
//const ABSPATH = path.dirname(process.mainModule.filename);
const gm = require('gm').subClass({imageMagick: true});
const FS = require('fs');

const exists = (path) => {
    try {
        return FS.statSync(path).isFile();
    } catch (e) {
        return false;
    }
};

const getFileExtension = (filename) => {
    return filename.slice((filename.lastIndexOf('.') - 1 >>> 0) + 2);
};

class Media {
    constructor(path) {
        this.src = path;
    }

    isValidMedia(src) {
        return /\.(jpe?g|png)$/.test(src);
    }

    isValidBaseDir(src) {
        return /^A-Za-z0-9\-\_\./.test(src);
    }

    thumb(request, response) {
        //let image = ABSPATH +  this.src;
        let dirs = {
            public:__dirname + '/../../public/refam/images/',
            gallery:__dirname + '/../../../uploads/gallery/',
        }
        let image = PATH.resolve( dirs[request.query.dir] + this.src);
        if(request.query['original'] != undefined)
            response.sendFile( image ) 
        else{
            let ext = this.src.split('.').pop()
            let thumb = ext == 'gif' ?  image : image.replace('/gallery/','/gallery/thumb_')
            let image404 = PATH.resolve(__dirname + '/../../public/refam/404.png')
            if(FS.existsSync( thumb )) response.sendFile( thumb )
            else{
                //  this.isValidBaseDir(this.src) &&
                if( exists(image) && this.isValidMedia(this.src))
                    gm(image)
                        .resize(300)
                        .write(thumb, err => {
                            if(err) {
                                console.log(err)
                                response.sendFile( image404 )
                            }
                            else response.sendFile( thumb )
                        });
                else response.sendFile( image404 ) 
            }
        }
    }
}

module.exports = Media;
