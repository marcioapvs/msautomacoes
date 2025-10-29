import React from 'react';
import { CopyIcon, SparklesIcon } from './icons';

interface PromptEditorProps {
  userIdea: string;
  onUserIdeaChange: (idea: string) => void;
  generatedPrompt: string;
  onGeneratedPromptChange: (prompt: string) => void;
  onGeneratePrompt: () => void;
  isGeneratingPrompt: boolean;
  disabled?: boolean;
}

export const PromptEditor: React.FC<PromptEditorProps> = ({ 
  userIdea, 
  onUserIdeaChange,
  generatedPrompt,
  onGeneratedPromptChange,
  onGeneratePrompt,
  isGeneratingPrompt,
  disabled
}) => {
  
  const handleCopy = () => {
    navigator.clipboard.writeText(generatedPrompt);
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-bold text-[#E6EEF6] mb-2">2. Descreva sua Ideia</h2>
        <p className="text-slate-400 mb-4">Digite uma ideia simples. A IA irá transformá-la em um prompt detalhado.</p>
        <textarea
          value={userIdea}
          onChange={(e) => onUserIdeaChange(e.target.value)}
          placeholder="Ex: 'Sou consultor de proteção veicular e quero uma imagem para Instagram com uma dica de direção segura.'"
          className="w-full h-28 p-3 bg-[#0B0F14] border border-slate-600 rounded-lg focus:ring-2 focus:ring-[#0EA5E9] focus:border-[#0EA5E9] transition-shadow disabled:bg-slate-800"
          disabled={disabled}
        />
        <button
          onClick={onGeneratePrompt}
          disabled={disabled || !userIdea}
          className="mt-3 w-full flex items-center justify-center px-4 py-2 bg-sky-600 text-white text-sm font-bold rounded-lg hover:bg-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-400 disabled:bg-slate-600 disabled:cursor-not-allowed transition-colors"
        >
          <SparklesIcon className="w-5 h-5 mr-2" />
          {isGeneratingPrompt ? 'Gerando...' : 'Gerar Prompt com Gemini'}
        </button>
      </div>

      <div>
        <h2 className="text-xl font-bold text-[#E6EEF6] mb-2">3. Edite seu Prompt Final</h2>
        <p className="text-slate-400 mb-4">Ajuste o prompt gerado pela IA como desejar.</p>
        <div className="relative">
          <textarea
            value={generatedPrompt}
            onChange={(e) => onGeneratedPromptChange(e.target.value)}
            placeholder="O prompt gerado pela IA aparecerá aqui..."
            className="w-full h-40 p-3 pr-10 bg-[#0B0F14] border border-slate-600 rounded-lg focus:ring-2 focus:ring-[#0EA5E9] focus:border-[#0EA5E9] transition-shadow disabled:bg-slate-800"
            disabled={disabled}
          />
          <button
            onClick={handleCopy}
            className="absolute top-2 right-2 p-1.5 text-slate-400 hover:text-white rounded-md hover:bg-slate-700 transition-colors"
            aria-label="Copiar prompt"
            disabled={!generatedPrompt}
          >
            <CopyIcon className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
