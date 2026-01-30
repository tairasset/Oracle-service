
import React, { useState, useCallback } from 'react';
import { STOCKS } from '../constants';
import { generateStockPrediction, getRealtimeStockData } from '../services/geminiService';
import { Prediction, StockData } from '../types';
import { Loader } from './Loader';
import { Card } from './Card';
import { AlertTriangle } from './Icons';
import { usePrompt } from '../context/PromptContext';
import { PromptData } from '../context/PromptContext';

interface PredictionHistoryItem {
  prediction: Prediction;
  currentData: StockData;
  ticker: string;
}

/**
 * Assembles the full prompt string from the prompt data object and current stock info.
 * @param {PromptData} promptData - The prompt data from the context.
 * @param {string} ticker - The stock ticker.
 * @param {number} currentPrice - The current stock price.
 * @returns {string} The fully assembled prompt string.
 */
const assemblePrompt = (promptData: PromptData, ticker: string, currentPrice: number): string => {
    const asOfDate = new Date().toISOString().split('T')[0];
    
    // Replace placeholders in the inputs template
    const inputsTemplate = promptData.inputsTemplate
        .replace(/\[AS-OF-DATE\]/g, asOfDate)
        .replace(/\[TICKER\]/g, ticker)
        .replace(/\$XXX\.XX/g, `$${currentPrice.toFixed(2)}`);

    // A simple text replacement for a single stock for now.
    const finalInputs = inputsTemplate.replace('MSFT: $XXX.XX | GOOGL: $XXX.XX | META: $XXX.XX', `${ticker}: $${currentPrice.toFixed(2)}`);

    const jsonSchemaInstruction = `
THE OUTPUT MUST BE A SINGLE VALID JSON OBJECT. Do not use markdown formatting or backticks.
The JSON object must conform to the following structure:
{
  "stock": "string (The ticker symbol)",
  "closeAsOf": "number (The last closing price used for the forecast)",
  "bullPercent": "number",
  "bullProbability": "number",
  "basePercent": "number",
  "baseProbability": "number",
  "bearPercent": "number",
  "bearProbability": "number",
  "expectedClose": "number (The final point forecast price)",
  "confidence": "number (The final confidence score)",
  "stressTests": [
    {
      "scenario": "string",
      "impactPercent": "number"
    }
  ],
  "sources": ["string (List of URL sources used)"],
  "rationale": "string (Your detailed explanation for the forecast)"
}
BASED ON ALL THE PREVIOUS INSTRUCTIONS, ANALYZE THE STOCK AND PROVIDE ONLY THE JSON OUTPUT.
    `;

    return `
${promptData.role}
${promptData.constraints}
${promptData.dataUsage}
${promptData.asOfDate}
${promptData.verification}
${finalInputs}
${promptData.methodology}
${promptData.stockAnalysis}
${promptData.confidence}
${promptData.stressTests}
${promptData.logbook}
${promptData.qualityControls}
${jsonSchemaInstruction}
    `.trim();
};


/**
 * A component that simulates the bot's core prediction functionality.
 * Users can select a stock, fetch its current data, and then generate
 * a prediction. It maintains a history of all predictions made during the session.
 */
