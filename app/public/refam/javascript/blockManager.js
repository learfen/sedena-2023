function base_template() {
  return {
    id: "base-template", // id is mandatory
    label: `<div>
			<img src="/refam/templates/templete18.png"/>
			<div class="my-label-block">Template 1</div>
			</div>`, // Set the images here
    category: "Templates",
    attributes: { class: "gjs-block-section" },
    content: `<div class="template v-18">
			<figure class="img-title v-18">
				<img src="/refam/images/sedena.png" alt="">
			</figure>
			<div class="white-square v-18">
				<h2>Porque todos somos México</h2>
				<p>…y unidos somos la Gran Fuerza de México</p>
				<h5>Sgto. 1/o. Aux. Ofta. Liliana Reyes Sánchez Licenciada en Comunicación
					Dirección General de Comunicación Social</h5>
			</div>
			<div id="content" class="text-content">
				<p>Debido a la contingencia a nivel global por Coronavirus COVID-19, elementos de la Fuerza Aérea, en
					coordinación con personal del Ejército y de la Secretaría de Relaciones Exteriores llevaron a cabo vuelos de
					traslado humanitario de Cuba, Perú, Argentina, Chile y Uruguay.</p>
				<p>Lo anterior, es resultado del trabajo intenso que realizan las Secretarías de la Defensa Nacional y
					Relaciones Exteriores, afrontando cada misión con disposición y compromiso, permitiendo mantener el
					prestigio, confianza y respaldo otorgado por los mexicanos.</p>
			</div>
			</div>`,
    render: ({ model, className }) => `<div class="${className}__my-wrap">
			${model.get("label")}
			</div>`,
  };
}

function base_template2() {
  return {
    id: "base-template-2", // id is mandatory
    label: `<div>
			<img src="/refam/templates/templete3.png"/>
			<div class="my-label-block">Template 2</div>
			</div>`, // You can use HTML/SVG inside labels
    category: "Templates",
    attributes: { class: "gjs-block-section" },
    content: `<div class="template">
			<video src="/refam/video/video-example-2.webm" controls width="100%" mute autoplay loop></video>
			<div class="heading">
				<h5>Sgto. 1/o. Aux. Ofta. Liliana Reyes Sánchez Licenciada en Comunicación
					Dirección General de Comunicación Social</h5>
			</div>
			</div>`,
    render: ({ model, className }) => `<div class="${className}__my-wrap">
			${model.get("label")}
			
			</div>`,
  };
}

function base_template3() {
  return {
    id: "base-template-3", // id is mandatory
    label: `<div>
              <img src="/refam/templates/templete2.png"/>
              <div class="my-label-block">Template 3</div>
            </div>`, // You can use HTML/SVG inside labels
    category: "Templates",
    attributes: { class: "gjs-block-section" },
    content: `<div class="template">
				<video src="/refam/video/video-example.mp4"   mute autoplay loop controls width="100%"></video>
				<div class="heading">
					<h2>Porque todos somos México</h2>
					<p>y unidos somos la Gran Fuerza de México</p>
				</div>
			</div>`,
    render: ({ model, className }) => `<div class="${className}__my-wrap">
            ${model.get("label")}
          </div>`,
  };
}

function base_template4() {
  return {
    id: "base-template-4", // id is mandatory
    label: `<div>
		<img src="/refam/templates/templete22.png"/>
		<div class="my-label-block">Template 4</div>
		</div>`, // You can use HTML/SVG inside labels
    category: "Templates",
    attributes: { class: "gjs-block-section" },
    content: `<div class="template v-22">
		<figure class="img-title v-22">
		<img class="full-img" src="/refam/images/noche-zocalo.png" alt="">
		<img src="/refam/images/filtro-blanco.png" alt="">
		</figure>
		<div class="black-square">
		<h2>Porque todos somos México</h2>
		<p>…y unidos somos la Gran Fuerza de México</p>
		</div>
		<img src="/refam/images/pixel-azul.png" alt="">
		</div>`,
    render: ({ model, className }) => `<div class="${className}__my-wrap">
${model.get("label")}
</div>`,
  };
}

