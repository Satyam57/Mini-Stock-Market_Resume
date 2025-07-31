# Mini Stock Market Dashboard

A sleek and responsive single-page web application that allows users to search for and view daily stock data for publicly traded companies. It features an interactive chart to visualize price history and a detailed summary of the latest trading day's metrics.

## Features

* **Stock Symbol Search**: Look up any valid stock symbol to fetch its latest data.
* **Interactive Price Chart**: View the last 30 days of a stock's closing prices on a dynamic and responsive line chart powered by Chart.js.
* **Detailed Stock Information**: Get a comprehensive overview of the latest stock data, including:
    * Last closing price
    * Daily change and percentage change
    * Open, High, and Low prices for the day
    * Trading Volume
* **Dynamic UI**: The interface includes a loading spinner for feedback during API calls and handles errors for invalid symbols or API issues gracefully.
* **Responsive Design**: Built with Tailwind CSS, the layout is fully responsive and optimized for both desktop and mobile devices.

## Technologies Used

* **Frontend**: HTML5, CSS3, Vanilla JavaScript
* **Styling**: [Tailwind CSS](https://tailwindcss.com/)
* **Charting**: [Chart.js](https://www.chartjs.org/)
* **Fonts**: [Google Fonts (Inter)](https://fonts.google.com/specimen/Inter)

## Setup and Usage

1.  **Clone the repository:**
    ```bash
    git clone <your-repository-url>
    ```
2.  **Get an API Key:** This project uses the [Alpha Vantage API](https://www.alphavantage.co/). You will need to get your own free API key.
3.  **Update the API Key:** Open the `script.js` file and replace the placeholder API key with your own:
    ```javascript
    const apiKey = 'YOUR_API_KEY_HERE'; // Replace with your free key from Alpha Vantage
    ```
4.  **Run the application:** Simply open the `index.html` file in your web browser. The application will load with data for 'IBM' by default.

---