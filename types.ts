
export interface StressTest {
  scenario: string;
  impactPercent: number;
}

export interface Prediction {
  stock: string;
  closeAsOf: number;
  bullPercent: number;
  bullProbability: number;
  basePercent: number;
  baseProbability: number;
  bearPercent: number;
  bearProbability: number;
  expectedClose: number;
  confidence: number;
  stressTests: StressTest[];
  sources: string[];
  rationale: string;
  timestamp: number;
  period: string;
}

export interface StockData {
  ticker: string;
  companyName: string;
  currentPrice: number;
  change: number;
  percentChange: number;
  timestamp: number;
}

export interface NewsItem {
  ticker: string;
  headline: string;
  summary: string;
  url: string;
  category: 'Positive' | 'Negative' | 'Neutral';
}

export type TaskCategory = 'Bot Development' | 'AI Model' | 'Report & Deliverables' | 'Presentation';

export interface Task {
  id: number;
  text: string;
  completed: boolean;
  category: TaskCategory;
}

export interface TeamMember {
  id: number;
  name: string;
  role: string;
  responsibilities: string;
}
