function renderTransfersChart(canvasId, chartData) {
    if (!chartData || chartData.length === 0) {
        console.warn('No data provided for transfers chart');
        return;
    }

    const reversedData = chartData.slice().reverse();

    const cumulativeData = reversedData.map((item, index) => {
        return {
            date: item.date,
            count: item.count,
            total: reversedData.slice(0, index + 1).reduce((sum, d) => sum + d.count, 0)
        };
    });

    const ctx = document.getElementById(canvasId).getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: cumulativeData.map(item => item.date),
            datasets: [
                {
                    label: 'Daily Transfers',
                    data: cumulativeData.map(item => item.count),
                    fill: false,
                    borderColor: 'rgba(75, 192, 192, 1)',
                    tension: 0.1
                },
                {
                    label: 'Cumulative Total Transfers',
                    data: cumulativeData.map(item => item.total),
                    fill: false,
                    borderColor: 'rgba(255, 99, 132, 1)',
                    tension: 0.1
                }
            ]
        },
        options: {
            scales: {
                x: {
                    title: { display: true, text: 'Дата' },
                    ticks: {
                        maxRotation: 45,
                        minRotation: 45
                    }
                },
                y: {
                    title: { display: true, text: 'Количество трансферов' },
                    beginAtZero: true
                }
            },
            plugins: {
                legend: {
                    display: true
                }
            }
        }
    });
}