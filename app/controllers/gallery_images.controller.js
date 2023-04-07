const fileSystem = require("fs");
const db = require("../models");
const GalleryImage = db.gallery_image;

const constants = require("../util/util.constants");
const jwt = require("jsonwebtoken");
const config = require("../config/auth.config");
const path = require("path");

const Op = db.Sequelize.Op;

const moduleExplorer = require(__dirname + "/../domain/explorer/index");

for (let key in moduleExplorer) {
	exports[key] = moduleExplorer[key];
}

exports.uploadImage = (req, res, next) => {
	const files = req.files;
	if (!files) {
		const error = new Error("Debes seleccionar una imagen");
		error.httpStatusCode = 400;
		return next(error);
	}

	files.forEach((imageFile, key) => {
		GalleryImage.create({
			name: imageFile.filename,
			//name: imageFile.originalname,
			size: imageFile.size,
			date: imageFile.size,
			status: true,
			category: imageFile.destination,
			route: imageFile.destination,
			magazine: 0,
		});
	});

	//res.send(files)
	res.redirect("/refam/galeria");
	//res.send({message: "Usuario registrado correctamente", status: 0});
};

/*[
    {
        "fieldname": "myFiles",
        "originalname": "img.png",
        "encoding": "7bit",
        "mimetype": "image/png",
        "destination": "..........",
        "filename": "myFiles-1596597904104.png",
        "path": "........../myFiles-1596597904104.png",
        "size": 343025
    }
]*/

/*   // Save User to Database
   GalleryImage.create({
       name: req.body.name,
       size: req.body.size,
       date: req.body.date,
       status: req.body.status,
       category: req.body.category,
       route: req.body.route
   })
       .then(image => {
           res.send({message: "Usuario registrado correctamente", status: 0});
       })
       .catch(err => {
           res.json({message: err.message, status: 1});
       });
};*/

exports.getAllGalleryImages = (req, res) => {
	GalleryImage.findAll(
		{
			where: { status: 1 },
		} /*{
        attributes: {exclude: ['size']},
    }*/
	)
		.then((galleryImages) => {
			res.status(200).send({
				galleryImages: galleryImages.filter((item) => item.status > 0),
			});
		})
		.catch((err) => {
			res.json({ message: err.message + "" });
		});
};

exports.getGalleryList = (req, res) => {
	GalleryImage.findAll({
		where: {
			status: 1 /*,magazine:'0' galeria ignorar imagenes de revistas */,
		},
	})
		.then((images) => {
			let galleryImages = [];
			for (let img of images) {
				img.name =
					img.magazine != ""
						? img.magazine + "/" + img.name
						: img.name;
				if (img.status > 0) {
					galleryImages.push(img);
				}
			}
			res.status(200).render("gallery", { galleryImages });
		})
		.catch((err) => {
			console.log(err.message);
			res.json({ message: err.message + "" });
		});
};

exports.getPaginationAndData = (req, res) => {
	let resUs = constants.STANDARD_RES_PAGINATION_AND_DATA;
	GalleryImage.count({})
		.then((galleryImagesCount) => {
			resUs.totalOfItems = galleryImagesCount;
			resUs.numItemsPerPage = constants.ITEMS_PER_PAGE_GALLERY;
			let totalPages = resUs.totalOfItems / resUs.numItemsPerPage;
			if (totalPages > Math.round(totalPages)) totalPages += 1;
			resUs.totalPages = Math.round(totalPages);
			res.status(200).send(resUs);
		})
		.catch((err) => {
			console.log(err.message);
			res.json({ message: err.message + "" });
		});
};

exports.getPageData = (req, res) => {
	let pag = req.body.reqPageNumber;
	let numPerPag = req.body.numItemsPerPage;

	let resUs = constants.getStandardRes;
	GalleryImage.findAll({ status: 1 })
		.then((galleryImages) => {
			let pageGalleryImages = galleryImages.slice(
				numPerPag * pag - numPerPag,
				numPerPag * pag
			);
			resUs.responseData.numOfItems = pageGalleryImages.length;
			resUs.responseData.isLastPage =
				numPerPag * pag >= galleryImages.length;
			resUs.responseData.galleryImages = pageGalleryImages;
			res.status(200).send(resUs);
		})
		.catch((err) => {
			console.log(err.message);
			res.json({ message: err.message + "" });
		});
};

exports.getGalleryImage = (req, res) => {
	let imageName = req.query.imageName;

	let filePathGallery = __dirname + "/../../uploads/gallery/" + imageName;
	let filePath = __dirname + "/../public/refam/images/default.png";
	console.log({filePathGallery})
	if (fileSystem.existsSync(filePathGallery)) {
		res.sendFile(path.resolve(filePathGallery));
	} else {
		GalleryImage.findOne({ where: { name: {[Op.endsWith]:imageName} } })
			.then( async (result) => {
			    console.log({imageName},{result})
				if (result != null) {
					let magazineId = result.dataValues.magazine;
					filePathMagazine = `${__dirname}/../../uploads/gallery/${magazineId}/${imageName}`;
					console.log({filePathMagazine})
					if (fileSystem.existsSync(filePathMagazine))
						res.sendFile(path.resolve(filePathMagazine));
					else {
                        async function readAllFiles(path, arrayOfFiles = []){
                        	const files = fileSystem.readdirSync(path)
                        	files.forEach(file => {
                        		const stat = fileSystem.statSync(`${path}/${file}`)
                        		if(stat.isDirectory()){
                        			readAllFiles(`${path}/${file}`, arrayOfFiles)
                        		}else{
                        			arrayOfFiles.push(`${path}/${file}`)
                        		}
                        	}
                        	)
                        	return arrayOfFiles.map( item => item.split('/').pop())
                        }
                        let files = (await readAllFiles(`${__dirname}/../../uploads/gallery/`))
                        files = files.filter( item =>  item.search(imageName) > -1 )
                        console.log({files})
    					if ( files.length ){
    					    filePathMagazine = `${__dirname}/../../uploads/gallery/${files[0]}`;
    						return res.sendFile(path.resolve(filePathMagazine));
    					}
					    res.sendFile(path.resolve(filePath));
					}
				}
			})
			.catch();
	}
};

exports.deleteImage = (req, res) => {
	if (req.query['name'] != undefined) {
		if (
			constants.evalAcces(
				req,
				config,
				(role) => {
					return role == 1 || role == 3;
				},
				"requiere nivel 1 (Editores/Administradores)"
			)
		){
			locals.emit("media.image.removed", {
				where: {name:req.query.name},
				data: { status: 0 },
				result:'Media eliminado',
                res
            });
        }
	} else {
		if (
			constants.evalAcces(
				req,
				config,
				(role) => {
					return role == 2 || role == 3;
				},
				"requiere nivel 2 o 3 (Editores/Administradores)"
			)
		) {
			constants.updateStatus(
				res,
				GalleryImage,
				req.params.id,
				0,
				"Eliminada"
			);
		}
	}
};

exports.deleteGalleryImages = (req, res) => {
	let resUs = constants.getStandardRes;
	GalleryImage.destroy({
		where: {
			id: req.body.imageIds,
		},
	})
		.then((galleryImages) => {
			resUs.responseData["galleryImages"] = galleryImages;
			res.status(200).send(resUs);
		})
		.catch((err) => {
			console.log(err.message);
			res.json({ message: err.message + "" });
		});
};

exports.galleryManagment = (req, res) => {
	res.status(200).render("gallery_editor");
};