function base_template5() {
  return {
    id: "base-template-5", // id is mandatory
    label: `<div>
		<img src="/refam/templates/templete1.png"/>
		<div class="my-label-block">Template 5</div>
		</div>`, // You can use HTML/SVG inside labels
    category: "Templates",
    attributes: { class: "gjs-block-section" },
    content: `<div class="template">
		<div class="heading">
		<h2>Porque todos somos México</h2>
		<p>y unidos somos la Gran Fuerza de México</p>
		</div>
		<video src="/refam/video/video-example.mp4"   mute autoplay loop controls width="100%"></video>
		</div>`,
    render: ({ model, className }) => `<div class="${className}__my-wrap">
		${model.get("label")}
		</div>`,
  };
}

function base_template6() {
  return {
    id: "base-template-6", // id is mandatory
    label: `<div>
		<img src="/refam/templates/templete24.png"/>
		<div class="my-label-block">Template 6</div>
		</div>`, // You can use HTML/SVG inside labels
    category: "Templates",
    attributes: { class: "gjs-block-section" },
    content: `<div class="template bg-blue">
		<img class="texture1" src="/refam/images/pixel_blue.svg" />
		<figure class="img-title v-24">
		<div class="dark-square">
			<h2>Porque todos somos México</h2>
			<p>…y unidos somos la <br>Gran Fuerza de <br>México</p>
			<h5>Sgto. 1/o. Aux. Ofta. Liliana Reyes Sánchez Licenciada en Comunicación Dirección General de Comunicación Social</h5>
		</div>
		</figure>
		</div>`,
    render: ({ model, className }) => `<div class="${className}__my-wrap">
${model.get("label")}
</div>`,
  };
}

function base_template7() {
  return {
    id: "base-template-7", // id is mandatory
    label: `<div>
		<img src="/refam/templates/templete13.png"/>
		<div class="my-label-block">Template 7</div>
		</div>`, // You can use HTML/SVG inside labels
    category: "Templates",
    attributes: { class: "gjs-block-section" },
    content: `<div class="template">
		<figure class="img-title v-13">
		<img src="/refam/images/castillo.png" />
		<div class="circle">
			<h2>¿Sabías qué?</h2>
			<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quae ullam illum unde mollitia possimus praesentium asperiores totam qui officiis laudantium repellat, ad maxime ipsum suscipit? Alias nihil debitis facere itaque?</p>
		</div>
		</figure>
		</div>`,
    render: ({ model, className }) => `<div class="${className}__my-wrap">
${model.get("label")}
</div>`,
  };
}

function base_template8() {
  return {
    id: "base-template-8", // id is mandatory
    label: `<div>
		<img src="/refam/templates/templete27.png"/>
		<div class="my-label-block">Template 8</div>
		</div>`, // You can use HTML/SVG inside labels
    category: "Templates",
    attributes: { class: "gjs-block-section" },
    content: `<div class="template v-19 bg-gray">
		<img src="/refam/images/pixel_green.svg" alt="">
		<figure class="img-title v-19">
		<img src="/refam/images/imagen-triangulo.png" />
		<img src="/refam/images/triangulo-blanco.png" />
		<h2>Porque <br> todos somos México</h2>
		<h5>…y unidos somos la Gran Fuerza de México</h5>
		</figure>
		</div>`,
    render: ({ model, className }) => `<div class="${className}__my-wrap">
${model.get("label")}
</div>`,
  };
}

