export enum SupportedLanguage {
  JAVASCRIPT = 'javascript',
  PYTHON = 'python',
  TYPESCRIPT = 'typescript',
  HTML = 'html',
  CSS = 'css',
  SQL = 'sql',
  C_PLUS_PLUS = 'cpp'
}

export interface CodeFile {
  id: string;
  name: string;
  language: SupportedLanguage;
  content: string;
}

export interface ExecutionResult {
  output: string;
  error?: string;
  isError: boolean;
}

export enum Tab {
  EDITOR = 'editor',
  SETTINGS = 'settings',
  AI_CHAT = 'ai_chat'
}