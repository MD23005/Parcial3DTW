const canvas = document.getElementById('mapaCanvas');
const MarcarBtn = document.getElementById('marcar-btn');
const ctx = canvas.getContext('2d');
const pointerMapBtn = document.getElementById('pointer-map')
const btnContinuar = document.getElementById('btn-continuar')

let mapaIniciado = false;
let progreso = 0;
let animacionID = null; // antes había un typo: se asignaba a "animacionId" (minúscula)

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
        if (x > limiteX) return; // el volcán todavía no "aparece"

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

        // Caminamos por los valles saltando de 12 en 12 píxeles
        for (let i = x; i < x + ancho; i += 12) {
                for (let j = y; j < y + alto; j += 12) {
                        // Pequeños detalles de vegetación
                        ctx.fillRect(i, j, 2, 2);
                        ctx.fillRect(i + 3, j + 3, 1, 2);
                }
        }
}

const puntosFrontera = [
        // Ahuachapán (noroeste)
        { x: 70, y: 180 },
        { x: 90, y: 145 },
        { x: 120, y: 125 },
        { x: 160, y: 115 },

        // Santa Ana
        { x: 200, y: 90 },
        { x: 240, y: 80 },
        { x: 280, y: 85 },

        // Chalatenango (joroba superior)
        { x: 310, y: 55 },
        { x: 350, y: 50 },
        { x: 390, y: 60 },
        { x: 430, y: 80 },

        // Cabañas
        { x: 470, y: 95 },
        { x: 510, y: 105 },

        // Morazán
        { x: 560, y: 120 },
        { x: 610, y: 110 },

        // La Unión (punta oriental)
        { x: 670, y: 135 },
        { x: 720, y: 180 },
        { x: 710, y: 230 },
        { x: 680, y: 270 },

        // Golfo de Fonseca
        { x: 640, y: 290 },

        // Costa sur
        { x: 580, y: 300 },
        { x: 520, y: 305 },
        { x: 460, y: 300 },
        { x: 400, y: 290 },
        { x: 340, y: 275 },
        { x: 280, y: 255 },
        { x: 220, y: 240 },
        { x: 170, y: 230 },
        { x: 120, y: 225 },

        // Regreso a Ahuachapán
        { x: 85, y: 215 }
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

        // Relleno de tierra (antes nunca se rellenaba)
        ctx.fillStyle = '#2e7d32';
        ctx.fill();

        // Textura de vegetación recortada dentro de la silueta
        // (antes texturaValle nunca se llamaba)
        ctx.save();
        ctx.clip();
        texturaValle(80, 70, 800, 400);
        ctx.restore();

        // Contorno blanco
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 2;
        ctx.stroke();
}

function crearMapa() {
        // Limpiar pantalla
        ctx.fillStyle = '#2700d6';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Dibujar los elementos limitados por la variable 'progreso' (Eje X)
        texturaMar(progreso);
        dibujarSilueta(progreso);

        // Cordillera volcánica icónica de El Salvador
        dibujarRelieve(220, 190, 25, progreso); // Complejo Volcánico de Santa Ana / Izalco
        dibujarRelieve(360, 180, 20, progreso); // Volcán de San Salvador
        dibujarRelieve(480, 200, 22, progreso); // Volcán de San Vicente (Chinchontepec)
        dibujarRelieve(600, 210, 25, progreso); // Volcán de San Miguel (Chaparrastique)

        // Incrementar el progreso (aumenta la velocidad cambiando este número)
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