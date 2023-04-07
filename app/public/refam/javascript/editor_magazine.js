
    

function removeBtnExtra(btnEvent){
	let btnStatus = document.createElement("div")
	btnStatus.className = "btnGallery"
	return btnStatus
}

function magazineBtnStatus1(btnEvent){
	btnStatus = removeBtnExtra(btnEvent)
	btnStatus.innerHTML = "A revisión"
	btnStatus.onclick = control
}

function magazineBtnStatus2(btnEvent){
	btnStatus = removeBtnExtra(btnEvent)
	btnStatus.onclick = posted
	btnStatus.innerHTML = "Publicar"
	let btnStatus2 = document.createElement("div")
	btnStatus2.className = "btnGallery"
	btnStatus2.innerHTML = "A edición"
	btnStatus2.onclick = edited
	btnEvent.parentNode.appendChild(btnStatus2)
}

function magazineBtnStatus3(btnEvent){
	btnStatus = removeBtnExtra(btnEvent)
	btnStatus.innerHTML = "A revisión"
	btnStatus.onclick = control
}
// ==============================================================

async function getMagazineContainer(){
	const container = document.querySelector("#magazines")
	await axios.get(apiURl+"magazine/getAll"+"?token="+token())
	.then( res => {
		for(let magazine of res.data){
			magazine.status = +magazine.status
			magazinesStore[magazine.id] = magazine
			let btn = createItemPanel(magazine , 'magazine')
			btn.children[1].href="/refam/editor/"+magazine.id
			container.appendChild(btn)
		}
	})
	.catch( err =>{
		console.log("getMagazineContainer > " , err)
	})
}
function deletedMagazine(e) {
  axios
	.delete(apiURl + "magazine/" + e.target.parentNode.getAttribute("itemid")+"?token="+token(), {
	  headers: { Authorization: localStorage.getItem("token") },
	})
	.then((res) => {
	  if (res.data.error) {
		alertWarning(res.data.error);
	  } else {
		e.target.parentNode.remove();
		alertSuccess(res.data.result);
	  }
	})
	.catch(function (error) {
	  alertWarning(
		"INTENTE EN OTRO MOMENTO O COMUNIQUESE CON EL DESARROLLADOR\n" + error
	  );
	});
}

function posted(e) {
  magazineUpdateState(e, "posted", 3);
  e.target.onclick = control;
}
function control(e) {
  magazineUpdateState(e, "control", 2);
  e.target.onclick = posted;
}
function edited(e) {
  e.target.onclick = edited;
  magazineUpdateState(e, "edited", 1);
}
function magazineUpdateState(e, action, status) {
  axios.post( apiURl + "magazine/" + action + "/" + e.target.parentNode.getAttribute("itemid")+"?token="+token(),
	  {},
	  { headers: { Authorization: localStorage.getItem("token") } }
	)
	.then((res) => {
	  if (res.data.error) {
		alertWarning(res.data.error);
	  } else {
		alertSuccess(res.data.result);
		magazinesStore[
		  e.target.parentNode.getAttribute("itemid")
		].status = status;
		for (let isBtn of Array.from(e.target.parentNode.children)) {
		  if (isBtn.className == "btnGallery") {
			isBtn.style.display = "none";
		  }
		}
		setTimeout(() => {
		  eval(`magazineBtnStatus${status}(e.target)`);
		});
	  }
	})
	.catch(function (error) {
	  alertWarning(
		"INTENTE EN OTRO MOMENTO O COMUNIQUESE CON EL DESARROLLADOR\n" + error
	  );
	});
}


function magazinePost() {
	console.log("article")

	let formData = new FormData()
	var d = $('#imgInp')[0].files[0]
	let title = $('#magazineTitle').val()
	let date = $('#magazineDate').val()
	let category = $('#magazineCat').val()
	let status = 1

	formData.append('fileid', d);
	formData.append('title', title);
	formData.append('date', date);
	formData.append('category', category);
	formData.append('status', status);

	$.ajax(
		apiURl + "magazine/postCreateMagazine", {
			enctype: 'multipart/form-data',
			headers: {'x-access-token': localStorage.getItem('token') ? localStorage.getItem('token') : ''},
			'contentType': false,
			'data': formData,
			'type': 'POST',
			'processData': false,
			success: function (response) {
				localStorage.removeItem('magazineID');
				localStorage.setItem('gjs-html', '');
				localStorage.setItem('gjs-components', '');
				editor.DomComponents.clear()
				localStorage.setItem('magazineID', response.magazineId);
				$('.current-magazine')
					.empty()
					.append("<p>Editando Revista " + response.magazineId + "</p>");
				resetFormById("newMagazineForm")
				alertSuccess("Creada con exito")
				setTimeout( ()=> {
					location.href="/refam/editor/"+response.magazineId+"?token="+localStorage.getItem('token')
				}, 2000)

			},
			error: function (data) {
				alertWarning("Ha ocurrido un error: " + data.message)
			}
		});

}