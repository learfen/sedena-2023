const db = require("../models");
const ROLES = db.ROLES;
const User = db.user;

checkDuplicateEnrollmentOrEmail = (req, res, next) => {

    User.findOne({
        where: {
            enrollment: req.body.enrollment
        }
    }).then(user => {
        if (user) {
            res.status(400).send({
                message: "Error, la matrícula ya está en uso"
            });
            return;
        }

        // Email
        User.findOne({
            where: {
                email: req.body.email
            }
        }).then(user => {
            if (user) {
                res.status(400).send({
                    message: "Error, el email ya está en uso"
                });
                return;
            }

            next();
        });
    });
};

checkRolesExisted = (req, res, next) => {
    if (req.body.roles) {
        for (let i = 0; i < req.body.roles.length; i++) {
            if (!ROLES.includes(req.body.roles[i])) {
                res.status(400).send({
                    message: "Falló! El rol no existe  = " + req.body.roles[i]
                });
                return;
            }
        }
    }

    next();
};

const verifySignUp = {
    checkDuplicateUsernameOrEmail: checkDuplicateEnrollmentOrEmail,
    checkRolesExisted: checkRolesExisted
};

module.exports = verifySignUp;
