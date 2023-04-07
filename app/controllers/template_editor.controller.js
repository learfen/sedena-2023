const ejsLint = require('ejs-lint');

/*
exports.getTemplateEditor = (req, res) => {
    ejsLint('template_editor', {})
    res.status(200).render('template_editor',{
        "articleId":"0",
        "id": "0",
    });
};*/
const fs = require('fs')
exports.getTemplateEditor = (req, res) => {
    res.send(fs.readFileSync(__dirname + '/../public/refam/editor.html').toString());
};

exports.getTemplateEditorId = (req, res) => {
    ejsLint('template_editor', {})
    res.status(200).render('template_editor',{
        "articleId":"0",
        "id": req.params.id,
    });
};

exports.getTemplateEditorIdArticle = (req, res) => {
    ejsLint('template_editor', {})
    res.status(200).render('template_editor',{
        "articleId":req.params.article,
        "id": req.params.id,
    });
};
