const apiKey = '4XXXXXXXXXXXXXX';
const stockChartCanvas = document.getElementById('stockChart');
const stockSymbolInput = document.getElementById('stockSymbol');
const searchBtn = document.getElementById('searchBtn');
const stockInfoDiv = document.getElementById('stockInfo');
const chartTitle = document.getElementById('chart-title');
const loader = document.getElementById('loader');

let stockChart;

// Function to fetch and display stock data
async function fetchStockData(symbol) {
    loader.classList.remove('hidden');
    stockInfoDiv.innerHTML = '';
    chartTitle.innerText = `Stock Price Chart for ${symbol.toUpperCase()}`;

    
    const url = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=${apiKey}&outputsize=compact`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        
        
        if (data['Error Message'] || !data['Time Series (Daily)']) {
            let errorMessage = 'Could not retrieve data. The stock symbol may be invalid.';
            if (data['Note']) {
                errorMessage = 'API call limit likely reached. Please try again later.';
            }
            throw new Error(errorMessage);
        }
        
        const timeSeries = data['Time Series (Daily)'];
        const metaData = data['Meta Data'];

        const dates = Object.keys(timeSeries).slice(0, 30).reverse(); // Last 30 days
        const prices = dates.map(date => parseFloat(timeSeries[date]['4. close']));

        displayStockChart(dates, prices);
        displayStockInfo(metaData, timeSeries);

    } catch (error) {
        stockInfoDiv.innerHTML = `<p class="text-red-500">${error.message}</p>`;
        if(stockChart) stockChart.destroy();
        chartTitle.innerText = 'Stock Price Chart';
    } finally {
        loader.classList.add('hidden');
    }
}

// Function to display the chart
function displayStockChart(labels, data) {
    if (stockChart) {
        stockChart.destroy();
    }

    const ctx = stockChartCanvas.getContext('2d');
    stockChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Stock Price (USD)',
                data: data,
                borderColor: 'rgba(239, 68, 68, 1)', // Red
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                borderWidth: 2,
                pointRadius: 0,
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    ticks: { color: '#9CA3AF' },
                    grid: { color: 'rgba(255, 255, 255, 0.1)' }
                },
                y: {
                    ticks: { color: '#9CA3AF', callback: value => '$' + value },
                    grid: { color: 'rgba(255, 255, 255, 0.1)' }
                }
            },
            plugins: {
                legend: {
                    labels: {
                        color: '#D1D5DB'
                    }
                }
            }
        }
    });
}

// Function to display stock information
function displayStockInfo(metaData, timeSeries) {
    const symbol = metaData['2. Symbol'];
    const lastRefreshed = metaData['3. Last Refreshed'];
    const latestDataPoint = timeSeries[Object.keys(timeSeries)[0]];
    const open = parseFloat(latestDataPoint['1. open']).toFixed(2);
    const high = parseFloat(latestDataPoint['2. high']).toFixed(2);
    const low = parseFloat(latestDataPoint['3. low']).toFixed(2);
    const close = parseFloat(latestDataPoint['4. close']).toFixed(2);
    const volume = parseInt(latestDataPoint['5. volume']).toLocaleString(); // Note: volume is key '5.' in this endpoint

    const previousClose = parseFloat(timeSeries[Object.keys(timeSeries)[1]]['4. close']).toFixed(2);
    const change = (close - previousClose).toFixed(2);
    const changePercent = ((change / previousClose) * 100).toFixed(2);
    const changeColor = change >= 0 ? 'text-green-500' : 'text-red-500';


    stockInfoDiv.innerHTML = `
        <div class="flex justify-between items-baseline">
            <span class="text-3xl font-bold text-white">${symbol}</span>
            <span class="text-gray-400 text-sm">Last updated: ${lastRefreshed}</span>
        </div>
        <div class="text-4xl font-bold text-white my-2">$${close}</div>
        <div class="flex items-center ${changeColor} text-xl font-semibold">
            <span>${change} (${changePercent}%)</span>
        </div>
        <div class="grid grid-cols-2 gap-4 mt-6 text-lg">
            <div><span class="font-semibold text-gray-400">Open:</span> <span class="text-white">$${open}</span></div>
            <div><span class="font-semibold text-gray-400">High:</span> <span class="text-white">$${high}</span></div>
            <div><span class="font-semibold text-gray-400">Low:</span> <span class="text-white">$${low}</span></div>
            <div><span class="font-semibold text-gray-400">Volume:</span> <span class="text-white">${volume}</span></div>
        </div>
    `;
}

// Event listener for the search button
searchBtn.addEventListener('click', () => {
    const symbol = stockSymbolInput.value.trim();
    if (symbol) {
        fetchStockData(symbol);
    }
});

// Event listener for Enter key in input
stockSymbolInput.addEventListener('keyup', (event) => {
    if (event.key === 'Enter') {
        searchBtn.click();
    }
});

// Initial load with a default stock
window.onload = () => {
    fetchStockData('IBM');
};
