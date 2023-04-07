function panel__devices(magazineId , articleId){

	let panel =  { id: 'panel-devices', el: '.panel__devices', buttons: [] }
	let addList = []

	let btns = {
		'new-magazine':{
			label: 'Nueva Revista',
			attributes: {title: 'Nueva Revista'}
		},
		'exit-magazine':{
			label: 'Salir de la revista',
			command(){
				location.href = "../"
			},
			attributes: {title: 'Salir de la Revista'}
		},
		'end-template':{
			label: 'Guardar revista',
			command: function () {
				if (localStorage.getItem('magazineID') === null) {
					alertWarning('Debe crear una revista primero')
				} else {
					let r = confirm('¿Está seguro que quiere publicar la revista?');
					if (r === true) {
						$('.current-magazine')
							.empty()
							.append('<p>Revista Publicada </p>'); // Todo validate mag id
						localStorage.removeItem('magazineID');
					} else {
						// TODO
					}
	
				}
			},
			attributes: {title: 'Finalizar edicion del template'}
		},
		'clean-canvas':{
			label: 'Resetear página',
			attributes: {title: 'Boorar todo el contenido del articulo'}
		},
		'new-article':{
			label: 'Nueva página',
			attributes: {title: 'Crear articulo en la revista abierta'}
		},
		'new-other-article':{
			label: 'Crear otra página',
			attributes: {title: 'Guardar y crear otro articulo en la revista abierta'}
		},
		'save-article':{
			label: 'Guardar página',
			attributes: {title: 'Guardar estado actual del articulo en la revista'}
		},
		'remove-article':{
			label: 'Eliminar página',
			attributes: {title: 'Elimina el articulo de la revista'}
		}
	}

	if(+magazineId == 0){ // no hay revista abierta
		addList.push('new-magazine')
	}else{
	
		if(+magazineId > 0 && +articleId == 0){ // hay revista abierta pero no articulo
			addList.push('new-magazine','new-article')
		}else{ // hay revista abierta y articulo 
			addList.push('exit-magazine','save-article','clean-canvas','remove-article')
		}
	
	}
	
	for(let add of addList){
		let item = btns[add]
		item["id"] = add
		if(item.command == undefined){
			item["command"] = add
		}
		panel.buttons.push(item)
	}

	return panel
}