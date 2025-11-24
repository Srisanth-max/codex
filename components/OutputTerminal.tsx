import React from 'react';
import { Trash2, Terminal } from 'lucide-react';

interface OutputTerminalProps {
  output: string;
  isError: boolean;
  onClear: () => void;
  isVisible: boolean;
  onClose: () => void;
}

export const OutputTerminal: React.FC<OutputTerminalProps> = ({
  output,
  isError,
  onClear,
  isVisible,
}) => {
  if (!isVisible) return null;

  return (
    <div className="h-full flex flex-col">
        {/* Terminal Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/5 bg-black/10">
            <div className="flex items-center gap-2 text-gray-400">
                <Terminal size={12} />
                <span className="text-[11px] font-bold uppercase tracking-widest">Console</span>
            </div>
            <button 
                onClick={onClear}
                className="p-1.5 hover:bg-white/5 rounded text-gray-500 hover:text-white transition-all"
                title="Clear Output"
            >
                <Trash2 size={12} />
            </button>
        </div>

        {/* Terminal Content */}
        <div className="flex-1 p-4 font-mono text-[13px] overflow-auto custom-scrollbar bg-black/20">
            {output ? (
                <div className={`whitespace-pre-wrap leading-relaxed animate-fade-in ${isError ? 'text-red-300' : 'text-blue-100'}`}>
                    <div className="flex gap-2 mb-3 opacity-40 text-[10px]">
                       <span>$</span>
                       <span>exec run --target=main</span>
                    </div>
                    {output}
                    <div className="mt-2 w-2 h-4 bg-gray-500/50 animate-pulse inline-block align-middle"></div>
                </div>
            ) : (
                <div className="h-full flex flex-col items-center justify-center text-white/10 gap-2">
                    <Terminal size={24} strokeWidth={1} />
                    <span className="text-xs font-medium">Output will appear here</span>
                </div>
            )}
        </div>
    </div>
  );
};