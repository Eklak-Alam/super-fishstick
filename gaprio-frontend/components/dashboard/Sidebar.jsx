'use client';
import { LayoutGrid, X, Settings } from 'lucide-react';
import Image from 'next/image';
import { Saira } from 'next/font/google';

// Initialize the Saira font
const saira = Saira({ 
  subsets: ['latin'], 
  weight: ['400', '500', '600', '700'] 
});

export default function Sidebar({ activeTab, setActiveTab, user, onOpenProfile, onClose, onOpenAI, isMobile = false }) {
    
    const connections = user?.connections || [];
    const checkConn = (provider) => connections.some(c => c.provider === provider);

    const handleTabChange = (tabName) => {
        if (typeof setActiveTab === 'function') setActiveTab(tabName);
        if (onClose) onClose(); 
    };

    // FIX: Ensure clicking the AI button properly updates the active tab state
    const handleAiClick = () => {
        if (onOpenAI) onOpenAI(); 
        handleTabChange('ai');
    };

    return (
        <aside className={`
            group/sidebar flex flex-col justify-between h-full bg-zinc-950 border-r border-zinc-800 transition-[width] duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] z-50 overflow-hidden
            ${isMobile ? 'w-full' : 'w-20 hover:w-[280px]'}
        `}>
            
            {isMobile && (
                <button onClick={onClose} className="absolute top-4 right-4 p-2 text-zinc-500 hover:text-white transition-colors z-50">
                    <X size={20} />
                </button>
            )}

            <div 
                className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar py-4 flex flex-col"
                data-lenis-prevent="true"
            >
                
                {/* --- LOGO AREA --- */}
                <div className="px-6 mb-8 h-10 flex items-center shrink-0">
                    
                    {/* Always visible logo1.png */}
                    <div className="shrink-0 flex items-center justify-center z-10 relative">
                        <Image src="/logo1.png" alt="Gaprio Icon" width={32} height={32} className="object-contain" priority style={{ width: "auto", height: "auto" }} />
                    </div>

                    {/* Sliding "Gaprio" Text - Using Saira Font */}
                    <div className={`overflow-hidden transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] whitespace-nowrap ${isMobile ? 'opacity-100 w-auto ml-3' : 'opacity-0 w-0 ml-0 group-hover/sidebar:opacity-100 group-hover/sidebar:w-auto group-hover/sidebar:ml-3'}`}>
                        <span className={`text-2xl font-bold text-white tracking-tight ${saira.className}`}>
                            Gaprio
                        </span>
                    </div>

                </div>

                {/* --- NAVIGATION --- */}
                <nav className="flex-1 space-y-4 px-3">
                    <div>
                        {/* <SectionLabel isMobile={isMobile}>Core Logic</SectionLabel> */}
                        <div className="space-y-1">
                            <SidebarItem 
                                customIcon={<LayoutGrid size={20} className="text-orange-500" />} 
                                label="System Overview" isActive={activeTab === 'overview'} onClick={() => handleTabChange('overview')} isMobile={isMobile} 
                            />
                            
                            {/* Gaprio AI Item - Using the new handleAiClick handler */}
                            <SidebarItem 
                                imageSrc="/logo1.png" 
                                label="Gaprio Intelligence" isActive={activeTab === 'ai'} onClick={handleAiClick} isMobile={isMobile} 
                                imageClass="drop-shadow-sm" 
                            />
                        </div>
                    </div>
                    
                    <div>
                        <SectionLabel isMobile={isMobile}>Integrations</SectionLabel>
                        <div className="space-y-1">
                            <SidebarItem imageSrc="/companylogo/google.webp" label="Google Workspace" isActive={activeTab === 'google'} onClick={() => handleTabChange('google')} isConnected={checkConn('google')} isMobile={isMobile} />
                            <SidebarItem imageSrc="/companylogo/slack.png" label="Slack" isActive={activeTab === 'slack'} onClick={() => handleTabChange('slack')} isConnected={checkConn('slack')} isMobile={isMobile} />
                            <SidebarItem imageSrc="/companylogo/asana.png" label="Asana" isActive={activeTab === 'asana'} onClick={() => handleTabChange('asana')} isConnected={checkConn('asana')} isMobile={isMobile} />
                            
                            <SidebarItem imageSrc="/companylogo/miro.png" label="Miro" isActive={activeTab === 'miro'} onClick={() => handleTabChange('miro')} isConnected={checkConn('miro')} isMobile={isMobile} isSoon />
                            <SidebarItem imageSrc="/companylogo/jira.png" label="Jira Software" isActive={activeTab === 'jira'} onClick={() => handleTabChange('jira')} isConnected={checkConn('jira')} isMobile={isMobile} isSoon />
                            <SidebarItem imageSrc="/companylogo/zoho.png" label="Zoho CRM" isActive={activeTab === 'zoho'} onClick={() => handleTabChange('zoho')} isConnected={checkConn('zoho')} isMobile={isMobile} isSoon />
                            <SidebarItem imageSrc="/companylogo/Microsoft_365.png" label="Microsoft 365" isActive={activeTab === 'microsoft'} onClick={() => handleTabChange('microsoft')} isMobile={isMobile} isSoon />
                        </div>
                    </div>
                </nav>
            </div>

            {/* --- USER PROFILE FOOTER --- */}
            <div className="p-3 border-t border-zinc-800/50 shrink-0">
                <button onClick={onOpenProfile} className="flex items-center w-full p-2 rounded-xl hover:bg-zinc-900 transition-all duration-300 group outline-none focus-visible:ring-2 focus-visible:ring-orange-500/50">
                    
                    {/* Vibrant Gradient Avatar */}
                    <div className="relative shrink-0 flex items-center justify-center w-10 h-10 rounded-xl bg-orange-500 text-sm font-bold text-white shadow-md group-hover:shadow-orange-500/20 transition-all duration-300">
                        {user?.full_name?.charAt(0)?.toUpperCase() || 'U'}
                        <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-zinc-950 rounded-full" />
                    </div>
                    
                    <div className={`text-left overflow-hidden transition-all duration-300 ${isMobile ? 'opacity-100 w-auto ml-3' : 'opacity-0 w-0 ml-0 group-hover/sidebar:opacity-100 group-hover/sidebar:w-auto group-hover/sidebar:ml-3'}`}>
                        <p className="text-sm font-bold text-zinc-100 truncate group-hover:text-white transition-colors">{user?.full_name || 'System Admin'}</p>
                        <p className="text-[11px] text-zinc-500 truncate flex items-center gap-1.5 mt-0.5 group-hover:text-zinc-400 transition-colors">
                            <Settings size={12} className="group-hover:rotate-90 transition-transform duration-500" /> Settings & Config
                        </p>
                    </div>
                </button>
            </div>
        </aside>
    );
}

