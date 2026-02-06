
export interface ReviewAnalysis {
  sentimentScore: number; // -1 to 1
  date: string;
  keywords: string[];
  summary: string;
}

export interface DashboardData {
  trendData: { date: string; score: number }[];
  wordCloud: { text: string; value: number; type: 'praise' | 'complaint' }[];
  executiveSummary: {
    overview: string;
    topActionableItems: {
      title: string;
      description: string;
      impact: 'High' | 'Medium' | 'Low';
    }[];
  };
}

export interface ChatMessage {
  role: 'user' | 'model' | 'system' | 'thinking';
  content: string;
}
