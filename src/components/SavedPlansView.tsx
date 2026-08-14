import React from 'react';
import { TripPlan } from '../types';
import { FolderHeart, Play, Trash2, Share2, Clock, DollarSign, Calendar } from 'lucide-react';

interface Props {
  savedPlans: TripPlan[];
  onSelectPlan: (plan: TripPlan) => void;
  onDeletePlan: (planId: string) => void;
  onOpenPlanner: () => void;
}

export const SavedPlansView: React.FC<Props> = ({
  savedPlans,
  onSelectPlan,
  onDeletePlan,
  onOpenPlanner,
}) => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <FolderHeart className="w-7 h-7 text-emerald-600" /> My Saved Day Plans
          </h1>
          <p className="text-xs text-slate-500">Access your saved itineraries anytime</p>
        </div>

        <button
          onClick={onOpenPlanner}
          className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold text-sm cursor-pointer"
        >
          + Plan New Day
        </button>
      </div>

      {savedPlans.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-10 text-center border border-slate-200 dark:border-slate-800 space-y-3">
          <p className="text-slate-500 text-sm font-semibold">No saved day plans yet.</p>
          <button
            onClick={onOpenPlanner}
            className="px-6 py-3 rounded-xl bg-emerald-600 text-white font-bold text-sm"
          >
            Create First Plan
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {savedPlans.map((plan) => (
            <div
              key={plan.id}
              className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between flex-wrap gap-4"
            >
              <div>
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                  {plan.createdAt} • {plan.preferences.location}
                </span>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-0.5">
                  {plan.title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  {plan.items.length} Activities • S${plan.totalCostEstimate} • {plan.walkingLevel} Walking
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => onSelectPlan(plan)}
                  className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs flex items-center gap-1 cursor-pointer"
                >
                  <Play className="w-3.5 h-3.5" /> View Plan
                </button>
                <button
                  onClick={() => onDeletePlan(plan.id)}
                  className="p-2 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-950 dark:text-red-300 font-bold text-xs cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
