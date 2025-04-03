const { getDailyTransfersCount } = require('../models/transfers');

async function getDailyTransfersData(req, res) {
    try {
        const chartData = await getDailyTransfersCount();


        res.render('index', {
            chartData: JSON.stringify(chartData)
        });
    } catch (error) {
        res.status(500).render('error', { message: 'Error fetching daily transfers data' });
    }
}

module.exports = { getDailyTransfersData };