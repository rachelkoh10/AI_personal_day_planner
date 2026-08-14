import React from 'react';
import { AdOffer } from '../types';
import { Tag, ExternalLink } from 'lucide-react';

interface Props {
  offer: AdOffer;
}

export const AdBanner: React.FC<Props> = ({ offer }) => {
  return (
    <div className="p-5 rounded-2xl bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 flex items-center justify-between flex-wrap gap-4 shadow-sm">
      <div className="space-y-1 max-w-xl">
        <div className="flex items-center gap-2">
          <span className="bg-amber-200 text-amber-900 dark:bg-amber-900 dark:text-amber-200 text-[10px] font-black uppercase px-2 py-0.5 rounded tracking-wider">
            SPONSORED RECOMMENDATION
          </span>
          <span className="text-xs font-bold text-amber-800 dark:text-amber-300">
            {offer.advertiserName}
          </span>
        </div>

        <h4 className="text-base font-bold text-slate-900 dark:text-white">
          {offer.title}
        </h4>
        <p className="text-xs text-slate-600 dark:text-slate-300">
          {offer.description}
        </p>
      </div>

      <div className="flex items-center gap-3">
        <span className="px-3 py-1.5 rounded-xl bg-amber-600 text-white font-extrabold text-xs">
          {offer.discountBadge}
        </span>
        <button className="px-4 py-2 rounded-xl bg-slate-900 text-white dark:bg-white dark:text-slate-900 font-bold text-xs flex items-center gap-1 cursor-pointer">
          {offer.ctaText} <ExternalLink className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
