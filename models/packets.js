const { GraphQLClient, gql } = require('graphql-request');
const fs = require('fs');

const endpoint = 'https://graphql.union.build/v1/graphql';
const client = new GraphQLClient(endpoint);

const GET_DAILY_PACKETS_COUNT = gql`
    query GetDailyPacketsCount($limit: Int, $offset: Int, $daysBack: Int, $orderBy: [v2_stats_daily_count_type_order_by!]) @cached(ttl: 1) {
        v2_stats_packets_daily_count(
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

function logApiResponse(response, status, params, error = null) {
    const logData = {
        timestamp: new Date().toISOString(),
        status: status,
        requestParams: params,
        response: response || null,
        error: error ? { message: error.message, stack: error.stack } : null
    };
    fs.appendFileSync('DPC_response.log', JSON.stringify(logData, null, 2) + '\n');
}

async function getDailyPacketsCount(daysBack = 30) {
    try {
        // Очищаем лог-файл
        fs.writeFileSync('DPC_response.log', '');

        let allData = [];
        const limit = 1000;
        let offset = 0;
        let hasMore = true;

        const orderBy = [{ day_date: 'asc' }]; // Сортировка по дате

        // Пагинация
        while (hasMore) {
            const response = await client.rawRequest(GET_DAILY_PACKETS_COUNT, {
                limit,
                offset,
                daysBack,
                orderBy
            });
            const data = response.data;
            logApiResponse(data, response.status, { limit, offset, daysBack });

            const dailyCounts = data.v2_stats_packets_daily_count;
            if (dailyCounts.length === 0) {
                hasMore = false;
            } else {
                allData = allData.concat(dailyCounts);
                offset += limit;
            }
        }

        if (allData.length === 0) {
            console.warn(`No packet data returned for the last ${daysBack} days`);
            return [];
        }

        // Форматируем данные для графика
        const chartData = allData.map(item => ({
            date: item.day_date,
            count: parseInt(item.count, 10) // Убеждаемся, что count — число
        }));

        console.log('Daily packets count:', chartData);
        return chartData;
    } catch (error) {
        logApiResponse(null, null, null, error);
        console.error('Error fetching daily packets count:', error);
        throw error;
    }
}

module.exports = { getDailyPacketsCount };

// Тестовый запуск
if (require.main === module) {
    getDailyPacketsCount().then(data => console.log('Done:', data)).catch(console.error);
}