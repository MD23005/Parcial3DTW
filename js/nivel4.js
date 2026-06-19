// conexion con nivel anterior
const KEY_ANTERIOR = 'nivel3_completado';
const KEY_ACTUAL = 'nivel4_completado';
const RUTA_SIGUIENTE = '../html/nivel5.html';

// refs al DOM
const faseIntro = document.getElementById('fase-intro');
const faseTerminal = document.getElementById('fase-terminal');
const textoTerminal = document.getElementById('texto-terminal');
const btnIniciar = document.getElementById('btn-iniciar');
const linuxBody = document.getElementById('linux-body');
const hudStatus = document.getElementById('hud-status');
const avanzarContainer = document.getElementById('avanzar-container');
const btnAvanzar = document.getElementById('btn-avanzar');
const ynContainer = document.getElementById('yn-container');
const ynInput = document.getElementById('yn-input');

let colaLineas = [];
let imprimiendo = false;

// intro
const mensajes = [
    '> ACCEDIENDO AL NUCLEO DE PROCESAMIENTO...',
    '> Se detectaron 2 sensores virtuales en el sistema.',
    '> Se requiere analizar 20,000 registros sin bloquear la interfaz.',
    '> Iniciando protocolo de Web Worker...'
];

function escribir(lineas, i = 0, j = 0) {
    if (i >= lineas.length) {
        btnIniciar.style.display = 'block';
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
    // validar que tenga ubicacion guardada desde nivel 1
    const ubicacion = localStorage.getItem('user_location');
    if (!ubicacion) {
        window.location.href = '../html/nivel1.html';
        return;
    }

    setTimeout(() => escribir(mensajes), 600);
});

btnIniciar.addEventListener('click', () => {
    faseIntro.style.display = 'none';
    faseTerminal.style.display = 'flex';
    iniciarSecuencia();
});

// helpers terminal
function agregarLinea(texto, clase = 'verde') {
    const p = document.createElement('p');
    p.className = 'tline ' + clase;
    p.textContent = texto;
    const card = document.getElementById('stats-card');
    linuxBody.insertBefore(p, card);
    linuxBody.scrollTop = linuxBody.scrollHeight;
    return p;
}

function encolar(texto, clase = 'verde', delay = 80) {
    colaLineas.push({ texto, clase, delay });
}

function vaciarCola(callback) {
    imprimiendo = true;
    function siguiente() {
        if (colaLineas.length === 0) {
            imprimiendo = false;
            if (callback) callback();
            return;
        }
        const item = colaLineas.shift();
        agregarLinea(item.texto, item.clase);
        setTimeout(siguiente, item.delay);
    }
    siguiente();
}

// barra de progreso 
let lineaBarra = null;

function crearBarra() {
    lineaBarra = agregarLinea(construirBarra(0), 'barra');
}

function construirBarra(pct) {
    const total = 200;
    const llenas = Math.round((pct / 100) * total);
    const vacias = total - llenas;
    return '[' + '█'.repeat(llenas) + '░'.repeat(vacias) + '] ' + pct + '%';
}

function actualizarBarra(pct) {
    if (lineaBarra) {
        lineaBarra.textContent = construirBarra(pct);
        linuxBody.scrollTop = linuxBody.scrollHeight;
    }
}

// contador UI 
let lineaContador = null;
let cuentaUI = 0;
let intervaloUI = null;

function iniciarContadorUI() {
    lineaContador = agregarLinea('> ui_check: 0 ticks — interfaz no bloqueada', 'blanco');
    intervaloUI = setInterval(() => {
        cuentaUI++;
        lineaContador.textContent = '> ui_check: ' + cuentaUI + ' ticks — interfaz no bloqueada';
    }, 100);
}

function detenerContadorUI() {
    clearInterval(intervaloUI);
}

