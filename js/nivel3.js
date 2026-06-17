// CONEXION CON RONALD: cambiar key si Ronald usa otra
const KEY_ANTERIOR = 'nivel2_completado';
const KEY_ACTUAL = 'nivel3_completado';
const RUTA_SIGUIENTE = '../html/nivel4.html';

// refs al DOM
const faseIntro = document.getElementById('fase-intro');
const faseCamara = document.getElementById('fase-camara');
const textoTerminal = document.getElementById('texto-terminal');
const btnActivar = document.getElementById('btn-activar-camara');
const videoStream = document.getElementById('video-stream');
const btnCapturar = document.getElementById('btn-capturar');
const canvasCaptura = document.getElementById('canvas-captura');
const fotoCapturada = document.getElementById('foto-capturada');
const evidenciaPlaceholder = document.getElementById('evidencia-placeholder');
const infoCapturaDiv = document.getElementById('info-captura');
const infoTimestamp = document.getElementById('info-timestamp');
const errorDiv = document.getElementById('error-camara');
const errorMsg = document.getElementById('error-mensaje');
const btnAvanzar = document.getElementById('btn-avanzar');
const avanzarHint = document.getElementById('avanzar-hint');
const hudStatus = document.getElementById('hud-status');

let streamActivo = null;

// texto que aparece al inicio
const mensajes = [
    '> INICIANDO PROTOCOLO DE VERIFICACION...',
    '> Se requiere verificacion biometrica visual.',
    '> Activa tu camara para continuar.'
];

// efecto de escritura letra por letra
function escribir(lineas, i = 0, j = 0) {
    if (i >= lineas.length) {
        btnActivar.style.display = 'block';
        return;
    }
    if (j === 0 && i > 0) textoTerminal.innerHTML += '<br>';
    if (j < lineas[i].length) {
        textoTerminal.innerHTML = textoTerminal.innerHTML.replace(/█$/, '');
        textoTerminal.innerHTML += lineas[i][j] + '█';
        setTimeout(() => escribir(lineas, i, j + 1), 40);
    } else {
        textoTerminal.innerHTML = textoTerminal.innerHTML.replace(/█$/, '');
        setTimeout(() => escribir(lineas, i + 1, 0), 500);
    }
}

window.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => escribir(mensajes), 600);
});

// al hacer click en activar camara
btnActivar.addEventListener('click', () => {
    faseIntro.style.display = 'none';
    faseCamara.style.display = 'flex';
    iniciarCamara();
});

async function iniciarCamara() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
        streamActivo = stream;
        videoStream.srcObject = stream;

        videoStream.addEventListener('loadedmetadata', () => {
            videoStream.play();
            btnCapturar.disabled = false;
        });

        errorDiv.style.display = 'none';

    } catch (err) {
        let msg = '> ERROR: algo salio mal con la camara.';

        if (err.name === 'NotAllowedError') {
            msg = '> ERROR 403: Permiso denegado por el usuario.';
        } else if (err.name === 'NotFoundError') {
            msg = '> ERROR 404: No se encontro ninguna camara.';
        } else if (err.name === 'NotReadableError') {
            msg = '> ERROR 503: La camara esta siendo usada por otra app.';
        }

        errorMsg.textContent = msg;
        errorDiv.style.display = 'block';
        hudStatus.textContent = 'SIN SEÑAL';
        hudStatus.style.color = '#ff003c';
    }
}

// capturar foto
btnCapturar.addEventListener('click', () => {
    if (!streamActivo) return;

    const w = videoStream.videoWidth;
    const h = videoStream.videoHeight;

    if (!w || !h) {
        alert('El video aun no esta listo, intenta de nuevo.');
        return;
    }

    canvasCaptura.width = w;
    canvasCaptura.height = h;

    const ctx = canvasCaptura.getContext('2d');
    ctx.drawImage(videoStream, 0, 0, w, h);

    const dataURL = canvasCaptura.toDataURL('image/jpeg', 0.85);

    // mostrar la foto
    fotoCapturada.src = dataURL;
    fotoCapturada.style.display = 'block';
    evidenciaPlaceholder.style.display = 'none';

    // guardar en localStorage
    try {
        localStorage.setItem('nivel3_foto', dataURL);
        localStorage.setItem('nivel3_timestamp', new Date().toLocaleString());
    } catch (e) {
        console.log('No se pudo guardar en localStorage:', e.message);
    }

    // mostrar info de captura
    infoTimestamp.textContent = 'Capturado: ' + new Date().toLocaleString();
    infoCapturaDiv.style.display = 'block';

    // desbloquear boton avanzar
    btnAvanzar.disabled = false;
    avanzarHint.textContent = 'Foto capturada - puedes avanzar';
    localStorage.setItem(KEY_ACTUAL, 'true');
});

// avanzar al siguiente nivel
btnAvanzar.addEventListener('click', () => {
    if (streamActivo) {
        streamActivo.getTracks().forEach(t => t.stop());
    }
    window.location.href = RUTA_SIGUIENTE;
});