function base_template9() {
  return {
    id: "base-template-9", // id is mandatory
    label: `<div>
		<img src="/refam/templates/templete15.png"/>
		<div class="my-label-block">Template 9</div>
		</div>`, // You can use HTML/SVG inside labels
    category: "Templates",
    attributes: { class: "gjs-block-section" },
    content: `<div class="template bg-gray">
		<figure class="img-title v-15">
		<div class="red-square"></div>
		<h2>Las Secretarías de Relaciones Exteriores y Defensa Nacional realizan vuelo humanitario </h2>
		<h5>Sgto. 1/o. Aux. Ofta. Liliana Reyes Sánchez Licenciada en Comunicación Dirección General de Comunicación Social</h5>
		</figure>
		<div id="content" class="text-content">
		<p>Debido a la contingencia a nivel global por Coronavirus COVID-19, elementos de la Fuerza Aérea, en coordinación con personal del Ejército y de la Secretaría de Relaciones Exteriores llevaron a cabo vuelos de traslado humanitario de Cuba, Perú, Argentina, Chile y Uruguay.</p>
		<p>Lo anterior, es resultado del  trabajo intenso que realizan las Secretarías de la Defensa  Nacional y Relaciones Exteriores, afrontando cada misión con disposición y compromiso, permitiendo mantener el prestigio, confianza y respaldo otorgado por los mexicanos.</p>
		</div>
		</div>`,
    render: ({ model, className }) => `<div class="${className}__my-wrap">
${model.get("label")}
</div>`,
  };
}

function base_template10() {
  return {
    id: "base-template-10", // id is mandatory
    label: `<div>
		<img src="/refam/templates/templete5.png"/>
		<div class="my-label-block">Template 10</div>
		</div>`, // You can use HTML/SVG inside labels
    category: "Templates",
    attributes: { class: "gjs-block-section" },
    content: `<div class="template">
		<div class="pleca">
		<img src="/refam/svg/soldados-aire.svg" alt="icono de tropa militar" >
		</div>
		<figure class="video-title">
		<video src="/refam/video/video-example.mp4"  mute autoplay loop controls width="100%"></video>
		<h2>¿Qué es una onda de Montaña?</h2>
		<h5>Sgto. 1/o. Aux. Ofta. Liliana Reyes Sánchez Licenciada en Comunicación Dirección General de Comunicación Social</h5>
		<img class="icon" src="/refam/svg/icono-bajar.svg" />
		</figure>
		<div id="content" class="text-content">
		<p><strong>Debido a la contingencia a nivel global por Coronavirus COVID-19, elementos de la Fuerza Aérea, en coordinación con personal del Ejército y de la Secretaría de Relaciones Exteriores llevaron a cabo vuelos de traslado humanitario de Cuba, Perú, Argentina, Chile y Uruguay.</strong></p>
		<p>Lo anterior, es resultado del  trabajo intenso que realizan las Secretarías de la Defensa  Nacional y Relaciones Exteriores, afrontando cada misión con disposición y compromiso, permitiendo mantener el prestigio, confianza y respaldo otorgado por los mexicanos.</p>
		<p>Con estas acciones, ambas dependencias refrendan su compromiso de velar y salvaguardar a los ciudadanos, trabajando con determinación para contribuir al bienestar y salud del pueblo de México.</p>
		</div>
		<figure class="only-image">
		<img src="/refam/images/svion.jpg"/>
		</figure>
		</div>`,
    render: ({ model, className }) => `<div class="${className}__my-wrap">
${model.get("label")}
</div>`,
  };
}

