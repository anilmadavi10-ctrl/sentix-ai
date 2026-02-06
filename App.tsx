
import React, { useState, useCallback } from 'react';
import { analyzeSentiment } from './services/geminiService';
import { DashboardData } from './types';
import SentimentChart from './components/SentimentChart';
import WordCloud from './components/WordCloud';
import ChatBot from './components/ChatBot';

const App: React.FC = () => {
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<DashboardData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (!inputText.trim()) return;
    setIsLoading(true);
    setError(null);
    try {
      const result = await analyzeSentiment(inputText);
      setData(result);
    } catch (err: any) {
      setError(err.message || 'Failed to analyze text. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const resetAnalysis = () => {
    setData(null);
    setInputText('');
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600 text-white p-2 rounded-lg">
              <i className="fas fa-chart-line text-xl"></i>
            </div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Sentix AI</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-500 hidden sm:inline">Powered by Gemini</span>
            {data && (
              <button 
                onClick={resetAnalysis}
                className="text-sm font-medium text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
              >
                <i className="fas fa-redo"></i> New Analysis
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!data ? (
          <div className="max-w-3xl mx-auto">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Analyze Sentiment</h2>
              <p className="text-slate-600 mb-6">Paste your customer reviews below to generate a comprehensive sentiment dashboard and actionable intelligence.</p>
              
              <div className="mb-6">
                <label className="block text-sm font-semibold text-slate-700 mb-2">Raw Review Text</label>
                <textarea
                  className="w-full h-64 p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition-all text-slate-700"
                  placeholder="Paste review batch here (one per line or standard block text)..."
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                />
              </div>

              {error && (
                <div className="mb-6 p-4 bg-rose-50 text-rose-700 rounded-xl border border-rose-100 flex items-center gap-3">
                  <i className="fas fa-exclamation-circle"></i>
                  <span className="text-sm">{error}</span>
                </div>
              )}

              <button
                onClick={handleAnalyze}
                disabled={isLoading || !inputText.trim()}
                className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold rounded-xl shadow-lg shadow-indigo-200 flex items-center justify-center gap-2 transition-all active:scale-95"
              >
                {isLoading ? (
                  <>
                    <i className="fas fa-circle-notch animate-spin"></i>
                    Processing Intelligence...
                  </>
                ) : (
                  <>
                    <i className="fas fa-rocket"></i>
                    Generate Insights
                  </>
                )}
              </button>
            </div>

            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <i className="fas fa-clock"></i>
                </div>
                <h3 className="font-bold text-slate-900 mb-1">Trend Tracking</h3>
                <p className="text-sm text-slate-500">See how customer satisfaction evolves over weeks and months.</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <i className="fas fa-cloud"></i>
                </div>
                <h3 className="font-bold text-slate-900 mb-1">Keyword Insights</h3>
                <p className="text-sm text-slate-500">Instant visualization of common praises and pain points.</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <i className="fas fa-lightbulb"></i>
                </div>
                <h3 className="font-bold text-slate-900 mb-1">Actionable Intelligence</h3>
                <p className="text-sm text-slate-500">AI-generated executive steps to improve your business.</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Top Stats/Summary */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-8">
                {/* Executive Summary Card */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
                  <div className="flex items-center gap-3 mb-4">
                    <i className="fas fa-file-alt text-indigo-600 text-xl"></i>
                    <h2 className="text-xl font-bold text-slate-900">Executive Summary</h2>
                  </div>
                  <p className="text-slate-600 leading-relaxed mb-8">
                    {data.executiveSummary.overview}
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {data.executiveSummary.topActionableItems.map((item, i) => (
                      <div key={i} className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition-colors">
                        <div className="flex justify-between items-start mb-2">
                          <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${
                            item.impact === 'High' ? 'bg-rose-100 text-rose-700' : 
                            item.impact === 'Medium' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'
                          }`}>
                            {item.impact} Impact
                          </span>
                          <span className="text-indigo-600 font-bold text-xs">#{i+1}</span>
                        </div>
                        <h4 className="font-bold text-slate-900 text-sm mb-2">{item.title}</h4>
                        <p className="text-xs text-slate-500 leading-relaxed">{item.description}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Trend Chart Card */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
                  <div className="flex justify-between items-center mb-8">
                    <div>
                      <h2 className="text-xl font-bold text-slate-900">Sentiment Velocity</h2>
                      <p className="text-sm text-slate-500">Trend of customer happiness over the selected period</p>
                    </div>
                    <div className="flex gap-2">
                      <div className="flex items-center gap-1 text-xs text-slate-400">
                        <span className="w-2 h-2 rounded-full bg-indigo-500"></span> Score
                      </div>
                    </div>
                  </div>
                  <SentimentChart data={data.trendData} />
                </div>
              </div>

              {/* Sidebar: Word Cloud & Stats */}
              <div className="space-y-8">
                {/* Word Cloud Card */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                  <h3 className="text-lg font-bold text-slate-900 mb-4">Voice of Customer</h3>
                  <WordCloud words={data.wordCloud} />
                  <div className="mt-4 flex justify-center gap-6 border-t border-slate-100 pt-4">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                      <span className="text-xs text-slate-500">Praises</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-rose-500"></div>
                      <span className="text-xs text-slate-500">Complaints</span>
                    </div>
                  </div>
                </div>

                {/* Score Summary */}
                <div className="bg-indigo-900 rounded-2xl shadow-lg p-6 text-white overflow-hidden relative">
                  <div className="relative z-10">
                    <h3 className="text-indigo-200 text-sm font-medium mb-1">Average Sentiment</h3>
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl font-black">
                        {((data.trendData.reduce((acc, curr) => acc + curr.score, 0) / data.trendData.length) * 100).toFixed(0)}%
                      </span>
                      <span className="text-indigo-300 text-sm">Satisfaction</span>
                    </div>
                    <div className="mt-6 space-y-3">
                      <div className="h-1.5 w-full bg-indigo-950/50 rounded-full">
                        <div 
                          className="h-full bg-indigo-400 rounded-full" 
                          style={{ width: `${(data.trendData.reduce((acc, curr) => acc + curr.score, 0) / data.trendData.length + 1) * 50}%` }}
                        ></div>
                      </div>
                      <div className="flex justify-between text-[10px] font-bold text-indigo-400 uppercase tracking-wider">
                        <span>Negative</span>
                        <span>Neutral</span>
                        <span>Positive</span>
                      </div>
                    </div>
                  </div>
                  {/* Decorative blobs */}
                  <div className="absolute top-[-20%] right-[-20%] w-40 h-40 bg-indigo-600/30 blur-3xl rounded-full"></div>
                  <div className="absolute bottom-[-10%] left-[-10%] w-24 h-24 bg-indigo-500/20 blur-2xl rounded-full"></div>
                </div>

                {/* Pro Tip */}
                <div className="bg-amber-50 border border-amber-100 rounded-2xl p-6">
                  <div className="flex items-center gap-3 mb-2">
                    <i className="fas fa-lightbulb text-amber-500"></i>
                    <h4 className="font-bold text-amber-900 text-sm">CX Tip</h4>
                  </div>
                  <p className="text-xs text-amber-700 leading-relaxed">
                    Based on your "High Impact" items, addressing the top concern could lead to a potential 15-20% boost in overall satisfaction scores. Use the assistant below to plan your rollout.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Floating Chat Bot */}
      <ChatBot />
    </div>
  );
};

export default App;
