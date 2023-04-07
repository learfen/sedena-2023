
module.exports = app =>{
    app.get('/usuarios/buscarBorrados/:enrollment' , (req , res) => {
        const db = require(__dirname + "/app/models")
        db.user.findOne({where:{enrollment:req.params.enrollment}})

        .then ( result => {
            if(result) res.json(result.dataValues)
            else res.json({message:'No encontrado'})
        })
        .catch ( error => res.json(error))
    })

    app.get('/usuarios/restablecerCuenta/:enrollment' , (req , res) => {
        const db = require(__dirname + "/app/models")
        db.user.update({status:1},{where:{enrollment:req.params.enrollment}})
        .then ( result => res.json({message:'La cuenta fue restablecida',result}))
        .catch ( error => res.json(error))
    })
}