function base_template11() {
  return {
    id: "base-template-11", // id is mandatory
    label: `<div>
		<img src="/refam/templates/templete4.png"/>
		<div class="my-label-block">Template 11</div>
		</div>`, // You can use HTML/SVG inside labels
    category: "Templates",
    attributes: { class: "gjs-block-section" },
    content: `<div class="template">
		<div class="pleca">
		<img src="/refam/svg/soldados-de-tierra-01.svg" alt="icono de tropa militar" >
		</div>
		<figure class="img-title">
		<img src="/refam/images/balsas-ejercito.png" />
		<h2>Las Secretarías de Relaciones Exteriores y Defensa Nacional realizan vuelo humanitario</h2>
		<h5>Sgto. 1/o. Aux. Ofta. Liliana Reyes Sánchez Licenciada en Comunicación Dirección General de Comunicación Social</h5>
		<img class="icon" src="/refam/svg/icono-bajar.svg" />
		</figure>
		<div id="content" class="text-content">
		<p><strong>Debido a la contingencia a nivel global por Coronavirus COVID-19, elementos de la Fuerza Aérea, en coordinación con personal del Ejército y de la Secretaría de Relaciones Exteriores llevaron a cabo vuelos de traslado humanitario de Cuba, Perú, Argentina, Chile y Uruguay.</strong></p>
		<p>Lo anterior, es resultado del  trabajo intenso que realizan las Secretarías de la Defensa  Nacional y Relaciones Exteriores, afrontando cada misión con disposición y compromiso, permitiendo mantener el prestigio, confianza y respaldo otorgado por los mexicanos.</p>
		<p>Con estas acciones, ambas dependencias refrendan su compromiso de velar y salvaguardar a los ciudadanos, trabajando con determinación para contribuir al bienestar y salud del pueblo de México.</p>
		</div>
		<figure class="only-image">
		<img src="/refam/images/avion-fuerza-aerea.png"/>
		</figure>
		</div>`,
    render: ({ model, className }) => `<div class="${className}__my-wrap">
${model.get("label")}
</div>`,
  };
}

function base_template12() {
  return {
    id: "base-template-12", // id is mandatory
    label: `<div>
		<img src="/refam/templates/templete17.png"/>
		<div class="my-label-block">Template 12</div>
		</div>`, // You can use HTML/SVG inside labels
    category: "Templates",
    attributes: { class: "gjs-block-section" },
    content: `<div class="template">
		<div class="banner-layers">
		<img src="/refam/images/castillo-chapu.png" alt="castillo chapultepec">
		<img class="img-squares" src="/refam/images/cuadricula-blanca.png" alt="cuadricula blanca">
		<img class="green-square" src="/refam/images/cuadro-verde.png" alt="cuadro verde">
		<h2>Las Secretarías de Relaciones Exteriores y Defensa Nacional realizan vuelo humanitario </h2>
		<h5>Sgto. 1/o. Aux. Ofta. Liliana Reyes Sánchez Licenciada en Comunicación Dirección General de Comunicación Social</h5>
		</div>
		<div class="text-content v-17">
		<p>
		Lo anterior, es resultado del  trabajo intenso que realizan las Secretarías de la Defensa  Nacional y Relaciones Exteriores, afrontando cada misión con disposición y compromiso, permitiendo mantener el prestigio, confianza y respaldo otorgado por los mexicanos.
		</p>
		<p>
		Con estas acciones, ambas dependencias refrendan su compromiso de velar y salvaguardar a los ciudadanos, trabajando con determinación para contribuir al bienestar y salud del pueblo de México.
		</p>
		</div>
		</div>`,
    render: ({ model, className }) => `<div class="${className}__my-wrap">
${model.get("label")}
</div>`,
  };
}

function base_template13() {
  return {
    id: "base-template-13", // id is mandatory
    label: `<div>
		<img src="/refam/templates/templete19.png"/>
		<div class="my-label-block">Template 13</div>
		</div>`, // You can use HTML/SVG inside labels
    category: "Templates",
    attributes: { class: "gjs-block-section" },
    content: `<div class="template">
		<div class="banner-layers v-19">
		<img src="/refam/images/rev-noche.png" alt="Monumento a la revolucion">
		<img class="green-square" src="/refam/images/cuadro-azul.png" alt="cuadro verde">
		<h2>Las Secretarías de Relaciones Exteriores y Defensa Nacional realizan vuelo humanitario </h2>
		<h5>Sgto. 1/o. Aux. Ofta. Liliana Reyes Sánchez <br> Licenciada en Comunicación <br> Dirección General de Comunicación Social</h5>
		</div>
		<div class="text-content v-17">
		<p>
		Lo anterior, es resultado del  trabajo intenso que realizan las Secretarías de la Defensa  Nacional y Relaciones Exteriores, afrontando cada misión con disposición y compromiso, permitiendo mantener el prestigio, confianza y respaldo otorgado por los mexicanos.
		</p>
		<p>
		Con estas acciones, ambas dependencias refrendan su compromiso de velar y salvaguardar a los ciudadanos, trabajando con determinación para contribuir al bienestar y salud del pueblo de México.
		</p>
		</div>
		</div>`,
    render: ({ model, className }) => `<div class="${className}__my-wrap">
${model.get("label")}
</div>`,
  };
}

