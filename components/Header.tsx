import React from 'react';
import { CameraIcon } from './icons';

export const Header: React.FC = () => (
  <header className="bg-[#121821] border-b border-slate-700/50">
    <div className="container mx-auto px-4 md:px-8 py-4 flex items-center">
      <CameraIcon className="w-8 h-8 text-[#0EA5E9] mr-3" />
      <h1 className="text-2xl font-bold text-[#E6EEF6] tracking-tight">
        Estilista de Imagens Gemini
      </h1>
    </div>
  </header>
);
