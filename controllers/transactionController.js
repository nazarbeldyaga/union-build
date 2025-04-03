const { getDailyTransfersCount } = require('../models/transaction');

async function getDailyTransfersData(req, res) {
    try {
        const chartData = await getDailyTransfersCount();

        // Передаем данные в представление
        res.render('index', {
            chartData: JSON.stringify(chartData) // Данные для графика: ежедневные транзакции
        });
    } catch (error) {
        res.status(500).render('error', { message: 'Error fetching daily transfers data' });
    }
}

module.exports = { getDailyTransfersData };