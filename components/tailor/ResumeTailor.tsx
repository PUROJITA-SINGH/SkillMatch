import React, { useState } from 'react';
import { ResumeTailorResult } from '../../types';
import { tailorResume } from '../../services/geminiService';
import Spinner from '../ui/Spinner';
import TailorResult from './TailorResult';
import InputModeToggle, { InputMode } from '../ui/InputModeToggle';
import FileInput from '../ui/FileInput';

const ResumeTailor: React.FC = () => {
  const [resumeText, setResumeText] = useState('');
  const [jobDescription, setJobDescription] = useState('');

  const [resumeInputMode, setResumeInputMode] = useState<InputMode>('text');
  const [jobInputMode, setJobInputMode] = useState<InputMode>('text');

  const [result, setResult] = useState<ResumeTailorResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleTailor = async () => {
    if (!resumeText.trim() || !jobDescription.trim()) {
      setError('Please provide both your base resume and a job description.');
      return;
    }
    setError(null);
    setIsLoading(true);
    setResult(null);

    try {
      const tailorResult = await tailorResume(resumeText, jobDescription);
      setResult(tailorResult);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An unknown error occurred.';
      setError(`Tailoring failed: ${message}`);
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setResumeText('');
    setJobDescription('');
    setError(null);
  };

  const renderInputSection = (
    title: string,
    mode: InputMode,
    setMode: (mode: InputMode) => void,
    value: string,
    setValue: (text: string, fileName?: string) => void,
    placeholder: string
  ) => (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        <InputModeToggle mode={mode} onModeChange={setMode} />
      </div>
      {mode === 'text' ? (
        <textarea
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={placeholder}
          className="w-full h-48 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow"
          aria-label={title}
        />
      ) : (
        <FileInput 
            id={title.toLowerCase().replace(' ', '-')} 
            label={title} 
            onFileRead={(text, _) => setValue(text)} />
      )}
    </div>
  );

  if (result) {
    return <TailorResult result={result} onReset={handleReset} />;
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-gray-800">AI Resume Tailor</h2>
        <p className="mt-2 text-gray-600">
          Automatically customize your resume for any job description to highlight your most relevant skills and experience.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {renderInputSection(
          'Your Base Resume',
          resumeInputMode,
          setResumeInputMode,
          resumeText,
          (text) => setResumeText(text),
          'Paste the full text of your base resume here...'
        )}
        {renderInputSection(
          'Target Job Description',
          jobInputMode,
          setJobInputMode,
          jobDescription,
          (text) => setJobDescription(text),
          'Paste the full job description text here...'
        )}
      </div>
      
      <div className="text-center">
        {error && <p className="text-red-500 mb-4" role="alert">{error}</p>}
        <button
          onClick={handleTailor}
          disabled={isLoading || !resumeText.trim() || !jobDescription.trim()}
          className="bg-indigo-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-indigo-700 transition-colors duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center space-x-2 mx-auto min-w-[200px]"
          aria-label="Tailor my resume"
        >
          {isLoading ? <Spinner /> : <span>Tailor My Resume</span>}
        </button>
      </div>
    </div>
  );
};

export default ResumeTailor;
