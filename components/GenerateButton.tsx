import React from 'react';

interface GenerateButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export const GenerateButton: React.FC<GenerateButtonProps> = ({ children, ...props }) => {
  return (
    <button
      {...props}
      className="w-full flex items-center justify-center px-6 py-4 bg-[#0EA5E9] text-white text-lg font-bold rounded-xl shadow-lg hover:bg-sky-500 focus:outline-none focus:ring-4 focus:ring-sky-400/50 transition-all duration-300 ease-in-out disabled:bg-slate-600 disabled:cursor-not-allowed transform hover:scale-105 disabled:transform-none"
    >
      {children}
    </button>
  );
};
