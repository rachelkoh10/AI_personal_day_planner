import React, { useState } from 'react';
import { AgentStep } from '../types';
import { ShieldCheck, Cpu, Database, Activity, CheckCircle, AlertTriangle, ChevronDown, ChevronUp, X } from 'lucide-react';

interface Props {
  steps: AgentStep[];
  isOpen: boolean;
  onClose: () => void;
}

export const AgentTelemetryDrawer: React.FC<Props> = ({ steps, isOpen, onClose }) => {
  const [expandedStepId, setExpandedStepId] = useState<string | null>(null);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[460px] bg-slate-950 text-white shadow-2xl border-l border-slate-800 flex flex-col animate-in slide-in-from-right duration-300">
      {/* Header */}
      <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/80">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold">
            <Cpu className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              AI Agent Telemetry
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
            </h2>
            <p className="text-xs text-slate-400">Professor Architecture Trace Panel</p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Architecture Loop Indicator */}
      <div className="p-4 bg-slate-900/40 border-b border-slate-800/80 text-xs text-slate-300 font-mono">
        <span className="text-indigo-400 font-bold block mb-1">AGENT LOOP EXECUTION:</span>
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-1 text-[11px] font-semibold text-slate-400">
          <span className="text-emerald-400">Perception</span> →
          <span className="text-blue-400">Data Tools</span> →
          <span className="text-amber-400">Reasoning</span> →
          <span className="text-purple-400">Optimize</span> →
          <span className="text-teal-400">Assembly</span> →
          <span className="text-indigo-400 font-bold">Monitor</span>
        </div>
      </div>

      {/* Steps List */}
      <div className="flex-1 overflow-y-auto p-5 space-y-4 font-mono text-xs">
        {steps.map((step, idx) => {
          const isExpanded = expandedStepId === step.id;
          return (
            <div
              key={step.id}
              className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-indigo-500/50 transition-all space-y-2"
            >
              <div
                onClick={() => setExpandedStepId(isExpanded ? null : step.id)}
                className="flex items-start justify-between cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-indigo-950 text-indigo-400 border border-indigo-800 text-[10px] flex items-center justify-center font-bold">
                    {idx + 1}
                  </span>
                  <div>
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-indigo-300 font-bold text-[10px]">
                      {step.phase}
                    </span>
                    {step.toolName && (
                      <span className="ml-2 text-emerald-400 font-bold">{step.toolName}</span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {step.status === 'success' ? (
                    <CheckCircle className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-amber-400" />
                  )}
                  {isExpanded ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                </div>
              </div>

              <p className="text-slate-200 font-sans text-xs leading-relaxed pl-7">
                {step.description}
              </p>

              {/* JSON Details */}
              {isExpanded && step.details && (
                <div className="pl-7 pt-2">
                  <pre className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-[11px] text-slate-300 overflow-x-auto">
                    {JSON.stringify(step.details, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer Info */}
      <div className="p-4 border-t border-slate-800 bg-slate-900/80 text-xs text-slate-400 text-center">
        🎓 Demonstrating tool calling, data adapter abstraction, and autonomous monitoring loops.
      </div>
    </div>
  );
};
