import { Search, RotateCcw, ChevronRight } from 'lucide-react';

const formatDate = (ms) => {
  if (!ms) return '—';
  try {
    const date = new Date(ms);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  } catch (e) {
    return '—';
  }
};

export default function LeadTable({
  filteredLeads,
  selectedLeadId,
  setSelectedLeadId,
  visibleCount,
  setVisibleCount,
  searchQuery,
  setSearchQuery,
  handleRefresh
}) {
  return (
    <div className="flex-1 flex flex-col min-w-0 transition-all duration-300">
      
      {/* Header section of Table with Search and Refresh */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-[17px] font-bold text-gray-900 tracking-tight">Your Leads</h2>

        <div className="flex items-center gap-3">
          <div className="flex items-center bg-white border border-gray-200 rounded-[14px] overflow-hidden w-[380px] h-11 shadow-[0_2px_8px_-3px_rgba(0,0,0,0.05)]">
            <input
              type="text"
              placeholder="Enter email or phone number..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 px-4 h-full text-[13px] text-gray-700 placeholder:text-gray-400 focus:outline-none font-medium bg-transparent"
            />
            <button className="bg-[#1e5b53] hover:bg-[#16423c] text-white w-14 h-full flex items-center justify-center transition-colors shrink-0">
              <Search className="w-4 h-4" />
            </button>
          </div>
          <button
            onClick={handleRefresh}
            className="w-11 h-11 bg-white border border-gray-200 hover:bg-gray-50 rounded-[14px] text-gray-500 flex items-center justify-center transition-colors shadow-[0_2px_8px_-3px_rgba(0,0,0,0.05)] shrink-0"
            title="Reload leads"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Table Container */}
      <div className="bg-white rounded-3xl shadow-[0_2px_10px_-4px_rgba(0,0,0,0.02)] border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto w-full relative">
          <table className="w-full text-left whitespace-nowrap min-w-[1200px]">
            <thead className="bg-[#f8faf9] border-b border-gray-200/50 text-[11px] font-extrabold uppercase text-gray-500 tracking-wider">
              <tr>
                <th className="px-6 py-4 w-[240px]">Lead Name</th>
                <th className="px-6 py-4 w-[220px]">Email</th>
                <th className="px-6 py-4 w-[150px]">Contact</th>
                <th className="px-6 py-4 w-[200px]">Date Created</th>
                <th className="px-6 py-4 w-[160px]">Company</th>
                <th className="px-6 py-4 w-[130px]">Status</th>
                <th className="px-6 py-4 w-[110px]">Quality</th>
                <th className="px-6 py-4 w-[100px] text-right sticky right-0 bg-[#f8faf9] z-10 border-l border-gray-200/20">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredLeads.slice(0, visibleCount).map(lead => {
                const isSelected = selectedLeadId === lead.id;
                const createdMs = (lead.created_at?._seconds || lead.created_at?.seconds || 0) * 1000;
                const formattedDate = createdMs ? formatDate(createdMs) : '—';

                return (
                  <tr
                    key={lead.id}
                    onClick={() => setSelectedLeadId(lead.id)}
                    className={`group hover:bg-[#f8faf9] cursor-pointer transition-colors border-b border-gray-50 ${isSelected ? 'bg-[#f4f7f6]' : ''}`}
                  >
                    {/* 1. LEAD NAME */}
                    <td className="px-6 py-4">
                      <div className="font-bold text-[13.5px] text-gray-800 tracking-tight">{lead.name}</div>
                    </td>

                    {/* 2. EMAIL */}
                    <td className="px-6 py-4">
                      <div className="text-[13px] text-gray-500 font-medium truncate max-w-[180px]" title={lead.email}>
                        {lead.email}
                      </div>
                    </td>

                    {/* 3. CONTACT */}
                    <td className="px-6 py-4 text-[13px] text-gray-500 font-medium">
                      {lead.mobile}
                    </td>

                    {/* 4. DATE CREATED */}
                    <td className="px-6 py-4 text-[13px] text-gray-500 font-medium">
                      {formattedDate}
                    </td>

                    {/* 5. COMPANY */}
                    <td className="px-6 py-4 text-[13px] text-gray-500 font-medium">
                      {lead.company || '—'}
                    </td>

                    {/* 6. STATUS */}
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-3 py-1 rounded-[6px] text-[11px] font-bold ${
                        (lead.crm?.status === 'Sales Done' || lead.crm?.status === 'Won') ? 'bg-[#eaf4f2] text-[#1e5b53] border border-[#1e5b53]/10' :
                        lead.crm?.status === 'Good Lead' ? 'bg-green-50 text-green-700 border border-green-150' :
                        lead.crm?.status === 'Bad Lead' ? 'bg-red-50 text-red-700 border border-red-150' :
                        'bg-[#f1f3f2] text-gray-600 border border-gray-200/50'
                      }`}>
                        {lead.crm?.status || 'Not Dialed'}
                      </span>
                    </td>

                    {/* 7. QUALITY */}
                    <td className="px-6 py-4">
                      {lead.crm?.quality === '—' || !lead.crm?.quality ? (
                        <div className="w-6 h-6 rounded-full bg-[#f1f3f2] flex items-center justify-center text-gray-400 text-[12px] font-bold">
                          —
                        </div>
                      ) : (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-[6px] text-[11px] font-bold bg-[#eaf4f2] text-[#1e5b53] border border-[#1e5b53]/10">
                          {lead.crm?.quality}
                        </span>
                      )}
                    </td>

                    {/* 8. ACTIONS */}
                    <td
                      className={`px-6 py-4 text-right sticky right-0 z-10 border-l border-gray-150/50 shadow-[-4px_0_10px_-4px_rgba(0,0,0,0.03)] transition-colors ${isSelected ? 'bg-[#f4f7f6]' : 'bg-white group-hover:bg-[#f8faf9]'}`}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedLeadId(lead.id);
                        }}
                        className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-gray-200 hover:border-gray-300 rounded-[6px] text-[12px] font-bold text-gray-500 hover:text-gray-700 transition-colors shadow-sm"
                      >
                        <span>More</span>
                        <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        
        {/* Pagination Footer */}
        <div className="p-4 flex items-center justify-center border-t border-gray-50 bg-[#fafbfc]">
          <button
            onClick={() => setVisibleCount(prev => prev + 10)}
            className="px-6 py-2.5 border border-gray-200 rounded-full text-[13px] font-bold text-gray-700 bg-white shadow-sm hover:bg-gray-50"
          >
            Load more
          </button>
        </div>
      </div>
    </div>
  );
}