// secuencia principal
function iniciarSecuencia() {
    hudStatus.textContent = '● ACTIVO';

    encolar('nucleo@system-break-4077:~$ ./iniciar_sensores.sh', 'verde', 60);
    encolar('', 'dim', 20);
    encolar('> Buscando sensores virtuales...', 'blanco', 80);
    encolar('', 'dim', 20);
    encolar('  SENSOR_A  [TEMPERATURA]  ONLINE', 'verde', 120);
    encolar('  SENSOR_B  [HUMEDAD]      ONLINE', 'verde', 120);
    encolar('', 'dim', 20);
    encolar('> Generando 20,000 registros...', 'blanco', 100);
    encolar('', 'dim', 20);

    vaciarCola(() => {
        const datos = generarDatos(20000);
        console.log('datos generados:', datos.length);

        encolar('> 20,000 registros generados.', 'blanco', 80);
        encolar('', 'dim', 20);
        encolar('nucleo@system-break-4077:~$ ./lanzar_worker.sh', 'verde', 60);
        encolar('', 'dim', 20);
        encolar('> Iniciar procesamiento masivo? [Y/N]', 'verde', 80);
        encolar('', 'dim', 20);

        vaciarCola(() => {
            ynContainer.style.display = 'block';
            linuxBody.scrollTop = linuxBody.scrollHeight;
            ynInput.focus();

            ynInput.addEventListener('keydown', function handler(e) {
                if (e.key !== 'Enter') return;

                const valor = ynInput.value.trim().toUpperCase();

                if (valor === 'Y') {
                    ynInput.removeEventListener('keydown', handler);
                    ynContainer.style.display = 'none';

                    agregarLinea('> Y', 'verde');
                    agregarLinea('', 'dim');
                    agregarLinea('> Procesamiento confirmado. Enviando datos al Worker...', 'blanco');
                    agregarLinea('> Interfaz libre durante el procesamiento.', 'blanco');
                    agregarLinea('', 'dim');

                    linuxBody.scrollTop = linuxBody.scrollHeight;
                    setTimeout(() => lanzarWorker(datos), 400);

                } else if (valor === 'N') {
                    ynInput.removeEventListener('keydown', handler);
                    ynContainer.style.display = 'none';

                    agregarLinea('> N', 'verde');
                    agregarLinea('', 'dim');
                    agregarLinea('> Operacion cancelada.', 'blanco');
                    agregarLinea('> Recarga la pagina para intentar de nuevo.', 'blanco');
                    hudStatus.textContent = '● CANCELADO';
                    hudStatus.style.animationName = 'none';

                } else {
                    ynInput.value = '';
                }
            });
        });
    });
}

// lanzar worker
function lanzarWorker(datos) {
    crearBarra();
    agregarLinea('', 'dim');
    iniciarContadorUI();
    hudStatus.textContent = '● PROCESANDO';

    const worker = new Worker('../js/worker4.js');
    worker.postMessage({ datos });

    worker.onmessage = function(e) {
        const msg = e.data;

        if (msg.tipo === 'progreso') {
            const pct = Math.round((msg.procesados / 20000) * 100);
            actualizarBarra(pct);

            if (msg.procesados % 5000 === 0) {
                agregarLinea('  > checkpoint ' + msg.procesados.toLocaleString() + ' registros OK', 'blanco');
            }
        }

        if (msg.tipo === 'resultado') {
            detenerContadorUI();
            actualizarBarra(100);
            worker.terminate();

            hudStatus.textContent = '● COMPLETADO';
            hudStatus.style.animationName = 'none';

            mostrarResultados(msg.stats);
        }
    };

    worker.onerror = function(err) {
        detenerContadorUI();
        agregarLinea('> ERROR: ' + err.message, 'rojo');
        hudStatus.textContent = '● ERROR';
    };
}

// mostrar resultados
function mostrarResultados(stats) {
    encolar('', 'dim', 40);
    encolar('> Worker finalizado. Generando reporte...', 'verde', 80);
    encolar('', 'dim', 40);

    vaciarCola(() => {
        
        document.getElementById('c-temp-prom').textContent = stats.temperatura.promedio.toFixed(2) + ' C';
        document.getElementById('c-temp-max').textContent = stats.temperatura.maximo.toFixed(2) + ' C';
        document.getElementById('c-temp-min').textContent = stats.temperatura.minimo.toFixed(2) + ' C';
        document.getElementById('c-hum-prom').textContent = stats.humedad.promedio.toFixed(2) + ' %';
        document.getElementById('c-hum-max').textContent = stats.humedad.maximo.toFixed(2) + ' %';
        document.getElementById('c-hum-min').textContent = stats.humedad.minimo.toFixed(2) + ' %';

        
        document.getElementById('stats-card').style.display = 'block';
        linuxBody.scrollTop = linuxBody.scrollHeight;

        const cursor = document.createElement('span');
        cursor.className = 'tcursor';
        cursor.textContent = '█';
        linuxBody.appendChild(cursor);
        linuxBody.scrollTop = linuxBody.scrollHeight;

        try { localStorage.setItem(KEY_ACTUAL, 'true'); } catch(e) {}
        avanzarContainer.style.display = 'flex';
    });
}

// generar datos
function generarDatos(cantidad) {
    const datos = [];
    for (let i = 0; i < cantidad; i++) {
        datos.push({
            temperatura: parseFloat((Math.random() * 60 - 10).toFixed(2)),
            humedad: parseFloat((Math.random() * 100).toFixed(2))
        });
    }
    return datos;
}

// avanzar al siguiente nivel
btnAvanzar.addEventListener('click', () => {
    window.location.href = RUTA_SIGUIENTE;
});