function base_template14() {
  return {
    id: "base-template-14", // id is mandatory
    label: `<div>
		<img src="/refam/templates/templete11.png"/>
		<div class="my-label-block">Template 14</div>
		</div>`, // You can use HTML/SVG inside labels
    category: "Templates",
    attributes: { class: "gjs-block-section" },
    content: `<div class="template">
		<div class="pleca pleca-v7">
		<img src="/refam/svg/soldados-aire.svg" alt="icono de tropa militar" >
		</div>
		<figure class="img-title v-11">
		<img src="/refam/images/purple-square.png" alt="">
		<img src="/refam/images/soldado-boina.png" />
		<img src="/refam/images/purple-square.png" alt="">
		<h2>Comisión Ejecutiva de Atención a Víctimas</h2>
		<h5>Sgto. 1/o. Aux. Ofta. Liliana Reyes Sánchez Licenciada en Comunicación Dirección General de Comunicación Social</h5>
		</figure>
		</div>`,
    render: ({ model, className }) => `<div class="${className}__my-wrap">
${model.get("label")}
</div>`,
  };
}

function base_template15() {
  return {
    id: "base-template-15", // id is mandatory
    label: `<div>
		<img src="/refam/templates/templete20.png"/>
		<div class="my-label-block">Template 15</div>
		</div>`, // You can use HTML/SVG inside labels
    category: "Templates",
    attributes: { class: "gjs-block-section" },
    content: `<div class="template">
		<div class="banner-layers v-20">
		<img src="/refam/images/soldados.png" alt="castillo chapultepec">
		<img src="/refam/images/bg-one.png" alt="cuadricula blanca">
		<h2>Las Secretarías de Relaciones Exteriores y Defensa Nacional realizan vuelo humanitario </h2>
		<h5>Sgto. 1/o. Aux. Ofta. Liliana Reyes Sánchez Licenciada en Comunicación</h5>
		</div>
		<div class="text-content v-20">
		<p>
		Lo anterior, es resultado del  trabajo intenso que realizan las Secretarías de la Defensa  Nacional y Relaciones Exteriores, afrontando cada misión con disposición y compromiso, permitiendo mantener el prestigio, confianza y respaldo otorgado por los mexicanos.
		</p>
		<p>
		Con estas acciones, ambas dependencias refrendan su compromiso de velar y salvaguardar a los ciudadanos, trabajando con determinación para contribuir al bienestar y salud del pueblo de México.
		</p>
		</div>
		</div>`,
    render: ({ model, className }) => `<div class="${className}__my-wrap">
${model.get("label")}
</div>`,
  };
}

function base_template16() {
  return {
    id: "base-template-16", // id is mandatory
    label: `<div>
		<img src="/refam/templates/templete26.png"/>
		<div class="my-label-block">Template 16</div>
		</div>`, // You can use HTML/SVG inside labels
    category: "Templates",
    attributes: { class: "gjs-block-section" },
    content: `<div class="template v-12b">
		<div class="section-img-two">
		<img src="/refam/images/vehiculo-militar.png" alt="vehiculo militar" />
		</div>
		<div class="you-know">
		<h2>¿Sabías qué?</h2>
		<p>
			Lo anterior, es resultado del  trabajo intenso que realizan las Secretarías de la Defensa  Nacional y Relaciones Exteriores, afrontando cada misión con disposición y compromiso, permitiendo mantener el prestigio, confianza y respaldo otorgado por los mexicanos.
		</p>
		</div>
		</div>`,
    render: ({ model, className }) => `<div class="${className}__my-wrap">
${model.get("label")}
</div>`,
  };
}

