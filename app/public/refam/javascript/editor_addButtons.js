let panelsAdd = 
	{
		'options':  [{
			id: 'send-to-magazine',
			className: 'fa fa-paper-plane',
			command: 'send-to-magazine',
			attributes: {
				'title': 'Mover a otra revista',
				'data-tooltip-pos': 'bottom',
				}
			}]
	}
let panelsAddArticle = [
			{
				id: 'article-save',
				className: 'fa fa-save articleBtn',
				command:'article-save',
				attributes:{
					'title':'Guardar articulo',
					'data-tooltip-pos': 'bottom'
				}
			},
			{
				id: 'article-cover-update',
				className: 'fa fa-image articleBtn articleUpdateCover',
				command:'article-cover-update',
				attributes:{
					'title':'Actualizar cover',
					'data-tooltip-pos': 'bottom'
				}
			},
			{
				id: 'article-delete',
				className: 'fa fa-remove articleBtn',
				command:'article-exit',
				attributes:{
					'title':'Cerrar articulo',
					'data-tooltip-pos': 'bottom'
				}
			}/*,
			{
			id: 'open-templates',
			className: 'fa fa-question-circle',
			command: 'open-templates',
			attributes: {
					'title': 'Plantillas',
					'data-tooltip-pos': 'bottom',
					}
				},
			{
			id: 'view-info',
			className: 'fa fa-question-circle',
			command: 'open-info',
			attributes: {
					'title': 'About',
					'data-tooltip-pos': 'bottom',
					}
				},
			{
			id: 'send-to-magazine',
			className: 'fa fa-paper-plane',
			command: 'send-to-magazine',
			attributes: {
				'title': 'Test Newsletter',
				'data-tooltip-pos': 'bottom',
				}
			}*/
		]
let panelsAddMagazine = [
	{
		id: 'magazine-new',
		className: 'fa fa-book magazineBtn',
		command:'magazine-new',
		attributes:{
			'title':'Nueva revista',
			'data-tooltip-pos': 'bottom'
		}
	},
	{
	id: 'open-magazines',
	className: 'fa fa-list magazineBtn',
	command: 'magazines-open',
	attributes: {
			'title': 'Revistas',
			'data-tooltip-pos': 'bottom',
			}
	},
]
if(urlParamsGet().article != "0"){
	panelsAdd.options = [...panelsAdd.options , ...panelsAddArticle]
}else{
	panelsAdd.options = [...panelsAdd.options , ...panelsAddMagazine]
}


function editor_addButtons(panels){
	for(let panel in panelsAdd){
		for(let button of panelsAdd[panel]){
			panels.addButton(panel, button) 
		}
	}
}