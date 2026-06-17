// worker-nivel5.js

self.onmessage = function(e) {
    const datos = e.data;
    const totalRegistros = datos.length;

    // Arrays para almcenar datos válidos ( filtrando negativos)
    let temperaturasValidas = [];
    let presionesValidas = [];
    let sumaHumedad = 0;
    let sumaTemperatura = 0;
    let sumaPresion = 0;

    let registrosValidosContador = 0;

    // Procesamos el array masivo de 250,000 rergistros

    for (let i = 0; i < totalRegistros; i++) {
        const registro = datos[i];

        // REQUISITO: Filtrar valores negativos.
        // Si temperatura, humedad o presión son menores a 0, se desacarta el registro.

        if (registro.temperatura >= 0 && registro.humedad >= 0 && registro.presion >= 0){
            temperaturasValidas.push(registro.temperatura);
            presionesValidas-push(registro.presion);

            sumaTemperatura += registro.temperatura;
            sumaHumedad += registro.humedad;
            sumaPresion += registro.presion;

            registrosValidosContador++;
        }

        //REQUISITOS: notificar el progreso a la interfaz (barra de carga)
        // Reportamos cada 5,000 registros para optimizar el rendimiento

        if (i % 5000 === 0 || i === totalRegistros - 1){
            const porcentaje = Math.round((i / totalRegistros)* 100);
            self.postMessage({ tipo: 'progreso', valor: porcentaje });
        }

    }

    // REQUISITTO: Calcular promedios generales de los datos válidos
    const promedioTemperatura = registrosValidosContador > 0 ? (sumaTemperatura / registrosValidosContador) : 0;
    const promedioHumedad = registrosValidosContador > 0 ? (sumaHumedad / registrosValidosContador) : 0;
    const promedioPresion = registrosValidosContador > 0 ? (sumaPresion / registrosValidosContador) : 0;

    // REQUISITO: Calcular TOP 10 de temperaturas y medidas de presion (de mayor a menor)
    const top10Temperaturas = temperaturasValidas.sort((a, b) => b -a).slice(0,10);
    const top10Presiones = presionesValidas.sort((a, b) => b -a).slice(0, 10);

    // Estructura final con los resultados requeridos

    const resultados = {
        cantidadValidos: registrosValidosContador,
        promedios: {
            temperatura: promedioTemperatura.toFixed(2),
            humedad: promedioHumedad.toFixed(2),
            presion: promedioPresion.toFixed(2)
        },
        top10Temperaturas: top10Temperaturas,
        top10Presiones: top10Presiones
    };

    // Envio de reulstados finales listos para el Card de boostrap y el JSON

    self.postMessage({ tipo: 'finalizado', resultado: resultado });

};