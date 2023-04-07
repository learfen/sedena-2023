const magazineBackBtn = document.querySelector('#magazineBackBtn')
const articles = document.querySelector('#articles')
				
function orderByPage(o1,o2) {
	let page_obj1 = o1.hasOwnProperty('page') ? o1.page : o1.children[2].getAttribute('page')
	let page_obj2 = o2.hasOwnProperty('page') ? o2.page : o2.children[2].getAttribute('page')
	if (page_obj1 > page_obj2) { //comparación lexicogŕafica
	  return 1;
	} else if (page_obj1 < page_obj2) {
	  return -1;
	} 
	return 0;
}

function createItemPanel(item , type){
	let itemHtml = document.createElement("div")
	let btn = document.createElement(type == 'magazine' ? 'div' : 'a')
	while(item["coverPage"].search(" ") > -1){
		item["coverPage"] = item["coverPage"].replace(" ","%20")
	}
	btn.setAttribute('itemid' , item.id)
	btn.setAttribute('href' , '/refam/editor.html?editor=true&'+type+'='+item.id)
	btn.className = "itemTarget"
	btn.style = `background-image:url(${item["coverPage"]});min-width:120px; min-height:180px;background-repeat: no-repeat;background-size: 160px 230px;background-position: center;`
	
	let btnEliminar = document.createElement("span")
	btnEliminar.innerHTML = "x"
	btnEliminar.setAttribute('itemid' , item.id)
	itemHtml.appendChild(btnEliminar)
	itemHtml.className = "itemTarget"
	
	let inputName = document.createElement("div")
	inputName.innerText = item.title.replace("_"," ")
	inputName.setAttribute('itemid' , item.id)
	inputName.setAttribute('contenteditable' , true)
	inputName.onfocus = e => {
		e.target.setAttribute('html-state',e.target.innerText)
	} 
	inputName.onblur = e => {
		if( e.target.getAttribute('html-state') != e.target.innerText){
			e.target.onchange( e )
		}
	}
	itemHtml.appendChild(btn)
	
	if(type != undefined){
		if(type == 'magazine'){
			inputName.onchange = e =>{
				if(e.target.innerText == ""){
					alertWarning("No puede estar vacio")
					e.preventDefault()
					return
				}
				axios.post('/refam/editor/magazine/update/'+e.target.getAttribute('itemid')+'/title/'+e.target.innerText)
					.then( res => alertSuccess(res.data.result) )
					.catch( res => alertWarning("No se pudo guardar"))
			}
			btnEliminar.onclick = e => {
				if(confirm("¿Seguro que desea borrar?") === true){
					axios.delete("/refam/api/magazine/"+e.target.getAttribute('itemid'))
					.then( res => {
						if(res.data.error){ alertWarning(res.data.error )}
						else{ alertSuccess(res.data.result ); e.target.parentNode.remove() }
					})
				}
			}
			btn.onclick = e => {
				if(proccessActived() == 'move'){
					axios.post('/refam/editor/article/update/'+urlParamsGet().article+"/magazineId/"+e.target.getAttribute('itemid'))
					.then( res => alertSuccess("Movido") )
					.catch( res => alertWarning("No se pudo mover"))
					proccessActived("")
					modalClose()
				}else{
					magazineOpen( e.target.getAttribute('itemid') )
				}
			}
		}
		if(type == 'article'){
			// add magazine to url
			btn.setAttribute('href' , btn.getAttribute('href')+"&magazine="+magazineStore().magazine.id)
			inputName.onchange = e =>{
				if(e.target.innerText == ""){
					alertWarning("No puede estar vacio")
					e.preventDefault()
					return
				}
				axios.post('/refam/editor/article/update/'+e.target.getAttribute('itemid')+'/title/'+e.target.innerText)
					.then( res => alertSuccess(res.data.result) )
					.catch( res => alertWarning("No se pudo guardar"))
			}
			
			let inputPage = document.createElement("input")
			inputPage.type = "number"
			inputPage.setAttribute('itemid' , item.id)
			inputPage.className = "article-page"
			inputPage.value = item.page == null ? 0 : item.page
			inputPage.onchange = e =>{
				if(e.target.value < 0 ){
					alertWarning("Solo numeros positivos")
					e.preventDefault()
					return
				}
				let store = magazineStore()
				let id = e.target.getAttribute('itemid')
				axios.post(`/refam/editor/article/update/${id}/page/${e.target.value}`)
				.then( res => {
					alertSuccess("Actualizado")
					let pages = []
					for(let article of store.articles){
						article.page = article.page == null ? 0 : article.page
						if(article.id == id){
							article.page = e.target.value 
						}
						if( pages.indexOf(article.page) > -1 ){
							alertWarning( "Hay paginas repetidas " + article.page )
						}
						pages.push( article.page )
					}
					magazineRenderArticles( magazineStore( store ).articles )
				})
				.catch( res => {
					alertWarning("Hubo un error al intentar actualizar")
				})
			}
			itemHtml.appendChild(inputPage)

			btnEliminar.onclick = e => {
				if(confirm("¿Seguro que desea borrar?") === true){
					axios.delete("/refam/api/magazine/article/"+e.target.getAttribute('itemid'))
					.then( res => {
						if(res.data.error){ alertWarning(res.data.error )}
						else{ alertSuccess(res.data.result ); e.target.parentNode.remove() }
					})
				}
			}
			
		}
	}
	itemHtml.appendChild(inputName)
	return itemHtml
}

