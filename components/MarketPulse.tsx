
import React, { useState, useCallback } from 'react';
import { STOCKS } from '../constants';
import { getRealtimeStockData } from '../services/geminiService';
import { StockData } from '../types';
import { Loader } from './Loader';
import { Card } from './Card';

/**
 * A component to fetch and display near real-time stock market data.
 * Users can select a stock and fetch its latest price information.
 * It maintains a history of all fetched data during the session.
 */
export const MarketPulse: React.FC = () => {
  // State for the currently selected stock ticker.
  const [selectedTicker, setSelectedTicker] = useState<string>(STOCKS[0].ticker);
  // State to store the history of fetched stock data.
  const [stockDataHistory, setStockDataHistory] = useState<StockData[]>([]);
  // State to manage the loading indicator.
  const [isLoading, setIsLoading] = useState<boolean>(false);
  // State to store and display any errors.
  const [error, setError] = useState<string | null>(null);

  /**
   * Handles fetching the stock data when the user clicks the "Fetch Data" button.
   * It calls the `getRealtimeStockData` service and adds the result to the
   * beginning of the history array.
   */
  const handleFetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await getRealtimeStockData(selectedTicker);
      // Add the new data to the top of the history list.
      setStockDataHistory(prev => [result, ...prev]);
    } catch (err) {
      setError('Failed to fetch stock data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [selectedTicker]);
  
  /**
   * A sub-component responsible for rendering a single stock data result in a card.
   * @param {object} props - The component props.
   * @param {StockData} props.data - The stock data object.
   * @param {string} props.ticker - The stock ticker symbol.
   * @returns {JSX.Element} A card displaying the stock data.
   */
  const StockDataResult: React.FC<{ data: StockData; ticker: string }> = ({ data, ticker }) => {
    const isUp = data.change >= 0;
    const colorClass = isUp ? 'text-green-400' : 'text-red-400';
    const formattedDate = new Date(data.timestamp).toLocaleString();

    return (
        <Card className="animate-fade-in border border-slate-700">
            <div>
                <h3 className="text-xl font-bold text-white">{data.companyName}</h3>
                <div className="flex items-center justify-between">
                    <p className="text-sm text-slate-400">{ticker}</p>
                    <p className="text-xs text-slate-500">As of {formattedDate}</p>
                </div>
            </div>
            <div className="mt-4 flex items-end justify-between">
                <p className="text-4xl font-bold text-white">${data.currentPrice.toFixed(2)}</p>
                <div className={`text-right ${colorClass}`}>
                    <p className="text-lg font-bold">{isUp ? '+' : ''}{data.change.toFixed(2)}</p>
                    <p className="text-sm">({isUp ? '+' : ''}{data.percentChange.toFixed(2)}%)</p>
                </div>
            </div>
        </Card>
    );
  };

  return (
    <div className="max-w-2xl mx-auto">
        <div className="flex items-baseline justify-between">
            <div>
                <h2 className="text-3xl font-bold text-white mb-2">Market Pulse</h2>
                <p className="text-slate-400 mb-6">Fetch near real-time stock data from Yahoo Finance using Google Search grounding.</p>
            </div>
            <div className="text-sm text-slate-500 flex-shrink-0">
                {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </div>
        </div>
      
      {/* User input section */}
      <Card>
        <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4">
          <select
            value={selectedTicker}
            onChange={(e) => setSelectedTicker(e.target.value)}
            className="w-full sm:flex-1 bg-slate-700 border border-slate-600 text-white rounded-md px-4 py-2 focus:ring-2 focus:ring-sky-500 focus:outline-none"
          >
            {STOCKS.map((stock) => (
              <option key={stock.ticker} value={stock.ticker}>
                {stock.ticker} ({stock.name})
              </option>
            ))}
          </select>
          <button
            onClick={handleFetchData}
            disabled={isLoading}
            className="w-full sm:w-auto bg-sky-500 text-white font-bold py-2 px-6 rounded-md hover:bg-sky-600 disabled:bg-slate-600 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
          >
            {isLoading ? <Loader size={20} /> : 'Fetch Data'}
          </button>
        </div>
      </Card>

      {error && <div className="mt-4 text-center text-red-400">{error}</div>}
      
      {/* Data history section */}
      <div className="mt-8">
        {stockDataHistory.length > 0 && (
          <h3 className="text-2xl font-bold text-white mb-4">Fetch History</h3>
        )}
        <div className="space-y-4">
          {stockDataHistory.map((data) => (
            <StockDataResult key={data.timestamp} data={data} ticker={data.ticker} />
          ))}
        </div>
        {!isLoading && stockDataHistory.length === 0 && (
          <Card className="mt-6 text-center text-slate-500">
            <p>No data fetched yet. Select a stock and click "Fetch Data" to see results.</p>
          </Card>
        )}
      </div>
    </div>
  );
};
