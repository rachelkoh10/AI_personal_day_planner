import React, { useState } from 'react';
import { ItineraryItem } from '../types';
import { MapPin, Info, Navigation, ExternalLink } from 'lucide-react';

interface Props {
  items: ItineraryItem[];
}

export const MapView: React.FC<Props> = ({ items }) => {
  const [selectedItem, setSelectedItem] = useState<ItineraryItem | null>(items[0] || null);

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <MapPin className="w-5 h-5 text-emerald-600" /> Interactive Singapore Day Map
          </h3>
          <p className="text-xs text-slate-500">
            Click on activity markers to view location details & transit route
          </p>
        </div>
      </div>

      {/* SVG Singapore Map Representation */}
      <div className="relative w-full h-[360px] bg-slate-100 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex items-center justify-center">
        {/* Singapore Outline SVG Backdrop */}
        <svg viewBox="0 0 800 450" className="w-full h-full opacity-30 dark:opacity-20 stroke-slate-400 fill-slate-200 dark:fill-slate-800">
          {/* Main Singapore Island */}
          <path d="M 120 220 Q 200 120 400 130 Q 650 120 720 210 Q 750 280 620 330 Q 400 370 220 340 Q 100 300 120 220 Z" />
          {/* Sentosa Island */}
          <path d="M 360 380 Q 420 370 450 390 Q 410 410 360 380 Z" />
        </svg>

        {/* Connecting Route Line */}
        <svg viewBox="0 0 800 450" className="absolute inset-0 w-full h-full pointer-events-none">
          <polyline
            points="380,240 420,220 410,260 460,280"
            fill="none"
            stroke="#10b981"
            strokeWidth="3"
            strokeDasharray="6,6"
          />
        </svg>

        {/* Activity Markers */}
        {items.map((item, idx) => {
          // Calculate positions for demo SG map
          const posX = 380 + idx * 30;
          const posY = 220 + (idx % 2 === 0 ? idx * 20 : -idx * 15);
          const isSelected = selectedItem?.id === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setSelectedItem(item)}
              style={{ left: `${(posX / 800) * 100}%`, top: `${(posY / 450) * 100}%` }}
              className={`absolute -translate-x-1/2 -translate-y-1/2 p-2 rounded-full font-black text-xs shadow-lg transition-all cursor-pointer flex items-center gap-1 ${
                isSelected
                  ? 'bg-emerald-600 text-white ring-4 ring-emerald-300 dark:ring-emerald-900 scale-125 z-20'
                  : 'bg-white text-slate-900 dark:bg-slate-800 dark:text-white hover:scale-110 z-10'
              }`}
            >
              <span className="w-5 h-5 rounded-full bg-slate-900 text-white flex items-center justify-center text-[10px]">
                {idx + 1}
              </span>
              <span className="hidden sm:inline text-[11px] max-w-[100px] truncate">
                {item.activity.name}
              </span>
            </button>
          );
        })}
      </div>

      {/* Selected Marker Detail Drawer */}
      {selectedItem && (
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex items-start justify-between gap-4">
          <div>
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
              {selectedItem.startTime} — {selectedItem.activity.area}
            </span>
            <h4 className="text-base font-bold text-slate-900 dark:text-white mt-0.5">
              {selectedItem.activity.name}
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
              {selectedItem.activity.description}
            </p>
          </div>

          <a
            href={`https://www.onemap.gov.sg/main/v2/?lat=${selectedItem.activity.coordinates.lat}&lng=${selectedItem.activity.coordinates.lng}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs flex items-center gap-1.5 whitespace-nowrap cursor-pointer hover:bg-emerald-700"
          >
            OneMap Directions <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      )}
    </div>
  );
};
