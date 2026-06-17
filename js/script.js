let canvasInicializado = false;
let latitud;
let longitud;

let figura = "";
let lineaDibujada = false;
let rectanguloDibujado = false;
let circuloDibujado = false;

let xInicio = 0;
let yInicio = 0;
let primerClick = false;

// ---------------- UBICACIÓN ----------------

function obtenerUbicacion(){

    if(navigator.geolocation){

        navigator.geolocation.getCurrentPosition(
            mostrarUbicacion,
            mostrarError
        );

    }else{

        document.getElementById("mensaje").innerHTML =
        "Tu navegador no soporta Geolocalización.";
    }
}

function mostrarUbicacion(posicion){

    latitud = posicion.coords.latitude;
    longitud = posicion.coords.longitude;

    document.getElementById("latitud").innerHTML =
        "Latitud: " + latitud;

    document.getElementById("longitud").innerHTML =
        "Longitud: " + longitud;

    document.getElementById("mensaje").innerHTML =
        "✔ Ubicación obtenida correctamente.";

    document.getElementById("mensaje").style.color = "green";

    document.getElementById("btnNivel2").disabled = false;
    document.getElementById("nivel2").style.display = "block";
}

function mostrarError(error){

    let mensaje = "";

    switch(error.code){

        case error.PERMISSION_DENIED:
            mensaje = "❌ Permiso denegado por el usuario.";
            break;

        case error.POSITION_UNAVAILABLE:
            mensaje = "❌ Ubicación no disponible.";
            break;

        case error.TIMEOUT:
            mensaje = "❌ Tiempo de espera agotado.";
            break;

        default:
            mensaje = "❌ Error desconocido.";
    }

    document.getElementById("mensaje").style.color = "red";
    document.getElementById("mensaje").innerHTML = mensaje;
}

// ---------------- MAPA ----------------

function dibujarMapa(){

    let canvas = document.getElementById("mapa");
    let ctx = canvas.getContext("2d");

    ctx.fillStyle = "lightgreen";
    ctx.fillRect(0, 0, 700, 400);

    ctx.beginPath();
    ctx.moveTo(50, 200);
    ctx.lineTo(650, 200);
    ctx.strokeStyle = "gray";
    ctx.lineWidth = 8;
    ctx.stroke();
}

// ---------------- INICIALIZAR CANVAS (ESTO ES LO CLAVE) ----------------

function initCanvas(){
    
    if(canvasInicializado){
        return;
    }

    canvasInicializado = true;

    const canvas = document.getElementById("mapa");

    if(!canvas) return;

    canvas.addEventListener("click", function(event){

        let ctx = canvas.getContext("2d");

        // -------- LINEA --------
        if(figura == "linea"){

            if(primerClick == false){

                xInicio = event.offsetX;
                yInicio = event.offsetY;
                primerClick = true;

            }else{

                ctx.beginPath();
                ctx.moveTo(xInicio, yInicio);
                ctx.lineTo(event.offsetX, event.offsetY);
                ctx.stroke();

                primerClick = false;
                lineaDibujada = true;
            }
        }

        // -------- RECTANGULO --------
        if(figura == "rectangulo"){

            if(primerClick == false){

                xInicio = event.offsetX;
                yInicio = event.offsetY;
                primerClick = true;

            }else{

                let ancho = event.offsetX - xInicio;
                let alto = event.offsetY - yInicio;

                ctx.strokeRect(xInicio, yInicio, ancho, alto);

                primerClick = false;
                rectanguloDibujado = true;
            }
        }

        // -------- CIRCULO --------
        if(figura == "circulo"){

            if(primerClick == false){

                xInicio = event.offsetX;
                yInicio = event.offsetY;
                primerClick = true;

            }else{

                let radio = Math.sqrt(
                    Math.pow(event.offsetX - xInicio, 2) +
                    Math.pow(event.offsetY - yInicio, 2)
                );

                ctx.beginPath();
                ctx.arc(xInicio, yInicio, radio, 0, 2 * Math.PI);
                ctx.stroke();

                primerClick = false;
                circuloDibujado = true;
            }
        }

        // -------- VALIDACION NIVEL 3 --------
        if(lineaDibujada && rectanguloDibujado && circuloDibujado){

            document.getElementById("estadoFiguras").innerHTML =
                "Línea ✅ | Rectángulo ✅ | Círculo ✅";

            document.getElementById("btnNivel3").disabled = false;
        }

    });
}

// ---------------- LIMPIAR ----------------

function limpiarCanvas(){

    let canvas = document.getElementById("mapa");
    let ctx = canvas.getContext("2d");

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    lineaDibujada = false;
    rectanguloDibujado = false;
    circuloDibujado = false;

    figura = "";
    primerClick = false;

    document.getElementById("estadoFiguras").innerHTML =
        "Línea ❌ | Rectángulo ❌ | Círculo ❌";

    document.getElementById("btnNivel3").disabled = true;
}

window.onload = function(){

    dibujarMapa();

    initCanvas();

}

