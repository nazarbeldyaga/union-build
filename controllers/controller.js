const { getDailyTransfersCount } = require('../models/transfers');
const { getDailyPacketsCount } = require('../models/packets');

async function getControllerData(req, res) {
    try {
        // Получаем данные для трансферов
        const transfersData = await getDailyTransfersCount();

        const packetsData = await getDailyPacketsCount();

        // Объединяем данные в один объект
        const chartData = {
            transfers: transfersData,
            packets: packetsData
        };

        // Рендерим страницу с объединенными данными
        res.render('index', {
            chartData: JSON.stringify(chartData)
        });
    } catch (error) {
        console.error('Error in getDailyData:', error);
        res.status(500).render('error', { message: 'Error fetching data' });
    }
}

module.exports = { getControllerData };