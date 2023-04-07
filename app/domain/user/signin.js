const db = require(__dirname + "/../../models");
const jwt = require("jsonwebtoken");
const constants = require(__dirname + '/../../util/util.constants');
const config = require(__dirname + "/../../config/auth.config");
const bcrypt = require("bcryptjs");

const userTokenCreate = () => {

	let authorities = [];
	const token = jwt.sign({id: user.id , role: user.role}, config.secret );
	const userOriginal = user
	user.getRoles().then(roles => {
		for (let i = 0; i < roles.length; i++) {
			authorities.push("ROLE_" + roles[i].name.toUpperCase());
		}
		User.update(
			{ tokenFirebase: req.body.tokenFirebase }, 
			{ where: { enrollment: req.body.enrollment } }
		).then(user => {

			res.status(200).send({
				id: userOriginal.id,
				enrollment: userOriginal.enrollment,
				email: userOriginal.email,
				roles: authorities,
				accessToken: token
			});

		}).catch(err => {
			res.status(500).send({message: err.message + ""});
		});
	});
}

module.exports = (req, res) => {
    if( req.body.password && req.body.password != '' && req.body.enrollment && req.body.enrollment != '' && req.body.tokenFirebase ){

        db.user.findOne({
            where: {
                enrollment: req.body.enrollment
            }
        })
        .then(user => {
                if (!user) {
                    res.status(404).send({message: "Usuario no encontrado."});
                }else{

                    if (+user.status < 1) {
                        res.send({
                            accessToken: null,
                            message: "Usuario no activado",
                            errorCode: constants.USER_NOT_ACTIVATED_ERROR_CODE
                        });
                    }else{

                        const passwordIsValid = bcrypt.compareSync(
                            req.body.password,
                            user.dataValues.password
                        );

                        if (!passwordIsValid) {
                            res.status(401).send({
                                accessToken: null,
                                message: "Password Invalida !"
                            });
                        }else{
                            db.user.update(
                                { tokenFirebase:null }, 
                                { where: { tokenFirebase: req.body.tokenFirebase } }
                            ).then(userIgnore => {
                                const token = jwt.sign({id: user.id , role: user.role}, config.secret );
                                const userOriginal = user
                                db.user.update(
                                    { tokenFirebase: req.body.tokenFirebase }, 
                                    { where: { enrollment: req.body.enrollment } }
                                ).then(user => {
                                    res.status(200).send({
                                        id: userOriginal.id,
                                        enrollment: userOriginal.enrollment,
                                        email: userOriginal.email,
                                        accessToken: token
                                    });

                                }).catch(err => {
                                    res.json({message: err.message + ""});
                                });
                            }).catch(err => {
                                res.json({message: err.message + ""});
                            });
                        }
                    }
                }

        })
        .catch(err => {
            res.json({message: err.message});
        });
    }else{
        res.json({message:'Requerid enrollment, tokenFirebase , password'})
    }
};