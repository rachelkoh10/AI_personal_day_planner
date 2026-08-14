import React, { useEffect } from 'react';
import { MessageSquare } from 'lucide-react';

export const DisqusThread: React.FC = () => {
  useEffect(() => {
    // Check if Disqus script already exists
    const existingScript = document.getElementById('disqus-embed-script');
    if (!existingScript) {
      const d = document;
      const s = d.createElement('script');
      s.id = 'disqus-embed-script';
      s.src = 'https://ai-smart-day-planner.disqus.com/embed.js';
      s.setAttribute('data-timestamp', (+new Date()).toString());
      (d.head || d.body).appendChild(s);
    } else if ((window as any).DISQUS) {
      // Reload Disqus if already initialized
      try {
        (window as any).DISQUS.reset({ reload: true });
      } catch (e) {
        console.log('Disqus reset notice:', e);
      }
    }
  }, []);

  return (
    <section className="max-w-5xl mx-auto px-4 my-12 border-t border-slate-200 dark:border-slate-800 pt-10 space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 flex items-center justify-center font-bold">
          <MessageSquare className="w-5 h-5 text-emerald-600" />
        </div>
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
            Community Discussion Forum
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Share recommendations, ask itinerary questions, and connect with Singapore day planners!
          </p>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-xl min-h-[250px]">
        <div id="disqus_thread"></div>
        <noscript>
          Please enable JavaScript to view the{' '}
          <a href="https://disqus.com/?ref_noscript" rel="nofollow">
            comments powered by Disqus.
          </a>
        </noscript>
      </div>
    </section>
  );
};
