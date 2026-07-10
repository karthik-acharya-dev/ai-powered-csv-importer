import { useState, useEffect } from 'react';
import {
  LayoutGrid, Rocket, Database, MessageSquare, Users, Megaphone,
  UserPlus, MessageCircle, Phone, Layout, ChevronRight, Plus,
  Check, User, X, Code, Sparkles
} from 'lucide-react';

export default function Sidebar({ mobileOpen, onClose, activeTab, setActiveTab }) {
  const [orgs, setOrgs] = useState([]);
  const [selectedOrg, setSelectedOrg] = useState(null);
  const [orgDropdownOpen, setOrgDropdownOpen] = useState(false);

  useEffect(() => {
    fetch('/api/users/organisations')
      .then(res => res.json())
      .then(data => {
        if (data && data.data) {
          setOrgs(data.data);
          const growEasy = data.data.find(o => o.name === 'GrowEasy AI');
          setSelectedOrg(growEasy || data.data[0]);
        }
      })
      .catch(err => {
        // Fallback for mock organization if backend is not responding yet
        const mockOrg = { name: "Select Organisation", role: "TEAM MEMBER" };
        setSelectedOrg(mockOrg);
        setOrgs([mockOrg]);
      });
  }, []);

  const navItemsMain = [
    { name: 'Dashboard', icon: LayoutGrid, tab: 'DASHBOARD' },
    { name: 'Generate Leads', icon: Rocket, tab: 'GENERATE' },
    { name: 'Manage Leads', icon: Database, tab: 'MANAGE_LEADS' },
    { name: 'Engage Leads', icon: MessageSquare, tab: 'ENGAGE' },
  ];

  const navItemsControlCenter = [
    { name: 'Team Members', icon: Users, tab: 'TEAM' },
    { name: 'Lead Sources', icon: Megaphone, tab: 'LEAD_SOURCES' },
    { name: 'Ad Accounts', icon: UserPlus, tab: 'ADS' },
    { name: 'WhatsApp Account', icon: MessageCircle, tab: 'WHATSAPP' },
    { name: 'Tele Calling', icon: Phone, tab: 'TELEPHONY' },
    { name: 'CRM Fields', icon: Layout, tab: 'CRM' },
    { name: 'API Center', icon: Code, tab: 'API' },
    { name: 'AI Tools', icon: Sparkles, tab: 'AI' }
  ];

  const getOrgIcon = (name) => {
    if (name === 'GrowEasy AI') {
      return (
        <div className="w-9 h-9 rounded-lg bg-black border-0 flex items-center justify-center shrink-0">
          <svg
            viewBox="0 0 212 212"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full text-white border-0"
          >
            <g clipPath="url(#clip0_30_8)">
              <path d="M153.512 102.25L28.3282 227.434L-11.2302 187.876L113.953 62.6921L153.512 102.25Z" fill="currentColor" />
              <path d="M40.5302 62.6965H153.503V102.257H40.5302V62.6965Z" fill="currentColor" />
              <path d="M153.503 62.6965V175.67H113.942L113.942 62.6965L153.503 62.6965Z" fill="currentColor" />
              <path d="M153.503 62.6965V175.67H113.95V62.6963L153.503 62.6965Z" fill="currentColor" />
              <rect x="4" y="4" width="204" height="204" rx="44" stroke="currentColor" strokeWidth="8" />
            </g>
            <defs>
              <clipPath id="clip0_30_8">
                <rect width="212" height="212" rx="48" fill="white" />
              </clipPath>
            </defs>
          </svg>
        </div>
      );
    }
    const initialsColors = {
      'T': 'bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400',
      'V': 'bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400',
      'S': 'bg-orange-50 text-orange-600 dark:bg-orange-950 dark:text-orange-400'
    };
    const letter = name?.charAt(0) || 'O';
    const classes = initialsColors[letter] || 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400';
    return (
      <div className={`w-9 h-9 rounded-lg flex items-center justify-center font-bold text-sm shrink-0 ${classes}`}>
        {letter}
      </div>
    );
  };

  return (
    <>
      {/* Backdrop for mobile drawer */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/25 backdrop-blur-[2px] z-50 md:hidden"
          onClick={onClose}
        />
      )}

      <aside className={`
        fixed md:sticky top-0 left-0 z-50 md:z-10 h-screen bg-white dark:bg-gray-900 flex flex-col border-r border-gray-200 dark:border-gray-800 shrink-0 select-none transition-all duration-300 transform group/sidebar 
        ${mobileOpen ? 'translate-x-0 w-[260px]' : '-translate-x-full md:translate-x-0'} 
        w-[280px] md:w-[76px] md:hover:w-[280px] lg:w-[280px] shadow-sm hover:shadow-xl md:hover:shadow-lg md:shadow-none
      `}>

        {/* Brand Header */}
        <div className="p-4 lg:p-6 pb-4 flex items-center justify-start md:justify-center md:group-hover/sidebar:justify-start lg:justify-start gap-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-black border-0 flex items-center justify-center shrink-0">
              <svg
                viewBox="0 0 212 212"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-full h-full text-white border-0"
              >
                <g clipPath="url(#clip0_30_8)">
                  <path d="M153.512 102.25L28.3282 227.434L-11.2302 187.876L113.953 62.6921L153.512 102.25Z" fill="currentColor" />
                  <path d="M40.5302 62.6965H153.503V102.257H40.5302V62.6965Z" fill="currentColor" />
                  <path d="M153.503 62.6965V175.67H113.942L113.942 62.6965L153.503 62.6965Z" fill="currentColor" />
                  <path d="M153.503 62.6965V175.67H113.95V62.6963L153.503 62.6965Z" fill="currentColor" />
                  <rect x="4" y="4" width="204" height="204" rx="44" stroke="currentColor" strokeWidth="8" />
                </g>
                <defs>
                  <clipPath id="clip0_30_8">
                    <rect width="212" height="212" rx="48" fill="white" />
                  </clipPath>
                </defs>
              </svg>
            </div>
            <span className="font-semibold text-[25px] text-gray-900 dark:text-white tracking-tight hidden lg:block md:group-hover/sidebar:block">GrowEasy</span>
            <span className="font-semibold text-[25px] text-gray-900 dark:text-white tracking-tight md:hidden">GrowEasy</span>
          </div>

          {/* Mobile drawer Close button */}
          <button
            onClick={onClose}
            className="md:hidden p-1.5 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Organization Switcher */}
        <div className="px-2 lg:px-4 pb-4 relative">
          <button
            onClick={() => setOrgDropdownOpen(!orgDropdownOpen)}
            className="w-full flex items-center justify-start md:justify-center md:group-hover/sidebar:justify-between lg:justify-between p-2 lg:p-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl hover:bg-gray-50 dark:hover:bg-gray-750 active:bg-gray-100 dark:active:bg-gray-700 transition-all shadow-sm"
          >
            <div className="flex items-center gap-2">
              {getOrgIcon(selectedOrg?.name)}
              <div className="text-left hidden lg:block md:group-hover/sidebar:block">
                <div className="font-bold text-[13px] text-gray-900 dark:text-white leading-tight">{selectedOrg?.name || 'Loading...'}</div>
                <div className="text-[10px] font-bold text-gray-400 dark:text-gray-400 uppercase tracking-wider mt-0.5">{selectedOrg?.role || 'OWNER'}</div>
              </div>
              <div className="text-left md:hidden">
                <div className="font-bold text-[13px] text-gray-900 dark:text-white leading-tight">{selectedOrg?.name || 'Loading...'}</div>
                <div className="text-[10px] font-bold text-gray-400 dark:text-gray-400 uppercase tracking-wider mt-0.5">{selectedOrg?.role || 'OWNER'}</div>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-400 dark:text-gray-400 hidden lg:block md:group-hover/sidebar:block" />
            <ChevronRight className="w-4 h-4 text-gray-400 dark:text-gray-400 md:hidden" />
          </button>

          {/* Dropdown Menu */}
          {orgDropdownOpen && (
            <div className="absolute top-full left-3 lg:left-6 right-3 lg:right-6 mt-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-lg z-50 p-2 min-w-[200px]">
              <div className="space-y-1">
                {orgs.map((org, index) => (
                  <button
                    key={index}
                    onClick={() => { setSelectedOrg(org); setOrgDropdownOpen(false); }}
                    className={`w-full flex items-center justify-between p-2 rounded-xl transition-all ${selectedOrg?.name === org.name ? 'bg-[#eaf4f2] dark:bg-teal-950/40' : 'hover:bg-gray-50 dark:hover:bg-gray-850'}`}
                  >
                    <div className="flex items-center gap-3">
                      {getOrgIcon(org.name)}
                      <div className="text-left">
                        <div className={`text-[13px] font-bold ${selectedOrg?.name === org.name ? 'text-[#1e5b53] dark:text-teal-400' : 'text-gray-700 dark:text-gray-300'}`}>{org.name}</div>
                        <div className="text-[10px] font-bold text-gray-400 dark:text-gray-550 uppercase tracking-wider">{org.role}</div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              <div className="mt-2 pt-2 border-t border-gray-100 dark:border-gray-850">
                <button className="w-full py-2.5 border border-dashed border-gray-300 dark:border-gray-700 rounded-xl text-[13px] font-bold text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 flex items-center justify-center gap-2 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all">
                  <Plus className="w-4 h-4" /> Add Business
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto px-3 lg:px-6 py-2 space-y-6 custom-sidebar-scrollbar">

          {/* Main Section */}
          <div>
            <h3 className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-2 px-1 hidden lg:block lg:text-left md:group-hover/sidebar:block">Main</h3>
            <h3 className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-2 px-1 md:hidden">Main</h3>
            <div className="space-y-0">
              {navItemsMain.map((item) => {
                const isActive = activeTab === item.tab;
                return (
                  <button
                    key={item.name}
                    onClick={() => {
                      onClose();
                    }}
                    className={`relative w-full flex items-center justify-start md:justify-center md:group-hover/sidebar:justify-start lg:justify-start gap-3 p-2.5 lg:px-3 lg:py-2 rounded-xl lg:rounded-full text-[13px] font-semibold transition-all ${isActive
                      ? 'bg-[#eaf4f2] text-[#1e5b53] dark:bg-teal-950/40 dark:text-teal-400'
                      : 'text-gray-650 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-200'
                      }`}
                    title={item.name}
                  >
                    <item.icon className={`w-4.5 h-4.5 shrink-0 ${isActive ? 'text-[#1e5b53] dark:text-teal-400' : 'text-gray-700 dark:text-gray-400'}`} />
                    <span className="hidden lg:block md:group-hover/sidebar:block">{item.name}</span>
                    <span className="md:hidden">{item.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Control Center Section */}
          <div>
            <h3 className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-2 px-1 hidden lg:block lg:text-left md:group-hover/sidebar:block">Control Center</h3>
            <h3 className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-2 px-1 md:hidden">Control Center</h3>
            <div className="space-y-1">
              {navItemsControlCenter.map((item) => {
                const isActive = activeTab === item.tab;
                return (
                  <button
                    key={item.name}
                    onClick={() => {
                      if (item.tab === 'LEAD_SOURCES') {
                        setActiveTab('LEAD_SOURCES');
                        onClose();
                      }
                    }}
                    className={`relative w-full flex items-center justify-start md:justify-center md:group-hover/sidebar:justify-start lg:justify-start gap-3 p-2.5 lg:px-3 lg:py-2 rounded-xl lg:rounded-full text-[13px] font-semibold transition-all ${isActive
                      ? 'bg-[#eaf4f2] text-[#1e5b53] dark:bg-teal-950/40 dark:text-teal-400'
                      : 'text-gray-650 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-200'
                      }`}
                    title={item.name}
                  >
                    <item.icon className={`w-4.5 h-4.5 shrink-0 ${isActive ? 'text-[#1e5b53] dark:text-teal-400' : 'text-gray-700 dark:text-gray-400'}`} />
                    <span className="hidden lg:block md:group-hover/sidebar:block">{item.name}</span>
                    <span className="md:hidden">{item.name}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Sidebar Footer */}
        <div className="p-3 lg:p-4 border-t border-gray-150 dark:border-gray-800 bg-white dark:bg-gray-900 shrink-0">
          <button
            className="w-full relative flex items-center justify-start md:justify-center md:group-hover/sidebar:justify-start lg:justify-start gap-3 p-2.5 lg:px-5 lg:py-2.5 rounded-xl lg:rounded-full text-[13px] font-semibold text-gray-700 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-200 transition-all"
            title="Business Center"
          >
            <User className="w-4.5 h-4.5 text-gray-400 dark:text-gray-500 shrink-0" />
            <span className="hidden lg:block md:group-hover/sidebar:block">Business Center</span>
            <span className="md:hidden">Business Center</span>
          </button>
        </div>

      </aside>
    </>
  );
}
