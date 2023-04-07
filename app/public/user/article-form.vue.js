Vue.component("article-form", {
	props: ["target", "article","magazines"],
	template: `
    <div class="container" style="max-width:480px">
	<h3>Nuevo articulo</h3>
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
			placeholder="Ingrese palabras claves para la busqueda"
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
		<v-text-field
			v-model="page"
			type="number"
			placeholder="0"
			label="Numero de pagina."
		></v-text-field>
		<v-select
			v-model="magazineRef"
			:items="magazines"
			label="Revista: "
		></v-select>
		<v-select
			v-model="status"
			:items="statusItems"
			label="Estado"
			required
			v-if="id > 0"
		></v-select>
		<div  v-if="cover!=''" @click="$refs['cover-input'].click()">
			<v-img  width="50px" height="50px" :src="cover"></v-img>
			<small>Click en la imagen para cambiar</small>
		</div>
		<v-btn v-else small @click="$refs['cover-input'].click()">Selecciona portada</v-btn>
		<div class="my-5 pa-2">
			<v-btn class="red white--text" @click="$emit('close')">Cancelar</v-btn>
			<v-btn class="mr-4 green white--text" @click="submit">{{ id > 0 ? 'Guardar articulo' : 'Crear articulo'}}</v-btn>
		</div>
	</form>
	</div>
    `,
	data: () => ({
		id: 0,
		title: '',
		seo: '',
		status: null,
		statusItems: ['', 'Borrador', 'Previsualizar APP', 'Publicada'],
		cover: '',
		coverFile: '',
		checkbox: false,
		magazineRef:'',
		page: 0,
		rules: [
			(value) =>
				!value ||
				value.size < 2000000 ||
				'Avatar size should be less than 2 MB!',
		],
	}),

	computed: {
		checkboxErrors() {
			return '';
		},
		statusErrors() {
			return '';
		},
		titleErrors() {
			return '';
		},
		seoErrors() {
			return '';
		},
		pageErrors() {
			return '';
		},
	},
	watch: {
		target: {
			immediate: true,
			handler(v) {
				if (v > 0) {
					this.setData();
				} else {
					this.resetData();
				}
			},
		},
	},
	mounted() {
		if (this.id == 0) this.resetData();
	},
	methods: {
		resetData() {
			for (let key of ['id', 'title', 'seo', 'cover', 'page','magazineRef']) {
				this[key] = '';
			}
			this.status = 0;
		},
		setData() {
			for (let key of ['id', 'title', 'seo', 'cover', 'page','magazineRef']) {
				this[key] = this.article[key];
			}
			this.status = this.statusItems[this.article.status];
		},
		async submit() {
			const form = new FormData();
			form.append('title', this.title);
			form.append('seo', this.seo);
			form.append('page', this.page);
			form.append('magazineId', this.magazineRef.split('@')[1]);
			form.append('status', this.statusItems.indexOf(this.status));
			form.append('fileid', this.coverFile);
			try {
				let article = await axios.post(api('article'), form, {
					headers: {
						'Content-Type': 'multipart/form-data',
					},
				});
				this.$emit('article-create', article.data.success.id);
			} catch (error) {
				console.log(error);
				this.$emit('article-create', error.message);
			}
		},
		clear() {
			this.$v.$reset();
			this.title = '';
			this.seo = '';
			this.magazineRef = '';
			this.page = 0;
			this.status = null;
			this.checkbox = false;
		},
		targetCover(event) {
			const [file] = event.target.files;
			if (file) {
				this.coverFile = file;
				this.cover = URL.createObjectURL(file);
			}
		},
	},
});
