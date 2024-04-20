function calculateEmissions() {
    const transport = document.getElementById('transport').value;
    const electricity = document.getElementById('electricity').value;
    const renewable = document.getElementById('renewable').checked;
    const meat = document.getElementById('meat').value;

    let emissions = 0;

    // Cálculo ficticio basado en el transporte
    switch (transport) {
        case 'auto':
            emissions += 5.6 * 52;
            break;
        case 'moto':
            emissions += 3.1 * 52;
            break;
        case 'bicicleta':
            emissions += 0; // Sin emisiones
            break;
        case 'publico':
            emissions += 1.8 * 52;
            break;
    }

    // Cálculo ficticio basado en el consumo eléctrico
    emissions += renewable ? (electricity * 0.3) : (electricity * 0.7);

    // Cálculo ficticio basado en el consumo de carne
    emissions += meat * 2.4 * 52;

    document.getElementById('result').innerHTML = `Tus emisiones anuales estimadas de CO2 son ${emissions.toFixed(2)} kg CO2e.`;
}
