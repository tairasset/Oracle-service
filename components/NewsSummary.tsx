
import React, { useState, useEffect, useCallback } from 'react';
import { getCompanyNews } from '../services/geminiService';
import { STOCKS } from '../constants';
import { NewsItem } from '../types';
import { Card } from './Card';
import { Loader } from './Loader';

export const NewsSummary: React.FC = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchNews = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const tickers = STOCKS.map(s => s.ticker);
      const result = await getCompanyNews(tickers);
      setNews(result);
    } catch (err) {
      setError('Failed to fetch the latest news.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNews();
  }, [fetchNews]);

  const getCategoryColor = (category: NewsItem['category']) => {
    switch (category) {
      case 'Positive': return 'bg-green-500/20 text-green-400 border-green-500/50';
      case 'Negative': return 'bg-red-500/20 text-red-400 border-red-500/50';
      default: return 'bg-slate-500/20 text-slate-400 border-slate-500/50';
    }
  };

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-3xl font-bold text-white">Market Intelligence</h2>
          <p className="text-slate-400">Summarized recent news for your tracked companies.</p>
        </div>
        <button
          onClick={fetchNews}
          disabled={isLoading}
          className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center"
        >
          {isLoading ? <Loader size={18} /> : 'Refresh'}
        </button>
      </div>

      {isLoading && news.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader size={40} />
          <p className="mt-4 text-slate-400 italic">Scanning global news sources via Google Search...</p>
        </div>
      )}

      {error && (
        <Card className="border border-red-500/50 bg-red-500/10 text-red-400 text-center">
          {error}
        </Card>
      )}

      <div className="grid grid-cols-1 gap-6">
        {news.map((item, idx) => (
          <Card key={`${item.ticker}-${idx}`} className="border border-slate-700 hover:border-sky-500/50 transition-colors">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center space-x-3 mb-2">
                  <span className="px-2 py-1 bg-sky-500/20 text-sky-400 text-xs font-bold rounded border border-sky-500/30">
                    {item.ticker}
                  </span>
                  <span className={`px-2 py-0.5 text-[10px] uppercase font-bold rounded border ${getCategoryColor(item.category)}`}>
                    {item.category}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-white mb-2 leading-tight">
                    {item.headline}
                </h3>
                <p className="text-slate-400 leading-relaxed mb-4">
                  {item.summary}
                </p>
                {item.url !== '#' && (
                  <a 
                    href={item.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-sky-400 hover:text-sky-300 text-sm font-medium inline-flex items-center"
                  >
                    Read source article
                    <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {!isLoading && news.length === 0 && !error && (
        <Card className="text-center text-slate-500">
          No recent major news found for the selected tickers.
        </Card>
      )}
    </div>
  );
};