// --- SUB-COMPONENTS ---

function SectionLabel({ children, isMobile }) {
    return (
        <div className={`overflow-hidden transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] ${isMobile ? 'h-6 opacity-100 mb-2 mt-4' : 'h-0 opacity-0 mb-0 mt-0 group-hover/sidebar:h-6 group-hover/sidebar:opacity-100 group-hover/sidebar:mb-2 group-hover/sidebar:mt-4'}`}>
            <h3 className="px-4 text-[10px] font-semibold text-zinc-600 uppercase tracking-widest whitespace-nowrap">
                {children}
            </h3>
        </div>
    );
}

function SidebarItem({ customIcon, imageSrc, label, isActive, onClick, isConnected, isBeta, isSoon, isMobile, imageClass = "" }) {
    return (
        <button 
            onClick={onClick} 
            className={`relative flex items-center w-full p-2.5 rounded-xl transition-all duration-200 group overflow-hidden outline-none focus-visible:ring-2 focus-visible:ring-orange-500/50 
            ${isActive ? 'bg-zinc-900/80 shadow-inner' : 'hover:bg-zinc-900 text-zinc-400'}`}
        >
            
            {/* Active Orange Bar */}
            {isActive && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-orange-500 rounded-r-full" />}
            
            {/* Image / Icon Container */}
            <div className={`shrink-0 flex items-center justify-center w-8`}>
                {imageSrc ? (
                    <Image 
                        src={imageSrc} 
                        alt={label} 
                        width={20} 
                        height={20} 
                        className={`object-contain ${imageClass}`} 
                        style={{ width: "auto", height: "auto" }}
                    />
                ) : (
                    customIcon
                )}
            </div>

            {/* Expandable Text & Badges */}
            <div className={`flex items-center justify-between flex-1 overflow-hidden transition-all duration-300 whitespace-nowrap ${isMobile ? 'opacity-100 ml-3 w-auto' : 'opacity-0 w-0 ml-0 group-hover/sidebar:opacity-100 group-hover/sidebar:w-auto group-hover/sidebar:ml-3'}`}>
                <span className={`text-[13px] font-medium truncate ${isActive ? 'text-zinc-100' : 'group-hover:text-zinc-200'}`}>{label}</span>
                <div className="flex items-center gap-2 pl-2">
                    {isBeta && <span className="text-[9px] font-bold text-orange-500 bg-orange-500/10 px-1.5 py-0.5 rounded border border-orange-500/20 uppercase shadow-sm">Beta</span>}
                    {isSoon && <span className="text-[9px] font-bold text-zinc-400 bg-zinc-900 border border-zinc-700 px-1.5 py-0.5 rounded uppercase tracking-wider">Soon</span>}
                    {isConnected && <div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]" />}
                </div>
            </div>
        </button>
    );
}