const pushMedia = require(__dirname + '/pushMedia')
exports.spliceExplorer = (req, res) => {
    pushMedia({query:{ id:req.body.id } } , res)
}
