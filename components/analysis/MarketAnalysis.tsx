import React, { useState } from 'react';
import { MarketAnalysisResult } from '../../types';
import { analyzeJobMarket } from '../../services/geminiService';
import Spinner from '../ui/Spinner';
import AnalysisResult from './AnalysisResult';

const MarketAnalysis: React.FC = () => {
    const [jobTitle, setJobTitle] = useState('');
    const [industry, setIndustry] = useState('');
    const [result, setResult] = useState<MarketAnalysisResult | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleAnalyze = async () => {
        if (!jobTitle.trim()) {
            setError('Please provide a target job title.');
            return;
        }
        setError(null);
        setIsLoading(true);
        setResult(null);

        try {
            const analysisResult = await analyzeJobMarket(jobTitle, industry);
            setResult(analysisResult);
        } catch (err) {
            const message = err instanceof Error ? err.message : 'An unknown error occurred.';
            setError(`Analysis failed: ${message}`);
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleReset = () => {
        setResult(null);
        setJobTitle('');
        setIndustry('');
        setError(null);
    };

    if (result) {
        return <AnalysisResult result={result} onReset={handleReset} />;
    }

    return (
        <div className="space-y-8 max-w-4xl mx-auto">
            <div>
                <h2 className="text-3xl font-bold text-gray-800">Job Market Analysis</h2>
                <p className="mt-2 text-gray-600">
                    Get real-time insights into the skills and trends for your target career path.
                </p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-md space-y-6">
                <div>
                    <label htmlFor="jobTitle" className="block text-sm font-medium text-gray-700 mb-1">
                        Target Job Title
                    </label>
                    <input
                        type="text"
                        id="jobTitle"
                        value={jobTitle}
                        onChange={(e) => setJobTitle(e.target.value)}
                        placeholder="e.g., Senior Software Engineer"
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        aria-required="true"
                    />
                </div>
                <div>
                     <label htmlFor="industry" className="block text-sm font-medium text-gray-700 mb-1">
                        Industry / Location (Optional)
                    </label>
                    <input
                        type="text"
                        id="industry"
                        value={industry}
                        onChange={(e) => setIndustry(e.target.value)}
                        placeholder="e.g., FinTech in New York"
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                </div>
            </div>
            
            <div className="text-center">
                {error && <p className="text-red-500 mb-4" role="alert">{error}</p>}
                <button
                    onClick={handleAnalyze}
                    disabled={isLoading || !jobTitle.trim()}
                    className="bg-indigo-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-indigo-700 transition-colors duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center space-x-2 mx-auto min-w-[180px]"
                    aria-label="Analyze job market"
                >
                    {isLoading ? <Spinner /> : <span>Analyze Market</span>}
                </button>
            </div>
        </div>
    );
};

export default MarketAnalysis;
