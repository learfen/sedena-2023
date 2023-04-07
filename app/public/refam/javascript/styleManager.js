function styleManager(){
	return {
		appendTo: '.styles-container',
		sectors: [{
			name: 'Capas',
			open: false,
			// Use built-in properties
			buildProps: ['width', 'height', 'min-width', 'min-height', 'padding', 'margin'],
			// Use `properties` to define/override single property
			properties: [
				{
					// Type of the input,
					// options: integer | radio | select | color | slider | file | composite | stack
					type: 'integer',
					name: 'Ancho', // Label for the property
					property: 'width', // CSS property (if buildProps contains it will be extended)
					units: ['px', '%'], // Units, available only for 'integer' types
					defaults: 'auto', // Default value
					min: 0, // Min value, available only for 'integer' types
				},
				{
					property: 'min-width',
					name: 'Ancho mínimo'
				},
				{
					property: 'min-height',
					name: 'Alto mínimo'
				},
				{
					property: 'padding',
					name: 'Espacio interno',
					properties: [
						{
							property: 'padding-top',
							name: 'Arriba',
						},
						{
							property: 'padding-right',
							name: 'Derecha',
						},
						{
							property: 'padding-bottom',
							name: 'Abajo',
						},
						{
							property: 'padding-left',
							name: 'Izquierda',
						}
					]

				},
				{
					property: 'margin',
					name: 'Espacio externo',
					properties: [
						{
							property: 'margin-top',
							name: 'Arriba',
						},
						{
							property: 'margin-right',
							name: 'Derecha',
						},
						{
							property: 'margin-bottom',
							name: 'Abajo',
						},
						{
							property: 'margin-left',
							name: 'Izquierda',
						}
					]
				},

			]
		}, {
			name: 'Posición',
			buildProps: ['position'],
			properties: [
				{
					property: 'position',
					name: 'Posición',
					list: [
						{value: 'static', name: 'Estática'},
						{value: 'relative', name: 'Relativa'},
						{value: 'absolute', name: 'Absoluta'},
						{value: 'fixed', name: 'Fija'}
					]
				},
				{
					type: 'integer',
					name: 'Arriba', // Label for the property
					property: 'top', // CSS property (if buildProps contains it will be extended)
					units: ['px', '%', 'vh'], // Units, available only for 'integer' types
					defaults: 'auto', // Default value
					min: 0, // Min value, available only for 'integer' types
				},
				{
					type: 'integer',
					name: 'Derecha', // Label for the property
					property: 'rigth', // CSS property (if buildProps contains it will be extended)
					units: ['px', '%', 'vh'], // Units, available only for 'integer' types
					defaults: 'auto', // Default value
					min: 0, // Min value, available only for 'integer' types
				},
				{
					type: 'integer',
					name: 'Abajo', // Label for the property
					property: 'bottom', // CSS property (if buildProps contains it will be extended)
					units: ['px', '%', 'vh'], // Units, available only for 'integer' types
					defaults: 'auto', // Default value
					min: 0, // Min value, available only for 'integer' types
				},
				{
					type: 'integer',
					name: 'Izquierda', // Label for the property
					property: 'left', // CSS property (if buildProps contains it will be extended)
					units: ['px', '%', 'vh'], // Units, available only for 'integer' types
					defaults: 'auto', // Default value
					min: 0, // Min value, available only for 'integer' types
				},
			]
		}, {
			name: 'Tipografía',
			open: false,
			buildProps: ['font-family', 'font-size', 'font-weight', 'letter-spacing', 'color', 'text-decoration'],
			properties: [
				{
					property: 'text-align',
					type: 'radio',
					name: 'Alineación de texto',
					defaults: 'left',
					list: [
						{value: 'left', name: 'Izquierda', className: 'fa fa-align-left'},
						{value: 'center', name: 'Centrado', className: 'fa fa-align-center'},
						{value: 'right', name: 'Derecha', className: 'fa fa-align-right'},
						{value: 'justify', name: 'Justificado', className: 'fa fa-align-justify'}
					],
				},
				{
					property: 'font-weight',
					name: 'Ancho de fuente'
				},
				{
					property: 'letter-spacing',
					name: 'Espaciado de letra'
				},

				{
					property: 'font-family',
					name: 'Fuente',
					list: [
						{name: 'Montserrat', value: 'monserratreg'},
						{name: 'Arial', value: 'Arial, Helvetica, sans-serif'},
						{name: 'GMX', value: 'gmxbold'}
					]
				},
				{
					property: 'text-decoration',
					type: 'radio',
					name: 'Decoración de texto',
					defaults: 'none',
					list: [
						{value: 'none', name: 'Ninguna', className: 'fa fa-times'},
						{value: 'underline', name: 'Subrayado', className: 'fa fa-underline'},
						{value: 'line-through', name: 'Tachado', className: 'fa fa-strikethrough'},
						{value: 'bold', name: 'Negrita', className: 'fa fa-bold'}
					],
				},
				{
					// Type of the input,
					// options: integer | radio | select | color | slider | file | composite | stack
					type: 'integer',
					name: 'Tamaño', // Label for the property
					property: 'font-size', // CSS property (if buildProps contains it will be extended)
					units: ['px'], // Units, available only for 'integer' types
					defaults: '25', // Default value
					min: 0, // Min value, available only for 'integer' types
				}
			]
		}, {
			name: 'Fondo',
			open: false,
			buildProps: ['background-color', 'box-shadow', 'custom-prop'],
			properties: [
				{
					id: 'custom-prop',
					name: 'Texto personalizado',
					property: 'font-size',
					type: 'select',
					defaults: '32px',
					// List of options, available only for 'select' and 'radio'  types
					options: [
						{value: '12px', name: 'Delgado'},
						{value: '18px', name: 'Medio'},
						{value: '32px', name: 'Grande'},
					],
				},
				{
					property: 'box-shadow',
					name: 'Sombras',

				},
				{
					property: 'background-color',
					name: 'Colores Sedena',
					defaults: 'none',
					type: 'select',
					list: [
						{value: '#621132', name: 'Rojo'},
						{value: '#929292', name: 'Gris'},
						{value: '#9d2449', name: 'Rosado'},
						{value: '#a2805d', name: 'Arena'},
						{value: '#285c4d', name: 'Verde Claro'},
						{value: '#13322b', name: 'Verde Oscuro'},
					],
				},
			]
		}]
	}
}