import React from 'react';
import MovieCard from './MovieCard';
import LoadingSpinner from './LoadingSpinner';
import { Film } from 'lucide-react';
export const MovieGrid = ({ movies, title, subtitle, isLoading = false, emptyMessage = 'No movies found.', actionButton, }) => {
    return (<section className="space-y-6">
      {(title || actionButton) && (<div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-white/10 pb-3">
          <div>
            {title && <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">{title}</h2>}
            {subtitle && <p className="text-xs sm:text-sm text-gray-400 mt-1">{subtitle}</p>}
          </div>
          {actionButton}
        </div>)}

      {isLoading ? (<div className="py-12">
          <LoadingSpinner message="Fetching movies..."/>
        </div>) : !movies || movies.length === 0 ? (<div className="flex flex-col items-center justify-center p-12 bg-[#131927]/80 backdrop-blur-md rounded-2xl border border-white/10 text-center space-y-3 shadow-xl">
          <Film className="w-12 h-12 text-purple-400/50 stroke-[1.5] animate-pulse"/>
          <h3 className="text-base font-bold text-gray-200">{emptyMessage}</h3>
          <p className="text-xs text-gray-400 max-w-sm">
            Try adjusting your search criteria or exploring our trending section.
          </p>
        </div>) : (<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-5">
          {movies.map((movie, idx) => (<MovieCard key={movie.id ? `${movie.id}-${idx}` : idx} movie={movie}/>))}
        </div>)}
    </section>);
};
export default MovieGrid;
