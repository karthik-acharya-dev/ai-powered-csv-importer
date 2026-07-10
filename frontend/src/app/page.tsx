'use client';
import { useState, useEffect } from 'react';
import { Menu, Upload, UserPlus, HelpCircle, Link, Phone, Sun, Moon } from 'lucide-react';
import { useTheme } from 'next-themes';

import CsvImporterModal from '@/components/CsvImporterModal';
import Sidebar from '@/components/Sidebar';

export default function LeadSourcesDashboard() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [isImporterOpen, setIsImporterOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('LEAD_SOURCES');

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleImportSuccess = () => {
    setIsImporterOpen(false);
    alert('CSV Leads imported successfully!');
  };

  return (
    <div className="flex h-screen w-full relative bg-[#f4f6f8] dark:bg-[#0b0f19] font-sans">
      <Sidebar 
        mobileOpen={mobileSidebarOpen} 
        onClose={() => setMobileSidebarOpen(false)} 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        
        {/* Lead Sources Tab View */}
        <div className="flex-1 flex flex-col h-screen overflow-hidden">
          {/* Header */}
          <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-8 py-4 shrink-0 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setMobileSidebarOpen(true)}
                className="md:hidden p-2 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400 transition-colors shrink-0"
                title="Open menu"
              >
                <Menu className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-[24px] font-semibold text-gray-900 dark:text-white tracking-tight">Lead Sources</h1>
                <p className="text-[13px] text-gray-500 dark:text-gray-400 mt-0.5">Connect, manage, and control all your lead channels from one dashboard.</p>
              </div>
            </div>
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2.5 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400 transition-colors shadow-sm"
              title="Toggle theme"
            >
              {mounted && (theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)) ? (
                <Sun className="w-5 h-5 text-amber-500" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </button>
          </header>

          <div className="flex-1 overflow-y-auto px-16 py-6 space-y-6 custom-scrollbar bg-white dark:bg-[#0b0f19]">
            
            {/* Import & Single Lead cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* CSV Importer */}
              <div 
                onClick={() => setIsImporterOpen(true)}
                className="bg-white dark:bg-gray-900 border-2 border-dashed border-gray-300 dark:border-gray-800 rounded-3xl p-6 shadow-sm hover:shadow-md hover:border-teal-500/50 dark:hover:border-teal-500/50 cursor-pointer flex items-center gap-5 transition-all group"
              >
                <div className="w-12 h-12 rounded-full bg-[#eaf4f2] dark:bg-teal-950/30 text-[#1e5b53] dark:text-teal-400 flex items-center justify-center shrink-0 border border-teal-100 dark:border-teal-950 group-hover:bg-[#1e5b53] group-hover:text-white dark:group-hover:bg-[#1e5b53] dark:group-hover:text-white transition-all">
                  <Upload size={20} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-gray-900 dark:text-white text-[18px]">Add Leads via CSV</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5 leading-relaxed">Bulk import leads from a file</p>
                </div>
              </div>

              {/* Single Lead */}
              <div 
                className="bg-white dark:bg-gray-900 border-2 border-dashed border-gray-300 dark:border-gray-800 rounded-3xl p-6 shadow-sm hover:shadow-md hover:border-gray-400 dark:hover:border-gray-600 cursor-pointer flex items-center gap-5 transition-all group"
              >
                <div className="w-12 h-12 rounded-full bg-[#f1f5f9] dark:bg-gray-800 text-gray-600 dark:text-gray-400 flex items-center justify-center shrink-0 border border-gray-200 dark:border-gray-750 group-hover:bg-gray-600 group-hover:text-white dark:group-hover:bg-gray-600 dark:group-hover:text-white transition-all">
                  <UserPlus size={20} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-extrabold text-gray-900 dark:text-white text-[18px]">Add Single Lead</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5 leading-relaxed">Manually add a new lead</p>
                </div>
              </div>

            </div>

            {/* Active Lead Sources */}
            <div>
              <h2 className="font-bold text-gray-900 dark:text-white my-8 text-base tracking-tight flex items-center gap-1.5">
                Active Lead Sources <HelpCircle size={15} className="text-gray-400 dark:text-gray-500 cursor-pointer" />
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Google Ads */}
                <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-7 shadow-sm flex flex-col justify-between min-h-[220px]">
                  <div>
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl flex items-center justify-center shrink-0 shadow-sm">
                        <svg viewBox="0 0 24 24" className="w-6 h-6">
                          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-bold text-[22px] text-gray-950 dark:text-white">Google Ads</h4>
                      </div>
                    </div>

                    <div className="mt-5 p-6 bg-[#f8fafc] dark:bg-gray-950 border border-gray-50 dark:border-gray-800 rounded-2xl flex justify-between items-center text-xs">
                      <div className="space-y-2 text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider text-[10px]">
                        <div>Account ID</div>
                        <div>Status</div>
                      </div>
                      <div className="space-y-1 text-right text-gray-600 dark:text-gray-300 font-bold">
                        <div>Not Connected</div>
                        <div className="flex items-center gap-1.5 justify-end text-gray-500 dark:text-gray-455">
                          <span className="w-1.5 h-1.5 rounded-full bg-gray-400"></span> Inactive
                        </div>
                      </div>
                    </div>
                  </div>

                  <button className="w-full mt-5 border border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 py-4 rounded-2xl flex items-center justify-center gap-2 text-xs font-bold text-gray-800 dark:text-gray-200 transition-all shadow-sm">
                    <Link size={14} /> Connect
                  </button>
                </div>

                {/* Meta Ads */}
                <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl p-6 shadow-sm flex flex-col justify-between min-h-[220px]">
                  <div>
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl flex items-center justify-center shrink-0 shadow-sm">
                        <svg stroke="currentColor" fill="#1877F2" stroke-width="0" viewBox="0 0 640 512" height="32" width="32" xmlns="http://www.w3.org/2000/svg"><path d="M640 317.9C640 409.2 600.6 466.4 529.7 466.4C467.1 466.4 433.9 431.8 372.8 329.8L341.4 277.2C333.1 264.7 326.9 253 320.2 242.2C300.1 276 273.1 325.2 273.1 325.2C206.1 441.8 168.5 466.4 116.2 466.4C43.42 466.4 0 409.1 0 320.5C0 177.5 79.78 42.4 183.9 42.4C234.1 42.4 277.7 67.08 328.7 131.9C365.8 81.8 406.8 42.4 459.3 42.4C558.4 42.4 640 168.1 640 317.9H640zM287.4 192.2C244.5 130.1 216.5 111.7 183 111.7C121.1 111.7 69.22 217.8 69.22 321.7C69.22 370.2 87.7 397.4 118.8 397.4C149 397.4 167.8 378.4 222 293.6C222 293.6 246.7 254.5 287.4 192.2V192.2zM531.2 397.4C563.4 397.4 578.1 369.9 578.1 322.5C578.1 198.3 523.8 97.08 454.9 97.08C421.7 97.08 393.8 123 360 175.1C369.4 188.9 379.1 204.1 389.3 220.5L426.8 282.9C485.5 377 500.3 397.4 531.2 397.4L531.2 397.4z"></path></svg>
                      </div>
                      <div>
                        <h4 className="font-bold text-[22px] text-gray-950 dark:text-white">Meta Ads</h4>
                      </div>
                    </div>

                    <div className="mt-5 p-6 bg-[#f8fafc] dark:bg-gray-950 border border-gray-50 dark:border-gray-800 rounded-2xl flex justify-between items-center text-xs">
                      <div className="space-y-1 text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider text-[10px]">
                        <div>Account ID</div>
                        <div>Status</div>
                      </div>
                      <div className="space-y-1 text-right text-gray-600 dark:text-gray-300 font-bold">
                        <div>Not Connected</div>
                        <div className="flex items-center gap-1.5 justify-end text-gray-500 dark:text-gray-450">
                          <span className="w-1.5 h-1.5 rounded-full bg-gray-400"></span> Inactive
                        </div>
                      </div>
                    </div>
                  </div>

                  <button className="w-full mt-5 border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 py-4 rounded-2xl flex items-center justify-center gap-2 text-xs font-bold text-gray-800 dark:text-gray-200 transition-all shadow-sm">
                    <Link size={14} /> Connect
                  </button>
                </div>

              </div>
            </div>

          </div>
        </div>

      </div>

      {/* CSV Importer Modal */}
      {isImporterOpen && (
        <CsvImporterModal 
          onClose={() => setIsImporterOpen(false)} 
          onImportSuccess={handleImportSuccess}
        />
      )}
    </div>
  );
}
