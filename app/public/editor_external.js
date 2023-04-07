document.querySelector('#app').addEventListener('click' , event => {
		
    if( event.target.classList.contains('text-editable') ) textEditable(event)
    
    if( event.target.parentNode.classList.contains('text-editable') ) event.target.parentNode.click()

    if( event.target.parentNode.parentNode.classList.contains('text-editable') ) event.target.parentNode.parentNode.click()

    if( event.target.parentNode.parentNode.parentNode.classList.contains('text-editable') ) event.target.parentNode.parentNode.parentNode.click()

}, false)

function textEditableUnactive(){
    let activePrevious = document.querySelector('.text-editable.active')
    if( activePrevious ) 
        activePrevious.classList.remove('active')
    document.querySelector('#editorwrap').style = 'display:none'
}

function textEditable( event ){
        let activePrevious = document.querySelector('.text-editable.active')
        
        if( activePrevious ) activePrevious.classList.remove('active')
        
        event.target.classList.add('active')
        document.querySelector('.ql-editor').innerHTML = event.target.innerHTML
        document.querySelector('#editorwrap').style = 'display:block'
        let editor =  new Quill("#editor", {
            styles: {
                ".ql-container": {
                    "padding": "5px 0",
                    "min-height": "120px"
                },
                ".ql-editor": {
                    "font-family": "Arial, sans-serif",
                    "font-size": "16px",
                    "line-height": "1.5em"
                }
            },
            formats: ["bold", "italic", "underline", "strike", "list", "bullet", "align"]
        })
        editor.addModule("toolbar", { container: "#toolbar" });
        editor.on("text-change", function() {
            let html = (editor.getHTML())
                .split('contenteditable').join('')
                .split('class="ql-editor"').join('')
                .split('<ul>').join(`<ul class="collection">`)
                .split('<ol>').join(`<ol class="collection">`)
                .split('<li >').join(`<li class="collection-item">`)
            document.querySelector(".text-editable.active").innerHTML = html
        });

        let x = setTimeout(()=>{
            if( $(".text-editable.active") )
                $(".text-editable.active").val(editor.getHTML());
        }, 50)
}

var delayit;
$("#editor .ql-editor").focus(function() {
    $("#editorwrap").addClass("focus");
    clearTimeout(delayit);
}).blur(function() {
    if ($("#editorwrap").is(":hover")) {
        delayit = setTimeout(function() {
            $("#editorwrap").removeClass("focus");
        }, 200);
    } else {
        $("#editorwrap").removeClass("focus");
    }
});
$("#toolbar button").click(function(e) { e.preventDefault() });



function getData(keys, nodo){
    let result = {}
    for(let key of keys){
        let attr = nodo.getAttribute(key)
        if(attr != undefined && attr != 'undefined') result[key] = attr
    }
    return result
}

function getDataLinks(dataLinks){
    let links = []
    if( String(dataLinks).split('|').length ){
        links = [...dataLinks.split('|').map(link => {
            let href = link.split(' ')[0]
            let text = link.split(' ')
            text.splice(0,1)
            text = text.join(' ')
            return { href , text }
        })]
    }
    let result = ''
    if( links.length ){
        for(let link of links){
            result += `<a href="${link.href}">${link.text}</a>`
        }
    }
    return result
}

class ComponentCard{
    attrs(){
        return ['image','title','text','links']
    }
    static render(nodo){
        let storage = getData(['image','title','text','links'], nodo)
        let image = storage.image ? `<img src="${storage.image}">` : ''
        let links = getDataLinks(storage.links)
        
        nodo.outerHTML = `
        <div class="col sm12 s12 m6 l4 col-card" component="card" image="${storage.image}"  title="${storage.title}"  text="${storage.text}"  links="${storage.links}">
            <div class="card">
                ${image != '' ? '<div class="card-image caption">'+image+'<span class="card-title">'+storage.title+'</span></div>' : ''}
                <div class="card-content">${image == '' ? '<span class="card-title">'+storage.title+'</span>' : ''} ${storage.text}</div>
                <div class="card-action">${links}<button class="btn-small" onclick="ComponentCard.target(this.parentNode.parentNode.parentNode)">Editar</button></div>
            </div>
        </div>`

    }
    static target( nodo ){
        componentsClass.target = nodo
        let storage = getData(ComponentCard.attrs(),nodo)
        for(let key in storage){
            componentsClass[key+'Card'].innerHTML = storage[key]
        }
    }
    
    static update(){
        let attrs = ComponentCard.attrs()
        for(let attr of attrs){
            componentsClass.target.setAttribute(attr, componentsClass[attr+'Card'].innerHTML)
        }
        renderComponents()
        componentsClass.target=null
    }
}

let componentsClass = {
    target:null,
    titleCard:document.querySelector('#form-cards-title'),
    textCard:document.querySelector('#form-cards-text'),
    imageCard:document.querySelector('#form-cards-image'),
    linksCard:document.querySelector('#form-cards-links'),
    card:ComponentCard,
    contentText:document.querySelector('#form-text-content'),
    text:ComponentText
}


function renderComponents(){
    let components = document.querySelectorAll('*[component]')
    for(let nodo of components){
        componentsClass[nodo.getAttribute('component')].render( nodo )
    }
}
/*
-webkit-column-count: 3; 
-moz-column-count: 3; 
column-count: 3;
*/
renderComponents()