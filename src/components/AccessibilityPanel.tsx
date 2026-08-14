import React from 'react';
import { AccessibilitySettings } from '../types';
import { Type, Eye, Activity, Sun, Moon, Check, X } from 'lucide-react';

interface Props {
  settings: AccessibilitySettings;
  onUpdate: (newSettings: Partial<AccessibilitySettings>) => void;
  onClose: () => void;
}

export const AccessibilityPanel: React.FC<Props> = ({ settings, onUpdate, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 animate-in fade-in zoom-in duration-200">
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <Eye className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Accessibility & Display Settings
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
            aria-label="Close settings"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-6 py-4 max-h-[75vh] overflow-y-auto">
          {/* Senior Easy Mode Master Toggle */}
          <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-sm font-semibold uppercase tracking-wider text-amber-800 dark:text-amber-300">
                  Senior Citizen Recommendation
                </span>
                <h3 className="text-lg font-bold text-amber-950 dark:text-amber-100">
                  👴 Gentle Day Mode
                </h3>
                <p className="text-sm text-amber-800/80 dark:text-amber-200/80 mt-1">
                  Prioritizes short walking (under 250m), frequent seating, longer breaks, and simple transport.
                </p>
              </div>
              <button
                onClick={() => onUpdate({ seniorEasyMode: !settings.seniorEasyMode })}
                className={`px-4 py-2 rounded-xl font-bold text-sm transition-all ${
                  settings.seniorEasyMode
                    ? 'bg-amber-600 text-white shadow-md'
                    : 'bg-slate-200 text-slate-800 dark:bg-slate-800 dark:text-slate-200'
                }`}
              >
                {settings.seniorEasyMode ? 'Enabled' : 'Disabled'}
              </button>
            </div>
          </div>

          {/* Text Size */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
              <Type className="w-4 h-4" /> Text Size
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { key: 'normal', label: 'Normal (16px)' },
                { key: 'large', label: 'Large (18px)' },
                { key: 'extra-large', label: 'Extra Large (20px)' },
              ].map((item) => (
                <button
                  key={item.key}
                  onClick={() => onUpdate({ textSize: item.key as any })}
                  className={`p-3 rounded-xl border text-center font-medium text-sm transition-all ${
                    settings.textSize === item.key
                      ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-900 dark:text-emerald-200 font-bold'
                      : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Contrast */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
              <Eye className="w-4 h-4" /> Visual Contrast
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { key: 'standard', label: 'Standard Contrast' },
                { key: 'high-contrast', label: 'High Contrast (WCAG AAA)' },
              ].map((item) => (
                <button
                  key={item.key}
                  onClick={() => onUpdate({ contrast: item.key as any })}
                  className={`p-3 rounded-xl border text-center font-medium text-sm transition-all ${
                    settings.contrast === item.key
                      ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-900 dark:text-emerald-200 font-bold'
                      : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Motion */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
              <Activity className="w-4 h-4" /> Animations & Motion
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { key: 'normal', label: 'Standard Animations' },
                { key: 'reduced', label: 'Reduced Motion' },
              ].map((item) => (
                <button
                  key={item.key}
                  onClick={() => onUpdate({ motion: item.key as any })}
                  className={`p-3 rounded-xl border text-center font-medium text-sm transition-all ${
                    settings.motion === item.key
                      ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-900 dark:text-emerald-200 font-bold'
                      : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Color Mode */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
              <Sun className="w-4 h-4" /> Display Mode
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { key: 'light', label: 'Light Mode', icon: Sun },
                { key: 'dark', label: 'Dark Mode', icon: Moon },
              ].map((item) => (
                <button
                  key={item.key}
                  onClick={() => onUpdate({ displayMode: item.key as any })}
                  className={`p-3 rounded-xl border text-center font-medium text-sm flex items-center justify-center gap-2 transition-all ${
                    settings.displayMode === item.key
                      ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-900 dark:text-emerald-200 font-bold'
                      : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
          <button
            onClick={onClose}
            className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
          >
            <Check className="w-5 h-5" /> Save Preferences
          </button>
        </div>
      </div>
    </div>
  );
};
