import React from 'react';
import { Sparkles, Utensils, ShoppingBag, Trees, Heart, Users, Landmark, Activity, HelpCircle, HeartHandshake, ShieldCheck, PlayCircle, Clock, MapPin, ArrowRight } from 'lucide-react';
import { ActivityCategory, UserPreferences } from '../types';

interface Props {
  onStartPlannerWithCategory?: (category: ActivityCategory) => void;
  onStartPlannerWithPreset?: (presetPrefs: UserPreferences, presetName: string) => void;
  onOpenPlanner: () => void;
  seniorGentleMode: boolean;
}

export const HomeView: React.FC<Props> = ({
  onStartPlannerWithCategory,
  onStartPlannerWithPreset,
  onOpenPlanner,
  seniorGentleMode,
}) => {
  const quickCategories: { key: ActivityCategory; label: string; icon: React.FC<{ className?: string }>; color: string }[] = [
    { key: 'relaxing', label: 'Relax', icon: HeartHandshake, color: 'bg-emerald-500 text-white' },
    { key: 'food', label: 'Eat', icon: Utensils, color: 'bg-amber-500 text-white' },
    { key: 'shopping', label: 'Shop', icon: ShoppingBag, color: 'bg-blue-500 text-white' },
    { key: 'nature', label: 'Explore', icon: Trees, color: 'bg-teal-500 text-white' },
    { key: 'romantic', label: 'Date', icon: Heart, color: 'bg-rose-500 text-white' },
    { key: 'family', label: 'Family', icon: Users, color: 'bg-indigo-500 text-white' },
    { key: 'culture', label: 'Culture', icon: Landmark, color: 'bg-purple-500 text-white' },
    { key: 'walking', label: 'Active', icon: Activity, color: 'bg-orange-500 text-white' },
  ];

  return (
    <div className="space-y-8 sm:space-y-12 pb-12">
      {/* Hero Header */}
      <section className="text-center pt-6 sm:pt-10 max-w-4xl mx-auto space-y-4 px-4">
        {seniorGentleMode && (
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-200 font-bold text-sm border border-amber-300 dark:border-amber-800">
            <span>👴 Gentle Day Mode Active</span>
            <span className="text-xs bg-amber-200 dark:bg-amber-900 px-2 py-0.5 rounded-full">Low walking • Sheltered</span>
          </div>
        )}

        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
          What would you like to do today?
        </h1>

        <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto font-medium">
          Tell us your available time, budget, and location. Our Singapore AI Agent uses real-time weather, public transport, and places data to build your ideal day.
        </p>

        {/* Big Primary Action Button */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={onOpenPlanner}
            className="w-full sm:w-auto px-8 py-5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-xl sm:text-2xl font-black shadow-xl shadow-emerald-600/30 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3 cursor-pointer"
          >
            <Sparkles className="w-8 h-8 text-amber-300" />
            <span>✨ Plan My Day</span>
          </button>
        </div>
      </section>

      {/* Quick Category Grid */}
      <section className="max-w-5xl mx-auto px-4">
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-4 text-center">
          Or Choose A Quick Mood
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          {quickCategories.map((cat) => {
            const Icon = cat.icon;
            return (
              <button
                key={cat.key}
                onClick={() => onStartPlannerWithCategory?.(cat.key)}
                className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-500 dark:hover:border-emerald-500 shadow-sm hover:shadow-md transition-all flex items-center gap-3 group text-left cursor-pointer"
              >
                <div className={`w-12 h-12 rounded-xl ${cat.color} flex items-center justify-center shadow-md group-hover:scale-110 transition-transform`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <span className="block text-lg font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400">
                    {cat.label}
                  </span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">Find ideas</span>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Professor Demo Presets Section */}
      <section className="max-w-5xl mx-auto px-4 pt-4">
        <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-800 space-y-6">
          <div className="flex items-center justify-between flex-wrap gap-2 pb-4 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Professor Demo Scenarios</h2>
                <p className="text-xs text-slate-400">
                  Instant 1-click test scenarios demonstrating autonomous agent reasoning & replanning
                </p>
              </div>
            </div>
            <span className="bg-indigo-950 text-indigo-300 text-xs font-mono font-bold px-3 py-1 rounded-full border border-indigo-800">
              Agent Telemetry Active
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Scenario 1: Senior Citizen */}
            <div className="bg-slate-800/80 rounded-2xl p-5 border border-slate-700/80 hover:border-amber-500 transition-all flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-xl">👴</span>
                  <h3 className="font-bold text-white text-base">Senior Citizen Scenario</h3>
                </div>
                <div className="text-xs text-slate-300 space-y-1">
                  <p className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-amber-400" /> Toa Payoh Lorong 1</p>
                  <p className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-amber-400" /> 4 Hours • S$40 Budget</p>
                  <p className="text-amber-300 font-semibold mt-1">Gentle Mode: Short walk, hawker lunch, town park rest, kopi break.</p>
                </div>
              </div>
              <button
                onClick={() =>
                  onStartPlannerWithPreset?.(
                    {
                      location: 'Toa Payoh & Novena',
                      timeAvailable: '3h',
                      budgetTier: 'under_50',
                      categories: ['food', 'relaxing', 'nature'],
                      walkingComfort: 'very_little',
                      groupType: 'seniors',
                      seniorGentleMode: true,
                    },
                    'Senior Citizen Gentle Day in Toa Payoh'
                  )
                }
                className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <PlayCircle className="w-4 h-4" /> Run Senior Demo
              </button>
            </div>

            {/* Scenario 2: Tourist */}
            <div className="bg-slate-800/80 rounded-2xl p-5 border border-slate-700/80 hover:border-teal-500 transition-all flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-xl">🇸🇬</span>
                  <h3 className="font-bold text-white text-base">Tourist Heritage Crawl</h3>
                </div>
                <div className="text-xs text-slate-300 space-y-1">
                  <p className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-teal-400" /> Bugis & Kampong Glam</p>
                  <p className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-teal-400" /> 5 Hours • S$60 Budget</p>
                  <p className="text-teal-300 font-semibold mt-1">Culture & Food: Sultan Mosque, Murtabak, Haji Lane, Marina Bay sunset.</p>
                </div>
              </div>
              <button
                onClick={() =>
                  onStartPlannerWithPreset?.(
                    {
                      location: 'Bugis & Kampong Glam',
                      timeAvailable: 'half_day',
                      budgetTier: 'under_100',
                      categories: ['culture', 'food', 'shopping'],
                      walkingComfort: 'some',
                      groupType: 'partner',
                      seniorGentleMode: false,
                    },
                    'Explore Bugis & Kampong Glam'
                  )
                }
                className="w-full py-2.5 rounded-xl bg-teal-500 hover:bg-teal-600 text-slate-950 font-extrabold text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <PlayCircle className="w-4 h-4" /> Run Tourist Demo
              </button>
            </div>

            {/* Scenario 3: Autonomous Weather Re-plan */}
            <div className="bg-slate-800/80 rounded-2xl p-5 border border-slate-700/80 hover:border-indigo-500 transition-all flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-xl">☔</span>
                  <h3 className="font-bold text-white text-base">Rain Weather Re-plan</h3>
                </div>
                <div className="text-xs text-slate-300 space-y-1">
                  <p className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-indigo-400" /> Marina Bay Gardens</p>
                  <p className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-indigo-400" /> Live Weather Re-evaluation</p>
                  <p className="text-indigo-300 font-semibold mt-1">Autonomous Agent detects rain & swaps outdoor walk to Flower Dome.</p>
                </div>
              </div>
              <button
                onClick={() =>
                  onStartPlannerWithPreset?.(
                    {
                      location: 'Marina Bay & Downtown',
                      timeAvailable: '3h',
                      budgetTier: 'under_50',
                      categories: ['nature', 'culture', 'food'],
                      walkingComfort: 'some',
                      groupType: 'friends',
                      seniorGentleMode: false,
                      indoorPreference: true,
                    },
                    'Autonomous Weather Re-Plan Demo'
                  )
                }
                className="w-full py-2.5 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white font-extrabold text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <PlayCircle className="w-4 h-4" /> Run Rain Re-Plan
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Value Highlights */}
      <section className="max-w-5xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
              1
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Live Public Data Combined</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Integrates NEA Weather, LTA DataMall transit, OneMap routing, and data.gov.sg heritage locations into one single answer.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
            <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
              2
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Senior Citizen Accessible</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Extra large text controls, high contrast, gentle walking mode, and plain-English reasoning without complicated jargon.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
            <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
              3
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Autonomous Agent Monitoring</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Monitors weather radar and transport delays in real time. If conditions deteriorate, the agent proactively recommends better alternatives.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
