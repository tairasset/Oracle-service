
import { GoogleGenAI, Type } from "@google/genai";
import { Prediction, StockData, NewsItem } from '../types';

// Retrieve the API key from environment variables.
const API_KEY = process.env.API_KEY;

// Ensure the API key is available, otherwise throw an error.
if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

// Initialize the GoogleGenAI client with the API key.
const ai = new GoogleGenAI({ apiKey: API_KEY });

/**
 * A robust function to clean a string that might contain a JSON object or array.
 * It handles markdown-wrapped JSON and extracts the core JSON structure,
 * even if search citations or extra text are present.
 */
const cleanJsonFromResponse = (text: string): string => {
  // Remove markdown block indicators and citations like [1], [web:1]
  let cleaned = text
    .replace(/```json/gi, '')
    .replace(/```/g, '')
    .replace(/\[\d+\]/g, '')
    .replace(/\[web:\d+\]/g, '')
    .trim();

  const firstObject = cleaned.indexOf('{');
  const firstArray = cleaned.indexOf('[');
  
  const start = (firstObject !== -1 && (firstArray === -1 || firstObject < firstArray)) ? firstObject : firstArray;
  
  if (start === -1) return cleaned;

  const lastObject = cleaned.lastIndexOf('}');
  const lastArray = cleaned.lastIndexOf(']');
  const end = Math.max(lastObject, lastArray);

  if (end > start) {
    return cleaned.substring(start, end + 1);
  }

  return cleaned;
};

/**
 * Fetches near real-time stock data for a given ticker.
 */
export const getRealtimeStockData = async (ticker: string): Promise<StockData> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Find the latest stock price for ticker ${ticker} on Yahoo Finance. Provide: Company Name, Price, Change, and Percent Change. 
      Respond ONLY with valid JSON: {"companyName": "string", "currentPrice": number, "change": number, "percentChange": number}`,
      config: {
        tools: [{googleSearch: {}}],
      }
    });

    if (response.text) {
      const jsonString = cleanJsonFromResponse(response.text);
      const parsedJson = JSON.parse(jsonString);
      return {
        ticker: ticker,
        companyName: String(parsedJson.companyName || ticker),
        currentPrice: Number(parsedJson.currentPrice || 0),
        change: Number(parsedJson.change || 0),
        percentChange: Number(parsedJson.percentChange || 0),
        timestamp: Date.now()
      };
    }
    throw new Error('Empty response from model.');
  } catch (error) {
    console.error("Error in getRealtimeStockData:", error);
    throw new Error("Failed to fetch stock data.");
  }
};

/**
 * Generates a summary of news for companies. Switches to Pro model for better tool reliability.
 */
export const getCompanyNews = async (tickers: string[]): Promise<NewsItem[]> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: `Search for the most recent major financial news for: ${tickers.join(', ')}. 
      For each ticker, provide exactly one entry.
      Return ONLY a JSON array: [{"ticker": "string", "headline": "string", "summary": "string", "category": "Positive|Negative|Neutral"}]`,
      config: {
        tools: [{googleSearch: {}}],
      }
    });

    // Extract URLs from grounding metadata as required
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    const sourceUrls = groundingChunks
      .filter(chunk => chunk.web && chunk.web.uri)
      .map(chunk => chunk.web!.uri);

    if (response.text) {
      const jsonString = cleanJsonFromResponse(response.text);
      const parsedArray = JSON.parse(jsonString);
      
      return parsedArray.map((item: any, index: number) => ({
        ticker: String(item.ticker),
        headline: String(item.headline),
        summary: String(item.summary),
        category: (['Positive', 'Negative', 'Neutral'].includes(item.category) ? item.category : 'Neutral'),
        // Map available URLs or fallback to the first grounding chunk URL
        url: sourceUrls[index] || sourceUrls[0] || '#'
      }));
    }
    return [];
  } catch (error) {
    console.error("Error in getCompanyNews:", error);
    throw new Error("News grounding service failed. Please try again in a moment.");
  }
};

/**
 * Generates a stock prediction. Switches to Pro model for high-quality reasoning.
 */
export const generateStockPrediction = async (prompt: string): Promise<Prediction> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: prompt,
      config: {
        tools: [{googleSearch: {}}],
      }
    });

    if (response.text) {
        const jsonString = cleanJsonFromResponse(response.text);
        const parsedJson = JSON.parse(jsonString);
        
        // Extract sources from grounding metadata if they aren't in the JSON
        const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
        const metadataSources = groundingChunks
            .filter(chunk => chunk.web && chunk.web.uri)
            .map(chunk => chunk.web!.uri);

        const stressTests = Array.isArray(parsedJson.stressTests) ? parsedJson.stressTests.map((st: any) => ({
            scenario: String(st.scenario ?? 'Unknown Scenario'),
            impactPercent: Number(st.impactPercent ?? 0)
        })) : [];

        const sources = (Array.isArray(parsedJson.sources) && parsedJson.sources.length > 0) 
            ? parsedJson.sources.map((s: any) => String(s)) 
            : metadataSources;

        return {
            stock: String(parsedJson.stock || 'N/A'),
            closeAsOf: Number(parsedJson.closeAsOf || 0),
            bullPercent: Number(parsedJson.bullPercent || 0),
            bullProbability: Number(parsedJson.bullProbability || 0),
            basePercent: Number(parsedJson.basePercent || 0),
            baseProbability: Number(parsedJson.baseProbability || 0),
            bearPercent: Number(parsedJson.bearPercent || 0),
            bearProbability: Number(parsedJson.bearProbability || 0),
            expectedClose: Number(parsedJson.expectedClose || 0),
            confidence: Number(parsedJson.confidence || 0),
            stressTests: stressTests,
            sources: sources,
            rationale: String(parsedJson.rationale || "No rationale provided."),
            timestamp: Date.now(),
            period: "1-Week Forecast"
        };
    }
    throw new Error('Empty response from model.');
  } catch (error) {
    console.error("Error in generateStockPrediction:", error);
    throw new Error("Prediction model failed. This usually happens if search data is unavailable.");
  }
};

export const generateReportSection = async (sectionTitle: string): Promise<string> => {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: `Write a concise paragraph for an 'AI-Powered Telegram Trading Bot' project report. Section: '${sectionTitle}'.`,
        });
        return response.text ?? "No content generated.";
    } catch (error) {
        throw new Error("Report generation failed.");
    }
};

export const generatePresentationPoints = async (): Promise<string> => {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: `Generate 5 key bullet points for a presentation on an 'AI-Powered Telegram Trading Bot'.`,
        });
        return response.text ?? "No content generated.";
    } catch (error) {
        throw new Error("Presentation points generation failed.");
    }
};
