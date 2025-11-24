import React, { useEffect, useRef } from 'react';
import { SupportedLanguage } from '../types';

interface CodeEditorProps {
  code: string;
  language: SupportedLanguage;
  onChange: (value: string) => void;
  className?: string;
}

const getPrismLang = (lang: SupportedLanguage) => {
  switch (lang) {
    case SupportedLanguage.JAVASCRIPT: return 'javascript';
    case SupportedLanguage.TYPESCRIPT: return 'typescript';
    case SupportedLanguage.PYTHON: return 'python';
    case SupportedLanguage.HTML: return 'markup';
    case SupportedLanguage.CSS: return 'css';
    case SupportedLanguage.SQL: return 'sql';
    case SupportedLanguage.C_PLUS_PLUS: return 'cpp';
    default: return 'clike';
  }
};

export const CodeEditor: React.FC<CodeEditorProps> = ({ code, language, onChange, className = '' }) => {
  const preRef = useRef<HTMLPreElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleScroll = (e: React.UIEvent<HTMLTextAreaElement>) => {
    if (preRef.current) {
      preRef.current.scrollTop = e.currentTarget.scrollTop;
      preRef.current.scrollLeft = e.currentTarget.scrollLeft;
    }
  };

  useEffect(() => {
    if (preRef.current && (window as any).Prism) {
      (window as any).Prism.highlightElement(preRef.current);
    }
  }, [code, language]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const start = e.currentTarget.selectionStart;
      const end = e.currentTarget.selectionEnd;
      const newValue = code.substring(0, start) + '    ' + code.substring(end);
      onChange(newValue);
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.selectionStart = textareaRef.current.selectionEnd = start + 4;
        }
      }, 0);
    }
  };

  const lineCount = code.split('\n').length;

  return (
    <div className={`relative flex flex-col h-full ${className}`}>
      <div className="flex-1 relative flex overflow-hidden">
        
        {/* Line Numbers */}
        <div className="w-12 shrink-0 bg-transparent border-r border-white/5 text-white/20 text-right pr-3 pt-6 select-none font-mono text-[12px] leading-[1.6]">
          {Array.from({ length: lineCount }).map((_, i) => (
            <div key={i} className="h-[19.2px]">{i + 1}</div>
          ))}
        </div>

        {/* Editor Container */}
        <div className="relative flex-1 h-full overflow-hidden">
          
          {/* Highlighted Output */}
          <pre
            ref={preRef}
            aria-hidden="true"
            className={`!m-0 !p-6 !bg-transparent !absolute inset-0 !overflow-hidden pointer-events-none z-0 language-${getPrismLang(language)}`}
          >
            <code className={`language-${getPrismLang(language)}`} style={{ fontSize: '12px' }}>
              {code + '\n'}
            </code>
          </pre>

          {/* Input Overlay */}
          <textarea
            ref={textareaRef}
            value={code}
            onChange={(e) => onChange(e.target.value)}
            onScroll={handleScroll}
            onKeyDown={handleKeyDown}
            spellCheck={false}
            autoCapitalize="off"
            autoComplete="off"
            className="absolute inset-0 w-full h-full p-6 bg-transparent text-transparent caret-blue-400 font-mono text-[12px] leading-[1.6] resize-none outline-none z-10 whitespace-pre overflow-auto selection:bg-blue-500/20"
            style={{ color: 'transparent' }}
          />
        </div>
      </div>
    </div>
  );
};