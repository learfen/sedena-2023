
let wrapperData = null
let count = 0
setTimeout( ()=> {
	if(document.querySelector('#wrapper') != undefined){
		while(nodo = eval(getId(count) + '.id')){
			count++
		}
		document.querySelector('body>div#wrapper').innerHTML = eval(getId(--count) + '.innerHTML')
	}
} , 500)

function addStyle( file ){
	let link = document.createElement('link')
	link.setAttribute('href' , '/refam/css/'+file+".css")
	link.setAttribute('rel' , 'stylesheet')
	document.body.appendChild(link)
}

for(let file of ['style','main']){
	addStyle(file)
}