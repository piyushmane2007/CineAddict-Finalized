import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight, Flame, Sparkles, TrendingUp, Calendar, PlayCircle } from 'lucide-react';
import MovieCard from './MovieCard';
export const MovieCarousel = ({ title, movies, icon }) => {
    const scrollRef = useRef(null);
    const scroll = (direction) => {
        if (scrollRef.current) {
            const { scrollLeft, clientWidth } = scrollRef.current;
            const scrollAmount = clientWidth * 0.75;
            scrollRef.current.scrollTo({
                left: direction === 'left' ? scrollLeft - scrollAmount : scrollLeft + scrollAmount,
                behavior: 'smooth',
            });
        }
    };
    if (!movies || movies.length === 0)
        return null;
    const renderIcon = () => {
        switch (icon) {
            case 'trending':
                return <Flame className="w-5 h-5 text-red-500 fill-red-500/20"/>;
            case 'popular':
                return <TrendingUp className="w-5 h-5 text-amber-500"/>;
            case 'top':
                return <Sparkles className="w-5 h-5 text-yellow-400"/>;
            case 'upcoming':
                return <Calendar className="w-5 h-5 text-emerald-400"/>;
            case 'now':
                return <PlayCircle className="w-5 h-5 text-blue-400"/>;
            default:
                return null;
        }
    };
    return (<section className="space-y-4 py-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          {renderIcon()}
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-wide">{title}</h2>
        </div>

        {/* Carousel Scroll Navigation Buttons */}
        <div className="flex items-center gap-1.5">
          <button type="button" onClick={() => scroll('left')} className="p-2 rounded-xl bg-slate-900/80 hover:bg-purple-600/20 border border-white/10 hover:border-purple-500/40 text-gray-300 hover:text-white transition-all shadow-md" aria-label="Scroll left">
            <ChevronLeft className="w-5 h-5"/>
          </button>
          <button type="button" onClick={() => scroll('right')} className="p-2 rounded-xl bg-slate-900/80 hover:bg-purple-600/20 border border-white/10 hover:border-purple-500/40 text-gray-300 hover:text-white transition-all shadow-md" aria-label="Scroll right">
            <ChevronRight className="w-5 h-5"/>
          </button>
        </div>
      </div>

      {/* Horizontal Scrollable Container */}
      <div ref={scrollRef} className="flex gap-4 sm:gap-5 overflow-x-auto no-scrollbar scroll-smooth pb-6 pt-2 px-1 -mx-1 snap-x">
        {movies.map((movie, idx) => (<div key={movie.id ? `${movie.id}-${idx}` : idx} className="flex-none w-40 sm:w-48 lg:w-52 snap-start">
            <MovieCard movie={movie}/>
          </div>))}
      </div>
    </section>);
};
export default MovieCarousel;
