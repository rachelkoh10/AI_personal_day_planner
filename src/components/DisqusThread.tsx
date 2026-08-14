import React, { useEffect, useState } from 'react';
import { MessageSquare, AlertCircle } from 'lucide-react';

export const DisqusThread: React.FC = () => {
  const [loadError, setLoadError] = useState<boolean>(false);

  useEffect(() => {
    // Configure window.disqus_config if available
    (window as any).disqus_config = function (this: any) {
      this.page.url = window.location.href;
      this.page.identifier = 'ai-smart-day-planner-singapore';
    };

    const existingScript = document.getElementById('disqus-embed-script');
    if (!existingScript) {
      const d = document;
      const s = d.createElement('script');
      s.id = 'disqus-embed-script';
      s.src = 'https://ai-smart-day-planner.disqus.com/embed.js';
      s.setAttribute('data-timestamp', (+new Date()).toString());
      s.onerror = () => {
        setLoadError(true);
      };
      (d.head || d.body).appendChild(s);
    } else if ((window as any).DISQUS) {
      try {
        (window as any).DISQUS.reset({
          reload: true,
          config: function (this: any) {
            this.page.url = window.location.href;
            this.page.identifier = 'ai-smart-day-planner-singapore';
          },
        });
      } catch (e) {
        console.warn('Disqus reset notice:', e);
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
        {loadError ? (
          <div className="p-6 text-center space-y-2 text-slate-500 dark:text-slate-400 text-sm">
            <AlertCircle className="w-8 h-8 text-amber-500 mx-auto" />
            <p className="font-bold text-slate-800 dark:text-slate-200">
              Unable to load Disqus community thread.
            </p>
            <p className="text-xs">
              Disqus may be restricted in this iframe environment or pending shortname registration at ai-smart-day-planner.disqus.com.
            </p>
          </div>
        ) : (
          <div id="disqus_thread"></div>
        )}
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
