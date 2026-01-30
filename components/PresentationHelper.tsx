
import React, { useState, useCallback } from 'react';
import { generatePresentationPoints } from '../services/geminiService';
import { Loader } from './Loader';
import { Card } from './Card';

/**
 * A component to help users prepare for their project presentation.
 * It generates a list of key talking points using the Gemini API.
 */
export const PresentationHelper: React.FC = () => {
  // State to store the generated talking points as an array of strings.
  const [points, setPoints] = useState<string[]>([]);
  // State to manage the loading indicator.
  const [isLoading, setIsLoading] = useState<boolean>(false);
  // State to store and display any errors.
  const [error, setError] = useState<string | null>(null);

  /**
   * Handles the generation of talking points when the user clicks the button.
   * It calls the `generatePresentationPoints` service and processes the
   * raw string response into an array of individual points.
   */
  const handleGenerate = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setPoints([]);
    try {
      const result = await generatePresentationPoints();
      // Split the result string into an array of lines and filter for bullet points.
      setPoints(result.split('\n').filter(p => p.trim().startsWith('-')));
    } catch (err) {
      setError('Failed to generate points. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <div className="max-w-3xl mx-auto">
      <h2 className="text-3xl font-bold text-white mb-2">Presentation Helper</h2>
      <p className="text-slate-400 mb-6">Generate key talking points for your 10-minute project presentation and live demo.</p>

      <Card>
        <div className="text-center">
          <button
            onClick={handleGenerate}
            disabled={isLoading}
            className="bg-sky-500 text-white font-bold py-3 px-8 rounded-md hover:bg-sky-600 disabled:bg-slate-600 disabled:cursor-not-allowed flex items-center justify-center transition-colors mx-auto"
          >
            {isLoading ? <Loader size={20} /> : 'Generate Talking Points'}
          </button>
        </div>
      </Card>

      {error && <div className="mt-4 text-center text-red-400">{error}</div>}

      {/* Display the list of generated points */}
      {points.length > 0 && (
        <Card className="mt-6 animate-fade-in border border-slate-700">
          <h3 className="text-lg font-semibold text-white mb-4">Key Presentation Points</h3>
          <ul className="space-y-3 list-disc list-inside">
            {points.map((point, index) => (
              <li key={index} className="text-slate-300">
                {point.substring(1).trim()}
              </li>
            ))}
          </ul>
        </Card>
      )}
    </div>
  );
};
