import React from 'react';
import { DownloadIcon, ImageIcon, AlertTriangleIcon } from './icons';

interface ResultDisplayProps {
  generatedImageUrl: string | null;
  isLoading: boolean;
  error: string | null;
}

const LoadingSpinner: React.FC = () => (
    <div className="flex flex-col items-center justify-center text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#0EA5E9] mb-4"></div>
        <h3 className="text-lg font-semibold text-[#E6EEF6]">Gerando sua visão...</h3>
        <p className="text-sm text-slate-400">Isso pode levar um momento. Por favor, aguarde.</p>
    </div>
);

const EmptyState: React.FC<{message: string, subMessage: string}> = ({message, subMessage}) => (
    <div className="flex flex-col items-center justify-center text-center text-slate-400">
        <ImageIcon className="w-16 h-16 mb-4"/>
        <h3 className="text-lg font-semibold text-[#E6EEF6]">{message}</h3>
        <p className="text-sm">{subMessage}</p>
    </div>
);

const ErrorState: React.FC<{ message: string }> = ({ message }) => (
    <div className="flex flex-col items-center justify-center text-center text-red-400">
        <AlertTriangleIcon className="w-16 h-16 mb-4"/>
        <h3 className="text-lg font-semibold text-red-300">Ocorreu um Erro</h3>
        <p className="text-sm">{message}</p>
    </div>
);

export const ResultDisplay: React.FC<ResultDisplayProps> = ({
  generatedImageUrl,
  isLoading,
  error,
}) => {
  
  const renderContent = () => {
    if (isLoading) {
      return <LoadingSpinner />;
    }
    if (error) {
      return <ErrorState message={error} />;
    }
    if (generatedImageUrl) {
      return (
        <div className="w-full h-full relative group">
            <img src={generatedImageUrl} alt="Resultado gerado" className="w-full h-full object-contain rounded-lg" />
            <a
                href={generatedImageUrl}
                download="imagem-gerada.png"
                className="absolute bottom-4 right-4 bg-[#0EA5E9] text-white px-4 py-2 rounded-lg shadow-lg flex items-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-sky-500"
            >
                <DownloadIcon className="w-5 h-5 mr-2" />
                Baixar
            </a>
        </div>
      );
    }
    return <EmptyState message="Sua imagem gerada aparecerá aqui" subMessage="Complete os passos para começar." />;
  }

  return (
    <div className="bg-[#121821] p-6 rounded-2xl border border-slate-700 w-full aspect-video flex items-center justify-center">
        {renderContent()}
    </div>
  );
};
