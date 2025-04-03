function renderWalletsChart(canvasId, chartData) {
    if (!chartData || chartData.length === 0) {
        console.warn('No data provided for clients chart');
        return;
    }

    // Пример: просто отображаем количество уникальных клиентов
    const uniqueClients = [...new Set(chartData.map(item => item.clientId))];
    const labels = ['Total Unique Clients'];
    const data = [uniqueClients.length];

    const ctx = document.getElementById(canvasId).getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Количество уникальных клиентов',
                data: data,
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    title: { display: true, text: 'Количество клиентов' },
                    beginAtZero: true
                }
            },
            plugins: {
                legend: { display: true }
            }
        }
    });
}