function createItemPanelCover(item){
	let itemHtml = document.createElement("div")
	let btn = document.createElement("div")
		while(item["coverPage"].search(" ") > -1){
			item["coverPage"] = item["coverPage"].replace(" ","%20")
		}
		btn.className = "itemTarget"
		btn.style = `background-image:url(${item["coverPage"]})`
	let btnEliminar = document.createElement("span")
	btnEliminar.innerHTML = "x"
	itemHtml.appendChild(btnEliminar)
	itemHtml.appendChild(btn)
	itemHtml.className = "itemTarget"
	return itemHtml
}


function magazineNotTarget(){ /*
	document.querySelector(".gjs-pn-panels").children[0].style.display = "none"
	document.querySelector(".gjs-pn-panels").children[2].style.display = "none"
	document.querySelector(".gjs-pn-panels").children[3].style.display = "none"
	document.querySelector(".gjs-pn-panels").children[4].style.display = "none"

	document.querySelector("#gjs-pn-options").children[0].children[1].style.display = "none"
	document.querySelector("#gjs-pn-options").children[0].children[4].style.display = "none"
	document.querySelector("#gjs-pn-options").children[0].children[5].style.display = "none"
	*/
}


function magazineTarget(){
	/*
	document.querySelector(".gjs-pn-panels").children[0].style.display = "block"
	document.querySelector(".gjs-pn-panels").children[2].style.display = "block"
	document.querySelector(".gjs-pn-panels").children[3].style.display = "block"
	document.querySelector(".gjs-pn-panels").children[4].style.display = "block"

	document.querySelector("#gjs-pn-options").children[0].children[1].style.display = "block"
	document.querySelector("#gjs-pn-options").children[0].children[4].style.display = "block"
	document.querySelector("#gjs-pn-options").children[0].children[5].style.display = "block"
	*/
}

function magazineRenderArticles(articlesItems){
	articles.innerHTML = ""
	articlesItems = Array.from( articlesItems ).sort(orderByPage)
	articlesItems.forEach( article => {
		articles.appendChild( createItemPanel( article , 'article') )
	})
}

function magazineUpdateAction(e) {
	let id = magazineBackBtn.getAttribute('magazine')
	let key = e.target.getAttribute('id').replace('magazineUpdate','').toLowerCase()
	let v = key == 'date' ? (new Date(e.target.value)).toISOString() : e.target.value
	console.log( `/refam/editor/magazine/update/${id}/${key}/${v}` )
	axios.post(`/refam/editor/magazine/update/${id}/${key}/${v}`)
	.then( res => {
		if(res.data.error != undefined){
			alertWarning(res.data.error)
		}else{
			alertSuccess(res.data.result)
		}
	})
}

