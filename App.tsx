import React, { useEffect, useState } from 'react';
import { QRCodeGenerator } from './components/qr/QRCodeGenerator';
import { QrCode, Moon, Sun } from 'lucide-react';
import { Button } from './components/ui/Layout';

const App: React.FC = () => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Check local storage or system preference
    if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      setIsDark(true);
      document.documentElement.classList.add('dark');
    } else {
      setIsDark(false);
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleTheme = () => {
    if (isDark) {
      document.documentElement.classList.remove('dark');
      localStorage.theme = 'light';
      setIsDark(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.theme = 'dark';
      setIsDark(true);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-50 transition-colors duration-300">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-indigo-600 rounded-lg shadow-sm">
              <QrCode className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600">
              QR Pro Generator
            </h1>
          </div>
          <div className="flex items-center gap-4">
             <Button variant="ghost" size="icon" onClick={toggleTheme} className="text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100">
               {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
             </Button>
            <a 
              href="https://github.com" 
              target="_blank" 
              rel="noreferrer"
              className="text-sm font-medium text-slate-500 hover:text-indigo-600 transition-colors dark:text-slate-400 dark:hover:text-indigo-400"
            >
              GitHub
            </a>
          </div>
        </div>
      </header>

      <main className="px-4 py-8">
        <QRCodeGenerator />
      </main>

      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-8 mt-auto transition-colors duration-300">
        <div className="max-w-6xl mx-auto px-4 text-center text-sm text-slate-500 dark:text-slate-400">
          <p>© {new Date().getFullYear()} QR Pro Generator. All rights reserved.</p>
          <p className="mt-1">Built with React, TypeScript & Tailwind CSS.</p>
        </div>
      </footer>
    </div>
  );
};

export default App;