function base_template17() {
  return {
    id: "base-template-17", // id is mandatory
    label: `<div>
		<img src="/refam/templates/templete12.png"/>
		<div class="my-label-block">Template 17</div>
		</div>`, // You can use HTML/SVG inside labels
    category: "Templates",
    attributes: { class: "gjs-block-section" },
    content: `<div class="template v-12">
		<div class="section-img-three">
		<img src="/refam/images/enfermera.png" alt="enfermera" />
		</div>
		<div class="you-know circle">
		<h2>¿Sabías qué?</h2>
		<p>
			Lo anterior, es resultado del  trabajo intenso que realizan las Secretarías de la Defensa  Nacional y Relaciones Exteriores, afrontando cada misión con disposición y compromiso, permitiendo mantener el prestigio, confianza y respaldo otorgado por los mexicanos.
		</p>
		</div>
		</div>`,
    render: ({ model, className }) => `<div class="${className}__my-wrap">
${model.get("label")}
</div>`,
  };
}

function base_template18() {
  return {
    id: "base-template-18", // id is mandatory
    label: `<div>
		<img src="/refam/templates/templete25.png"/>
		<div class="my-label-block">Template 18</div>
		</div>`, // You can use HTML/SVG inside labels
    category: "Templates",
    attributes: { class: "gjs-block-section" },
    content: `<div class="template v-25">
		<div class="pleca pleca-v8">
		<img src="/refam/svg/soldados-de-tierra-01.svg" alt="icono de tropa militar" >
		</div>
		<div class="section-img-four">
		<h2>Las Secretarías de Relaciones Exteriores y Defensa Nacional realizan vuelo humanitario</h2>
		<h5>Sgto. 1/o. Aux. Ofta. Liliana Reyes Sánchez Licenciada en Comunicación Dirección General de Comunicación Social</h5>
		<img src="/refam/images/fondo-papel.png" alt="vehiculo militar" />
		</div>
		<figure>
		<img src="/refam/images/sombra-diagonal.png" alt="diagonal">
		<div class="triangle-bottomright"></div>
		</figure>
		</div>`,
    render: ({ model, className }) => `<div class="${className}__my-wrap">
${model.get("label")}
</div>`,
  };
}

function base_template19() {
  return {
    id: "base-template-19", // id is mandatory
    label: `<div>
		<img src="/refam/templates/templete21.png"/>
		<div class="my-label-block">Template 19</div>
		</div>`, // You can use HTML/SVG inside labels
    category: "Templates",
    attributes: { class: "gjs-block-section" },
    content: `<div class="template v-19-b">
		<figure class="img-title v-19-b">
		<img src="/refam/images/tringulo-superior-verde.png" />
		<img src="/refam/images/soldados-inferior.png" />
		<img src="/refam/images/tringulo-derecho-verde.png" alt="">
		<h2>Porque <br> todos somos México</h2>
		<h5>…y unidos somos la Gran Fuerza de México</h5>
		</figure>
		</div>`,
    render: ({ model, className }) => `<div class="${className}__my-wrap">
${model.get("label")}
</div>`,
  };
}

function base_template20() {
  return {
    id: "base-template-20", // id is mandatory
    label: `<div>
		<img src="/refam/templates/templete14.png"/>
		<div class="my-label-block">Template 20</div>
		</div>`, // You can use HTML/SVG inside labels
    category: "Templates",
    attributes: { class: "gjs-block-section" },
    content: `<div class="template v-14">
		<h2>Porque todos somos México</h2>
		<h5>Sgto. 1/o. Aux. Ofta. Liliana Reyes Sánchez Licenciada en Comunicación Dirección General de Comunicación Social</h5>
		<img src="/refam/images/castillo-cha.png" />
		<h3>…y unidos somos la </h3>
		<h2 class="second-h">Gran Fuerza de México</h2>
		<img class="barra-azul" src="/refam/images/barra-chapu-01.png" alt="">
		</div>`,
    render: ({ model, className }) => `<div class="${className}__my-wrap">
${model.get("label")}
</div>`,
  };
}

