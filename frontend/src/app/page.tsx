'use client';

import { useState } from 'react';
import CsvImporterModal from '@/components/CsvImporterModal';
import { UploadCloud, CheckCircle2, FileText, ArrowRight } from 'lucide-react';
import { useTheme } from 'next-themes';

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { theme, setTheme } = useTheme();

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
      {/* Sidebar (Mock) */}
      <aside className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 hidden md:flex flex-col">
        <div className="p-6 flex items-center gap-2">
          <div className="w-8 h-8 bg-black dark:bg-white rounded flex items-center justify-center">
            <span className="text-white dark:text-black font-bold">G</span>
          </div>
          <span className="text-xl font-bold dark:text-white">GrowEasy</span>
        </div>
        <nav className="flex-1 px-4 py-6 space-y-2">
          <div className="text-xs font-semibold text-gray-400 mb-4 uppercase tracking-wider">Main</div>
          <button className="w-full flex items-center gap-3 px-3 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md">
            <FileText size={18} />
            Dashboard
          </button>
          <button className="w-full flex items-center gap-3 px-3 py-2 bg-groweasy-light dark:bg-groweasy-dark/30 text-groweasy dark:text-blue-400 font-medium rounded-md">
            <UploadCloud size={18} />
            Lead Sources
          </button>
        </nav>
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <button 
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="text-sm text-gray-500 hover:text-gray-900 dark:hover:text-white"
          >
            Toggle {theme === 'dark' ? 'Light' : 'Dark'} Mode
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <header className="h-20 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center px-8">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Lead Sources</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">Connect, manage, and control all your lead channels from one dashboard.</p>
          </div>
        </header>
        
        <div className="p-8 flex-1 overflow-y-auto">
          <div className="max-w-4xl mx-auto">
            {/* Action Card */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-8 border border-gray-200 dark:border-gray-700 shadow-sm text-center">
              <div className="w-16 h-16 bg-groweasy-light dark:bg-groweasy-dark/30 text-groweasy dark:text-blue-400 rounded-full flex items-center justify-center mx-auto mb-4">
                <UploadCloud size={32} />
              </div>
              <h2 className="text-xl font-semibold mb-2 dark:text-white">Import Leads via CSV</h2>
              <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md mx-auto">
                Upload a CSV file to bulk import leads into your system. Our AI will automatically map your columns to the correct CRM fields.
              </p>
              <button 
                onClick={() => setIsModalOpen(true)}
                className="bg-groweasy hover:bg-groweasy-dark text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                Start CSV Import
              </button>
            </div>
          </div>
        </div>
      </div>

      {isModalOpen && <CsvImporterModal onClose={() => setIsModalOpen(false)} />}
    </main>
  );
}
