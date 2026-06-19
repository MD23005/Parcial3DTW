const canvas = document.getElementById('mapaCanvas');
const MarcarBtn = document.getElementById('marcar-btn');
const ctx = canvas.getContext('2d');
const pointerMapBtn = document.getElementById('pointer-map')
const btnContinuar = document.getElementById('btn-continuar')

let mapaIniciado = false;
let progreso = 0;
let animacionID = null;

function texturaMar(limiteX) {
        ctx.strokeStyle = 'rgba(255,255,255,0.4)';
        ctx.lineWidth = 1.5;

        for (let y = 250; y < 400; y += 18) {

                const offset = (y / 18 % 2) * 20;

                ctx.beginPath();

                let x = -40 + offset;
                ctx.moveTo(x, y);

                while (x < limiteX + 40) {

                        ctx.quadraticCurveTo(
                                x + 10, y - 5,
                                x + 20, y
                        );

                        ctx.quadraticCurveTo(
                                x + 30, y + 5,
                                x + 40, y
                        );

                        x += 40;
                }

                ctx.stroke();
        }
}

function dibujarRelieve(x, y, base, limiteX) {
        if (x > limiteX) return;

        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 1.5;
        ctx.fillStyle = '#6b5700';

        let altura = base * 0.8;

        ctx.beginPath();
        ctx.moveTo(x - base, y);
        ctx.lineTo(x, y - altura);
        ctx.lineTo(x + base, y);
        ctx.closePath();

        ctx.fill();
        ctx.stroke();

        ctx.beginPath();
        ctx.lineWidth = 1;
        ctx.moveTo(x, y - altura);
        ctx.lineTo(x - (base / 4), y);
        ctx.moveTo(x - 5, y - (altura * 0.5));
        ctx.lineTo(x - 15, y);
        ctx.stroke();
}

function texturaValle(x, y, ancho, alto) {
        ctx.fillStyle = '#fff';

        for (let i = x; i < x + ancho; i += 12) {
                for (let j = y; j < y + alto; j += 12) {
                        ctx.fillRect(i, j, 2, 2);
                        ctx.fillRect(i + 3, j + 3, 1, 2);
                }
        }
}

//Puntos exteriores de El Salvador (Simulados)
const puntosFrontera = [
        { x: 70, y: 20 },
        { x: 120, y: 20 },
        { x: 120, y: 90 },
        { x: 190, y: 90 },
        { x: 370, y: 150 },
        { x: 370, y: 200 },
        { x: 390, y: 200 },
        { x: 410, y: 155 },
        { x: 450, y: 155 },
        { x: 475, y: 185 },
        { x: 500, y: 185 },
        { x: 510, y: 215 },
        { x: 525, y: 240 },
        { x: 500, y: 260 },
        { x: 500, y: 275 },
        { x: 520, y: 295 },
        { x: 500, y: 310 },
        { x: 300, y: 310 },
        { x: 200, y: 260 },
        { x: 200, y: 250 },
        { x: 100, y: 240 },
        { x: 20, y: 190 },
        { x: 0, y: 150 },
        { x: 0, y: 110 },
        { x: 40, y: 95 },
        { x: 80, y: 40 },
        { x: 70, y: 20 },

];

function dibujarSilueta(limiteX) {
        ctx.beginPath();

        const puntosVisibles = puntosFrontera.filter(p => p.x <= limiteX);

        if (puntosVisibles.length > 1) {

                ctx.moveTo(puntosVisibles[0].x, puntosVisibles[0].y);

                for (let i = 0; i < puntosVisibles.length - 1; i++) {
                        const p1 = puntosVisibles[i];
                        const p2 = puntosVisibles[i + 1];

                        const xc = (p1.x + p2.x) / 2;
                        const yc = (p1.y + p2.y) / 2;

                        ctx.quadraticCurveTo(
                                p1.x, p1.y, // punto de control
                                xc, yc      // punto destino
                        );
                }

                // llegar exactamente al último punto
                const ultimo = puntosVisibles[puntosVisibles.length - 1];
                ctx.lineTo(ultimo.x, ultimo.y);
        }
        ctx.closePath();

        ctx.fillStyle = '#2e7d32';
        ctx.fill();

        ctx.save();
        ctx.clip();
        texturaValle(0, 0, 600, 400);
        ctx.restore();

        ctx.strokeStyle = '#387400';
        ctx.lineWidth = 2;
        ctx.stroke();
}

function crearMapa() {
        // Limpiar pantalla
        ctx.fillStyle = '#2700d6';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        texturaMar(progreso);
        dibujarSilueta(progreso);

        dibujarRelieve(50, 190, 25, progreso); 
        dibujarRelieve(250, 180, 20, progreso); 
        dibujarRelieve(350, 200, 22, progreso); 

        if (progreso <= canvas.width) {
                progreso += 10;
                animacionID = requestAnimationFrame(crearMapa);
        }
}

MarcarBtn.addEventListener('click', () => {
        if (animacionID) {
                cancelAnimationFrame(animacionID);
        }

        MarcarBtn.classList.add('btn-hidden');

        pointerMapBtn.classList.remove('btn-hidden');

        progreso = 0;
        crearMapa();
});

pointerMapBtn.addEventListener('click', () => {
        let ubicacion = localStorage.getItem('user_location')

        if (!ubicacion) {
                pointerMapBtn.classList.add('btn-error')

                setTimeout(() => {
                        alert('No se pudo obtener su ubicación, regrese al nivel anterior para guardarla')
                        window.location.href = './nivel1.html'
                }, 500)
        } else {
                try {
                        const userLocation = JSON.parse(ubicacion)

                        if(!userLocation.lon || !userLocation.lat){
                                throw new Error("Formato de la ubicación inválido");
                                alert ('Formato de la ubicación inávlido')                                
                        }

                        const map_width = 800;
                        const map_heigth = 400;

                        const pixelX = ((parseFloat(userLocation.lon)+180)*map_width)/360
                        const pixelY = map_heigth - ((parseFloat(userLocation.lat) + 90)*map_heigth)/180

                        ctx.beginPath()

                        ctx.arc(pixelX,pixelY,8,0,2*Math.PI)
                        ctx.fillStyle = '#ef4444'
                        ctx.fill()
                        ctx.strokeStyle = "#fff"
                        ctx.lineWidth = 2
                        ctx.stroke()
                        ctx.closePath()

                        ctx.fillStyle = '#000'
                        ctx.font = '12px sans-serif'
                        ctx.fillText("Ubicación actual", pixelX + 12, pixelY + 4)
                        

                        btnContinuar.classList.remove('btn-hidden')

                }catch(error){
                        console.error("Error al procesar las coordenadas:", error);
                        pointerMapBtn.classList.add('btn-error');
                        
                        setTimeout(() => {
                                alert('Las coordenadas guardadas están corruptas. Regrese para capturarlas de nuevo.');
                                window.location.href = './nivel1.html';
                        }, 500);
                }
        }


})
btnContinuar.addEventListener('click',()=>{
        window.location.href = './nivel3.html'
})