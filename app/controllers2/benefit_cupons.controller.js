const fileSystem = require('fs')
const db = require("../models");
const BenefitCupon = db.benefit_cupon;
const Op = db.Sequelize.Op;

const multer = require('multer');
const constants = require("../util/util.constants");

var upload = multer({dest: 'uploads/'})


exports.cpUpload = upload.fields([{name: 'avatar', maxCount: 1}, {name: 'gallery', maxCount: 8}])

exports.uploadCupon = (req, res, next) => {
    const files = req.files
    if (!files || !files[0] || !files[1] || files.length > 2) {
        const error = new Error('Debes seleccionar una imagen para el cupon')
        error.httpStatusCode = 400
        return next(error)
    }

    let cuponImage = files[0] // cuponImage
    let iconImage = files[1] // cuponIcon

    BenefitCupon.create({
        description: req.body.description,
        enterprise: cuponImage.filename,
        status: 1,
        startDate: "",
        endDate: "",
        cuponImage: cuponImage.filename,
        iconImage: iconImage.filename
    })
    //res.send(files)
    res.redirect("/refam/beneficios")
}


exports.getAllCupons = (req, res) => {
    BenefitCupon.findAll({where:{status:true}})
        .then(benefitCupons => {
            res.status(200).send(
                {
                    "benefitCupons": benefitCupons
                }
            );
        })
        .catch(err => {
            console.log(err.message);
            res.status(500).send({message: err.message + ""});
        });
};



exports.getCuponImage = (req, res) => {
    let cuponName = req.query.cuponName
    let filePath = __dirname + "/../../uploads/cupons/" + cuponName
    const stat = fileSystem.statSync(filePath);

    res.writeHead(200, {
        'Content-Type': 'image/jpeg',
        'Content-Length': stat.size
    });

    let fileStream = fileSystem.createReadStream(filePath);
    fileStream.pipe(res);

};


exports.getPaginationAndData = (req, res) => {
    let resUs = constants.getStandarPaginationRes
    BenefitCupon.count({where:{status:true}})
        .then(cuponsCount => {
            resUs.totalOfItems = cuponsCount
            resUs.numItemsPerPage = constants.ITEMS_PER_PAGE_CUPONS
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
    let numPerpag = req.body.numItemsPerPage;

    let resUs = constants.getStandardRes;
    BenefitCupon.findAll({where:{status:true}})
        .then(cupons => {
            let pageUsers = cupons.slice(numPerpag * pag - numPerpag, numPerpag * pag)
            resUs.responseData.isLastPage = numPerpag * pag >= cupons.length;
            resUs.responseData.numOfItems = pageUsers.length
            resUs.responseData["cupons"] = pageUsers

            res.status(200).send(
                resUs
            );

        })
        .catch(err => {
            console.log(err.message);
            res.status(500).send({message: err.message + ""});
        });
};

exports.deleteBenfitCupons = (req, res) => {
    req.body.cuponIds
    let resUs = constants.getStandardRes;
    BenefitCupon.destroy(
        {
            where: {
                id: req.body.cuponIds,
            }
        }
    ).then(benefitCupons => {
        resUs.responseData["benefitCupons"] = benefitCupons
        res.status(200).send(
            resUs
        );

    })
        .catch(err => {
            console.log(err.message);
            res.status(500).send({message: err.message + ""});
        });
};


exports.cuponManagment = (req, res) => {
    res.status(200).render('newbenefit');
};

exports.cuponList2 = (req, res) => {
    BenefitCupon.findAll({where:{status:1}})
        .then(benefitCupons => {
            res.status(200).render(
                'newbenefitlist',
                {
                    "benefitCupons": benefitCupons
                }
            );
        })
        .catch(err => {
            console.log(err.message);
            res.status(500).send({message: err.message + ""});
        });
};


exports.cuponList = (req, res) => {
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
        }
    }
    let query = req.query.q == undefined ? all : search
    BenefitCupon.findAll(query)
        .then( benefitCupons => {        
            let size =  benefitCupons.length 
            let cantPerPage = 100
            let last = size / cantPerPage
            if(last >= 1){
                last = last > parseInt(last) ? parseInt(last) + 1 : parseInt(last)
            }else{
                last = 0
            } 
            let pagination = constants.page(req)
            
            res.status(200).render(
                'newbenefitlist',
                {
                    benefitCupons:constants.evalPage(
                        pagination, 
                        benefitCupons.sort(constants.orderDesc),
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

exports.cuponDelete = ( req, res ) => {
    constants.updateStatus(res, BenefitCupon, req.params.id , 0 , "Eliminado")
}