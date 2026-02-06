import React from 'react';
import { LayoutDashboard, FileUp, ShieldCheck, Settings, PieChart, Activity, LogOut } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { cn } from './ui';

const NavItem = ({ icon: Icon, label, active = false, onClick }) => (
    <button
        onClick={onClick}
        className={cn(
            "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group relative",
            active
                ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                : "text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white"
        )}
    >
        <Icon size={20} className={cn("transition-transform group-hover:scale-110", active ? "text-white" : "")} />
        <span className="font-bold text-sm tracking-tight">{label}</span>
        {active && (
            <div className="absolute right-2 w-1.5 h-1.5 rounded-full bg-white/40" />
        )}
    </button>
);

export const Sidebar = ({ activeTab, onTabChange }) => {
    const { t } = useTranslation();

    return (
        <aside className="fixed left-0 top-0 h-screen w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 z-50 flex flex-col p-6 overflow-y-auto">
            <div className="flex items-center gap-3 mb-12 px-2">
                <div className="w-10 h-10 bg-gradient-to-tr from-blue-600 to-teal-500 rounded-xl flex items-center justify-center text-white shadow-xl shadow-blue-500/20">
                    <Activity size={24} />
                </div>
                <div className="leading-tight">
                    <h1 className="text-xl font-black tracking-tighter shimmer-text">FINHEALTH</h1>
                    <p className="text-[10px] font-bold text-slate-400 tracking-[0.2em] uppercase">Enterprise AI</p>
                </div>
            </div>

            <nav className="flex-1 space-y-2">
                <div className="mb-4">
                    <p className="px-4 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Main Menu</p>
                    <NavItem
                        icon={LayoutDashboard}
                        label={t('nav.overview')}
                        active={activeTab === 'overview'}
                        onClick={() => onTabChange('overview')}
                    />
                    <NavItem
                        icon={FileUp}
                        label={t('nav.upload')}
                        active={activeTab === 'upload'}
                        onClick={() => onTabChange('upload')}
                    />
                </div>

                <div className="mb-4">
                    <p className="px-4 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">AI Insights</p>
                    <NavItem
                        icon={PieChart}
                        label={t('nav.analytics')}
                        active={activeTab === 'analytics'}
                        onClick={() => onTabChange('analytics')}
                    />
                    <NavItem
                        icon={ShieldCheck}
                        label={t('nav.compliance')}
                        active={activeTab === 'compliance'}
                        onClick={() => onTabChange('compliance')}
                    />
                </div>
            </nav>

            <div className="mt-auto pt-6 border-t border-slate-100 dark:border-slate-800">
                <NavItem
                    icon={Settings}
                    label={t('nav.settings', 'Settings')}
                    active={activeTab === 'settings'}
                    onClick={() => onTabChange('settings')}
                />
                <NavItem
                    icon={LogOut}
                    label={t('nav.signout', 'Sign Out')}
                    onClick={() => onTabChange('signout')}
                />
            </div>
        </aside>
    );
};
