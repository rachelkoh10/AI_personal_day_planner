import React from 'react';
import { SubscriptionTier, UserSubscription } from '../types';
import { Sparkles, Check, X, ShieldCheck, Zap } from 'lucide-react';

interface Props {
  subscription: UserSubscription;
  onSelectTier: (tier: SubscriptionTier) => void;
  onClose: () => void;
}

export const SubscriptionModal: React.FC<Props> = ({ subscription, onSelectTier, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
          <div>
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
              SaaS Subscription Plans
            </span>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white">
              Upgrade Your Singapore Day Planner
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-900 dark:hover:text-white text-lg font-bold"
          >
            ✕
          </button>
        </div>

        {/* Current Usage Banner */}
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex items-center justify-between text-xs">
          <div>
            <span className="font-bold text-emerald-900 dark:text-emerald-200">
              Current Active Plan: {subscription.tier.toUpperCase()}
            </span>
            <p className="text-emerald-700 dark:text-emerald-300">
              Plans Used This Month: {subscription.plansUsedThisMonth} / {subscription.tier === 'free' ? '5' : 'Unlimited'}
            </p>
          </div>
          <span className="bg-emerald-600 text-white font-bold px-3 py-1 rounded-full text-[10px]">
            Server Tracked
          </span>
        </div>

        {/* Tiers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* FREE */}
          <div className="bg-slate-50 dark:bg-slate-800/60 rounded-2xl p-5 border border-slate-200 dark:border-slate-700 flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">FREE</span>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white">S$0</h3>
              <ul className="text-xs text-slate-600 dark:text-slate-300 space-y-2">
                <li className="flex items-center gap-1.5"><Check className="w-4 h-4 text-emerald-500" /> 5 AI Plans per month</li>
                <li className="flex items-center gap-1.5"><Check className="w-4 h-4 text-emerald-500" /> Public Data Weather</li>
                <li className="flex items-center gap-1.5"><Check className="w-4 h-4 text-emerald-500" /> Standard Senior Mode</li>
                <li className="flex items-center gap-1.5 text-slate-400"><X className="w-4 h-4" /> Ads Displayed</li>
              </ul>
            </div>
            <button
              onClick={() => onSelectTier('free')}
              className={`w-full py-2.5 rounded-xl font-bold text-xs cursor-pointer ${
                subscription.tier === 'free'
                  ? 'bg-slate-300 text-slate-800'
                  : 'bg-slate-200 hover:bg-slate-300 text-slate-900'
              }`}
            >
              {subscription.tier === 'free' ? 'Current Tier' : 'Downgrade to Free'}
            </button>
          </div>

          {/* PLUS */}
          <div className="bg-slate-50 dark:bg-slate-800/60 rounded-2xl p-5 border-2 border-emerald-500 flex flex-col justify-between space-y-4 relative shadow-md">
            <span className="absolute -top-3 right-4 bg-emerald-600 text-white text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase">
              POPULAR
            </span>
            <div className="space-y-3">
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">PLUS</span>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white">S$4.99 <span className="text-xs font-normal">/mo</span></h3>
              <ul className="text-xs text-slate-600 dark:text-slate-300 space-y-2">
                <li className="flex items-center gap-1.5"><Check className="w-4 h-4 text-emerald-500" /> 50 AI Plans per month</li>
                <li className="flex items-center gap-1.5"><Check className="w-4 h-4 text-emerald-500" /> No Advertisements</li>
                <li className="flex items-center gap-1.5"><Check className="w-4 h-4 text-emerald-500" /> Voice Input Planning</li>
                <li className="flex items-center gap-1.5"><Check className="w-4 h-4 text-emerald-500" /> Budget Optimization</li>
              </ul>
            </div>
            <button
              onClick={() => onSelectTier('plus')}
              className={`w-full py-2.5 rounded-xl font-bold text-xs cursor-pointer ${
                subscription.tier === 'plus'
                  ? 'bg-emerald-700 text-white'
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-md'
              }`}
            >
              {subscription.tier === 'plus' ? 'Current Tier' : 'Subscribe to Plus'}
            </button>
          </div>

          {/* PREMIUM */}
          <div className="bg-slate-900 text-white rounded-2xl p-5 border border-indigo-500 flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">PREMIUM</span>
              <h3 className="text-2xl font-black text-white">S$9.99 <span className="text-xs font-normal">/mo</span></h3>
              <ul className="text-xs text-slate-300 space-y-2">
                <li className="flex items-center gap-1.5"><Check className="w-4 h-4 text-indigo-400" /> Unlimited AI Plans</li>
                <li className="flex items-center gap-1.5"><Check className="w-4 h-4 text-indigo-400" /> Autonomous Monitoring</li>
                <li className="flex items-center gap-1.5"><Check className="w-4 h-4 text-indigo-400" /> Auto-Replanning Engine</li>
                <li className="flex items-center gap-1.5"><Check className="w-4 h-4 text-indigo-400" /> Priority Server AI Access</li>
              </ul>
            </div>
            <button
              onClick={() => onSelectTier('premium')}
              className={`w-full py-2.5 rounded-xl font-bold text-xs cursor-pointer ${
                subscription.tier === 'premium'
                  ? 'bg-indigo-800 text-white'
                  : 'bg-indigo-600 hover:bg-indigo-700 text-white'
              }`}
            >
              {subscription.tier === 'premium' ? 'Current Tier' : 'Upgrade to Premium'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
