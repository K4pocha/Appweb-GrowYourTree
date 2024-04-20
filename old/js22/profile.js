document.addEventListener("DOMContentLoaded", function() {
    const ctx = document.getElementById('usageChart').getContext('2d');
    const chartTypeSelector = document.getElementById('chartType');
    let currentChart;

    function createChartData() {
        switch(chartTypeSelector.value) {
            case 'visitas':
                return {
                    labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo'],
                    datasets: [{
                        label: 'Visitas por mes',
                        data: [12, 19, 3, 5, 2, 3],
                        backgroundColor: ['rgba(75, 192, 192, 0.2)'],
                        borderColor: ['rgba(75, 192, 192, 1)'],
                        borderWidth: 1
                    }]
                };
            case 'logros':
                return {
                    labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo'],
                    datasets: [{
                        label: 'Logros completados',
                        data: [7, 11, 5, 8, 12],
                        backgroundColor: ['rgba(153, 102, 255, 0.2)'],
                        borderColor: ['rgba(153, 102, 255, 1)'],
                        borderWidth: 1
                    }]
                };
            default:
                return {};
        }
    }

    function updateChart() {
        if (currentChart) {
            currentChart.destroy(); // Destruye el gráfico anterior
        }
        currentChart = new Chart(ctx, {
            type: 'line', // Tipo de gráfico
            data: createChartData(), // Datos para el gráfico
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }

    // Actualizar el gráfico cuando se cambie la selección
    chartTypeSelector.addEventListener('change', updateChart);

    // Inicializar el gráfico con la selección por defecto
    updateChart();
});