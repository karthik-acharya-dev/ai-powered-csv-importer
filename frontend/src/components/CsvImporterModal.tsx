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
        // Introduce a 4s delay to display the parsing loader animation
        await new Promise(resolve => setTimeout(resolve, 4000));

        // Use original headers for raw preview (no mapping, matching Step 2 instructions)
        const rawHeaders = Object.keys(data[0]);

        setHeaders(rawHeaders);
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

  const handleDownloadParsedFile = () => {
    if (!rawRecords || rawRecords.length === 0) return;
    
    // Convert rawRecords to CSV format
    const csvHeaders = headers.join(',');
    const csvRows = rawRecords.map(row => 
      headers.map(h => {
        const val = row[h] === null || row[h] === undefined ? '' : String(row[h]);
        // Escape double quotes and wrap in quotes if there's a comma, quote or newline
        const escaped = val.replace(/"/g, '""');
        if (escaped.includes(',') || escaped.includes('\n') || escaped.includes('"')) {
          return `"${escaped}"`;
        }
        return escaped;
      }).join(',')
    );
    
    const csvContent = [csvHeaders, ...csvRows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    // Create temporary link and trigger download
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', file ? `parsed_${file.name}` : 'parsed_leads.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-black/60 animate-fade-in">
      <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl w-full transition-all duration-300 flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200 max-w-[660px] max-h-[95vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-8 pt-8 pb-6 dark:border-gray-800 bg-white dark:bg-gray-900">
          <div>
            <h2 className="text-[20px] font-bold text-gray-900 dark:text-white">Import Leads via CSV</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Upload a CSV file to bulk import leads into your system.</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors text-gray-500">
            <X size={20} />
          </button>
        </div>

        {/* Selected File Card */}
        {file && (
          <div className="px-8 pt-4 pb-0 bg-white dark:bg-gray-900">
            <div className="flex items-center gap-4 p-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl w-full">
              <div className="w-12 h-12 bg-[#eaf4f2] dark:bg-teal-950/20 border border-[#b2ebd5]/40 dark:border-teal-900 rounded-xl flex flex-col items-center justify-center text-[#1e5b53] dark:text-teal-400 shrink-0 select-none">
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="mb-0.5"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/></svg>
                <span className="text-[9px] font-extrabold tracking-wider leading-none uppercase">CSV</span>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-[15px] text-gray-900 dark:text-white truncate">{file.name}</h3>
                <p className="text-xs text-gray-505 dark:text-gray-400 mt-0.5">{file.size} Bytes</p>
              </div>
              <button 
                onClick={() => {
                  setFile(null);
                  setRawRecords([]);
                  setStep('UPLOAD');
                }}
                className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full text-gray-450 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
              >
                <X size={16} />
              </button>
            </div>
          </div>
        )}

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto flex flex-col bg-white dark:bg-gray-900 custom-scrollbar">
          
          {step === 'UPLOAD' && (
            <div className="px-8 py-2 flex-1 flex flex-col items-center justify-center">
              {!file ? (
                <div 
                  {...getRootProps()} 
                  className={`w-full border-2 border-gray-300 border-dashed rounded-2xl p-12 py-12 text-center cursor-pointer transition-all duration-200 bg-white dark:bg-gray-900 flex flex-col items-center justify-center
                    ${isDragActive ? 'border-[#1e5b53] bg-teal-50/30 dark:bg-teal-900/10' : 'border-gray-200 dark:border-gray-800 hover:border-gray-300'}
                  `}
                >
                  <input {...getInputProps()} />
                  <div className="w-16 h-16 bg-white dark:bg-gray-800 border border-[#1e5b53]/20 dark:border-gray-700 rounded-2xl flex items-center justify-center mb-6 text-[#1e5b53] dark:text-teal-400 shrink-0 shadow-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
                      <path d="m18 9-6-6-6 6" />
                      <path d="M12 3v14" />
                      <path d="M5 21h14" />
                    </svg>
                  </div>
                  
                  <h3 className="text-xl font-bold mb-1 text-gray-900 dark:text-white">Drop your CSV file here</h3>
                  <p className="text-sm text-gray-550 dark:text-gray-455 mb-6">or click to browse files</p>
                  
                  {/* Info capsule */}
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-gray-50 dark:bg-gray-800 border border-gray-250 dark:border-gray-750 rounded-full text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2">
                    <AlertCircle size={14} className="text-gray-450 dark:text-gray-555" /> Supported file: .csv (max 5MB)
                  </div>

                  {/* Required headers text */}
                  <p className="text-[11px] text-gray-500 dark:text-gray-500 leading-relaxed text-center max-w-sm mb-4 max-w-[460px]">
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
              ) : (
                <div className="w-full flex-1 flex flex-col items-center justify-center py-16 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl">
                  <div className="relative w-8 h-8 mb-4">
                    <div className="w-8 h-8 border-[3px] border-gray-100 dark:border-gray-800 rounded-full"></div>
                    <div className="absolute top-0 left-0 w-8 h-8 border-[3px] border-[#1e5b53] dark:border-teal-400 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                  <p className="text-[14px] font-bold text-gray-550 dark:text-gray-400 text-center">AI is parsing your uploaded file...</p>
                </div>
              )}
            </div>
          )}

          {step === 'PREVIEW' && (
            <div className="flex-1 flex flex-col overflow-hidden pb-2">
              <div className="px-8 mt-4 mb-2">
                <div className="text-[12px] font-bold text-gray-600 dark:text-teal-400 uppercase tracking-wider">
                  Preview (upto first 30 rows)
                </div>
              </div>
              
              <div className="px-8 flex-1 overflow-hidden flex flex-col">
                <div className="flex-1 overflow-auto border border-gray-250 dark:border-gray-800 rounded-2xl bg-white dark:bg-gray-950 custom-scrollbar">
                  <table className="w-full text-left text-xs border-collapse min-w-[1000px]">
                    <thead className="bg-gray-50 dark:bg-gray-900 sticky top-0 border-b border-gray-200 dark:border-gray-800 z-10">
                      <tr>
                        {headers.map(h => (
                          <th key={h} className="px-4 py-2 font-bold text-gray-900 dark:text-white uppercase tracking-wider whitespace-nowrap">
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-150 dark:divide-gray-800">
                      {rawRecords.slice(0, 30).map((row, rIndex) => (
                        <tr key={rIndex} className="hover:bg-gray-55/50 dark:hover:bg-gray-900/50">
                          {headers.map(h => (
                            <td key={h} className="px-4 py-3.5 text-gray-750 dark:text-gray-300 whitespace-nowrap">
                              {row[h] || ''}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="flex justify-center mt-3">
                <button 
                  type="button" 
                  onClick={handleDownloadParsedFile}
                  className="text-[#1e5b53] dark:text-teal-400 font-bold text-xs flex items-center gap-1.5 hover:underline"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                    <polyline points="15 3 21 3 21 9" />
                    <line x1="10" x2="21" y1="14" y2="3" />
                  </svg>
                  View Parsed File
                </button>
              </div>
            </div>
          )}

          {step === 'PROCESSING' && (
            <div className="px-8 py-2 flex-1 flex flex-col justify-center">
              <div className="w-full flex-1 flex flex-col items-center justify-center py-16 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl">
                <div className="relative w-8 h-8 mb-4">
                  <div className="w-8 h-8 border-[3px] border-gray-100 dark:border-gray-800 rounded-full"></div>
                  <div className="absolute top-0 left-0 w-8 h-8 border-[3px] border-[#1e5b53] dark:border-teal-400 border-t-transparent rounded-full animate-spin"></div>
                </div>
                <p className="text-[14px] font-bold text-gray-550 dark:text-gray-400 text-center mb-6">AI is Extracting Data</p>
                
                <div className="w-full max-w-[200px] bg-gray-100 dark:bg-gray-850 rounded-full h-2 mb-2 overflow-hidden">
                  <div 
                    className="bg-[#FA5A3C] h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
                <p className="text-xs font-semibold text-gray-450 dark:text-gray-400">{progress}% Processed</p>
              </div>
            </div>
          )}

          {step === 'RESULT' && (
            <div className="flex-1 flex flex-col overflow-hidden pb-2 bg-white dark:bg-gray-900">
              <div className="px-8 mt-2 mb-4 grid grid-cols-2 gap-4">
                <div className="bg-[#f3faf8] dark:bg-green-950/20 p-3 rounded-2xl border border-[#d1f2ec] dark:border-green-900/30 flex items-center justify-between">
                  <div>
                    <div className="text-[10px] font-extrabold text-[#1e5b53] dark:text-teal-400 uppercase tracking-wider mb-0.5">Successfully Mapped</div>
                    <div className="text-xl font-bold text-gray-900 dark:text-white">{extractedData.success.length}</div>
                  </div>
                  <CheckCircle2 size={24} className="text-[#1e5b53] dark:text-teal-450 shrink-0" />
                </div>
                <div className="bg-red-50/50 dark:bg-red-950/20 p-3 rounded-2xl border border-red-100 dark:border-red-900/30 flex items-center justify-between">
                  <div>
                    <div className="text-[10px] font-extrabold text-red-650 dark:text-red-400 uppercase tracking-wider mb-0.5">Skipped (Invalid)</div>
                    <div className="text-xl font-bold text-gray-900 dark:text-white">{extractedData.skipped.length}</div>
                  </div>
                  <AlertCircle size={24} className="text-red-500 dark:text-red-450 shrink-0" />
                </div>
              </div>
              
              <div className="px-8 mt-2 mb-2">
                <div className="text-[10px] font-extrabold text-[#1e5b53] dark:text-teal-400 uppercase tracking-wider">
                  Extracted CRM Records (Preview)
                </div>
              </div>

              <div className="px-8 flex-1 overflow-hidden flex flex-col">
                <div className="flex-1 overflow-auto border border-gray-250 dark:border-gray-800 rounded-2xl bg-white dark:bg-gray-950 custom-scrollbar">
                  <table className="w-full text-left text-xs border-collapse min-w-[1000px]">
                    <thead className="bg-gray-50 dark:bg-gray-900 sticky top-0 border-b border-gray-200 dark:border-gray-800 z-10">
                      <tr>
                        {[
                          'CREATED_AT', 'NAME', 'EMAIL', 'COUNTRY_CODE', 'MOBILE_WITHOUT_COUNTRY_CODE',
                          'COMPANY', 'CITY', 'STATE', 'COUNTRY', 'LEAD_OWNER', 'CRM_STATUS', 'CRM_NOTE'
                        ].map(h => (
                          <th key={h} className="px-4 py-2.5 font-bold text-gray-900 dark:text-white uppercase tracking-wider whitespace-nowrap">
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-150 dark:divide-gray-800">
                      {extractedData.success.slice(0, 30).map((row, rIndex) => (
                        <tr key={rIndex} className="hover:bg-gray-55/50 dark:hover:bg-gray-900/50">
                          <td className="px-4 py-3.5 text-gray-750 dark:text-gray-300 whitespace-nowrap">{row.created_at || ''}</td>
                          <td className="px-4 py-3.5 text-gray-750 dark:text-gray-300 whitespace-nowrap font-semibold">{row.name || ''}</td>
                          <td className="px-4 py-3.5 text-gray-750 dark:text-gray-300 whitespace-nowrap">{row.email || ''}</td>
                          <td className="px-4 py-3.5 text-gray-750 dark:text-gray-300 whitespace-nowrap">{row.country_code || ''}</td>
                          <td className="px-4 py-3.5 text-gray-750 dark:text-gray-300 whitespace-nowrap">{row.mobile_without_country_code || ''}</td>
                          <td className="px-4 py-3.5 text-gray-750 dark:text-gray-300 whitespace-nowrap">{row.company || ''}</td>
                          <td className="px-4 py-3.5 text-gray-750 dark:text-gray-300 whitespace-nowrap">{row.city || ''}</td>
                          <td className="px-4 py-3.5 text-gray-750 dark:text-gray-300 whitespace-nowrap">{row.state || ''}</td>
                          <td className="px-4 py-3.5 text-gray-750 dark:text-gray-300 whitespace-nowrap">{row.country || ''}</td>
                          <td className="px-4 py-3.5 text-gray-750 dark:text-gray-300 whitespace-nowrap">{row.lead_owner || ''}</td>
                          <td className="px-4 py-3.5 text-gray-750 dark:text-gray-300 whitespace-nowrap">
                            {row.crm_status ? (
                              <span className="px-2 py-0.5 bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 text-[10px] font-bold rounded-full">
                                {row.crm_status}
                              </span>
                            ) : ''}
                          </td>
                          <td className="px-4 py-3.5 text-gray-750 dark:text-gray-300 whitespace-nowrap max-w-xs truncate" title={row.crm_note}>{row.crm_note || ''}</td>
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
    <div className="px-8 pb-8 pt-4 bg-white dark:bg-gray-900 shrink-0 grid grid-cols-2 gap-4">
      <button 
        onClick={onClose}
        className="w-full py-4 border border-gray-250 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-900 dark:text-gray-200 font-bold rounded-2xl text-[15px] transition-all text-center"
      >
        Cancel
      </button>
      
      {step === 'UPLOAD' && (
        <button 
          disabled
          className="w-full py-4 bg-[#FA5A3C]/50 text-white font-bold rounded-2xl text-[15px] cursor-not-allowed text-center"
        >
          Upload File
        </button>
      )}

      {step === 'PREVIEW' && (
        <button 
          onClick={handleConfirmImport}
          className="w-full py-4 bg-[#FA5A3C] hover:bg-[#E5482B] text-white font-bold rounded-2xl text-[15px] transition-all shadow-sm text-center"
        >
          Upload File
        </button>
      )}

      {step === 'PROCESSING' && (
        <button 
          disabled
          className="w-full py-4 bg-[#FA5A3C]/50 text-white font-bold rounded-2xl text-[15px] cursor-not-allowed text-center"
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
          className="w-full py-4 bg-[#FA5A3C] hover:bg-[#E5482B] text-white font-bold rounded-2xl text-[15px] transition-all shadow-sm text-center"
        >
          Done
        </button>
      )}
    </div>

      </div>
    </div>
  );
}
