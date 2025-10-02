
import React, { useState, useRef } from 'react';
import { ICONS } from '../../constants';

declare const pdfjsLib: any;

interface FileInputProps {
  onFileRead: (text: string, fileName: string) => void;
  id: string;
  label: string;
}

const FileInput: React.FC<FileInputProps> = ({ onFileRead, id, label }) => {
  const [fileName, setFileName] = useState<string | null>(null);
  const [isReading, setIsReading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    setFileName(file.name);
    setIsReading(true);

    if (file.type === 'application/pdf') {
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const arrayBuffer = e.target?.result as ArrayBuffer;
          if (typeof pdfjsLib === 'undefined') {
            console.error("pdf.js is not loaded.");
            setFileName("Error: PDF library not loaded.");
            setIsReading(false);
            return;
          }
          const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
          let fullText = '';
          for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const textContent = await page.getTextContent();
            // a space is added between each text item to separate words.
            const pageText = textContent.items.map((item: any) => item.str).join(' ');
            // a newline is added between each page to separate pages.
            fullText += pageText + '\n\n';
          }
          onFileRead(fullText.trim(), file.name);
        } catch (error) {
          console.error("Error parsing PDF:", error);
          setFileName("Error parsing PDF.");
          onFileRead('', file.name);
        } finally {
          setIsReading(false);
        }
      };
      reader.onerror = () => {
        console.error("Error reading file");
        setFileName("Error reading file.");
        setIsReading(false);
      };
      reader.readAsArrayBuffer(file);
    } else { // Handle text-based files
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        onFileRead(text, file.name);
        setIsReading(false);
      };
      reader.onerror = () => {
        console.error("Error reading file");
        setFileName("Error reading file.");
        setIsReading(false);
      };
      reader.readAsText(file);
    }
  };

  const handleClearFile = () => {
    setFileName(null);
    onFileRead('', '');
    if (fileInputRef.current) {
        fileInputRef.current.value = '';
    }
  };

  return (
    <div className="w-full">
      <input
        type="file"
        id={id}
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept=".txt,.md,.pdf"
      />
      <label
        htmlFor={id}
        className="w-full flex items-center justify-center px-4 py-6 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-white hover:bg-gray-50 transition-colors"
      >
        {isReading ? (
             <div className="text-center">
                <div className="flex justify-center">
                    <div className="border-2 border-gray-200 border-t-indigo-600 rounded-full w-6 h-6 animate-spin"></div>
                </div>
                <p className="mt-2 text-sm text-gray-600">Reading file...</p>
             </div>
        ) : fileName ? (
          <div className="text-center">
             <div className="flex items-center justify-center text-green-600">
                {ICONS.CHECK}
                <span className="ml-2 font-semibold text-gray-700">{fileName}</span>
             </div>
             <button onClick={(e) => { e.preventDefault(); handleClearFile(); }} className="mt-2 text-sm text-indigo-600 hover:underline">
                Choose a different file
            </button>
          </div>
        ) : (
          <div className="text-center">
            <div className="flex justify-center">{ICONS.UPLOAD}</div>
            <p className="mt-2 text-sm text-gray-600">
              <span className="font-semibold text-indigo-600">Click to upload</span> or drag and drop
            </p>
            <p className="text-xs text-gray-500">{label} (PDF, TXT, MD)</p>
          </div>
        )}
      </label>
    </div>
  );
};

export default FileInput;
