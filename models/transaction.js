const { GraphQLClient, gql } = require('graphql-request');
const fs = require('fs');

// Настройка клиента GraphQL для Union Build API
const endpoint = 'https://graphql.union.build/v1/graphql';
const client = new GraphQLClient(endpoint);

// Запрос для получения ежедневной статистики транзакций
const GET_DAILY_TRANSFERS_COUNT = gql`
  query GetDailyTransfersCount($limit: Int, $offset: Int, $daysBack: Int, $orderBy: [v2_stats_daily_count_type_order_by!]) @cached(ttl: 1) {
    v2_stats_transfers_daily_count(
      args: { p_days_back: $daysBack }
      limit: $limit
      offset: $offset
      order_by: $orderBy
    ) {
      day_date
      count
    }
  }
`;

// Функция для логирования ответа API
function logApiResponse(response, error = null) {
    const logData = {
        timestamp: new Date().toISOString(),
        response: response || null,
        error: error ? { message: error.message, stack: error.stack } : null
    };
    fs.appendFileSync('api_response.log', JSON.stringify(logData, null, 2) + '\n');
    console.log('API Response Log:', JSON.stringify(logData, null, 2));
}

// Функция для получения ежедневной статистики транзакций
async function getDailyTransfersCount() {
    try {
        let allData = [];
        const limit = 1000;
        let offset = 0;
        let hasMore = true;

        const daysBack = 30; // Количество дней назад для статистики
        const orderBy = [{ day_date: 'desc' }]; // Сортировка по дате по убыванию

        while (hasMore) {
            const data = await client.request(GET_DAILY_TRANSFERS_COUNT, {
                limit,
                offset,
                daysBack,
                orderBy
            });
            logApiResponse(data);
            const dailyCounts = data.v2_stats_transfers_daily_count;

            if (dailyCounts.length === 0) {
                hasMore = false;
            } else {
                allData = allData.concat(dailyCounts);
                offset += limit;
            }
        }

        const chartData = allData.map(item => ({
            date: item.day_date,
            count: parseInt(item.count, 10) // Преобразуем count в число
        }));

        return chartData;
    } catch (error) {
        logApiResponse(null, error);
        console.error('Error fetching daily transfers count:', error);
        throw error;
    }
}

module.exports = { getDailyTransfersCount };