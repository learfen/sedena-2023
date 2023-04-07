setTimeout(()=>{
    document.querySelector("#magazineStateEdited").onclick = e => {
    	magazineUpdateState( e.target.getAttribute('magazine') , "edited")
    }
    document.querySelector("#magazineStatePosted").onclick = e => {
    	magazineUpdateState( e.target.getAttribute('magazine') , "posted")
    }
    
    document.querySelector("#videoInp").onchange = videoUpload
    
    alertBox.children[0].onclick = ( e ) =>  { e.target.parentNode.classList.remove('active') }
    
    document.querySelector('#btnRevistas').onclick = () => {
    	document.querySelector('.fa-list').click()
    }
}, 1000)