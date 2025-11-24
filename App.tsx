import React, { useState, useEffect } from 'react';
import { Play, Sparkles, MessageSquare, Code2, Copy, Check, Terminal as TerminalIcon, Command, Box, X } from 'lucide-react';
import { GlassPanel, GlassButton } from './components/GlassComponents';
import { OutputTerminal } from './components/OutputTerminal';
import { CodeEditor } from './components/CodeEditor';
import { runCodeSimulation, explainCode, fixCode } from './services/geminiService';
import { SupportedLanguage } from './types';

const TEMPLATES: Record<SupportedLanguage, string> = {
  [SupportedLanguage.JAVASCRIPT]: `// Core Runner v2.6
// Neat, clean, efficient.

function processData(input) {
  console.log("Processing stream: " + input);
  return input.split('').reverse().join('');
}

const result = processData("Aether Studio");
console.log("Result:", result);`,
  
  [SupportedLanguage.PYTHON]: `# Python 3.10
def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n-1) + fibonacci(n-2)

print("Calculating sequence...")
for i in range(10):
    print(f"Fib({i}) = {fibonacci(i)}")`,
    
  [SupportedLanguage.TYPESCRIPT]: `// TypeScript Strict
interface User {
  id: number;
  role: 'admin' | 'user';
}

const currentUser: User = {
  id: 42,
  role: 'admin'
};

console.log(\`User \${currentUser.id} authorized.\`);`,

  [SupportedLanguage.HTML]: `<!-- Live Preview -->
<div class="card">
  <h2>Neat Design</h2>
  <button>Click Me</button>
</div>`,

  [SupportedLanguage.CSS]: `/* Minimal Style */
body {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: transparent;
  color: white;
  font-family: sans-serif;
}

.card {
  background: rgba(255,255,255,0.1);
  padding: 40px;
  border-radius: 20px;
  border: 1px solid rgba(255,255,255,0.1);
  backdrop-filter: blur(10px);
}

button {
  background: #3b82f6;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  color: white;
  margin-top: 15px;
  cursor: pointer;
}`,

  [SupportedLanguage.SQL]: `-- Database Query
SELECT name, email 
FROM users 
WHERE status = 'active'
LIMIT 5;`,

  [SupportedLanguage.C_PLUS_PLUS]: `// System Core
#include <iostream>

int main() {
    std::cout << "System initialized." << std::endl;
    return 0;
}`
};

