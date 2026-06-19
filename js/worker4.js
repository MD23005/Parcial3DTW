self.onmessage = function(e) {
    const datos = e.data.datos;
    const total = datos.length;

    // acumuladores para temperatura
    let sumaTemp = 0;
    let maxTemp = -Infinity;
    let minTemp = Infinity;

    // acumuladores para humedad
    let sumaHum = 0;
    let maxHum = -Infinity;
    let minHum = Infinity;

    // procesar cada registro
    for (let i = 0; i < total; i++) {
        const temp = datos[i].temperatura;
        const hum = datos[i].humedad;

        // temperatura
        sumaTemp += temp;
        if (temp > maxTemp) maxTemp = temp;
        if (temp < minTemp) minTemp = temp;

        // humedad
        sumaHum += hum;
        if (hum > maxHum) maxHum = hum;
        if (hum < minHum) minHum = hum;

        // mandar progreso cada 200 registros
        if ((i + 1) % 200 === 0) {
            self.postMessage({
                tipo: 'progreso',
                procesados: i + 1
            });
        }
    }

    // calcular promedios
    const promTemp = sumaTemp / total;
    const promHum = sumaHum / total;

    // mandar resultado final
    self.postMessage({
        tipo: 'resultado',
        stats: {
            temperatura: {
                promedio: promTemp,
                maximo: maxTemp,
                minimo: minTemp
            },
            humedad: {
                promedio: promHum,
                maximo: maxHum,
                minimo: minHum
            }
        }
    });
};