import React from 'react';
import { Sparkles, Eye, ShieldCheck, HeartHandshake, Home, Calendar, FolderHeart, Compass, BarChart2 } from 'lucide-react';
import { AccessibilitySettings, SubscriptionTier } from '../types';

interface Props {
  activeTab: 'home' | 'plan' | 'my-plans' | 'explore' | 'admin';
  setActiveTab: (tab: 'home' | 'plan' | 'my-plans' | 'explore' | 'admin') => void;
  accessibilitySettings: AccessibilitySettings;
  onOpenAccessibility: () => void;
  onOpenSubscription: () => void;
  subscriptionTier: SubscriptionTier;
  professorDemoMode: boolean;
  onToggleProfessorDemo: () => void;
  onToggleSeniorGentleMode: () => void;
}

export const Navbar: React.FC<Props> = ({
  activeTab,
  setActiveTab,
  accessibilitySettings,
  onOpenAccessibility,
  onOpenSubscription,
  subscriptionTier,
  professorDemoMode,
  onToggleProfessorDemo,
  onToggleSeniorGentleMode,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <div
            onClick={() => setActiveTab('home')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-600/20 group-hover:scale-105 transition-transform">
              <Sparkles className="w-6 h-6 sm:w-7 sm:h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg sm:text-xl tracking-tight text-slate-900 dark:text-white">
                  AI Day Planner
                </span>
                <span className="bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 text-xs font-bold px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                  SG
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block">
                Singapore Autonomous Public-Data Agent
              </p>
            </div>
          </div>

          {/* Top Quick Actions / Badges */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Gentle Day Mode Quick Toggle */}
            <button
              onClick={onToggleSeniorGentleMode}
              className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-all border ${
                accessibilitySettings.seniorEasyMode
                  ? 'bg-amber-500 text-white border-amber-600 shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-amber-50 dark:hover:bg-amber-950'
              }`}
              title="Toggle Senior-Friendly Gentle Day Mode"
            >
              <HeartHandshake className="w-4 h-4" />
              <span className="hidden md:inline">👴 Gentle Mode</span>
              <span className="md:hidden">👴 Gentle</span>
            </button>

            {/* Professor Demo Mode Badge */}
            <button
              onClick={onToggleProfessorDemo}
              className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-all border ${
                professorDemoMode
                  ? 'bg-indigo-600 text-white border-indigo-700 shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-indigo-50 dark:hover:bg-indigo-950'
              }`}
              title="Toggle Professor AI Agent Telemetry Trace"
            >
              <ShieldCheck className="w-4 h-4" />
              <span className="hidden md:inline">🎓 Agent Telemetry</span>
              <span className="md:hidden">🎓 Demo</span>
            </button>

            {/* Accessibility Button */}
            <button
              onClick={onOpenAccessibility}
              className="p-2 sm:px-3 sm:py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-xs sm:text-sm flex items-center gap-1.5 transition-all border border-slate-200 dark:border-slate-700"
              aria-label="Accessibility Settings"
            >
              <Eye className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span className="hidden lg:inline">Text & Contrast</span>
            </button>

            {/* Subscription Badge */}
            <button
              onClick={onOpenSubscription}
              className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold text-xs sm:text-sm shadow-sm hover:opacity-95 transition-opacity flex items-center gap-1.5"
            >
              <span className="uppercase tracking-wider font-extrabold text-[10px] bg-white/20 px-1.5 py-0.5 rounded">
                {subscriptionTier}
              </span>
              <span className="hidden sm:inline">Upgrade</span>
            </button>
          </div>
        </div>

        {/* Bottom Navigation Tabs */}
        <nav className="flex items-center gap-1 sm:gap-2 overflow-x-auto pb-2 pt-1 border-t border-slate-100 dark:border-slate-800/80 no-scrollbar">
          {[
            { id: 'home', label: 'Home', icon: Home },
            { id: 'plan', label: 'Plan My Day', icon: Calendar },
            { id: 'my-plans', label: 'My Plans', icon: FolderHeart },
            { id: 'explore', label: 'Explore SG', icon: Compass },
            { id: 'admin', label: 'Admin & Sources', icon: BarChart2 },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