function magazineOpen( id ){
	axios.get("/refam/api/magazine/getArticlesFromMagazine/"+id)
	.then( res => {
		magazineBackBtn.setAttribute('magazine' , id)
		document.querySelector("#article-new-btn-post").setAttribute('magazine' , id)
		document.querySelector("#magazineStateEdited").setAttribute('magazine' , id)
		document.querySelector("#magazineStatePosted").setAttribute('magazine' , id)
		
		if(res.data.error != undefined){
			alertWarning(res.data.error)
		}else{

			document.querySelector('#magazineUpdateTitle').value = res.data.result.magazine.title
			document.querySelector('#magazineUpdateDate').value = res.data.result.magazine.date

			document.querySelector('#magazineUpdateTitle').onchange = magazineUpdateAction
			document.querySelector('#magazineUpdateDate').onchange = magazineUpdateAction

			magazineStore( res.data.result )
			magazineRenderArticles( magazineStore().articles )
			modalOpen('long','REVISTA ABIERTA', '#magazine-container')
		}
	})
}

document.querySelector('#magazineNewArticle').onclick = () =>{
	modalOpen('long','CREAR ARTICULO', '#article-new')
}

document.querySelector("#article-new-btn-post").onclick = e => {
		e.preventDefault()

		let magazineId = e.target.getAttribute('magazine');
		//let htmlContent = heading + localStorage.getItem('gjs-html') + footer;
		let htmlContent = "<h3>Soy un nuevo articulo</h3>"
		let formData = new FormData()
		var d = $('#imgArticle')[0].files[0]

		let category = $('#articleCat').val()
		let title = $('#articleTitle').val()

		formData.append('fileid', d);
		formData.append('category', category);
		formData.append('date', (new Date).getUTCDate());
		formData.append('title', title);
		formData.append('htmlContent', htmlContent);
		formData.append('magazineId', magazineId);


		$.ajax("/refam/api/magazine/postAddHtmlArticle", {
				enctype: 'multipart/form-data',
				headers: {'x-access-token': localStorage.getItem('token') ? localStorage.getItem('token') : ''},
				'contentType': false,
				'data': formData,
				'type': 'POST',
				'processData': false,
				success: function (response) {
					editor.DomComponents.clear()
					$('.current-article').html(` Creado con exito`);
					alertSuccess("Pagina/Articulo creado")
					setTimeout( ()=> {
						location.href = "/refam/editor.html?article="+response.articleId
					}, 1500)
					apiClone("articleSave" , htmlContent )
					
				},
				error: function (data) {
					alertWarning("Ha ocurrido un error: " + data.message)
				}
			});

}

document.querySelector("#magazine-new-btn-post").onclick = e => {
	e.preventDefault()
	
	let formData = new FormData()
	var d = $('#imgInp')[0].files[0]

	let title = $('#magazineTitle').val()
	let date = $('#magazineDate').val()
	let category = $('#magazineCat').val()
	let status = 1

	$('#magazineTitle').val('')
	$('#magazineDate').val('')
	$('#magazineCat').val('')
	$('#imgInp')[0].files = null

	formData.append('fileid', d);
	formData.append('title', title);
	formData.append('date', date);
	formData.append('category', category);
	formData.append('status', status);

	$.ajax(
		"/refam/api/magazine/postCreateMagazine", {
			enctype: 'multipart/form-data',
			headers: {'x-access-token': localStorage.getItem('token') ? localStorage.getItem('token') : ''},
			'contentType': false,
			'data': formData,
			'type': 'POST',
			'processData': false,
			success: function (response) {
				if(response.result != undefined){
					localStorage.removeItem('magazineID');
					localStorage.setItem('gjs-html', '');
					localStorage.setItem('gjs-components', '');
					editor.DomComponents.clear()
					localStorage.setItem('magazineID', response.result.magazineId);
					$('.current-magazine').html(` Revista Creada ${response.result.title}`);
					let open = document.createElement('button')
					open.setAttribute('itemid' , response.result.id)
					open.onclick = e => { magazineOpen( e.target.getAttribute('itemid') ) }
					document.querySelector('.current-magazine').appendChild( open )
					alertSuccess("Revista creada en el editor")
					apiClone("magazineSave" , { file:d , magazine:{ title , dateOrder:date , category , source:"html" } })
					//location.href = "/refam/editor.html?editor=true&article=105"
				}
				if(response.error != undefined){
					alertWarning(response.error)
				}

			},
			error: function (data) {
				alertWarning("Ha ocurrido un error: " + data.message)
			}
		});

}

magazineBackBtn.onclick = e => {
	modalClose()
	document.querySelector('*[data-tooltip=Revistas]').click()
}