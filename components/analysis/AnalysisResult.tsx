

import React from 'react';
import { MarketAnalysisResult } from '../../types';

interface AnalysisResultProps {
  result: MarketAnalysisResult;
  onReset: () => void;
}

const ResultCard: React.FC<{title: string, children: React.ReactNode, icon?: React.ReactNode}> = ({ title, children, icon }) => (
    <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex items-center mb-4">
            {icon && <div className="mr-3 text-indigo-600">{icon}</div>}
            <h3 className="text-xl font-bold text-gray-800">{title}</h3>
        </div>
        <div>{children}</div>
    </div>
);

const SkillTag: React.FC<{skill: string}> = ({ skill }) => (
    <span className="bg-indigo-100 text-indigo-800 text-sm font-medium px-3 py-1 rounded-full">
        {skill}
    </span>
);


const AnalysisResult: React.FC<AnalysisResultProps> = ({ result, onReset }) => {
  return (
    <div className="space-y-8 animate-fade-in">
        <ResultCard title="Market Summary">
            <p className="text-gray-600">{result.summary}</p>
        </ResultCard>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* FIX: Changed strokeLineCap to strokeLinecap and strokeLineJoin to strokeLinejoin */}
            <ResultCard title="Top In-Demand Skills" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>}>
                 <div className="flex flex-wrap gap-2">
                    {result.topSkills.map((skill, index) => <SkillTag key={index} skill={skill} />)}
                </div>
            </ResultCard>
            {/* FIX: Changed strokeLineCap to strokeLinecap and strokeLineJoin to strokeLinejoin */}
            <ResultCard title="Emerging Skills & Trends" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>}>
                 <div className="flex flex-wrap gap-2">
                    {result.emergingSkills.map((skill, index) => <SkillTag key={index} skill={skill} />)}
                </div>
            </ResultCard>
        </div>

         {/* FIX: Changed strokeLineCap to strokeLinecap and strokeLineJoin to strokeLinejoin */}
         <ResultCard title="Common Tools & Technologies" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>}>
             <div className="flex flex-wrap gap-2">
                {result.commonTools.map((tool, index) => <SkillTag key={index} skill={tool} />)}
            </div>
        </ResultCard>
        
        {result.sources && result.sources.length > 0 && (
            // FIX: Changed strokeLineCap to strokeLinecap and strokeLineJoin to strokeLinejoin
            <ResultCard title="Sources" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.536a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>}>
                <p className="text-sm text-gray-600 mb-4">
                    This analysis is based on information from the following web pages:
                </p>
                <ul className="space-y-2">
                    {result.sources.map((source, index) => (
                         <li key={index}>
                            <a href={source.uri} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline break-all">
                                {source.title}
                            </a>
                        </li>
                    ))}
                </ul>
            </ResultCard>
        )}

        <div className="mt-8 text-center">
            <button
                onClick={onReset}
                className="bg-indigo-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-indigo-700 transition-colors duration-300 flex items-center space-x-2 mx-auto"
                aria-label="Analyze another role"
            >
                <span>Analyze Another Role</span>
            </button>
        </div>
    </div>
  );
};

export default AnalysisResult;