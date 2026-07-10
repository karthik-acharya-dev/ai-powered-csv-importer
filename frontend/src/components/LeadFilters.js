import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown, Check, RotateCcw, CalendarDays, X, ChevronLeft, ChevronRight } from 'lucide-react';

const formatInputDate = (dateStr) => {
  if (!dateStr) return '';
  try {
    const d = new Date(dateStr + "T00:00:00");
    return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  } catch (e) {
    return '';
  }
};

const formatMonthYear = (date) => {
  if (!date) return '';
  try {
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  } catch (e) {
    return '';
  }
};

export default function LeadFilters({
  statusFilter,
  setStatusFilter,
  qualityFilter,
  setQualityFilter,
  sourceFilter,
  setSourceFilter,
  ownerFilter,
  setOwnerFilter,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  activeDatePreset,
  setActiveDatePreset,
  handleClearAll,
  handleClearDate,
  handleDatePresetClick,
  handleDateClick
}) {
  const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);
  const [qualityDropdownOpen, setQualityDropdownOpen] = useState(false);
  const [sourceDropdownOpen, setSourceDropdownOpen] = useState(false);
  const [ownerDropdownOpen, setOwnerDropdownOpen] = useState(false);
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const [currentCalendarMonth, setCurrentCalendarMonth] = useState(new Date("2026-05-18"));

  const statusRef = useRef(null);
  const qualityRef = useRef(null);
  const sourceRef = useRef(null);
  const ownerRef = useRef(null);
  const datePickerRef = useRef(null);

  const statuses = ['Not Dialed', 'Contacted', 'Bad Lead', 'Won', 'Lost'];
  const qualities = ['Hot', 'Warm', 'Cold', '—'];
  const sources = ['WEBSITE', 'WEBHOOK', 'WA_MESSAGE'];
  const owners = ['SHIVAM YADAV', 'Aiman Shakeel', 'Mehak Agrawal', 'Vidhi Shingala'];

  const getSourceDisplay = (sourceType) => {
    if (!sourceType) return '—';
    return sourceType.charAt(0) + sourceType.slice(1).toLowerCase().replace('_', ' ');
  };

  const getDaysInMonthGrid = (date) => {
    const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
    const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    const startDayOfWeek = startOfMonth.getDay();
    const grid = [];

    // Prev month overflow days
    const prevMonthEnd = new Date(date.getFullYear(), date.getMonth(), 0);
    for (let i = startDayOfWeek - 1; i >= 0; i--) {
      grid.push({
        date: new Date(date.getFullYear(), date.getMonth() - 1, prevMonthEnd.getDate() - i),
        isCurrentMonth: false
      });
    }

    // Current month days
    for (let i = 1; i <= endOfMonth.getDate(); i++) {
      grid.push({
        date: new Date(date.getFullYear(), date.getMonth(), i),
        isCurrentMonth: true
      });
    }

    // Next month overflow days
    const remainingCells = 42 - grid.length;
    for (let i = 1; i <= remainingCells; i++) {
      grid.push({
        date: new Date(date.getFullYear(), date.getMonth() + 1, i),
        isCurrentMonth: false
      });
    }

    return grid;
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (statusRef.current && !statusRef.current.contains(event.target)) setStatusDropdownOpen(false);
      if (qualityRef.current && !qualityRef.current.contains(event.target)) setQualityDropdownOpen(false);
      if (sourceRef.current && !sourceRef.current.contains(event.target)) setSourceDropdownOpen(false);
      if (ownerRef.current && !ownerRef.current.contains(event.target)) setOwnerDropdownOpen(false);
      if (datePickerRef.current && !datePickerRef.current.contains(event.target) && document.body.contains(event.target)) setDatePickerOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const onDateClick = (clickedDate) => {
    handleDateClick(clickedDate);
    // If we just clicked the end date (meaning range is complete), close the datepicker
    if (startDate && !endDate && clickedDate >= new Date(startDate + "T00:00:00")) {
      setDatePickerOpen(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col gap-4">
      {/* Top Row: Dropdowns & Clear All */}
      <div className="flex items-center justify-between">
        <div className="flex flex-wrap items-center gap-3">
          
          {/* Status Dropdown */}
          <div className="relative" ref={statusRef}>
            <button
              onClick={() => setStatusDropdownOpen(!statusDropdownOpen)}
              className="flex items-center gap-1.5 px-4 py-2 bg-white border border-gray-200 rounded-full text-[13px] font-bold text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <span>Status{statusFilter ? `: ${statusFilter}` : ''}</span>
              <ChevronDown className="w-4 h-4 text-gray-400" />
            </button>
            {statusDropdownOpen && (
              <div className="absolute left-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg z-50 p-1 w-44">
                <button
                  onClick={() => { setStatusFilter(''); setStatusDropdownOpen(false); }}
                  className={`w-full text-left px-3 py-2 text-[13px] font-semibold rounded-lg flex items-center justify-between ${!statusFilter ? 'text-[#1e5b53] bg-[#eaf4f2]' : 'text-gray-700 hover:bg-gray-50'}`}
                >
                  All Statuses
                  {!statusFilter && <Check className="w-3.5 h-3.5 text-[#1e5b53]" />}
                </button>
                {statuses.map(st => (
                  <button
                    key={st}
                    onClick={() => { setStatusFilter(st); setStatusDropdownOpen(false); }}
                    className={`w-full text-left px-3 py-2 text-[13px] font-semibold rounded-lg flex items-center justify-between ${statusFilter === st ? 'text-[#1e5b53] bg-[#eaf4f2]' : 'text-gray-700 hover:bg-gray-50'}`}
                  >
                    {st}
                    {statusFilter === st && <Check className="w-3.5 h-3.5 text-[#1e5b53]" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Quality Dropdown */}
          <div className="relative" ref={qualityRef}>
            <button
              onClick={() => setQualityDropdownOpen(!qualityDropdownOpen)}
              className="flex items-center gap-1.5 px-4 py-2 bg-white border border-gray-200 rounded-full text-[13px] font-bold text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <span>Quality{qualityFilter ? `: ${qualityFilter}` : ''}</span>
              <ChevronDown className="w-4 h-4 text-gray-400" />
            </button>
            {qualityDropdownOpen && (
              <div className="absolute left-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg z-50 p-1 w-40">
                <button
                  onClick={() => { setQualityFilter(''); setQualityDropdownOpen(false); }}
                  className={`w-full text-left px-3 py-2 text-[13px] font-semibold rounded-lg flex items-center justify-between ${!qualityFilter ? 'text-[#1e5b53] bg-[#eaf4f2]' : 'text-gray-700 hover:bg-gray-50'}`}
                >
                  All Qualities
                  {!qualityFilter && <Check className="w-3.5 h-3.5 text-[#1e5b53]" />}
                </button>
                {qualities.map(q => (
                  <button
                    key={q}
                    onClick={() => { setQualityFilter(q); setQualityDropdownOpen(false); }}
                    className={`w-full text-left px-3 py-2 text-[13px] font-semibold rounded-lg flex items-center justify-between ${qualityFilter === q ? 'text-[#1e5b53] bg-[#eaf4f2]' : 'text-gray-700 hover:bg-gray-50'}`}
                  >
                    {q}
                    {qualityFilter === q && <Check className="w-3.5 h-3.5 text-[#1e5b53]" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Source Dropdown */}
          <div className="relative" ref={sourceRef}>
            <button
              onClick={() => setSourceDropdownOpen(!sourceDropdownOpen)}
              className="flex items-center gap-1.5 px-4 py-2 bg-white border border-gray-200 rounded-full text-[13px] font-bold text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <span>Source{sourceFilter ? `: ${getSourceDisplay(sourceFilter)}` : ''}</span>
              <ChevronDown className="w-4 h-4 text-gray-400" />
            </button>
            {sourceDropdownOpen && (
              <div className="absolute left-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg z-50 p-1 w-44">
                <button
                  onClick={() => { setSourceFilter(''); setSourceDropdownOpen(false); }}
                  className={`w-full text-left px-3 py-2 text-[13px] font-semibold rounded-lg flex items-center justify-between ${!sourceFilter ? 'text-[#1e5b53] bg-[#eaf4f2]' : 'text-gray-700 hover:bg-gray-50'}`}
                >
                  All Sources
                  {!sourceFilter && <Check className="w-3.5 h-3.5 text-[#1e5b53]" />}
                </button>
                {sources.map(src => (
                  <button
                    key={src}
                    onClick={() => { setSourceFilter(src); setSourceDropdownOpen(false); }}
                    className={`w-full text-left px-3 py-2 text-[13px] font-semibold rounded-lg flex items-center justify-between ${sourceFilter === src ? 'text-[#1e5b53] bg-[#eaf4f2]' : 'text-gray-700 hover:bg-gray-50'}`}
                  >
                    {getSourceDisplay(src)}
                    {sourceFilter === src && <Check className="w-3.5 h-3.5 text-[#1e5b53]" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Owner Dropdown */}
          <div className="relative" ref={ownerRef}>
            <button
              onClick={() => setOwnerDropdownOpen(!ownerDropdownOpen)}
              className="flex items-center gap-1.5 px-4 py-2 bg-white border border-gray-200 rounded-full text-[13px] font-bold text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <span>Owner{ownerFilter ? `: ${ownerFilter}` : ''}</span>
              <ChevronDown className="w-4 h-4 text-gray-400" />
            </button>
            {ownerDropdownOpen && (
              <div className="absolute left-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg z-50 p-1 w-52">
                <button
                  onClick={() => { setOwnerFilter(''); setOwnerDropdownOpen(false); }}
                  className={`w-full text-left px-3 py-2 text-[13px] font-semibold rounded-lg flex items-center justify-between ${!ownerFilter ? 'text-[#1e5b53] bg-[#eaf4f2]' : 'text-gray-700 hover:bg-gray-50'}`}
                >
                  All Owners
                  {!ownerFilter && <Check className="w-3.5 h-3.5 text-[#1e5b53]" />}
                </button>
                {owners.map(ow => (
                  <button
                    key={ow}
                    onClick={() => { setOwnerFilter(ow); setOwnerDropdownOpen(false); }}
                    className={`w-full text-left px-3 py-2 text-[13px] font-semibold rounded-lg flex items-center justify-between ${ownerFilter === ow ? 'text-[#1e5b53] bg-[#eaf4f2]' : 'text-gray-700 hover:bg-gray-50'}`}
                  >
                    {ow}
                    {ownerFilter === ow && <Check className="w-3.5 h-3.5 text-[#1e5b53]" />}
                  </button>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* Clear All Button */}
        <button onClick={handleClearAll} className="flex items-center gap-2 text-[13px] font-bold text-gray-600 hover:text-gray-900 transition-colors px-2 py-1">
          <RotateCcw className="w-3.5 h-3.5" /> Clear All
        </button>
      </div>

      {/* Date Range Section */}
      <div className="flex flex-col gap-2 relative" ref={datePickerRef}>
        <div className="text-[12px] text-gray-500 font-medium">Created Date Range</div>

        {/* Date Input Field */}
        <div
          onClick={() => setDatePickerOpen(!datePickerOpen)}
          className={`flex items-center gap-2 bg-white border ${datePickerOpen ? 'border-[#1e5b53]' : 'border-gray-200'} px-4 py-2.5 rounded-xl text-[13px] font-medium w-full max-w-sm justify-between shadow-sm cursor-pointer select-none`}
        >
          <div className="flex items-center gap-2">
            <CalendarDays className="w-4 h-4 text-gray-400" />
            <span className={(!startDate && !endDate) ? "text-gray-400" : "text-gray-700"}>
              {startDate && endDate
                ? `${formatInputDate(startDate)} - ${formatInputDate(endDate)}`
                : 'Select created date range'
              }
            </span>
          </div>
          {(startDate || endDate) && (
            <button
              onClick={(e) => { e.stopPropagation(); handleClearDate(); }}
              className="bg-[#1e5b53] rounded-full p-0.5 text-white flex items-center justify-center hover:bg-[#153f3a] transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Tooltip arrow pointing up to the input box */}
        {datePickerOpen && (
          <div className="absolute top-[72px] left-10 w-3 h-3 bg-white rotate-45 border-t border-l border-gray-200 z-50"></div>
        )}

        {/* Custom Date Picker Calendar Dropdown */}
        {datePickerOpen && (
          <div className="absolute left-0 top-[77px] bg-white border border-gray-200 rounded-2xl shadow-xl p-4 w-[320px] z-50 select-none">
            {/* Month Selection Header */}
            <div className="flex items-center justify-between mb-4 px-1">
              <button
                type="button"
                onClick={() => {
                  const prev = new Date(currentCalendarMonth);
                  prev.setMonth(prev.getMonth() - 1);
                  setCurrentCalendarMonth(prev);
                }}
                className="p-1 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-gray-600 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-[14px] font-bold text-gray-900">
                {formatMonthYear(currentCalendarMonth)}
              </span>
              <button
                type="button"
                onClick={() => {
                  const next = new Date(currentCalendarMonth);
                  next.setMonth(next.getMonth() + 1);
                  setCurrentCalendarMonth(next);
                }}
                className="p-1 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-gray-600 transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Weekday Row */}
            <div className="grid grid-cols-7 text-center text-[12px] font-bold text-gray-400 mb-2">
              {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => (
                <div key={d} className="py-1">{d}</div>
              ))}
            </div>

            {/* Days Grid */}
            <div className="grid grid-cols-7 gap-y-1 text-center">
              {getDaysInMonthGrid(currentCalendarMonth).map((cell, idx) => {
                const isStart = startDate && formatMonthYear(cell.date) === formatMonthYear(new Date(startDate + "T00:00:00")) && cell.date.getDate() === new Date(startDate + "T00:00:00").getDate();
                // Simple date string comparisons
                const startStr = startDate ? startDate : null;
                const endStr = endDate ? endDate : null;
                const currentStr = cell.date.toISOString().split('T')[0];
                
                const isCellStart = startStr === currentStr;
                const isCellEnd = endStr === currentStr;
                const isCellInRange = startStr && endStr && currentStr > startStr && currentStr < endStr;

                let cellClass = "w-9 h-9 flex items-center justify-center text-[13px] font-semibold transition-all mx-auto cursor-pointer ";

                if (isCellStart) {
                  if (endDate) {
                    cellClass += "bg-[#1e5b53] text-white rounded-full";
                  } else {
                    cellClass += "bg-[#eaf4f2] text-[#1e5b53] rounded-full";
                  }
                } else if (isCellEnd) {
                  cellClass += "bg-[#1e5b53] text-white rounded-full";
                } else if (isCellInRange) {
                  cellClass += "bg-[#eaf4f2] text-[#1e5b53] rounded-none";
                } else {
                  cellClass += cell.isCurrentMonth
                    ? "text-gray-800 hover:bg-gray-100 rounded-full"
                    : "text-gray-300 hover:bg-gray-50 rounded-full";
                }

                return (
                  <div
                    key={idx}
                    onClick={() => onDateClick(cell.date)}
                    className={cellClass}
                  >
                    {cell.date.getDate()}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Date Presets Row */}
      <div className="flex flex-wrap items-center gap-3">
        {['Today', 'Last 7 Days', 'Last 30 Days', 'Last 2 Months'].map(preset => (
          <button
            key={preset}
            onClick={() => handleDatePresetClick(preset)}
            className={`px-4 py-2.5 rounded-full text-[13px] font-bold transition-all shadow-sm ${activeDatePreset === preset ? 'bg-white text-[#1e5b53] border border-[#1e5b53]' : 'bg-transparent text-gray-600 border border-gray-200 hover:bg-gray-50'}`}
          >
            {preset}
          </button>
        ))}
      </div>

      {/* Active Tags Row */}
      {(startDate || statusFilter || qualityFilter || sourceFilter || ownerFilter) && (
        <div className="flex flex-col gap-1.5 mt-0">
          {startDate && (
            <div className="flex items-center">
              <button onClick={handleClearDate} className="flex items-center gap-1.5 text-[12px] text-gray-500 hover:text-gray-700 font-bold bg-gray-50 px-3 py-1.5 rounded-full border border-gray-100">
                <X className="w-3.5 h-3.5" /> Clear Date
              </button>
            </div>
          )}

          {(statusFilter || qualityFilter || sourceFilter || ownerFilter) && (
            <div className="flex flex-wrap items-center gap-3">
              {statusFilter && (
                <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#eaf4f2] text-[#1e5b53] rounded-full text-[12px] font-bold border border-[#1e5b53]/10">
                  Status: {statusFilter} <X className="w-3.5 h-3.5 cursor-pointer" onClick={() => setStatusFilter('')} />
                </span>
              )}
              {qualityFilter && (
                <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#eaf4f2] text-[#1e5b53] rounded-full text-[12px] font-bold border border-[#1e5b53]/10">
                  Quality: {qualityFilter} <X className="w-3.5 h-3.5 cursor-pointer" onClick={() => setQualityFilter('')} />
                </span>
              )}
              {sourceFilter && (
                <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#eaf4f2] text-[#1e5b53] rounded-full text-[12px] font-bold border border-[#1e5b53]/10">
                  Source: {getSourceDisplay(sourceFilter)} <X className="w-3.5 h-3.5 cursor-pointer" onClick={() => setSourceFilter('')} />
                </span>
              )}
              {ownerFilter && (
                <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#eaf4f2] text-[#1e5b53] rounded-full text-[12px] font-bold border border-[#1e5b53]/10">
                  Owner: {ownerFilter} <X className="w-3.5 h-3.5 cursor-pointer" onClick={() => setOwnerFilter('')} />
                </span>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
