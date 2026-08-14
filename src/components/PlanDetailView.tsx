import React, { useState } from 'react';
import { TripPlan } from '../types';
import { Sparkles, Clock, DollarSign, Footprints, CloudRain, Bus, MapPin, Share2, Bookmark, HelpCircle, ShieldAlert, Check, RefreshCw, Layers, Map, List, ExternalLink, ArrowRight, Sun, Volume2 } from 'lucide-react';
import { MapView } from './MapView';
import { AdBanner } from './AdBanner';
import { DEFAULT_SPONSORED_ADS } from '../data/singaporeData';

interface Props {
  plan: TripPlan;
  onTweakPlan: (instruction: string) => void;
  onTriggerReplan: (reason: 'weather_rain' | 'transport_delay') => void;
  onSavePlan: (plan: TripPlan) => void;
  isReplanning: boolean;
  onOpenTelemetry: () => void;
}

export const PlanDetailView: React.FC<Props> = ({
  plan,
  onTweakPlan,
  onTriggerReplan,
  onSavePlan,
  isReplanning,
  onOpenTelemetry,
}) => {
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [showWhyModal, setShowWhyModal] = useState<boolean>(false);
  const [showShareModal, setShowShareModal] = useState<boolean>(false);
  const [isMonitoring, setIsMonitoring] = useState<boolean>(plan.monitoringActive);
  const [customTweakText, setCustomTweakText] = useState<string>('');
  const [isSaved, setIsSaved] = useState<boolean>(false);

  const handleShareWhatsApp = () => {
    const text = `🇸🇬 My Singapore Day Plan: ${plan.title}\nTime: ${plan.totalDurationMinutes} mins | Cost: S$${plan.totalCostEstimate}\n` +
      plan.items.map(item => `• ${item.startTime} - ${item.activity.name} (${item.activity.locationName})`).join('\n') +
      `\nCreated with AI Smart Day Planner Singapore`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">
      {/* Top Header Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold text-xs">
                Singapore AI Agent Plan
              </span>
              {plan.preferences.seniorGentleMode && (
                <span className="px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 font-bold text-xs">
                  👴 Gentle Mode
                </span>
              )}
            </div>
            <h1 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white">
              {plan.title}
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Location: {plan.preferences.location} • Created {plan.createdAt}
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setShowWhyModal(true)}
              className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold text-sm flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
            >
              <HelpCircle className="w-4 h-4" /> Why This Plan?
            </button>

            <button
              onClick={() => {
                onSavePlan(plan);
                setIsSaved(true);
              }}
              className={`px-4 py-2.5 rounded-xl font-bold text-sm flex items-center gap-1.5 border transition-all cursor-pointer ${
                isSaved
                  ? 'bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950 dark:text-emerald-200'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border-slate-300 dark:border-slate-700'
              }`}
            >
              <Bookmark className="w-4 h-4" /> {isSaved ? 'Saved!' : 'Save Plan'}
            </button>

            <button
              onClick={() => setShowShareModal(true)}
              className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-800 dark:text-slate-200 font-bold text-sm flex items-center gap-1.5 border border-slate-300 dark:border-slate-700 cursor-pointer"
            >
              <Share2 className="w-4 h-4" /> Share
            </button>
          </div>
        </div>

        {/* Plan Summary Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-emerald-600" /> Duration
            </span>
            <span className="text-xl font-black text-slate-900 dark:text-white mt-1 block">
              {Math.round(plan.totalDurationMinutes / 60)} hours
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1">
              <DollarSign className="w-3.5 h-3.5 text-emerald-600" /> Estimated Cost
            </span>
            <span className="text-xl font-black text-slate-900 dark:text-white mt-1 block">
              S${plan.totalCostEstimate}
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1">
              <Footprints className="w-3.5 h-3.5 text-emerald-600" /> Walking
            </span>
            <span className="text-xl font-black text-slate-900 dark:text-white mt-1 block">
              {plan.walkingLevel}
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1">
              <CloudRain className="w-3.5 h-3.5 text-amber-500" /> Weather Status
            </span>
            <span className="text-sm font-bold text-amber-700 dark:text-amber-300 mt-1 block">
              {plan.weatherStatus}
            </span>
          </div>
        </div>

        {/* Autonomous Agent Monitoring Control Bar */}
        <div className="p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div className={`w-3 h-3 rounded-full ${isMonitoring ? 'bg-emerald-500 animate-ping' : 'bg-slate-400'}`} />
            <div>
              <span className="font-bold text-indigo-950 dark:text-indigo-100 text-sm block">
                🤖 Autonomous Agent Monitoring: {isMonitoring ? 'ACTIVE' : 'PAUSED'}
              </span>
              <span className="text-xs text-indigo-800 dark:text-indigo-300">
                Listening to NEA Weather Radar & LTA Bus/MRT Delays
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onTriggerReplan('weather_rain')}
              disabled={isReplanning}
              className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs flex items-center gap-1 cursor-pointer"
              title="Simulate rain radar trigger to demonstrate autonomous replanning"
            >
              <CloudRain className="w-3.5 h-3.5" /> ☔ Simulate Rain
            </button>

            <button
              onClick={() => onTriggerReplan('transport_delay')}
              disabled={isReplanning}
              className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-1 cursor-pointer"
              title="Simulate transport delay trigger"
            >
              <Bus className="w-3.5 h-3.5" /> 🚌 Simulate Delay
            </button>
          </div>
        </div>
      </div>

      {/* Quick Modification Bar */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Quick AI Plan Tweaks
        </span>
        <div className="flex items-center gap-2 flex-wrap">
          {[
            'Make it cheaper',
            'Less walking',
            'More food & snacks',
            'Indoor air-con only',
            'Add something for grandchildren',
            'Make it romantic',
          ].map((tweak) => (
            <button
              key={tweak}
              onClick={() => onTweakPlan(tweak)}
              disabled={isReplanning}
              className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-emerald-950 hover:text-emerald-700 dark:hover:text-emerald-300 text-slate-700 dark:text-slate-300 font-semibold text-xs border border-slate-200 dark:border-slate-700 transition-all cursor-pointer"
            >
              {tweak}
            </button>
          ))}
        </div>

        <div className="flex gap-2 pt-1">
          <input
            type="text"
            value={customTweakText}
            onChange={(e) => setCustomTweakText(e.target.value)}
            placeholder='Custom instruction e.g., "Change lunch to halal hawker food"'
            className="flex-1 px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm text-slate-900 dark:text-white"
          />
          <button
            onClick={() => {
              if (customTweakText) {
                onTweakPlan(customTweakText);
                setCustomTweakText('');
              }
            }}
            disabled={isReplanning}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm cursor-pointer"
          >
            Apply
          </button>
        </div>
      </div>

      {/* List / Map View Toggle */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
          Itinerary Timeline
        </h2>
        <div className="flex items-center bg-slate-200 dark:bg-slate-800 p-1 rounded-xl">
          <button
            onClick={() => setViewMode('list')}
            className={`px-3 py-1.5 rounded-lg font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
              viewMode === 'list' ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm' : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            <List className="w-4 h-4" /> Timeline List
          </button>
          <button
            onClick={() => setViewMode('map')}
            className={`px-3 py-1.5 rounded-lg font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
              viewMode === 'map' ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm' : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            <Map className="w-4 h-4" /> Singapore Map View
          </button>
        </div>
      </div>

      {/* View Content: Map or Timeline List */}
      {viewMode === 'map' ? (
        <MapView items={plan.items} />
      ) : (
        <div className="space-y-6">
          {plan.items.map((item, idx) => (
            <div key={item.id} className="relative pl-6 sm:pl-8 border-l-2 border-emerald-500 space-y-3">
              {/* Timeline Time Dot */}
              <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-emerald-600 ring-4 ring-emerald-100 dark:ring-emerald-950" />

              {/* Activity Card */}
              <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-md space-y-3">
                <div className="flex items-start justify-between flex-wrap gap-2">
                  <div>
                    <span className="text-xs font-black text-emerald-600 dark:text-emerald-400 tracking-wider uppercase">
                      {item.startTime} — {item.endTime}
                    </span>
                    <h3 className="text-xl font-extrabold text-slate-900 dark:text-white mt-0.5">
                      {item.activity.name}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" /> {item.activity.locationName}
                    </p>
                  </div>

                  <div className="text-right">
                    <span className="text-lg font-black text-slate-900 dark:text-white">
                      {item.activity.estimatedCostMax === 0 ? 'Free' : `S$${item.activity.estimatedCostMin} - S$${item.activity.estimatedCostMax}`}
                    </span>
                    <span className="block text-xs text-slate-500 dark:text-slate-400">
                      {item.activity.isIndoor ? '🏬 Air-Con Indoor' : '🌿 Outdoor'}
                    </span>
                  </div>
                </div>

                <p className="text-sm text-slate-700 dark:text-slate-300">
                  {item.activity.description}
                </p>

                {/* Badges & Accessibility Details */}
                <div className="flex items-center gap-2 flex-wrap text-xs pt-1">
                  {item.activity.seniorFriendly && (
                    <span className="px-2.5 py-1 rounded-lg bg-amber-50 dark:bg-amber-950 text-amber-800 dark:text-amber-200 font-bold border border-amber-200 dark:border-amber-800">
                      👴 Senior Friendly (Seating Every 30m)
                    </span>
                  )}
                  {item.activity.wheelchairAccessible && (
                    <span className="px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-950 text-blue-800 dark:text-blue-200 font-bold border border-blue-200 dark:border-blue-800">
                      ♿ Wheelchair Ramps
                    </span>
                  )}
                  <span className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-semibold">
                    ⏱ {item.activity.durationMinutes} mins stay
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-semibold">
                    🚶 {item.activity.walkingDistanceMeters}m walk
                  </span>
                </div>

                {/* Rain Backup Note if Outdoor */}
                {item.indoorBackupPlan && (
                  <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-xs text-amber-900 dark:text-amber-200">
                    <span className="font-bold">☔ Weather Backup Plan: </span> {item.indoorBackupPlan}
                  </div>
                )}
              </div>

              {/* Transit Connection to Next Stop */}
              {item.transitToNext && (
                <div className="my-2 py-2 px-4 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
                  <div className="flex items-center gap-2">
                    <Bus className="w-4 h-4 text-emerald-600" />
                    <span>{item.transitToNext.details}</span>
                  </div>
                  <span>
                    ⏱ {item.transitToNext.durationMinutes} mins • {item.transitToNext.costEstimate === 0 ? 'Free' : `S$${item.transitToNext.costEstimate}`}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Sponsored Ad Banner */}
      <AdBanner offer={DEFAULT_SPONSORED_ADS[0]} />

      {/* "Why This Plan?" Modal Drawer */}
      {showWhyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-6 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
              <h2 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                <HelpCircle className="w-6 h-6 text-amber-500" /> Why This Plan?
              </h2>
              <button
                onClick={() => setShowWhyModal(false)}
                className="text-slate-400 hover:text-slate-900 dark:hover:text-white text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-sm text-slate-700 dark:text-slate-300">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1">
                <h4 className="font-bold text-slate-900 dark:text-white">💰 Budget Optimization</h4>
                <p>{plan.reasoning.budgetExplanation}</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1">
                <h4 className="font-bold text-slate-900 dark:text-white">⏱ Time Management</h4>
                <p>{plan.reasoning.timeExplanation}</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1">
                <h4 className="font-bold text-slate-900 dark:text-white">🚶 Walking & Accessibility</h4>
                <p>{plan.reasoning.walkingExplanation}</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1">
                <h4 className="font-bold text-slate-900 dark:text-white">🌦 Weather Adaptation</h4>
                <p>{plan.reasoning.weatherExplanation}</p>
              </div>

              {/* Data Sources Attribution List */}
              <div className="pt-2 space-y-2">
                <h4 className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider">
                  Verified Data Sources Used
                </h4>
                <div className="flex flex-wrap gap-2">
                  {plan.sources.map((src) => (
                    <span
                      key={src.name}
                      className="px-3 py-1 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-xs font-semibold border border-emerald-200 dark:border-emerald-800 flex items-center gap-1"
                    >
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      {src.name}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowWhyModal(false)}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl"
            >
              Close Explanation
            </button>
          </div>
        </div>
      )}

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Share Your Itinerary</h3>
            <p className="text-xs text-slate-500">Send your day plan directly to family, friends, or WhatsApp.</p>

            <button
              onClick={handleShareWhatsApp}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl flex items-center justify-center gap-2 cursor-pointer"
            >
              Share via WhatsApp
            </button>

            <button
              onClick={() => setShowShareModal(false)}
              className="w-full py-3 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold rounded-xl cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
