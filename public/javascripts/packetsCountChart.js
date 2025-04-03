function renderPacketsChart(canvasId, chartData) {
    if (!chartData || chartData.length === 0) {
        console.warn('No data provided for packets chart');
        return;
    }

    const cumulativeData = chartData.map((item, index) => {
        return {
            date: item.date,
            count: item.count,
            total: chartData.slice(0, index + 1).reduce((sum, d) => sum + d.count, 0)
        };
    });

    const ctx = document.getElementById(canvasId).getContext('2d');
    if (!ctx) {
        console.error(`Canvas with id "${canvasId}" not found`);
        return;
    }

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: cumulativeData.map(item => item.date),
            datasets: [
                {
                    label: 'Daily GMP',
                    data: cumulativeData.map(item => item.count),
                    fill: false,
                    borderColor: 'rgba(54, 162, 235, 1)',
                    tension: 0.1
                },
                {
                    label: 'Cumulative Total GMP',
                    data: cumulativeData.map(item => item.total),
                    fill: false,
                    borderColor: 'rgba(255, 99, 132, 1)',
                    tension: 0.1
                }
            ]
        },
        options: {
            scales: {
                x: { title: { display: true, text: 'Date' },
                        ticks: {
                            maxRotation: 45,
                            minRotation: 45
                        }
                    },

                y: { title: { display: true, text: 'GMP Count' }, beginAtZero: true }
            },
            plugins: {
                legend: { display: true }
            },

        }
    });
}