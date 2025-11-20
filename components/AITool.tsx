import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";
import { GenerationStatus } from '../types';
import { Sparkles, AlertCircle, Terminal } from 'lucide-react';
import { GEMINI_COST_PER_USE } from '../constants';

interface AIToolProps {
  points: number;
  deductPoints: (amount: number) => void;
}

export const AITool: React.FC<AIToolProps> = ({ points, deductPoints }) => {
  const [prompt, setPrompt] = useState('');
  const [result, setResult] = useState('');
  const [status, setStatus] = useState<GenerationStatus>(GenerationStatus.IDLE);

  const handleGenerate = async () => {
    if (points < GEMINI_COST_PER_USE) return;
    if (!process.env.API_KEY) {
        console.error("API Key not configured in environment");
        setStatus(GenerationStatus.ERROR);
        setResult("System Error: API Key missing.");
        return;
    }

    setStatus(GenerationStatus.LOADING);
    
    // Deduct points first (optimistic)
    deductPoints(GEMINI_COST_PER_USE);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
            systemInstruction: "You are a helpful AI assistant within the AutoPoints app. Keep answers concise, witty, and formatted in markdown.",
        }
      });

      setResult(response.text || "No response generated.");
      setStatus(GenerationStatus.SUCCESS);
    } catch (error) {
      console.error("Generation failed", error);
      setStatus(GenerationStatus.ERROR);
      setResult("Failed to generate content. Points have been refunded.");
      // Refund points on error
      deductPoints(-GEMINI_COST_PER_USE);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
      <div className="p-1 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600">
        <div className="bg-slate-900 p-6 rounded-t-xl">
           <div className="flex items-center justify-between mb-6">
             <h2 className="text-2xl font-bold flex items-center">
               <Sparkles className="w-6 h-6 text-purple-400 mr-2" />
               AutoGenerator
             </h2>
             <span className="text-xs font-mono px-2 py-1 rounded bg-slate-800 text-slate-400 border border-slate-700">
               Cost: {GEMINI_COST_PER_USE} PTS/RUN
             </span>
           </div>

           <div className="space-y-4">
             <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe what you want the AI to generate..."
                className="w-full h-32 bg-slate-950 border border-slate-800 rounded-xl p-4 text-slate-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none placeholder:text-slate-600"
             />
             
             <div className="flex justify-end">
               <button
                 onClick={handleGenerate}
                 disabled={status === GenerationStatus.LOADING || points < GEMINI_COST_PER_USE || !prompt.trim()}
                 className="flex items-center space-x-2 bg-white text-slate-900 px-6 py-2.5 rounded-lg font-semibold hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
               >
                 {status === GenerationStatus.LOADING ? (
                   <span className="w-4 h-4 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
                 ) : (
                   <Sparkles className="w-4 h-4" />
                 )}
                 <span>Generate</span>
               </button>
             </div>
             
             {points < GEMINI_COST_PER_USE && (
               <div className="flex items-center text-red-400 text-sm bg-red-400/10 p-3 rounded-lg">
                 <AlertCircle className="w-4 h-4 mr-2" />
                 Insufficient points. Purchase a package above to continue.
               </div>
             )}
           </div>
        </div>
      </div>

      {/* Result Area */}
      {(result || status === GenerationStatus.ERROR) && (
        <div className="bg-slate-950 border-t border-slate-800 p-6">
          <div className="flex items-center space-x-2 text-slate-500 mb-4">
             <Terminal className="w-4 h-4" />
             <span className="text-sm font-mono uppercase">Output Console</span>
          </div>
          
          {status === GenerationStatus.ERROR && !result ? (
            <div className="text-red-400">An error occurred during generation. Points refunded.</div>
          ) : (
            <div className="prose prose-invert prose-sm max-w-none text-slate-300">
                {/* Simple rendering, in real app use Markdown renderer */}
                <pre className="whitespace-pre-wrap font-sans">{result}</pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
};