import React, { useState } from 'react';
import { SINGAPORE_PLACES } from '../data/singaporeData';
import { ActivityCategory } from '../types';
import { Search, MapPin, Star, Clock, Filter, Check, HeartHandshake } from 'lucide-react';

export const ExploreView: React.FC = () => {
  const [selectedArea, setSelectedArea] = useState<string>('All');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredPlaces = SINGAPORE_PLACES.filter((place) => {
    if (selectedArea !== 'All' && place.area !== selectedArea) return false;
    if (selectedCategory !== 'All' && place.category !== selectedCategory) return false;
    if (
      searchQuery &&
      !place.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !place.description.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-black text-slate-900 dark:text-white">
           Explore Singapore Places
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Curated database of hawker stalls, heritage sites, gardens, and air-conditioned spots.
        </p>
      </div>

      {/* Filter Bar */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
        <div className="relative">
          <Search className="w-5 h-5 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search places e.g., Sultan Mosque, Chicken Rice, Flower Dome..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm text-slate-900 dark:text-white"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 text-xs">
          <span className="font-bold text-slate-500 whitespace-nowrap">Category:</span>
          {['All', 'food', 'culture', 'nature', 'shopping', 'relaxing'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
              }`}
            >
              {cat === 'All' ? 'All Categories' : cat.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Places Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredPlaces.map((place) => (
          <div
            key={place.id}
            className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow space-y-3"
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                  {place.area}
                </span>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-0.5">
                  {place.name}
                </h3>
              </div>
              <span className="text-sm font-black text-slate-900 dark:text-white">
                {place.estimatedCostMax === 0 ? 'Free' : `S$${place.estimatedCostMin}-${place.estimatedCostMax}`}
              </span>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              {place.description}
            </p>

            <div className="flex items-center gap-2 flex-wrap text-xs pt-1">
              {place.seniorFriendly && (
                <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-200 font-bold">
                  👴 Senior Friendly
                </span>
              )}
              <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                {place.isIndoor ? '🏬 Air-Con Indoor' : '🌿 Outdoor'}
              </span>
              <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                ⏱ {place.durationMinutes} mins
              </span>
              <span className="px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-semibold">
                ★ {place.rating}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
