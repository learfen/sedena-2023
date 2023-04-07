

    document.querySelector("#articlePost").addEventListener("click" , function(){
        $("#myModal").modal()
    })

    function deletedArticle( e ){
        axios.delete(apiURl+"magazine/article/"+e.target.parentNode.getAttribute("itemid") +'?token='+token(),
        { headers: { 'Authorization': localStorage.getItem("token") } }
        ).then( res => {
            if(res.data.error){
                alertWarning(res.data.error)
            }else{
                e.target.parentNode.remove()
                alertSuccess( res.data.result )
            }
        }).catch(function (error) {
            alertWarning("INTENTE EN OTRO MOMENTO O COMUNIQUESE CON EL DESARROLLADOR\n" + error)
        })
	}
	
    function createArticleReq(){
        let error = false
        let title = $('#articleTitle').val()
        let category = $('#articleCat').val()

        if($('#imgArticle')[0].files.length == 0){
            error = true
            alertWarning("Seleccione una imagen 1")
        }
        if(title == "" || category == ""){
            error = true
            alertWarning("Titulo y categoria son necesarias")
        }
        if(error == false){
            let formData = new FormData()
            formData.append("fileid", $('#imgArticle')[0].files[0] )
            formData.append('title', title );
            formData.append('category', category );
            formData.append('html' , localStorage.getItem('gjs-html'))

            axios.post(apiURl+"article/push/<%= id %>"+'?token='+token(),
            formData,
            { headers: {'Content-Type': 'multipart/form-data', 'Authorization': localStorage.getItem("token") } }
            )
            .then(res => {
                if(res.data.error != undefined){
                    alertWarning(res.data.error)
                }else{
                    alertSuccess(res.data.result)
                    location.href = "/refam/editor/<%= id %>/"+res.data.articleId
                }
            })
            .catch(res => console.log(res))
        }
    }



	// codigo previo 

    function articlePost2() {

		const heading = '<!DOCTYPE html><html lang="en" dir="ltr"><head><link rel="stylesheet" type="text/css" href="/css/style.css"/><\/head> <body>';
		const footer = '<\/body><\/html>';
        console.log("article")

        let magazineId = "<%= id %>";
        let htmlContent = heading + localStorage.getItem('gjs-html') + footer;

        console.log("val setted article=", magazineId)

        let formData = new FormData()
        var d = $('#imgArticle')[0].files[0]

        let category = $('#articleCat').val()

        console.log("d", d)
        formData.append('fileid', d);
        formData.append('category', category);
        formData.append('htmlContent', htmlContent);
        formData.append('magazineId', magazineId);


        $.ajax(
            apiURl + "magazine/postAddHtmlArticle", {
                enctype: 'multipart/form-data',
                headers: {'x-access-token': localStorage.getItem('token') ? localStorage.getItem('token') : ''},
                'contentType': false,
                'data': formData,
                'type': 'POST',
                'processData': false,
                success: function (response) {
                    console.log(response);
                    localStorage.setItem('gjs-html', response);
                    resetFormById("newArticleForm")

                },
                error: function (data) {
                    alertWarning("Ha ocurrido un error: " + data.message)
                }
        });

        axios.post(apiURl+"article/push/<%= id %>"+'?token='+token(),
            {},
            { headers: { 'Authorization': localStorage.getItem("token") } }
        )
        .then(res => {
            if(res.data.error != undefined){
                alertWarning(res.data.error)
            }else{
                alertSuccess(res.data.result)
                location.href = "/refam/editor/<%= id %>/"+res.data.articleId
            }
        })
        .catch(res => console.log(res))

    }