'use client';

import { useState, useCallback, useRef } from 'react';
import { useDropzone } from 'react-dropzone';
import { X, UploadCloud, FileText, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import axios from 'axios';
import { useVirtualizer } from '@tanstack/react-virtual';

type Step = 'UPLOAD' | 'PREVIEW' | 'PROCESSING' | 'RESULT';

export default function CsvImporterModal({ 
  onClose, 
  onImportSuccess 
}: { 
  onClose: () => void; 
  onImportSuccess?: (leads: any[]) => void;
}) {
  const [step, setStep] = useState<Step>('UPLOAD');
  const [file, setFile] = useState<File | null>(null);
  const [rawRecords, setRawRecords] = useState<any[]>([]);
  const [headers, setHeaders] = useState<string[]>([]);
  const [extractedData, setExtractedData] = useState<{ success: any[], skipped: any[] }>({ success: [], skipped: [] });
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const selected = acceptedFiles[0];
      setFile(selected);
      handleUpload(selected);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'text/csv': ['.csv'] },
    maxFiles: 1
  });

  const handleUpload = async (fileToUpload: File) => {
    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', fileToUpload);

    try {
      // Setup backend base url, assume localhost:5000 if not in env
      const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';
      const response = await axios.post(`${baseUrl}/api/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      const data = response.data.data;
      if (data.length > 0) {
        setHeaders(Object.keys(data[0]));
        setRawRecords(data);
        setStep('PREVIEW');
      } else {
        alert('CSV is empty');
      }
    } catch (error) {
      console.error(error);
      alert('Error parsing CSV file');
    } finally {
      setIsUploading(false);
    }
  };

  const handleConfirmImport = async () => {
    setStep('PROCESSING');
    setProgress(0);
    
    try {
      const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';
      
      // Batch processing logic: chunks of 50 records to not overload the API
      const chunkSize = 50;
      let allSuccess: any[] = [];
      let allSkipped: any[] = [];

      for (let i = 0; i < rawRecords.length; i += chunkSize) {
        const chunk = rawRecords.slice(i, i + chunkSize);
        
        // Retry logic inside the API call or here
        let retries = 3;
        while(retries > 0) {
          try {
            const response = await axios.post(`${baseUrl}/api/extract`, { records: chunk });
            allSuccess = [...allSuccess, ...response.data.successRecords];
            allSkipped = [...allSkipped, ...response.data.skippedRecords];
            break; // Success
          } catch (e) {
            retries--;
            if(retries === 0) throw e;
            await new Promise(r => setTimeout(r, 1000)); // wait 1s before retry
          }
        }

        setProgress(Math.round(((i + chunk.length) / rawRecords.length) * 100));
      }

      setExtractedData({ success: allSuccess, skipped: allSkipped });
      setStep('RESULT');

    } catch (error) {
      console.error(error);
      alert('Error extracting data. Check console for details.');
      setStep('PREVIEW'); // Revert
    }
  };

  // Virtualizer for preview table
  const parentRef = useRef<HTMLDivElement>(null);
  const rowVirtualizer = useVirtualizer({
    count: rawRecords.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 48, // 48px row height
    overscan: 5,
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className={`bg-white dark:bg-gray-900 rounded-3xl shadow-2xl w-full transition-all duration-300 flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200
        ${(step === 'UPLOAD' || step === 'PROCESSING') ? 'max-w-2xl' : 'max-w-5xl'} max-h-[90vh]`}
      >
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 py-8  dark:border-gray-700">
          <div>
            <h2 className="text-xl font-semibold dark:text-white">Import Leads via CSV</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">Upload a CSV file to bulk import leads into your system.</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors text-gray-500">
            <X size={20} />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-hidden flex flex-col bg-white dark:bg-gray-800/50">
          
          {step === 'UPLOAD' && (
            <div className="p-0 flex-1 flex flex-col items-center justify-center">
              <div 
                {...getRootProps()} 
                className={`w-full max-w-xl border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-200 bg-white dark:bg-gray-800 flex flex-col items-center justify-center
                  ${isDragActive ? 'border-teal-500 bg-teal-50/30 dark:bg-teal-900/10' : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'}
                `}
              >
                <input {...getInputProps()} />
                <div className="w-16 h-16 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-2xl flex items-center justify-center mb-6 text-[#1e5b53] dark:text-teal-400 shrink-0 shadow-sm">
                  {isUploading ? <Loader2 className="animate-spin text-teal-600" size={24} /> : <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-arrow-up-to-line" aria-hidden="true"><path d="M5 3h14"></path><path d="m18 13-6-6-6 6"></path><path d="M12 7v14"></path></svg>}
                </div>
                
                <h3 className="text-xl font-bold mb-1 text-gray-900 dark:text-white">Drop your CSV file here</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">or click to browse files</p>
                
                {/* Info capsule */}
                <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-750 rounded-full text-xs font-medium text-gray-500 dark:text-gray-400 mb-4">
                  <AlertCircle size={14} className="text-gray-400" /> Supported file: .csv (max 5MB)
                </div>

                {/* Required headers text */}
                <p className="text-xs text-gray-400 dark:text-gray-550 leading-relaxed text-center max-w-md mb-6">
                  Required headers: created_at, name, email, country_code, mobile_without_country_code, company, city, state, country, lead_owner, crm_status, crm_note. Template includes default + custom CRM fields to reduce upload errors.
                </p>

                {/* Download Template Button */}
                <a 
                  href="/sample_leads.csv" 
                  download="sample_leads.csv"
                  onClick={(e) => e.stopPropagation()}
                  className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#eaf4f2] hover:bg-[#d1f2ed] border border-[#1e5b53]/20 text-xs font-bold rounded-xl text-[#1e5b53] transition-colors"
                >
                  <FileText size={14} /> Download Sample CSV Template
                </a>
              </div>
            </div>
          )}

          {step === 'PREVIEW' && (
            <div className="flex-1 flex flex-col overflow-hidden">
              {/* File details card matching ref2.png */}
              <div className="p-4 bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
                <div className="flex items-center gap-3 p-3 bg-[#f3faf8] dark:bg-gray-700/50 border border-[#d1f2ec] dark:border-gray-600 rounded-xl w-full">
                  <div className="w-10 h-10 bg-[#e6f7f5] text-teal-700 rounded-lg flex items-center justify-center shrink-0">
                    <FileText size={20} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-sm text-gray-900 dark:text-white truncate">{file?.name}</h3>
                    <p className="text-[10px] text-gray-500 dark:text-gray-400">{(file?.size ? file.size / 1024 : 0).toFixed(2)} KB</p>
                  </div>
                  <button 
                    onClick={() => {
                      setFile(null);
                      setRawRecords([]);
                      setStep('UPLOAD');
                    }}
                    className="p-1.5 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>
              
              {/* Virtualized Table */}
              <div ref={parentRef} className="flex-1 overflow-auto custom-scrollbar bg-white dark:bg-gray-900">
                <div 
                  className="min-w-full"
                  style={{
                    width: `${headers.length * 200}px`
                  }}
                >
                  {/* Sticky Header */}
                  <div className="sticky top-0 bg-gray-50 dark:bg-gray-800 shadow-sm z-10 flex border-b dark:border-gray-700">
                    {headers.map(h => (
                      <div 
                        key={h} 
                        className="w-[200px] shrink-0 px-4 py-3 font-semibold text-gray-600 dark:text-gray-300 uppercase text-xs tracking-wider truncate"
                      >
                        {h}
                      </div>
                    ))}
                  </div>

                  {/* Virtualized Body */}
                  <div
                    className="relative"
                    style={{
                      height: `${rowVirtualizer.getTotalSize()}px`,
                    }}
                  >
                    {rowVirtualizer.getVirtualItems().map((virtualRow) => {
                      const row = rawRecords[virtualRow.index];
                      return (
                        <div
                          key={virtualRow.index}
                          className="border-b dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 absolute top-0 left-0 flex items-center"
                          style={{
                            height: `${virtualRow.size}px`,
                            width: '100%',
                            transform: `translateY(${virtualRow.start}px)`,
                          }}
                        >
                          {headers.map(h => (
                            <div 
                              key={h} 
                              className="w-[200px] shrink-0 px-4 py-3 text-gray-700 dark:text-gray-300 truncate text-sm"
                            >
                              {row[h] || ''}
                            </div>
                          ))}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 'PROCESSING' && (
            <div className="flex-1 flex flex-col items-center justify-center p-12">
              <Loader2 className="w-16 h-16 text-groweasy animate-spin mb-6" />
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">AI is Extracting Data</h3>
              <p className="text-gray-500 text-center max-w-sm mb-8">
                Our AI model is intelligently mapping your custom CSV columns to GrowEasy CRM fields.
              </p>
              
              <div className="w-full max-w-md bg-gray-200 dark:bg-gray-700 rounded-full h-3 mb-2 overflow-hidden">
                <div 
                  className="bg-groweasy h-3 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300">{progress}% Processed</p>
            </div>
          )}

          {step === 'RESULT' && (
            <div className="flex-1 flex flex-col overflow-hidden bg-white dark:bg-gray-900">
              <div className="p-6 border-b dark:border-gray-800 grid grid-cols-2 gap-4">
                <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-xl border border-green-100 dark:border-green-800">
                  <div className="flex items-center gap-2 text-green-600 mb-1">
                    <CheckCircle2 size={18} /> <span className="font-semibold">Successfully Mapped</span>
                  </div>
                  <div className="text-3xl font-bold text-green-700 dark:text-green-500">{extractedData.success.length}</div>
                </div>
                <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-xl border border-red-100 dark:border-red-800">
                  <div className="flex items-center gap-2 text-red-600 mb-1">
                    <AlertCircle size={18} /> <span className="font-semibold">Skipped (Invalid)</span>
                  </div>
                  <div className="text-3xl font-bold text-red-700 dark:text-red-500">{extractedData.skipped.length}</div>
                </div>
              </div>
              
              <div className="flex-1 overflow-auto custom-scrollbar p-6">
                <h4 className="font-semibold mb-4 dark:text-white">Extracted CRM Records (Preview)</h4>
                <div className="overflow-x-auto border border-gray-200 dark:border-gray-700 rounded-lg">
                  <table className="w-full text-left text-sm whitespace-nowrap">
                    <thead className="bg-gray-50 dark:bg-gray-800">
                      <tr>
                        <th className="px-4 py-3 font-semibold text-gray-600 dark:text-gray-300">Name</th>
                        <th className="px-4 py-3 font-semibold text-gray-600 dark:text-gray-300">Email</th>
                        <th className="px-4 py-3 font-semibold text-gray-600 dark:text-gray-300">Mobile</th>
                        <th className="px-4 py-3 font-semibold text-gray-600 dark:text-gray-300">Status</th>
                        <th className="px-4 py-3 font-semibold text-gray-600 dark:text-gray-300">Source</th>
                        <th className="px-4 py-3 font-semibold text-gray-600 dark:text-gray-300">Notes</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                      {extractedData.success.slice(0, 50).map((row, i) => (
                        <tr key={i} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                          <td className="px-4 py-3 dark:text-gray-300">{row.name || '-'}</td>
                          <td className="px-4 py-3 dark:text-gray-300">{row.email || '-'}</td>
                          <td className="px-4 py-3 dark:text-gray-300">{row.mobile_without_country_code || '-'}</td>
                          <td className="px-4 py-3">
                            <span className="px-2 py-1 bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 text-xs rounded-full">
                              {row.crm_status || 'UNMAPPED'}
                            </span>
                          </td>
                          <td className="px-4 py-3 dark:text-gray-300">{row.data_source || '-'}</td>
                          <td className="px-4 py-3 dark:text-gray-300 truncate max-w-xs" title={row.crm_note}>{row.crm_note || '-'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {extractedData.success.length === 0 && (
                    <div className="p-8 text-center text-gray-500">No records were successfully mapped.</div>
                  )}
                </div>
              </div>
            </div>
          )}

        </div>

      {/* Footer Actions */}
      <div className="p-6 border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 flex justify-end gap-3 shrink-0">
        <button 
          onClick={onClose}
          className="px-10 py-3 border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-900 dark:text-gray-200 font-bold rounded-2xl text-[15px] transition-all"
        >
          Cancel
        </button>
        
        {step === 'UPLOAD' && (
          <button 
            disabled
            className="px-10 py-3 bg-[#FA5A3C]/40 text-white font-bold rounded-2xl text-[15px] cursor-not-allowed opacity-70"
          >
            Upload File
          </button>
        )}

        {step === 'PREVIEW' && (
          <button 
            onClick={handleConfirmImport}
            className="px-10 py-3 bg-[#FA5A3C] hover:bg-[#E5482B] text-white font-bold rounded-2xl text-[15px] transition-all shadow-sm"
          >
            Upload File
          </button>
        )}
        
        {step === 'RESULT' && (
          <button 
            onClick={() => {
              if (onImportSuccess) {
                onImportSuccess(extractedData.success);
              }
              onClose();
            }}
            className="px-10 py-3 bg-[#FA5A3C] hover:bg-[#E5482B] text-white font-bold rounded-2xl text-[15px] transition-all shadow-sm"
          >
            Done
          </button>
        )}
      </div>

      </div>
    </div>
  );
}
