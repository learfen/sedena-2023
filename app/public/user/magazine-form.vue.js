Vue.component('magazine-form',{
	props:['target','magazine'],
    template:`
    <div class="container" style="max-width:480px">
	<h3>Nueva revista</h3>
	<form>
		<div>{{id}}</div>
		<v-text-field
			v-model="title"
			label="Titulo"
			required
		></v-text-field>
		<v-text-field
			v-model="seo"
			label="SEO"
		></v-text-field>
		<input
			:rules="rules"
			accept="image/png, image/jpg"
			placeholder=""
			label="Avatar"
			@change="targetCover"
			type="file"
			ref="cover-input"
			style="display:none"
		>
		<v-select
			v-model="status"
			:items="statusItems"
			label="Estado"
			required
			v-if="id > 0"
		></v-select>
		<div class="pa-5">
			<label>Esta revista corresponde al mes de <input v-model="date" type="date"> </label>
		</div>
		<div  v-if="cover!=''" @click="$refs['cover-input'].click()">
			<v-img  width="50px" height="50px" :src="cover"></v-img>
			<small>Click en la imagen para cambiar</small>
		</div>
		<v-btn v-else small @click="$refs['cover-input'].click()">Selecciona portada</v-btn>
		<div class="my-5 pa-2">
			<v-btn class="red white--text" @click="$emit('close')">Cancelar</v-btn>
			<v-btn class="mr-4 green white--text" @click="submit">{{ id > 0 ? 'Guardar revista' : 'Crear revista'}}</v-btn>
		</div>
	</form>
	</div>
    `,
	data: () => ({
		id:0,
		title: '',
		seo: '',
		status: null,
		date: new Date(),
		statusItems: [
		  '',
		  'Borrador',
		  'Previsualizar APP',
		  'Publicada',
		],
		cover:'',
		coverFile:'',
		checkbox: false,
		rules: [
			value => !value || value.size < 2000000 || 'Avatar size should be less than 2 MB!',
		],
	  }),
  
	  computed: {
		checkboxErrors () {
			return ''
		},
		statusErrors () {
			return ''
		},
		titleErrors () {
			return ''
		},
		seoErrors () {
			return ''
		},
		dateErrors () {
			return ''
		}
	  },
	  watch:{  
		target:{
			immediate: true, 
		    handler(v){
				if( v > 0) {
					this.setData()
				}else{
					this.resetData()
				}
			}
		}
	  },
	  mounted(){
		  if(this.id == 0) this.resetData()
	  },
	  methods: {
			resetData(){
				for(let key of ['id','title','seo','cover','date']){
					this[key] = ''
				}
				this.date = new Date()
				this.status = 0
			},
			setData(){
				for(let key of ['id','title','seo','cover','date']){
					this[key] = this.magazine[key]
				}
				this.status = this.statusItems[this.magazine.status]
			},
			async submit () {
				const form = new FormData()
				form.append('title' , this.title)
				form.append('date' , this.date)
				form.append('seo' , this.seo)
				form.append('status' , this.statusItems.indexOf(this.status))
				form.append('fileid' , this.coverFile)
				try{
					let magazine = await axios.post(api('magazine') , form , {
						headers:{
							'Content-Type':'multipart/form-data'
						}
					})
					this.$emit('magazine-create' , magazine.data.success.id)
				}catch( error ){
					console.log( error )
					this.$emit('magazine-create' , error.message)
				}
			},
			clear () {
				this.$v.$reset()
				this.title = ''
				this.seo = ''
				this.date = new Date()
				this.status = null
				this.checkbox = false
			},
			targetCover( event ){
				const [file] = event.target.files
				if (file) {
					this.coverFile = file
					this.cover = URL.createObjectURL(file)
				}
			}
	  },
})