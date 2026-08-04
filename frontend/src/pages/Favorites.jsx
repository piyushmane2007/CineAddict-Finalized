import React from 'react';
import { Heart } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import MovieGrid from '../components/MovieGrid';
export const Favorites = () => {
    const { favorites } = useAuth();
    return (<div className="space-y-6 py-6">
      <div className="flex items-center gap-3 border-b border-white/10 pb-4">
        <div className="p-3 rounded-2xl bg-purple-600/20 border border-purple-500/30 text-purple-400 shadow-md shadow-purple-600/20">
          <Heart className="w-6 h-6 fill-current text-purple-400"/>
        </div>
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">Favorite Movies</h1>
          <p className="text-xs sm:text-sm text-gray-400">Your personal hall of fame for top cinematic choices.</p>
        </div>
      </div>

      <MovieGrid movies={favorites} emptyMessage="You haven't added any favorite movies yet. Click the heart icon on any movie card to save it here!"/>
    </div>);
};
export default Favorites;
