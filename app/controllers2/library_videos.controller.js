const fileSystem = require('fs')
const db = require("../models");
const LibraryVideo = db.library_video;
const config = require("../config/auth.config");
const constants = require("../util/util.constants");

const Op = db.Sequelize.Op;

exports.uploadVideo = (req, res, next) => {
    const files = req.files
    if (!files) {
        const error = new Error('Debes seleccionar un video')
        error.httpStatusCode = 400
        return next(error)
    }

    const saveVideo = ( files, index )=>{
        LibraryVideo.create({
            name: files[index].filename,
            //name: files[index].originalname,
            size: files[index].size,
            date: files[index].size,
            status: true,
            category: files[index].destination,
            route: files[index].destination
        }).then( ()=>{
            if(index < files.length - 1){
                saveVideo( files, ++index )
            }else{
                res.redirect("/refam/biblioteca")
            }
        })
    }

    saveVideo( files, 0 )
}

exports.getUploadVideoView = (req, res, next) => {
    res.status(200).render("video_library_new");
}


exports.getAllLibraryVideos = (req, res) => {

    LibraryVideo.findAll(/*{
        attributes: {exclude: ['size']},
    }*/)
        .then(libraryVideos => {
            res.status(200).send(
                {
                    "libraryVideos": libraryVideos
                }
            );
        })
        .catch(err => {
            res.status(500).send({message: err.message + ""});
        });
};

exports.getLibraryVideosList = (req, res) => {
    LibraryVideo.findAll()
        .then(libraryVideos => {
            res.status(200).render(
                "gallery",
                {
                    "libraryVideos": libraryVideos
                }
            );
        })
        .catch(err => {
            console.log(err.message);
            res.status(500).send({message: err.message + ""});
        });
};


exports.getPaginationAndData = (req, res) => {
    let resUs = constants.STANDARD_RES_PAGINATION_AND_DATA
    LibraryVideo.count({})
        .then(libraryVideosCount => {
            resUs.totalOfItems = libraryVideosCount
            resUs.numItemsPerPage = constants.ITEMS_PER_PAGE_LIBRARY
            let totalPages = (resUs.totalOfItems / resUs.numItemsPerPage)
            if (totalPages > Math.round(totalPages))
                totalPages += 1
            resUs.totalPages = Math.round(totalPages)
            res.status(200).send(
                resUs
            );

        })
        .catch(err => {
            console.log(err.message);
            res.status(500).send({message: err.message + ""});
        });
};


exports.getPageData = (req, res) => {
    let pag = req.body.reqPageNumber;
    let numPerPag = req.body.numItemsPerPage;

    let resUs = constants.getStandardRes;
    LibraryVideo.findAll({})
        .then(libraryVideos => {

            let pageLibraryVideos = libraryVideos.slice(numPerPag * pag - numPerPag, numPerPag * pag)
            resUs.responseData.numOfItems = pageLibraryVideos.length
            resUs.responseData.isLastPage = numPerPag * pag >= libraryVideos.length;
            resUs.responseData.libraryVideos = pageLibraryVideos

            console.log("resUs.pageLibraryVideos.length = ", (pageLibraryVideos.length))
            console.log("resUs.responseData.LibraryVideos = ", (resUs.responseData.libraryVideos))
            console.log("resUs.responseData = ", (resUs.responseData.libraryVideos).length)
            console.log("resUs.pageLibraryVideos = ", pageLibraryVideos.length)

            res.status(200).send(
                resUs
            );

        })
        .catch(err => {
            console.log(err.message);
            res.status(500).send({message: err.message + ""});
        });
};
/*
exports.getLibraryVideo = (req, res) => {
    let videoName = req.query.videoName
    console.log("\nvideoName", videoName)

    let filePath = __dirname + "/../public/refam/video/" + videoName
    const stat = fileSystem.statSync(filePath);
    // TODO validate VIDEO TYPE // video/webm, video/ogg
    res.writeHead(200, {
        'Content-Type': 'video/mp4',
        'Content-Length': stat.size
    });

    let fileStream = fileSystem.createReadStream(filePath);
    fileStream.pipe(res);

};
*/
const path = require('path')
exports.getLibraryVideo = (req, res) => {
    let videoName = req.query.videoName

    let filePath = __dirname + "/../public/refam/video/" + videoName
    if(!fileSystem.existsSync(filePath)){
        filePath = __dirname + "/../public/refam/video/default.mp4"
    }
    res.sendFile( path.resolve(filePath) )
};

exports.deleteVideo = (req, res) => {
	if(constants.evalAcces( req , res , config , role =>{ return (role == 2 || role == 3) } , "requiere nivel 2 o 3 (Editores/Administradores)"))
		constants.updateStatus(res, LibraryVideo, req.params.id , 0 , "Eliminada")
}

exports.deleteLibraryVideos = (req, res) => {
    let videoIds = req.body.videoIds
    console.log("req.body.videoIds = ", videoIds)

    let resUs = constants.getStandardRes;
    LibraryVideo.destroy(
        {
            where: {
                id: videoIds,
            }
        }
    ).then(libraryVideos => {
        resUs.responseData["libraryVideos"] = libraryVideos
        console.log("req.body.libraryVideos = ", libraryVideos[0])
        res.status(200).send(
            resUs
        );

    })
        .catch(err => {
            console.log(err.message);
            res.status(500).send({message: err.message + ""});
        });
};


exports.libraryVideoManagment = (req, res) => {
    res.status(200).render('gallery_editor');
};

exports.getLibrary2 = (req, res) => {
    LibraryVideo.findAll({
        order: [ ['id', 'DESC'] ],
        where:{ status: 1 }}
        )
        .then(libraryVideos => {
            res.status(200).render("library_videos", { libraryVideos } );
        })
        .catch(err => {
            res.status(500).send({message: err.message + ""});
        });
};


exports.getLibrary = (req, res) => {
    let all = {where:{status:1}}
    let search = {
        where: {
            [Op.or]: {
                enrollment: {
                    [Op.like]: '%' + req.query.q + '%'
                },
                email: {
                    [Op.like]: '%' + req.query.q + '%'
                }
            }
        },
        attributes: {exclude: ['password']}
    }
    let query = req.query.q == undefined ? all : search
    LibraryVideo.findAll(query)
        .then( videos => {        
            let size =  videos.length 
            let cantPerPage = 100
            let last = size / cantPerPage
            if(last >= 1){
                last = last > parseInt(last) ? parseInt(last) + 1 : parseInt(last)
            }else{
                last = 0
            } 
            let pagination = constants.page(req)
            for(let video of videos){
                video.name = video.magazine != '' ? video.magazine+'/'+video.name : video.name 
            }
            res.status(200).render(
                'library_videos',
                {
                    videos:constants.evalPage(
                        pagination, 
                        videos.sort(constants.orderDesc),
                        cantPerPage // cant per page 
                    ),
                    page:pagination.page,
                    next:pagination.next,
                    prev:pagination.prev,
                    size,
                    last,
                    paginationText:`${(+pagination.page + 1)} de ${(last + 1)}`
                });

        })
        .catch(err => {
            out(err.message);
            res.status(500).send({message: err.message + ""});
        });
};