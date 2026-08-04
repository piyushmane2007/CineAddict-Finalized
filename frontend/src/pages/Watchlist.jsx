import React from 'react';
import { Bookmark } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import MovieGrid from '../components/MovieGrid';
export const Watchlist = () => {
    const { watchlist } = useAuth();
    return (<div className="space-y-6 py-6">
      <div className="flex items-center gap-3 border-b border-white/10 pb-4">
        <div className="p-3 rounded-2xl bg-amber-500/20 border border-amber-500/30 text-amber-400 shadow-md shadow-amber-500/10">
          <Bookmark className="w-6 h-6 fill-current"/>
        </div>
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">Your Watchlist</h1>
          <p className="text-xs sm:text-sm text-gray-400">Movies queued up for your upcoming watch sessions.</p>
        </div>
      </div>

      <MovieGrid movies={watchlist} emptyMessage="Your watchlist is empty. Bookmark movies you plan to watch soon!"/>
    </div>);
};
export default Watchlist;
