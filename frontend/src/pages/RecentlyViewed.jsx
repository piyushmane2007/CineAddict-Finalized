import React from 'react';
import { Clock, Trash2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import MovieGrid from '../components/MovieGrid';
export const RecentlyViewed = () => {
    const { recentlyViewed, clearRecentlyViewed } = useAuth();
    return (<div className="space-y-6 py-6">
      <div className="flex items-center justify-between border-b border-white/10 pb-4 flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-purple-600/20 border border-purple-500/30 text-purple-400 shadow-md shadow-purple-600/20">
            <Clock className="w-6 h-6"/>
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">Recently Viewed</h1>
            <p className="text-xs sm:text-sm text-gray-400">Movies you have explored during your recent browsing.</p>
          </div>
        </div>

        {recentlyViewed.length > 0 && (<button type="button" onClick={clearRecentlyViewed} className="px-3.5 py-2 bg-slate-900/80 hover:bg-purple-900/40 text-gray-300 hover:text-purple-300 border border-white/10 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-md">
            <Trash2 className="w-4 h-4"/> Clear History
          </button>)}
      </div>

      <MovieGrid movies={recentlyViewed} emptyMessage="No recently viewed movies. Click on any movie card to explore details!"/>
    </div>);
};
export default RecentlyViewed;
