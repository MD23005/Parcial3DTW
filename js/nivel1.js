const botonUbicacion = document.getElementById('action-btn');
const robotDialog = document.getElementById('speech-bubble');
const mouth = document.getElementById('robot-mouth');
const antena = document.getElementById('antenna-glow');
const robot = document.querySelector('.robot');
const botonContinuar = document.getElementById('continuar-btn');



function changeRobot(text,mod,color){
    robotDialog.textContent = text;

    mouth.className = "mouth";
    if(mod != "normal"){
        mouth.classList.add(mod);
    }

    antena.style.backgroundColor = color;
    antena.style.boxShadow = `0 0 15px ${color}`;

    botonUbicacion.disabled = false;
}

const savedLocation = localStorage.getItem('user_location')

if(savedLocation){
    const cordenadas = JSON.parse(savedLocation)

    setTimeout(()=>{
        changeRobot(
            `¡UBICACIÓN ENCONTRADA EN MEMORIA! La úlitma ubicación almacenada es: latitud= ${cordenadas.lat}, longitud=${cordenadas.lon}`,
            "happy",
            "#7d2ae8"
        )
        botonUbicacion.textContent = "Actualizar ubicación"
    }, 3200)
}

botonUbicacion.addEventListener('click', ()=>{
    botonUbicacion.disabled = true;
    robot.classList.add('thinking');
    robotDialog.classList.add('loading');
    robotDialog.textContent = "Escaneando información brindada...";
    mouth.className = "mouth surprised";

    if(!navigator.geolocation){
        setTimeout(()=>{
            changeRobot(
                "¡ERROR! No puedes continuar, no se puede rastrear tu ubicación actual",
                "surprised",
                "#f20"
            )
        }, 1500)
        return
    }

    navigator.geolocation.getCurrentPosition(
        (position)=>{
            const lat = position.coords.latitude.toFixed(4)
            const lon = position.coords.longitude.toFixed(4)

            const locationData = {
                lat: lat,
                lon: lon,
                timestamp: new Date().getTime()
            }

            localStorage.setItem('user_location',JSON.stringify(locationData))

            setTimeout(()=>{
                changeRobot(
                    `¡UBICACIÓN ENCONTRADA! Latitud: ${lat}, Longitud: ${lon}. Se han guardado en memoria local`,
                    "happy",
                    "#10ac84"
                )
                botonUbicacion.textContent = "Actualizar información"

                botonContinuar.classList.add('show')
            },1200)
        },
        (error)=>{
            setTimeout(()=>{
                let mensajeError = "¡ERROR! No se pudo actualizar la ubicación"

                if(error.code === error.TIMEOUT){
                    mensajeError = "¡TIEMPO AGOTADO!"
                }

                changeRobot(mensajeError,"normal","#ff3366")
            },1200)
        },
        {
            enableHighAccuracy: true,
            timeout: 8000,
            maximumAge: 0
        }
    )
})

botonContinuar.addEventListener('click',()=>{
    window.location.href = "./nivel2.html"
})