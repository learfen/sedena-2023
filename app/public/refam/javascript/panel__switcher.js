function panel__switcher(){
	return {
		id: 'panel-switcher',
		el: '.panel__switcher',
		buttons: [{
			id: 'show-magazine',
			label: 'Revistas',
			active: true,
			command: 'show-magazine',
			togglable: false,
		},{
			id: 'show-blocks',
			label: 'Plantillas',
			active: true,
			command: 'show-blocks',
			togglable: false,
		}, {
			id: 'show-layers',
			label: 'Capas',
			command: 'show-layers',
			// Once activated disable the possibility to turn it off
			togglable: false,
		}, {
			id: 'show-style',
			label: 'Estilos',
			command: 'show-styles',
			togglable: false,
		}, {
			id: 'show-traits',
			label: 'Atributos',
			command: 'show-traits',
			togglable: false,
		}],
	}
}