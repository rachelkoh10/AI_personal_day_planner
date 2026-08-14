import React, { useState } from 'react';
import { SINGAPORE_LOCATIONS } from '../data/singaporeData';
import { ActivityCategory, BudgetTier, GroupType, TimeAvailable, UserPreferences, WalkingComfort } from '../types';
import { MapPin, Clock, DollarSign, HeartHandshake, Mic, Sparkles, Navigation, Check, ChevronRight } from 'lucide-react';

interface Props {
  initialPreferences?: Partial<UserPreferences>;
  onSubmit: (prefs: UserPreferences, customPrompt?: string) => void;
  isLoading: boolean;
  seniorGentleMode: boolean;
}

export const PlannerForm: React.FC<Props> = ({
  initialPreferences,
  onSubmit,
  isLoading,
  seniorGentleMode,
}) => {
  const [location, setLocation] = useState<string>(initialPreferences?.location || SINGAPORE_LOCATIONS[0]);
  const [timeAvailable, setTimeAvailable] = useState<TimeAvailable>(initialPreferences?.timeAvailable || '3h');
  const [budgetTier, setBudgetTier] = useState<BudgetTier>(initialPreferences?.budgetTier || 'under_50');
  const [categories, setCategories] = useState<ActivityCategory[]>(initialPreferences?.categories || ['food', 'relaxing']);
  const [walkingComfort, setWalkingComfort] = useState<WalkingComfort>(initialPreferences?.walkingComfort || 'very_little');
  const [groupType, setGroupType] = useState<GroupType>(initialPreferences?.groupType || 'solo');
  const [gentleMode, setGentleMode] = useState<boolean>(initialPreferences?.seniorGentleMode ?? seniorGentleMode);

  // Voice Input State
  const [isListening, setIsListening] = useState<boolean>(false);
  const [voiceText, setVoiceText] = useState<string>('');
  const [showVoiceModal, setShowVoiceModal] = useState<boolean>(false);

  const toggleCategory = (cat: ActivityCategory) => {
    if (categories.includes(cat)) {
      if (categories.length > 1) {
        setCategories(categories.filter((c) => c !== cat));
      }
    } else {
      setCategories([...categories, cat]);
    }
  };

  const handleUseMyLocation = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        () => {
          setLocation('Bugis & Kampong Glam');
        },
        () => {
          setLocation('Bugis & Kampong Glam');
        }
      );
    } else {
      setLocation('Bugis & Kampong Glam');
    }
  };

  const startVoiceInput = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      setShowVoiceModal(true);
      return;
    }

    try {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.lang = 'en-SG';
      recognition.interimResults = false;

      setIsListening(true);
      setShowVoiceModal(true);

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setVoiceText(transcript);
        setIsListening(false);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch {
      setShowVoiceModal(true);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const prefs: UserPreferences = {
      location,
      timeAvailable,
      budgetTier,
      categories,
      walkingComfort,
      groupType,
      seniorGentleMode: gentleMode,
    };
    onSubmit(prefs, voiceText || undefined);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <form onSubmit={handleFormSubmit} className="space-y-8 bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-xl">
        {/* Form Title */}
        <div className="flex items-center justify-between flex-wrap gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              Tell us your preferences
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Select what you need, or use voice input to describe your ideal day in Singapore.
            </p>
          </div>

          <button
            type="button"
            onClick={startVoiceInput}
            className="px-4 py-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-sm flex items-center gap-2 border border-slate-300 dark:border-slate-700 transition-all cursor-pointer"
          >
            <Mic className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <span>🎤 Tell Me What You Want</span>
          </button>
        </div>

        {/* Step 1: Location */}
        <div className="space-y-3">
          <label className="flex items-center justify-between text-base font-bold text-slate-900 dark:text-white">
            <span className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-xs flex items-center justify-center font-bold">1</span>
              Where are you in Singapore?
            </span>
            <button
              type="button"
              onClick={handleUseMyLocation}
              className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <Navigation className="w-3.5 h-3.5" /> Use My Location
            </button>
          </label>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {SINGAPORE_LOCATIONS.map((loc) => (
              <button
                key={loc}
                type="button"
                onClick={() => setLocation(loc)}
                className={`p-3 rounded-xl border text-left text-sm font-semibold transition-all cursor-pointer ${
                  location === loc
                    ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-900 dark:text-emerald-200 shadow-sm'
                    : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                {loc}
              </button>
            ))}
          </div>
        </div>

        {/* Step 2: Time Available */}
        <div className="space-y-3">
          <label className="block text-base font-bold text-slate-900 dark:text-white">
            <span className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-xs flex items-center justify-center font-bold">2</span>
              How much time do you have?
            </span>
          </label>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
            {[
              { key: '30m', label: '30 mins' },
              { key: '1h', label: '1 hour' },
              { key: '2h', label: '2 hours' },
              { key: '3h', label: '3 hours' },
              { key: 'half_day', label: 'Half Day (4-5h)' },
              { key: 'full_day', label: 'Full Day' },
            ].map((time) => (
              <button
                key={time.key}
                type="button"
                onClick={() => setTimeAvailable(time.key as TimeAvailable)}
                className={`p-3 rounded-xl border text-center text-sm font-bold transition-all cursor-pointer ${
                  timeAvailable === time.key
                    ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-900 dark:text-emerald-200 shadow-sm'
                    : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                {time.label}
              </button>
            ))}
          </div>
        </div>

        {/* Step 3: Budget */}
        <div className="space-y-3">
          <label className="block text-base font-bold text-slate-900 dark:text-white">
            <span className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-xs flex items-center justify-center font-bold">3</span>
              What is your budget limit?
            </span>
          </label>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              { key: 'free', label: 'Free Activities' },
              { key: 'under_20', label: 'Under S$20' },
              { key: 'under_50', label: 'Under S$50' },
              { key: 'under_100', label: 'Under S$100' },
            ].map((b) => (
              <button
                key={b.key}
                type="button"
                onClick={() => setBudgetTier(b.key as BudgetTier)}
                className={`p-3 rounded-xl border text-center text-sm font-bold transition-all cursor-pointer ${
                  budgetTier === b.key
                    ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-900 dark:text-emerald-200 shadow-sm'
                    : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                {b.label}
              </button>
            ))}
          </div>
        </div>

        {/* Step 4: Categories */}
        <div className="space-y-3">
          <label className="block text-base font-bold text-slate-900 dark:text-white">
            <span className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-xs flex items-center justify-center font-bold">4</span>
              What do you feel like doing? (Select multiple)
            </span>
          </label>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              { key: 'food', label: '🍜 Food & Hawker' },
              { key: 'relaxing', label: '☕ Relaxing & Cafe' },
              { key: 'nature', label: '🌿 Parks & Gardens' },
              { key: 'culture', label: '🏛 Culture & Museums' },
              { key: 'shopping', label: '🛍 Shopping & Mall' },
              { key: 'walking', label: '🚶 Sightseeing' },
              { key: 'indoor', label: '🏬 Indoor Air-Con' },
              { key: 'family', label: '👨‍👩‍👧 Family Friendly' },
            ].map((cat) => {
              const isSelected = categories.includes(cat.key as ActivityCategory);
              return (
                <button
                  key={cat.key}
                  type="button"
                  onClick={() => toggleCategory(cat.key as ActivityCategory)}
                  className={`p-3 rounded-xl border text-left text-sm font-semibold transition-all flex items-center justify-between cursor-pointer ${
                    isSelected
                      ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-900 dark:text-emerald-200 font-bold'
                      : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  <span>{cat.label}</span>
                  {isSelected && <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Step 5: Walking Comfort */}
        <div className="space-y-3">
          <label className="block text-base font-bold text-slate-900 dark:text-white">
            <span className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-xs flex items-center justify-center font-bold">5</span>
              How much walking is comfortable?
            </span>
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {[
              { key: 'very_little', label: 'Very Little Walking (Under 250m)', desc: 'Ideal for seniors or hot days' },
              { key: 'some', label: 'Some Walking (Moderate)', desc: 'Casual strolls with seating' },
              { key: 'happy', label: 'Happy to Walk', desc: 'Sustained walks and parks' },
            ].map((w) => (
              <button
                key={w.key}
                type="button"
                onClick={() => setWalkingComfort(w.key as WalkingComfort)}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  walkingComfort === w.key
                    ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-900 dark:text-emerald-200 font-bold'
                    : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                <div className="text-sm">{w.label}</div>
                <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{w.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Gentle Mode Quick Card */}
        <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 flex items-center justify-between flex-wrap gap-3">
          <div>
            <span className="font-bold text-amber-950 dark:text-amber-100 text-base">👴 Senior Citizen Gentle Mode</span>
            <p className="text-xs text-amber-800 dark:text-amber-200">Automatically caps walking, ensures frequent seating, and selects covered pathways.</p>
          </div>
          <button
            type="button"
            onClick={() => setGentleMode(!gentleMode)}
            className={`px-4 py-2 rounded-xl font-bold text-sm transition-all cursor-pointer ${
              gentleMode ? 'bg-amber-600 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
            }`}
          >
            {gentleMode ? 'Enabled' : 'Disabled'}
          </button>
        </div>

        {/* Action Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-xl font-black shadow-xl shadow-emerald-600/30 transition-all flex items-center justify-center gap-3 cursor-pointer disabled:opacity-50"
        >
          {isLoading ? (
            <span>Generating Plan with AI Agent...</span>
          ) : (
            <>
              <Sparkles className="w-7 h-7 text-amber-300" />
              <span>✨ Create My Day Plan</span>
            </>
          )}
        </button>
      </form>

      {/* Voice Input Dialog */}
      {showVoiceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Mic className="w-6 h-6 text-emerald-600" /> Tell Me What You Want
            </h3>

            {isListening ? (
              <div className="p-6 text-center space-y-2">
                <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center mx-auto animate-pulse">
                  <Mic className="w-8 h-8" />
                </div>
                <p className="text-sm font-semibold text-emerald-600">Listening to your voice...</p>
                <p className="text-xs text-slate-500">Speak clearly e.g., "I have 3 hours around Bugis, budget $40, low walking."</p>
              </div>
            ) : (
              <div className="space-y-3">
                <textarea
                  value={voiceText}
                  onChange={(e) => setVoiceText(e.target.value)}
                  placeholder='e.g., "I have 4 hours free near Bugis, $50 budget, low walking, want food and something relaxing."'
                  className="w-full h-32 p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm text-slate-900 dark:text-white"
                />
              </div>
            )}

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setShowVoiceModal(false)}
                className="flex-1 py-3 rounded-xl border border-slate-300 dark:border-slate-700 font-bold text-sm"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowVoiceModal(false);
                }}
                className="flex-1 py-3 rounded-xl bg-emerald-600 text-white font-bold text-sm"
              >
                Use Speech Input
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