export const BotSimulator: React.FC = () => {
  // Global prompt state
  const { promptData } = usePrompt();
  // State for the currently selected stock ticker.
  const [selectedTicker, setSelectedTicker] = useState<string>(STOCKS[0].ticker);
  // State to store the history of all predictions.
  const [predictionHistory, setPredictionHistory] = useState<PredictionHistoryItem[]>([]);
  // State to manage the loading indicator.
  const [isLoading, setIsLoading] = useState<boolean>(false);
  // State to store and display any errors.
  const [error, setError] = useState<string | null>(null);

  /**
   * Handles the prediction process when the user clicks the "Predict" button.
   * It fetches the latest stock data and then uses that data to generate a prediction.
   * The new prediction is added to the beginning of the history array.
   */
  const handlePredict = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Step 1: Fetch the latest stock data to ground the prediction
      const currentData = await getRealtimeStockData(selectedTicker);
      
      // Step 2: Assemble the prompt using the global state and current data
      const prompt = assemblePrompt(promptData, selectedTicker, currentData.currentPrice);

      // Step 3: Use the assembled prompt to generate a prediction
      const result = await generateStockPrediction(prompt);
      
      const newHistoryItem = {
          prediction: result,
          currentData: currentData,
          ticker: selectedTicker
      };
      // Add the new prediction to the top of the history list.
      setPredictionHistory(prev => [newHistoryItem, ...prev]);

    } catch (err) {
      console.error(err);
      setError('Failed to get prediction. The model may have returned an invalid format. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [selectedTicker, promptData]);
  
  /**
   * A sub-component responsible for rendering a single prediction result in a card.
   * @param {object} props - The component props.
   * @param {Prediction} props.result - The prediction data object.
   * @param {string} props.ticker - The stock ticker symbol.
   * @returns {JSX.Element} A card displaying the prediction details.
   */
  const PredictionResult: React.FC<{ result: Prediction; ticker: string }> = ({ result, ticker }) => {
    const formattedDate = new Date(result.timestamp).toLocaleString();
  
    const getScenarioRow = (
      scenario: 'Bull' | 'Base' | 'Bear', 
      probability: number, 
      percent: number,
      closeAsOf: number
    ) => {
      const colorClass = scenario === 'Bull' ? 'text-green-400' : scenario === 'Bear' ? 'text-red-400' : 'text-slate-300';
      const targetPrice = closeAsOf * (1 + percent / 100);
      return (
          <tr key={scenario} className="border-b border-slate-700 last:border-b-0">
              <td className={`p-3 font-semibold ${colorClass}`}>{scenario}</td>
              <td className="p-3 text-slate-300">{probability}%</td>
              <td className={`p-3 font-semibold ${colorClass}`}>{percent.toFixed(1)}%</td>
              <td className={`p-3 font-semibold ${colorClass}`}>${targetPrice.toFixed(2)}</td>
          </tr>
      );
    };
    
    return (
      <Card className="animate-fade-in border border-slate-700">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-xl font-bold text-white">{result.period} for {ticker}</h3>
            <p className="text-xs text-slate-500">As-of: ${result.closeAsOf.toFixed(2)} | Generated: {formattedDate}</p>
          </div>
        </div>
  
        {/* Main Forecast Metrics */}
        <div className="grid grid-cols-2 gap-4 mb-6 text-center">
          <div className="p-4 bg-slate-900 rounded-lg">
            <p className="text-sm text-slate-400">Expected Close</p>
            <p className="text-3xl font-bold text-sky-400">${result.expectedClose.toFixed(2)}</p>
          </div>
          <div className="p-4 bg-slate-900 rounded-lg">
            <p className="text-sm text-slate-400">Model Confidence</p>
            <p className="text-3xl font-bold text-white">{result.confidence.toFixed(0)}%</p>
          </div>
        </div>
  
        {/* Scenarios Table */}
        <div>
          <h4 className="font-semibold text-lg text-white mb-2">Scenarios</h4>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-slate-400 uppercase bg-slate-900/50">
                <tr>
                  <th scope="col" className="p-3">Scenario</th>
                  <th scope="col" className="p-3">Probability</th>
                  <th scope="col" className="p-3">Impact</th>
                  <th scope="col" className="p-3">Target Price</th>
                </tr>
              </thead>
              <tbody>
                {getScenarioRow('Bull', result.bullProbability, result.bullPercent, result.closeAsOf)}
                {getScenarioRow('Base', result.baseProbability, result.basePercent, result.closeAsOf)}
                {getScenarioRow('Bear', result.bearProbability, result.bearPercent, result.closeAsOf)}
              </tbody>
            </table>
          </div>
        </div>
  
        {/* Stress Tests Table */}
        <div className="mt-6">
          <h4 className="font-semibold text-lg text-white mb-2">Stress Tests</h4>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-slate-400 uppercase bg-slate-900/50">
                <tr>
                  <th scope="col" className="p-3">Scenario</th>
                  <th scope="col" className="p-3">Price Impact</th>
                </tr>
              </thead>
              <tbody>
                {result.stressTests.map((test) => (
                  <tr key={test.scenario} className="border-b border-slate-700 last:border-b-0">
                    <td className="p-3 text-slate-300">{test.scenario}</td>
                    <td className={`p-3 font-semibold ${test.impactPercent >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {test.impactPercent.toFixed(1)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
        {/* Analyst's Rationale */}
        <div className="mt-6">
            <details className="bg-slate-900/50 rounded-lg border border-slate-700/50">
                <summary className="p-3 cursor-pointer font-semibold text-white hover:bg-slate-700/20">
                    Analyst's Rationale
                </summary>
                <div className="p-4 border-t border-slate-700/50">
                    <p className="text-slate-300 whitespace-pre-wrap leading-relaxed">{result.rationale}</p>
                </div>
            </details>
        </div>
      </Card>
    );
  };


  return (
    <div className="max-w-4xl mx-auto">
        <div className="flex items-baseline justify-between">
            <div>
                <h2 className="text-3xl font-bold text-white mb-2">Bot Simulator</h2>
                <p className="text-slate-400 mb-6">Test the core functionality of the bot. Select a stock and run the prediction model.</p>
            </div>
            <div className="text-sm text-slate-500 flex-shrink-0">
                {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </div>
        </div>
      
      {/* Disclaimer */}
      <div className="bg-yellow-900/50 border border-yellow-700/50 text-yellow-300 px-4 py-3 rounded-lg relative mb-6" role="alert">
        <div className="flex">
          <div className="py-1 flex-shrink-0">
              <AlertTriangle className="w-5 h-5 mr-3 text-yellow-400" />
          </div>
          <div>
            <p className="font-bold">Disclaimer</p>
            <p className="text-sm">Stock predictions are for informational purposes only and not financial advice. AI models can make significant mistakes. Always do your own research before investing.</p>
          </div>
        </div>
      </div>

      {/* User input section */}
      <Card>
        <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4">
          <div className="w-full sm:w-auto flex-shrink-0 text-slate-300 font-mono text-lg p-2 bg-slate-900 rounded-md">/predict</div>
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
            onClick={handlePredict}
            disabled={isLoading}
            className="w-full sm:w-auto bg-sky-500 text-white font-bold py-2 px-6 rounded-md hover:bg-sky-600 disabled:bg-slate-600 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
          >
            {isLoading ? <Loader size={20} /> : 'Predict'}
          </button>
        </div>
      </Card>

      {error && <div className="mt-4 text-center text-red-400">{error}</div>}
      
      {/* Prediction history section */}
      <div className="mt-8">
        {predictionHistory.length > 0 && (
          <h3 className="text-2xl font-bold text-white mb-4">Prediction History</h3>
        )}
        <div className="space-y-4">
          {predictionHistory.map((item) => (
            <PredictionResult 
                key={item.prediction.timestamp} 
                result={item.prediction} 
                ticker={item.ticker} 
            />
          ))}
        </div>
         {!isLoading && predictionHistory.length === 0 && (
            <Card className="mt-6 text-center text-slate-500">
                <p>No predictions made yet. Select a stock and click "Predict" to see results.</p>
            </Card>
        )}
      </div>
    </div>
  );
};
