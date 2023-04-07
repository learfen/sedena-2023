	if(document.querySelector('img')){
		[].slice.apply(document.querySelector('img')).filter(is_gif_image).map(freeze_gif);
	}
	function is_gif_image(i) {
		return /^(?!data:).*\.gif/i.test(i.src);
	}

	function freeze_gif(i) {
		var c = document.createElement('canvas');
		var w = c.width = i.width;
		var h = c.height = i.height;
		c.getContext('2d').drawImage(i, 0, 0, w, h);
		try {
			i.src = c.toDataURL("image/gif"); 
		} catch(e) {
			for (var j = 0, a; a = i.attributes[j]; j++)
				c.setAttribute(a.name, a.value);
			i.parentNode.replaceChild(c, i);
		}
	}

	let imgs = document.querySelectorAll('.navegation>img')
	Array.from(imgs).map( img => {
		img.style = "max-width:initial !important;max-height:initial"
		return img
	})

	let videos = document.querySelectorAll('video')
	setTimeout( ()=> {

			Array.from(videos).map( video => {
				video.setAttribute('playsinline', true)
				video.setAttribute('webkit-playsinline',true)
				video.setAttribute('preload','metadata')
				video.setAttribute('controls',true)
				video.className = ''
				video.load()
				video.addEventListener("loadeddata", function () {
					if (video.readyState >= 3) {
						video.currentTime = 2;
					}
				})
				if (video.readyState >= 3) {
					video.currentTime = 2;
				}
				return video
			})
	} , 3000 )



 let hidden = "hidden";

 // Standards:
 if (hidden in document)
   document.addEventListener("visibilitychange", onchange);
 else if ((hidden = "mozHidden") in document)
   document.addEventListener("mozvisibilitychange", onchange);
 else if ((hidden = "webkitHidden") in document)
   document.addEventListener("webkitvisibilitychange", onchange);
 else if ((hidden = "msHidden") in document)
   document.addEventListener("msvisibilitychange", onchange);
 // IE 9 and lower:
 else if ("onfocusin" in document)
   document.onfocusin = document.onfocusout = onchange;
 // All others:
 else
   window.onpageshow = window.onpagehide
   = window.onfocus = window.onblur = onchange;

 function onchange (evt) {
   var v = "visible", h = "hidden",
       evtMap = {
         focus:v, focusin:v, pageshow:v, blur:h, focusout:h, pagehide:h
       };

   evt = evt || window.event;
   if (evt.type in evtMap)
     document.body.className = evtMap[evt.type];
   else
     document.body.className = hidden ? "hidden" : "visible";

 	if( hidden ){
	 	Array.from(document.querySelectorAll('video')).map( item => {
	 		item.pause()
	 	})
	 }
 }

 // set the initial state (but only if browser supports the Page Visibility API)
 if( document[hidden] !== undefined )
   onchange({type: document[hidden] ? "blur" : "focus"});

function getId( multiplicador ){
	let base = `document.querySelector('div#wraper')content`
	let content = ''
	for(let index = 0; index <= multiplicador; index++){
		content += '.children[0]'
	}
	return base.replace('content' , content)
}