export default function App() {
  const [language, setLanguage] = useState<SupportedLanguage>(SupportedLanguage.JAVASCRIPT);
  const [code, setCode] = useState<string>(TEMPLATES[SupportedLanguage.JAVASCRIPT]);
  const [output, setOutput] = useState<string>("");
  const [isError, setIsError] = useState<boolean>(false);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [aiAnalyzing, setAiAnalyzing] = useState<boolean>(false);
  const [copied, setCopied] = useState(false);
  
  const isWebMode = language === SupportedLanguage.HTML || language === SupportedLanguage.CSS;
  const [previewDoc, setPreviewDoc] = useState("");

  useEffect(() => {
    if (language === SupportedLanguage.HTML) {
      setPreviewDoc(code);
    } else if (language === SupportedLanguage.CSS) {
      setPreviewDoc(`
        <!DOCTYPE html>
        <html>
          <head>
            <style>${code}</style>
          </head>
          <body>
            <div class="card">
              <h2>Neat Design</h2>
              <button>Click Me</button>
            </div>
          </body>
        </html>
      `);
    }
  }, [code, language]);

  const handleLanguageChange = (lang: SupportedLanguage) => {
    setLanguage(lang);
    setCode(TEMPLATES[lang]);
    setOutput("");
  };

  const handleRun = async () => {
    if (isWebMode) return;
    setIsRunning(true);
    setOutput("Running...");
    setIsError(false);
    try {
      const result = await runCodeSimulation(code, language);
      setOutput(result);
    } catch (err) {
      setIsError(true);
      setOutput("Execution Error.");
    } finally {
      setIsRunning(false);
    }
  };

  const handleExplain = async () => {
    setAiAnalyzing(true);
    if (!isWebMode) setOutput("Analyzing...");
    const explanation = await explainCode(code);
    setOutput(explanation);
    setIsError(false);
    setAiAnalyzing(false);
  };

  const handleFix = async () => {
    setAiAnalyzing(true);
    const fixed = await fixCode(code, output || "General check");
    if (fixed && fixed.length > 0 && fixed !== code) {
       setCode(fixed);
       if (!isWebMode) setOutput("Optimized code applied.");
    }
    setAiAnalyzing(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="h-screen w-screen relative overflow-hidden bg-black font-sans text-gray-200 flex items-center justify-center p-4 md:p-8">
      
      {/* Sleek Dark Background */}
      <div className="fixed inset-0 z-0 bg-[#050505]">
        <div className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] bg-indigo-900/20 rounded-full blur-[150px] animate-mesh"></div>
        <div className="absolute bottom-[-20%] left-[-10%] w-[600px] h-[600px] bg-blue-900/10 rounded-full blur-[120px] animate-mesh animation-delay-2000"></div>
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03]"></div>
      </div>

      {/* Main Studio Window */}
      <div className="z-10 w-full max-w-[1400px] h-full max-h-[900px] flex flex-col">
        <GlassPanel className="flex-1 flex flex-col shadow-2xl !border-opacity-10">
          
          {/* Header Bar */}
          <div className="h-16 px-6 border-b border-white/5 flex items-center justify-between shrink-0 bg-white/5 backdrop-blur-xl">
            
            {/* Left: Window Controls & Branding */}
            <div className="flex items-center gap-6">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/50 border border-red-400/20"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500/50 border border-yellow-400/20"></div>
                <div className="w-3 h-3 rounded-full bg-green-500/50 border border-green-400/20"></div>
              </div>
              
              <div className="h-6 w-px bg-white/10"></div>
              
              <div className="flex items-center gap-2 text-white/50 hover:text-white/80 transition-colors cursor-default">
                <Box size={14} />
                <span className="text-sm font-medium tracking-wide">Aether Studio</span>
              </div>
            </div>

            {/* Center: Language Selector */}
            <div className="absolute left-1/2 -translate-x-1/2 group">
               <div className="relative">
                 <select 
                   value={language}
                   onChange={(e) => handleLanguageChange(e.target.value as SupportedLanguage)}
                   className="appearance-none bg-black/40 hover:bg-black/60 border border-white/10 rounded-lg py-1.5 pl-3 pr-8 text-xs font-semibold text-gray-300 focus:outline-none focus:border-blue-500/50 transition-all uppercase tracking-widest"
                 >
                   {Object.values(SupportedLanguage).map(lang => (
                     <option key={lang} value={lang} className="bg-[#1e1e1e]">{lang}</option>
                   ))}
                 </select>
                 <Command size={10} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
               </div>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-2">
               <GlassButton variant="secondary" onClick={handleExplain} isLoading={aiAnalyzing} title="Explain Code">
                  <MessageSquare size={14} />
               </GlassButton>
               <GlassButton variant="secondary" onClick={handleFix} isLoading={aiAnalyzing} title="Fix Code">
                  <Sparkles size={14} className="text-amber-300" />
               </GlassButton>
               {!isWebMode && (
                  <GlassButton variant="primary" onClick={handleRun} isLoading={isRunning}>
                      <Play size={14} fill="currentColor" /> <span className="hidden sm:inline">Run</span>
                  </GlassButton>
               )}
            </div>
          </div>

          {/* Main Content Split View */}
          <div className="flex-1 flex min-h-0 divide-x divide-white/5">
            
            {/* Editor Pane */}
            <div className={`flex-1 flex flex-col relative ${isWebMode ? 'w-1/2' : 'w-3/5'}`}>
               <div className="absolute top-4 right-4 z-20">
                  <button onClick={handleCopy} className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/40 hover:text-white transition-colors">
                     {copied ? <Check size={14} className="text-green-400"/> : <Copy size={14}/>}
                  </button>
               </div>
               <CodeEditor 
                  code={code} 
                  language={language} 
                  onChange={setCode}
                  className="bg-transparent"
               />
            </div>

            {/* Output/Preview Pane */}
            <div className={`flex flex-col bg-black/20 backdrop-blur-md ${isWebMode ? 'w-1/2' : 'w-2/5'}`}>
              
              {isWebMode ? (
                 <div className="flex-1 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTEgMWgydjJIMUMxeiIgZmlsbD0iIzIyMiIgZmlsbC1ydWxlPSJldmVub2RkIi8+PC9zdmc+')] relative">
                    <iframe 
                      title="preview"
                      srcDoc={previewDoc}
                      className="w-full h-full border-none"
                      sandbox="allow-scripts"
                    />
                 </div>
              ) : (
                 <OutputTerminal 
                    output={output}
                    isError={isError}
                    isVisible={true}
                    onClear={() => setOutput("")}
                    onClose={() => {}} // No close button in split view
                 />
              )}
            </div>
          </div>
          
          {/* Footer Status Bar */}
          <div className="h-8 border-t border-white/5 bg-black/40 flex items-center justify-between px-4 text-[10px] text-gray-500 font-mono uppercase tracking-widest">
            <div className="flex gap-4">
               <span>Ready</span>
               <span>Ln {code.split('\n').length}, Col 1</span>
            </div>
            <div>
               UTF-8
            </div>
          </div>

        </GlassPanel>
      </div>
    </div>
  );
}