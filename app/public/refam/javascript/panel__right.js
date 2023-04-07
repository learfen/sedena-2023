function panel__right(){
	return {
		id: 'layers',
		el: '.panel__right',
		// Make the panel resizable
		resizable: {
			maxDim: 480,
			minDim: 200,
			tc: 0, // Top handler
			cl: 0, // Left handler
			cr: 1, // Right handler
			bc: 0, // Bottom handler
			// Being a flex child we need to change `flex-basis` property
			// instead of the `width` (default)
			keyWidth: 'flex-basis',
		},
		blocks:editor_blockManager()
	}
}