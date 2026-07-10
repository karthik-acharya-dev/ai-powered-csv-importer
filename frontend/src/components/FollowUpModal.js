'use client';
import { useState } from 'react';
import { X } from 'lucide-react';

export default function FollowUpModal({ isOpen, onClose, leadName, onSave, currentValue }) {
  const [dateTime, setDateTime] = useState(currentValue || '');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!dateTime) return;
    onSave(dateTime);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-[420px] w-full shadow-2xl overflow-hidden transform transition-all scale-100 p-8 relative">
        
        {/* Header */}
        <div className="pr-8 mb-6">
          <h3 className="text-xl font-bold text-gray-900 tracking-tight">Set Next Follow Up</h3>
          <p className="text-[13px] text-gray-650 mt-1">for <span className="font-bold text-gray-950">{leadName}</span></p>
        </div>
        
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 p-1.5 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2">
                Follow Up Date & Time
              </label>
              <div className="relative">
                <input 
                  type="datetime-local" 
                  value={dateTime}
                  onChange={(e) => setDateTime(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm font-medium focus:outline-none focus:border-[#1e5b53] focus:ring-1 focus:ring-[#1e5b53] transition-all"
                />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-8 flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-bold text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-8 py-2.5 bg-[#1e5b53] hover:bg-[#16423c] text-white rounded-xl text-sm font-bold shadow-sm transition-all"
            >
              Save
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
