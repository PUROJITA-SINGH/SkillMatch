

import React, { useState } from 'react';
import { ResumeTailorResult } from '../../types';

interface TailorResultProps {
  result: ResumeTailorResult;
  onReset: () => void;
}

const ResultCard: React.FC<{title: string, children: React.ReactNode, icon?: React.ReactNode, className?: string}> = ({ title, children, icon, className }) => (
    <div className={`bg-white p-6 rounded-lg shadow-md ${className}`}>
        <div className="flex items-center mb-4">
            {icon && <div className="mr-3 text-indigo-600">{icon}</div>}
            <h3 className="text-xl font-bold text-gray-800">{title}</h3>
        </div>
        <div>{children}</div>
    </div>
);

const TailorResult: React.FC<TailorResultProps> = ({ result, onReset }) => {
    const [copySuccess, setCopySuccess] = useState('');

    const handleCopy = () => {
        navigator.clipboard.writeText(result.tailoredResumeText).then(() => {
            setCopySuccess('Copied!');
            setTimeout(() => setCopySuccess(''), 2000);
        }, () => {
            setCopySuccess('Failed to copy');
            setTimeout(() => setCopySuccess(''), 2000);
        });
    };
  
    return (
    <div className="space-y-8 animate-fade-in">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
                 <div className="bg-white p-6 rounded-lg shadow-md h-full flex flex-col">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl font-bold text-gray-800">Your Tailored Resume</h3>
                        <button 
                            onClick={handleCopy}
                            className="bg-gray-200 text-gray-800 font-semibold py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors text-sm"
                        >
                            {copySuccess || 'Copy Text'}
                        </button>
                    </div>
                    <textarea
                        readOnly
                        value={result.tailoredResumeText}
                        className="w-full flex-grow p-3 border border-gray-200 rounded-md bg-gray-50 font-mono text-sm resize-none"
                        aria-label="Tailored Resume Text"
                    />
                </div>
            </div>

            <ResultCard 
                title="Key Changes" 
                // FIX: Changed strokeLineCap to strokeLinecap and strokeLineJoin to strokeLinejoin
                icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>}
                className="lg:col-span-1"
            >
                <ul className="space-y-3">
                    {result.changeSummary.map((item, index) => (
                         <li key={index} className="flex items-start text-gray-700">
                            <span className="text-indigo-500 mr-3 mt-1">&#10022;</span>
                            <span>{item}</span>
                        </li>
                    ))}
                </ul>
            </ResultCard>
        </div>

        <div className="mt-8 text-center">
            <button
                onClick={onReset}
                className="bg-indigo-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-indigo-700 transition-colors duration-300 flex items-center space-x-2 mx-auto"
                aria-label="Tailor for another job"
            >
                <span>Tailor for Another Job</span>
            </button>
        </div>
    </div>
  );
};

export default TailorResult;