function base_template21() {
  return {
    id: "base-template-21", // id is mandatory
    label: `<div>
		<img src="/refam/templates/templete16.png"/>
		<div class="my-label-block">Template 21</div>
		</div>`, // You can use HTML/SVG inside labels
    category: "Templates",
    attributes: { class: "gjs-block-section" },
    content: `<div class="template">
		<img class="ceja" src="/refam/images/emblema-01.png" alt="">
		<img class="logo" src="/refam/images/refam-logo.png" alt="">
		<img class="main-img" src="/refam/images/sdn-01.png" alt="">
		<div class="footer-legend">
		<h2>Porque todos somos México</h2>
		<h5>…y unidos somos la Gran Fuerza de México</h5>
		</div>
		</div>`,
    render: ({ model, className }) => `<div class="${className}__my-wrap">
${model.get("label")}
</div>`,
  };
}

function base_template22() {
  return {
    id: "base-template-22", // id is mandatory
    label: `<div>
		<img src="/refam/templates/templete6.png"/>
		<div class="my-label-block">Template 22</div>
		</div>`, // You can use HTML/SVG inside labels
    category: "Templates",
    attributes: { class: "gjs-block-section" },
    content: `<div class="template">
		<div class="pleca pleca-v9">
		<img src="/refam/svg/soldados-de-tierra-01.svg" alt="icono de tropa militar" >
		</div>
		<img class="sections" src="/refam/images/secciones-02.png" alt="vehiculo militar" />
		<div class="headings">
		<h2>Tecnología de punta en el Sistema Educativo</h2>
		<h5>Sgto. 1/o. Aux. Ofta. Liliana Reyes Sánchez Licenciada en Comunicación 
			Dirección General de Comunicación Social</h5>
		</div>
		<div class="text-content txt-v7">
		<p><strong>Debido a la contingencia a nivel global por Coronavirus COVID-19, elementos de la Fuerza Aérea, en coordinación con personal del Ejército y de la Secretaría de Relaciones Exteriores llevaron a cabo vuelos de traslado humanitario de Cuba, Perú, Argentina, Chile y Uruguay.</strong></p>
		<p>Lo anterior, es resultado del  trabajo intenso que realizan las Secretarías de la Defensa  Nacional y Relaciones Exteriores, afrontando cada misión con disposición y compromiso, permitiendo mantener el prestigio, confianza y respaldo otorgado por los mexicanos.</p>
		<p>Con estas acciones, ambas dependencias refrendan su compromiso de velar y salvaguardar a los ciudadanos, trabajando con determinación para contribuir al bienestar y salud del pueblo de México.</p>
		</div>
		</div>`,
    render: ({ model, className }) => `<div class="${className}__my-wrap">
${model.get("label")}
</div>`,
  };
}

function base_template23() {
  return {
    id: "base-template-23", // id is mandatory
    label: `<div>
		<img src="/refam/templates/templete23.png"/>
		<div class="my-label-block">Template 23</div>
		</div>`, // You can use HTML/SVG inside labels
    category: "Templates",
    attributes: { class: "gjs-block-section" },
    content: `<div class="template v-7">
		<div class="pleca pleca-v10">
		<img src="/refam/svg/historia-militar-04.svg" alt="icono de tropa militar" >
		</div>
		<h2>El Ejército siglo XXI, pilar del Estado</h2>
		<h5>Sgto. 1/o. Aux. Ofta. Liliana Reyes Sánchez Licenciada en <br>Comunicación <br> Dirección General de Comunicación Social</h5>
		<img class="sections" src="/refam/images/soldado-01.png" alt="vehiculo militar" />

		<div class="text-content txt-v8">
		<p><strong>Debido a la contingencia a nivel global por Coronavirus COVID-19, elementos de la Fuerza Aérea, en coordinación con personal del Ejército y de la Secretaría de Relaciones Exteriores llevaron a cabo vuelos de traslado humanitario de Cuba, Perú, Argentina, Chile y Uruguay.</strong></p>
		<p>Lo anterior, es resultado del  trabajo intenso que realizan las Secretarías de la Defensa  Nacional y Relaciones Exteriores, afrontando cada misión con disposición y compromiso, permitiendo mantener el prestigio, confianza y respaldo otorgado por los mexicanos.</p>
		<p>Con estas acciones, ambas dependencias refrendan su compromiso de velar y salvaguardar a los ciudadanos, trabajando con determinación para contribuir al bienestar y salud del pueblo de México.</p>
		</div>
		</div>`,
    render: ({ model, className }) => `<div class="${className}__my-wrap">
${model.get("label")}
</div>`,
  };
}

