window.addEventListener("DOMContentLoaded", ()=>{
    const city = document.querySelector('.ss-city');
    const ancho_edificio = 32;
    const ancho_pantalla = window.innerWidth;

    const cantidad_edificios = Math.ceil(ancho_pantalla/ancho_edificio);

    let edificiosCSS = [];
    let ventanasCSS = [];

    for(let i = 1; i <= cantidad_edificios; i++){
        let posX = i*ancho_edificio;

        let altura_edificio = Math.floor(Math.random() * (-70 -(-10)+1)+10);

        edificiosCSS.push(`${posX}px ${altura_edificio}px 0 0 #0f0c1b`);

        let ventana1X = posX + 10;
        let ventana1Y = altura_edificio + 15;

        ventanasCSS.push(`${ventana1X}px ${ventana1Y}px 0 0 #ffe066`)
  
        let ventana2X = posX + 18;
        let ventana2Y = altura_edificio + 35;
        let colorVentana = (i%3 === 0) ? '#f9a03f' : '#ffe066'

        ventanasCSS.push(`${ventana2X}px ${ventana2Y}px 0 0 ${colorVentana}`);
    }

    city.style.boxShadow = edificiosCSS.join(', ');

    const EstiloVentana = document.createElement('style');
    EstiloVentana.innerHTML=`.ss-city::before { box-shadow: ${ventanasCSS.join(', ')}; }`;
    document.head.appendChild(EstiloVentana);
})

const botonIniciar = document.getElementById("btn-iniciar");
const pantalla = document.getElementById("pantalla");

botonIniciar.addEventListener("click", ()=>{
    botonIniciar.classList.add('boton-hidden');

    pantalla.classList.add('fullscreen');
})

pantalla.addEventListener("transitionend",(event)=>{
    if(event.propertyName === 'width'){
        window.location.href = './html/nivel1.html'
    }
})