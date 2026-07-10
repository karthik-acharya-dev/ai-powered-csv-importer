import {
  X, Edit3, Phone, MessageCircle, Share2, Bot, Mail, Tag, BarChart2,
  User, Globe, CheckCircle2, Calendar, ChevronUp, Sparkles, Plus, Activity
} from 'lucide-react';

const formatTime = (ms) => {
  if (!ms) return '';
  try {
    const d = new Date(ms);
    return d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  } catch (e) {
    return '';
  }
};

export default function LeadDetailsPanel({
  leadDetails,
  setSelectedLeadId,
  summaryExpanded,
  setSummaryExpanded,
  setIsFollowUpModalOpen,
  getSourceDisplay
}) {
  if (!leadDetails) return null;

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[430px] h-full xl:h-[calc(100vh-140px)] xl:sticky xl:top-0 bg-white xl:rounded-[24px] shadow-[0_4px_24px_-8px_rgba(0,0,0,0.1)] border-l xl:border border-gray-150 xl:border-gray-100 flex flex-col overflow-hidden transition-all duration-300 animate-in slide-in-from-right">
      {/* Header section */}
      <div className="p-6 pb-4 bg-white shrink-0">
        <div className="flex items-start justify-between">
          <div className="max-w-[85%]">
            <div className="flex flex-wrap items-center gap-3">
              <h2 className="text-[20px] font-bold text-gray-900 tracking-tight leading-none truncate max-w-[320px]">
                {leadDetails.lead?.name || leadDetails.lead?.company}
              </h2>
            </div>

            <div className="flex items-center gap-2 mt-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold text-[#1e5b53] bg-[#eaf4f2] border border-[#1e5b53]/10">
                {leadDetails.lead?.crm?.status || 'Not Dialed'}
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-[11px] font-bold text-gray-400 bg-gray-50 border border-gray-100">
                Quality: {leadDetails.lead?.crm?.quality || '—'}
              </span>
            </div>

            <div className="mt-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[11px] font-bold text-gray-700 bg-gray-50 border border-gray-100">
                Owned by {leadDetails.lead?.owner_name || '—'}
              </span>
            </div>
          </div>

          <button
            onClick={() => setSelectedLeadId(null)}
            className="p-2 border border-gray-200 rounded-full text-gray-500 hover:bg-gray-50 transition-colors shadow-sm"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Circular Action Buttons */}
        <div className="flex items-center gap-3 mt-6">
          <button className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 shadow-sm bg-white">
            <Phone className="w-4 h-4" />
          </button>
          <button className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 shadow-sm bg-white">
            <MessageCircle className="w-4 h-4" />
          </button>
          <button className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 shadow-sm bg-white">
            <Share2 className="w-4 h-4" />
          </button>
          <button className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-[#1e5b53] bg-[#eaf4f2] border-[#1e5b53]/20 shadow-sm">
            <Bot className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Scrollable Body */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
        {/* Info Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white border border-gray-100 rounded-[14px] p-3 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.02)] flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center shrink-0 border border-gray-100">
              <Mail className="w-3.5 h-3.5 text-gray-500" />
            </div>
            <div className="min-w-0">
              <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-0.5">Email</div>
              <div className="text-[13px] font-bold text-gray-900 truncate" title={leadDetails.lead?.email}>{leadDetails.lead?.email || '—'}</div>
            </div>
          </div>

          <div className="bg-white border border-gray-100 rounded-[14px] p-3 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.02)] flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center shrink-0 border border-gray-100">
              <Phone className="w-3.5 h-3.5 text-gray-500" />
            </div>
            <div className="min-w-0">
              <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-0.5">Contact Number</div>
              <div className="text-[13px] font-bold text-gray-900 truncate" title={leadDetails.lead?.mobile}>{leadDetails.lead?.mobile || '—'}</div>
            </div>
          </div>

          <div className="bg-white border border-gray-100 rounded-[14px] p-3 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.02)] flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center shrink-0 border border-gray-100">
              <Tag className="w-3.5 h-3.5 text-gray-500" />
            </div>
            <div className="min-w-0">
              <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Status</div>
              <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[11px] font-bold text-gray-800 bg-gray-50 border border-gray-200">
                {leadDetails.lead?.crm?.status || 'Not Dialed'}
              </span>
            </div>
          </div>

          <div className="bg-white border border-gray-100 rounded-[14px] p-3 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.02)] flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center shrink-0 border border-gray-100">
              <BarChart2 className="w-3.5 h-3.5 text-gray-500" />
            </div>
            <div className="min-w-0">
              <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Quality</div>
              <div className="text-[13px] font-bold text-gray-900">{leadDetails.lead?.crm?.quality || '—'}</div>
            </div>
          </div>

          <div className="bg-white border border-gray-100 rounded-[14px] p-3 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.02)] flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center shrink-0 border border-gray-100">
              <User className="w-3.5 h-3.5 text-gray-500" />
            </div>
            <div className="min-w-0">
              <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Owner</div>
              <div className="text-[13px] font-bold text-gray-900 truncate" title={leadDetails.lead?.owner_name}>{leadDetails.lead?.owner_name || '—'}</div>
            </div>
          </div>

          <div className="bg-white border border-gray-100 rounded-[14px] p-3 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.02)] flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center shrink-0 border border-gray-100">
              <Globe className="w-3.5 h-3.5 text-gray-500" />
            </div>
            <div className="min-w-0">
              <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-0.5">Source</div>
              <div className="text-[13px] font-bold text-gray-900 truncate">{getSourceDisplay(leadDetails.lead?.source?.type)}</div>
            </div>
          </div>
        </div>

        {/* Call Status Today */}
        <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm flex items-center justify-between">
          <div className="flex items-start gap-3 min-w-0">
            <div className="w-10 h-10 rounded-full bg-gray-50 border border-gray-100 text-[#1e5b53] flex items-center justify-center shrink-0">
              <Phone className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <h4 className="text-[15px] font-bold text-gray-900 leading-tight">Call Status Today</h4>
              <p className="text-[12px] text-gray-500 mt-1 truncate">Status: {leadDetails.lead?.crm?.call_status_today || 'Mark done'}</p>
            </div>
          </div>
          <button className="px-5 py-2 bg-[#eaf4f2] text-[#1e5b53] rounded-lg text-[13px] font-bold flex items-center gap-2 border border-[#1e5b53]/10 shadow-sm hover:bg-[#dff0ec] transition-colors shrink-0">
            <CheckCircle2 className="w-4 h-4" /> Done
          </button>
        </div>

        {/* Follow UP */}
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
          <h4 className="text-[15px] font-bold text-gray-900 mb-4">Follow UP</h4>
          <button
            onClick={() => setIsFollowUpModalOpen(true)}
            className="flex items-center gap-2 text-[14px] font-bold text-[#1e5b53] hover:text-[#16423c] transition-colors"
          >
            <Calendar className="w-4.5 h-4.5" /> 
            <span>
              {leadDetails.lead?.crm?.next_follow_up 
                ? `Follow up set for: ${new Date(leadDetails.lead?.crm?.next_follow_up).toLocaleString()}`
                : 'Set Follow Up Date'
              }
            </span>
          </button>
        </div>

        {/* Lead Summary */}
        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm">
          <button
            onClick={() => setSummaryExpanded(!summaryExpanded)}
            className="w-full px-4 py-3 flex items-center justify-between"
          >
            <span className="text-[14px] font-bold text-gray-900">Lead Summary</span>
            <ChevronUp className={`w-4 h-4 text-gray-400 transition-transform ${summaryExpanded ? 'rotate-180' : ''}`} />
          </button>
          {summaryExpanded && (
            <div className="px-4 pb-4 pt-1 text-[12px] text-gray-500 leading-relaxed">
              {leadDetails.lead?.crm_note || 'No notes or AI-generated summary available.'}
            </div>
          )}
        </div>

        {/* Activity Timeline */}
        <div className="pt-2">
          <h4 className="text-[15px] font-bold text-gray-900 mb-4 pl-1">Activity History</h4>
          <div className="relative border-l border-gray-200 ml-[18px] space-y-6 pb-6">
            {leadDetails.activities && leadDetails.activities.map((act) => {
              const actMs = (act.created_at?._seconds || act.created_at?.seconds || 0) * 1000;
              const formattedTime = actMs ? formatTime(actMs) : '';

              return (
                <div key={act.id} className="relative pl-8">
                  {/* Dot Icon */}
                  <div className="absolute -left-[17px] top-2 w-8 h-8 rounded-full bg-white border border-gray-200 shadow-sm flex items-center justify-center z-10 text-[#1e5b53]">
                    {act.type === 'PHONE_CALL' ? <Phone className="w-3.5 h-3.5" /> :
                      act.type === 'WA_MESSAGE' ? <MessageCircle className="w-3.5 h-3.5" /> :
                        act.type.includes('CAMPAIGN') ? <Sparkles className="w-3.5 h-3.5" /> :
                          act.type.includes('LEAD') ? <Plus className="w-3.5 h-3.5" /> :
                            <Activity className="w-3.5 h-3.5" />}
                  </div>

                  {/* Event Card */}
                  <div className="bg-white rounded-[16px] border border-gray-100 p-4 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.02)]">
                    <div className="text-[12px] font-medium text-gray-500 mb-1.5">{formattedTime}</div>
                    <div className="text-[15px] font-bold text-[#1e5b53] leading-tight mb-1">{act.title}</div>
                    <div className="text-[13px] text-gray-600 mb-3 leading-relaxed">{act.description}</div>

                    {act.metadata?.content && (
                      <div className="mb-4 p-4 bg-gray-50 rounded-xl text-[13px] text-gray-600 leading-relaxed whitespace-pre-line">
                        {act.metadata.content}
                      </div>
                    )}

                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-3 py-1.5 bg-gray-50 rounded-full text-[11px] font-bold text-gray-700 capitalize">
                        {act.type.replace(/_/g, ' ').toLowerCase()}
                      </span>
                      {act.direction && (
                        <span className="px-3 py-1.5 bg-[#eaf4f2] text-[#1e5b53] rounded-full text-[11px] font-bold flex items-center gap-1.5 capitalize">
                          <Activity className="w-3 h-3" /> {act.direction.toLowerCase()}
                        </span>
                      )}
                      {act.metadata?.campaign_id && (
                        <span className="px-3 py-1.5 bg-white border border-gray-200 rounded-full text-[11px] font-bold text-gray-600 flex items-center gap-1.5">
                          # {act.metadata.campaign_id}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
