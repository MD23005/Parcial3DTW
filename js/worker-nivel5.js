self.onmessage = function(e) {
    const datos = e.data;
    const totalRegistros = datos.length;

    let temperaturasValidas = [];
    let presionesValidas = [];
    let sumaHumedad = 0;
    let sumaTemperatura = 0;
    let sumaPresion = 0;
    let registrosValidosContador = 0;

    for (let i = 0; i < totalRegistros; i++) {
        const registro = datos[i];

        if (registro.temperatura >= 0 && registro.humedad >= 0 && registro.presion >= 0){
            temperaturasValidas.push(registro.temperatura);
            presionesValidas.push(registro.presion);

            sumaTemperatura += registro.temperatura;
            sumaHumedad += registro.humedad;
            sumaPresion += registro.presion;

            registrosValidosContador++;
        }

        if (i % 5000 === 0 || i === totalRegistros - 1){
            const porcentaje = Math.round((i / totalRegistros) * 100);
            self.postMessage({ tipo: 'progreso', valor: porcentaje });
        }
    }

    const promedioTemperatura = registrosValidosContador > 0 ? (sumaTemperatura / registrosValidosContador) : 0;
    const promedioHumedad = registrosValidosContador > 0 ? (sumaHumedad / registrosValidosContador) : 0;
    const promedioPresion = registrosValidosContador > 0 ? (sumaPresion / registrosValidosContador) : 0;

    const top10Temperaturas = temperaturasValidas.sort((a, b) => b - a).slice(0, 10);
    const top10Presiones = presionesValidas.sort((a, b) => b - a).slice(0, 10);

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

    // SOLUCIÓN DOBLE: Enviamos tanto en 'resultado' como en 'resultados' 
    // para asegurar que el HTML lo lea bien use la propiedad que use.
    self.postMessage({ 
        tipo: 'finalizado', 
        resultado: resultados,
        resultados: resultados 
    });
};
