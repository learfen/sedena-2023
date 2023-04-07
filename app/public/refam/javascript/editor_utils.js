function cleanCanvas() {
	localStorage.setItem('gjs-html', '')
	localStorage.setItem('gjs-components', '')
	editorGet().DomComponents.clear()
}


function resetFormById(id) {
	$(`#${id}`)[0].reset()
	resetImageUrl()
}

function resetImageUrl() {
	$('#img-upload').attr('src', '')
}



function readURL(input) {
	if (input.files && input.files[0]) {
		var reader = new FileReader()
		reader.onload = function (e) {
			$('#img-upload').attr('src', e.target.result)
		}
		reader.readAsDataURL(input.files[0])
	}
}




$(document).ready(function () {
	$(document).on('change', '.btn-file :file', function () {
		var input = $(this),
			label = input.val().replace(/\\/g, '/').replace(/.*\//, '');
		input.trigger('fileselect', [label]);
	});

	$('.btn-file :file').on('fileselect', function (event, label) {

		var input = $(this).parents('.input-group').find(':text'),
			log = label;

		if (input.length) {
			input.val(log);
		} else {
			if (log) alertWarning(log);
		}

	});

	function readURL(input) {
		if (input.files && input.files[0]) {
			var reader = new FileReader();

			reader.onload = function (e) {
				document.querySelector('#img-upload').src = e.target.result;
			}

			reader.readAsDataURL(input.files[0]);
		}
	}


	$("#imgInp").change(function () {
		readURL(this);
	});
});



$(document).ready(function () {
	$(document).on('change', '.btn-file :file', function () {
		var input = $(this),
			label = input.val().replace(/\\/g, '/').replace(/.*\//, '');
		input.trigger('fileselect', [label]);
	});

	$('.btn-file :file').on('fileselect', function (event, label) {

		var input = $(this).parents('.input-group').find(':text'),
			log = label;
		if (input.length) {
			input.val(log);
		} else {
			if (log) alertWarning(log);
		}

	});

	$("#imgInp").change(function () {
		readURL(this);
	});


	$("#imgArticle").change(function () {
		readURL(this);
	});
});


// =========================================================================================================

var urlParams = {article:"0",magazine:"0"}
function urlParamsGet(){ return urlParams}
function urlParamsSet(key , value){ urlParams[key]=value}
if(window.location.href.split("?").length > 1){
	const urlQuery = window.location.href.split("?")[1].split("&")
	for(let key in urlQuery){
		urlParams[urlQuery[key].split("=")[0]] = urlQuery[key].split("=")[1]
	}
}

function normalizeUrl(urlVideo){
	if(urlVideo.split('videoName=').length > 1){
		let url = urlVideo.split('videoName=')[1]
		return location.origin + '/refam/video/' + url
	}else{
		return urlVideo
	}
}


function stylesAdd(){
	let x = setTimeout( async ()=>{

		if( 1 == 0 && document.querySelector("iframe").contentWindow.document.querySelector('#customStylesArticle') == undefined){
			/*
			let dataStyle = await axios.get('/refam/css/style.css')
			let dataStyleFonts = await axios.get('/refam/css/fontsCustom.css')
			
			let style = document.querySelector("iframe").contentWindow.document.createElement("style")
			style.innerHTML =  dataStyle.data + " h1,h2,h3,h4,h5,h6,p,div,article,section,figure{ max-width: 100vw !important; };img{max-width:100% !important;}"
			style.setAttribute('id' , 'customStylesArticle')
			document.querySelector("iframe").contentWindow.document.body.appendChild(style)

			let fonts = document.querySelector("iframe").contentWindow.document.createElement("style")
			fonts.innerHTML =  dataStyleFonts.data
			fonts.setAttribute('id' , 'customFontsArticle')
			document.querySelector("iframe").contentWindow.document.body.appendChild(fonts)
			*/
		}
		if(document.querySelector("iframe").contentWindow.document.querySelector('#customScriptrticle') == undefined){
			let script = document.createElement('script')
			script.setAttribute('id' , 'customScriptrticle')
			script.setAttribute('src','/refam/javascript/editor_main.js')
			document.querySelector("iframe").contentWindow.document.body.appendChild(script)
		}
		clearTimeout(x)

	}, 750)
}


function magazineUpdateState( id , state){
	axios.post("/refam/api/magazine/"+state+"/"+id+"?token="+token())
	.then( res => {
		if(res.data.error) alertWarning(res.data.error)
		else alertSuccess(res.data.result)
	} )
	.catch( error => alertWarning(error) )
} 


function magazinesList(){
	fetch("/refam/api/magazine/getAll")
	.then( async res =>{
		let result = await res.json()
		const magazines = document.querySelector("#magazines")
		magazines.innerHTML = ""
		result = result.filter( magazine => magazine.status < 3)
		magazinesStore(result)
		for(let magazine of result){
			let btn = createItemPanel(magazine , 'magazine')
			magazines.appendChild(btn)
		}
	})
}

function alertSuccess(txt){
	alertBox.style.background="green"
	alertOpen(txt)
}

function alertWarning(txt){
	alertBox.style.background="orange"
	alertOpen(txt)
}
function alertOpen(txt){
	alertBoxText.innerHTML = txt
	alertBox.classList.add('active')
}


function videoUpload(eInput){
	var files = eInput.dataTransfer ? eInput.dataTransfer.files : eInput.target.files;
	var formData = new FormData();
	if(files.length > 0){
		formData.append('fileid', files[0])
		alertWarning("Subiendo")
		axios.post('/refam/upload/editor/?magazine='+urlParamsGet().magazine , formData , {
			headers: {
				'Content-Type': 'multipart/form-data',
				'Authorization': localStorage.getItem("token") ,
				'x-access-token': localStorage.getItem('token') ? localStorage.getItem('token') : ''
			}
		})
		.then( res => {
			if(res.data.error != undefined){
				alertWarning( res.data.error )
			}else{
				videosStored().push( res.data.result )
				videosItemRender(res.data.result , eInput)
				alertSuccess("Guardado")
			}
		}).catch(function (error) {
			alertWarning("INTENTE EN OTRO MOMENTO O COMUNIQUESE CON EL DESARROLLADOR\n" + error)
		})
	}else{
		alertWarning("Debe existir algun archivo")
	}
}
function fontsAdd( fontList ){
	document.querySelector('#gjs-sm-font-family select').id = "fontListSelect"
	for(let font of fontList){
		let fontCut = font.split('/')
		if( fontCut.length > 3 ){
			let fontName = fontCut[3].split('.')[0]
			let notAdd = ['main','fonts','']
			if(notAdd.indexOf(fontName) == -1 && fontName.search('font') == -1){
				let fontOption = document.createElement('option')
				fontOption.style = `font-family:'${fontName}'`
				fontOption.value = fontName
				fontOption.innerHTML = fontName
				document.querySelector('#gjs-sm-font-family select').appendChild(fontOption)
			}
			if(document.querySelector("iframe").contentWindow.document.querySelector('#linkFonts') == undefined){
				let linkFonts = document.createElement('link')
				linkFonts.setAttribute('id','linkFonts')
				linkFonts.setAttribute('rel','stylesheet')
				linkFonts.setAttribute('href','/refam/css/fontsCustom.css')

				let linkStyle = document.createElement('link')
				linkStyle.setAttribute('id','linkStyle')
				linkStyle.setAttribute('rel','stylesheet')
				linkStyle.setAttribute('href','/refam/css/style.css')
				
				document.querySelector("iframe").contentWindow.document.body.appendChild(linkFonts)
				document.querySelector("iframe").contentWindow.document.body.appendChild(linkStyle)
			}
		}
	}
	var selectList = $('#fontListSelect option');
	function sort(a,b){
		a = a.text.toLowerCase();
		b = b.text.toLowerCase();
		if(a > b) {
			return 1;
		} else if (a < b) {
			return -1;
		}
		return 0;
	}
	selectList.sort(sort);
	$('#fontListSelect').html(selectList);
}

function autoImport(){
	let st = setTimeout( ()=> {
		document.querySelector(".gjs-pn-btn.fa.fa-download").click()
		document.querySelector(".gjs-btn-prim.gjs-btn-import").click()
		clearInterval(st)
	}, 500)
}


var modalState = false
function modalClose(){
	editorGet().Modal.close();
	modalState = false
}
function modalOpen(size , title , content){
	modalState = true
	content = document.querySelector(content)
	const sizes = {little:modalClassLittle, long: modalClassLong} 
	size = sizes[size]
	var modalContent = editorGet().Modal.getContentEl();
	var mdlDialog = document.querySelector('.gjs-mdl-dialog');
	var cmdGetCode = editorGet().Commands.get('gjs-get-inlined-html');
	document.getElementById("test-form").querySelector('input[name=body]').value = cmdGetCode && cmdGetCode.run(editorGet());
	mdlDialog.className += ' ' + size;
	content.style.display = 'block';
	editorGet().Modal.setTitle(title);
	editorGet().Modal.setContent('');
	editorGet().Modal.setContent(content);
	editorGet().Modal.open();
	editorGet().Modal.getModel().once('change:open', function() {
		mdlDialog.className = mdlDialog.className.replace(size, '');
	})
}


		
function videosItemRender(videoData , eInput){
	let item = document.createElement('div')
	let leyend = document.createElement('span')
	leyend.innerHTML = videoData.route
	let video = document.createElement('video')
	video.setAttribute('controls', true)
	video.style = "width:100%;height:90px"
	item.appendChild(video)
	let srcVideo = normalizeUrl(videoData.src)
	let addVideo = document.createElement('button')
	addVideo.setAttribute('video-src', srcVideo)
	addVideo.style="width:100%;display:inline-block;padding:.5rem .25rem;border:0;border-radius:4px"
	addVideo.onclick = e =>{
		let video = document.querySelector("iframe").contentWindow.document.querySelector('video')
		eInput.target.value = e.target.getAttribute('video-src')
		video.className = ''
		video.currentTime = 2
		video.src = e.target.getAttribute('video-src')
		eInput.target.blur()
		eInput.target.parentNode.nextSibling.nextSibling.children[1].children[0].children[0].click()
		eInput.target.parentNode.nextSibling.nextSibling.children[1].children[0].children[0].click()
		modalClose()
	}
	addVideo.innerHTML = 'Insertar'

	let removeVideo = document.createElement('button')
	removeVideo.setAttribute('name' , videoData.id)
	removeVideo.style="background-color:#9f0000;color:#fff;width:100%;display:inline-block;padding:.5rem .25rem;border:0;border-radius:4px"
	removeVideo.onclick = e =>{
		e.preventDefault()
		axios.delete('/refam/api/library/video/'+e.target.getAttribute('name'))
		.then( res => {
			item.revemo()
		} )
	}
	removeVideo.innerHTML = 'Eliminar'
	
	let options = document.createElement('div')
	options.style = "display:flex"
	options.appendChild(addVideo)
	options.appendChild(removeVideo)
	item.appendChild(options)
	item.appendChild(leyend)
	video.src = srcVideo
	document.querySelector('#videos').prepend(item)
}