function base_template24() {
  return {
    id: "base-template-24", // id is mandatory
    label: `<div>
		<img src="/refam/templates/templete10.png"/>
		<div class="my-label-block">Template 24</div>
		</div>`, // You can use HTML/SVG inside labels
    category: "Templates",
    attributes: { class: "gjs-block-section" },
    content: `<div class="template">
		<div class="pleca pleca-v10">
		<img src="/refam/svg/soldados-de-tierra-01.svg" alt="icono de tropa militar" >
		</div>
		<div class="section-img-one bg-v7">
		<h2>Las Secretarías de Relaciones Exteriores y Defensa Nacional realizan vuelo humanitario</h2>
		<h5>Sgto. 1/o. Aux. Ofta. Liliana Reyes Sánchez Licenciada en Comunicación Dirección General de Comunicación Social</h5>
		<img class="textura" src="/refam/images/textura-1.png" alt="vehiculo militar" />
		</div>
		<div class="text-content txt-v8">
		<p><strong>Debido a la contingencia a nivel global por Coronavirus COVID-19, elementos de la Fuerza Aérea, en coordinación con personal del Ejército y de la Secretaría de Relaciones Exteriores llevaron a cabo vuelos de traslado humanitario de Cuba, Perú, Argentina, Chile y Uruguay.</strong></p>
		<p>Lo anterior, es resultado del  trabajo intenso que realizan las Secretarías de la Defensa  Nacional y Relaciones Exteriores, afrontando cada misión con disposición y compromiso, permitiendo mantener el prestigio, confianza y respaldo otorgado por los mexicanos.</p>
		<p>Con estas acciones, ambas dependencias refrendan su compromiso de velar y salvaguardar a los ciudadanos, trabajando con determinación para contribuir al bienestar y salud del pueblo de México.</p>
		</div>
		</div>`,
    render: ({ model, className }) => `<div class="${className}__my-wrap">
${model.get("label")}
</div>`,
  };
}

function base_magazine() {
	return {
	  id: "base-template", // id is mandatory
	  label: `<div>
			  <img src="/refam/templates/templete18.png"/>
			  <div class="my-label-block">Template 1</div>
			  </div>`, // Set the images here
	  category: "Templates",
	  attributes: { class: "gjs-block-section" },
	  content: `<div class="template v-18">
			  <figure class="img-title v-18">
				  <img src="/refam/images/sedena.png" alt="">
			  </figure>
			  <div class="white-square v-18">
				  <h2>LEARFEN Porque todos somos México</h2>
				  <p>…y unidos somos la Gran Fuerza de México</p>
				  <h5>Sgto. 1/o. Aux. Ofta. Liliana Reyes Sánchez Licenciada en Comunicación
					  Dirección General de Comunicación Social</h5>
			  </div>
			  <div id="content" class="text-content">
				  <p>Debido a la contingencia a nivel global por Coronavirus COVID-19, elementos de la Fuerza Aérea, en
					  coordinación con personal del Ejército y de la Secretaría de Relaciones Exteriores llevaron a cabo vuelos de
					  traslado humanitario de Cuba, Perú, Argentina, Chile y Uruguay.</p>
				  <p>Lo anterior, es resultado del trabajo intenso que realizan las Secretarías de la Defensa Nacional y
					  Relaciones Exteriores, afrontando cada misión con disposición y compromiso, permitiendo mantener el
					  prestigio, confianza y respaldo otorgado por los mexicanos.</p>
			  </div>
			  </div>`,
	  render: ({ model, className }) => `<div class="${className}__my-wrap">
			  ${model.get("label")}
			  </div>`,
	};
  }