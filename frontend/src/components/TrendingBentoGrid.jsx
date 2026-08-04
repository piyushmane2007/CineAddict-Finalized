import React from 'react';
import { Link } from 'react-router-dom';
import { Play, Star, Bookmark, Info, Check, Flame, Heart } from 'lucide-react';
import { getImageUrl, getReleaseYear, formatRating, getYoutubeTrailerUrl } from '../utils/movieHelpers';
import { useAuth } from '../context/AuthContext';
export const TrendingBentoGrid = ({ movies }) => {
    const { toggleWatchlist, isInWatchlist, toggleFavorite, isFavorite, recordViewedMovie } = useAuth();
    if (!movies || movies.length === 0)
        return null;
    const featured = movies[0];
    const sideMovies = movies.slice(1, 5); // 4 smaller surrounding bento cards
    const featuredTitle = featured.title || featured.name || 'Featured Trending Film';
    const featuredBackdrop = featured.backdrop_path || featured.poster_path || featured.poster_url;
    const featuredRating = featured.vote_average ?? featured.rating;
    const featuredYear = getReleaseYear(featured.release_date || featured.first_air_date || featured.year);
    const featuredWatchlisted = isInWatchlist(featured.id);
    const featuredTrailerUrl = getYoutubeTrailerUrl(featuredTitle, featured.youtube_id, featured.trailer_url);
    return (<div className="relative w-full my-4">
      {/* Dynamic Immersive Background Container: Blurs dominant poster backdrop color */}
      <div className="absolute -inset-4 sm:-inset-6 bg-gradient-to-r from-purple-900/25 via-indigo-900/20 to-slate-900/40 rounded-3xl blur-2xl pointer-events-none -z-10 overflow-hidden">
        {featuredBackdrop && (<img src={getImageUrl(featuredBackdrop, 'backdrop')} alt="" className="w-full h-full object-cover opacity-35 filter blur-3xl scale-125 transform origin-center"/>)}
      </div>

      {/* Header Label */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-purple-600/30 border border-purple-500/40 flex items-center justify-center text-purple-400 shadow-md shadow-purple-600/20">
            <Flame className="w-5 h-5 fill-purple-500/30"/>
          </div>
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
              Trending Today <span className="text-xs px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 uppercase tracking-widest font-bold">Bento Spotlight</span>
            </h2>
          </div>
        </div>
      </div>

      {/* Asymmetric Bento-Box Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6">
        {/* 1. Oversized Featured Card */}
        <div className="lg:col-span-7 xl:col-span-8 relative rounded-3xl overflow-hidden min-h-[440px] sm:min-h-[520px] flex flex-col justify-end p-6 sm:p-10 border border-white/10 hover:border-purple-500/60 transition-all duration-500 group shadow-2xl hover:shadow-[0_0_35px_rgba(139,92,246,0.35)] glass-card">
          {/* Background Poster/Backdrop */}
          <div className="absolute inset-0 z-0 bg-slate-950 overflow-hidden">
            <img src={getImageUrl(featuredBackdrop, 'backdrop')} alt={featuredTitle} className="w-full h-full object-cover object-center transform group-hover:scale-105 transition-transform duration-700 ease-out" onError={(e) => {
            e.target.src =
                'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=1200&q=80';
        }}/>
            {/* Multi-stage Gradients for readable text & cinematic vibe */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0b0f19] via-[#0b0f19]/70 to-transparent"/>
            <div className="absolute inset-0 bg-gradient-to-r from-[#0b0f19] via-[#0b0f19]/80 to-transparent max-w-2xl"/>
          </div>

          {/* Card Top Info */}
          <div className="relative z-10 flex flex-wrap items-center gap-2.5 mb-3">
            <span className="px-3 py-1 rounded-full bg-purple-600 text-white uppercase text-[11px] font-black tracking-widest shadow-lg shadow-purple-600/40 border border-purple-400/40 flex items-center gap-1">
              <Flame className="w-3.5 h-3.5 fill-current"/> #1 Featured
            </span>
            {featuredRating !== undefined && featuredRating !== null && (<span className="flex items-center gap-1 text-amber-400 bg-slate-950/80 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 text-xs font-bold">
                <Star className="w-3.5 h-3.5 fill-amber-400"/>
                {formatRating(featuredRating)} / 10
              </span>)}
            {featuredYear && (<span className="bg-slate-950/80 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 text-xs text-gray-300 font-semibold">
                {featuredYear}
              </span>)}
          </div>

          {/* Featured Title & Overview */}
          <div className="relative z-10 space-y-3">
            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight drop-shadow-md">
              {featuredTitle}
            </h1>

            {featured.overview && (<p className="text-gray-300 text-sm sm:text-base leading-relaxed line-clamp-2 sm:line-clamp-3 max-w-2xl drop-shadow">
                {featured.overview}
              </p>)}

            {/* Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <a href={featuredTrailerUrl} target="_blank" rel="noopener noreferrer" className="px-5 py-3 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-2xl transition-all duration-200 flex items-center gap-2 shadow-xl shadow-purple-600/40 transform hover:-translate-y-0.5 active:translate-y-0 text-sm border border-purple-400/30">
                <Play className="w-4 h-4 fill-current"/> Watch Trailer
              </a>

              <button type="button" onClick={() => toggleWatchlist(featured)} className={`px-4 py-3 font-semibold rounded-2xl backdrop-blur-md border transition-all duration-200 flex items-center gap-2 text-sm ${featuredWatchlisted
            ? 'bg-amber-500 text-black border-amber-400 shadow-md'
            : 'bg-slate-900/80 hover:bg-slate-800 text-white border-white/15'}`}>
                {featuredWatchlisted ? (<>
                    <Check className="w-4 h-4 stroke-[3]"/> Watchlisted
                  </>) : (<>
                    <Bookmark className="w-4 h-4"/> Watchlist
                  </>)}
              </button>

              <Link to={`/movie/${featured.id}`} onClick={() => recordViewedMovie(featured)} className="px-4 py-3 bg-slate-900/80 hover:bg-slate-800 text-gray-200 hover:text-white font-semibold rounded-2xl border border-white/15 backdrop-blur-md transition-all duration-200 flex items-center gap-1.5 text-sm">
                <Info className="w-4 h-4 text-purple-400"/> Details
              </Link>
            </div>
          </div>
        </div>

        {/* 2. Surrounding Smaller Bento Cards */}
        <div className="lg:col-span-5 xl:col-span-4 grid grid-cols-2 gap-4">
          {sideMovies.map((movie, index) => {
            const title = movie.title || movie.name || 'Movie';
            const poster = movie.poster_path || movie.poster_url;
            const rating = movie.vote_average ?? movie.rating;
            const favorited = isFavorite(movie.id);
            return (<div key={movie.id || index} className="relative rounded-2xl overflow-hidden min-h-[220px] sm:min-h-[240px] flex flex-col justify-end p-4 border border-white/10 hover:border-purple-500/50 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-[0_10px_25px_-5px_rgba(139,92,246,0.35)] group glass-card">
                {/* Background Poster */}
                <div className="absolute inset-0 z-0 bg-slate-950 overflow-hidden">
                  <img src={getImageUrl(poster, 'poster')} alt={title} className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500" onError={(e) => {
                    e.target.src =
                        'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=500&q=80';
                }}/>
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0b0f19] via-[#0b0f19]/60 to-transparent"/>
                </div>

                {/* Top Rank Badge & Favorite Button */}
                <div className="relative z-10 flex items-center justify-between mb-auto">
                  <span className="px-2.5 py-0.5 rounded-lg bg-slate-950/80 backdrop-blur-md text-purple-300 font-black text-xs border border-purple-500/30">
                    #{index + 2}
                  </span>

                  <button type="button" onClick={() => toggleFavorite(movie)} className={`p-1.5 rounded-full backdrop-blur-md transition-all ${favorited ? 'bg-purple-600 text-white' : 'bg-slate-950/70 text-gray-300 hover:text-purple-400'}`}>
                    <Heart className={`w-3.5 h-3.5 ${favorited ? 'fill-current' : ''}`}/>
                  </button>
                </div>

                {/* Content */}
                <div className="relative z-10 space-y-1">
                  <div className="flex items-center gap-1 text-[11px] font-bold text-amber-400">
                    <Star className="w-3 h-3 fill-amber-400"/>
                    <span>{formatRating(rating)}</span>
                  </div>

                  <Link to={`/movie/${movie.id}`} onClick={() => recordViewedMovie(movie)} className="font-bold text-sm text-white hover:text-purple-300 line-clamp-1 transition-colors block">
                    {title}
                  </Link>

                  <div className="pt-1 flex items-center justify-between">
                    <a href={getYoutubeTrailerUrl(title, movie.youtube_id, movie.trailer_url)} target="_blank" rel="noopener noreferrer" className="text-[11px] font-extrabold text-purple-400 hover:text-purple-300 flex items-center gap-1 uppercase tracking-wider">
                      <Play className="w-3 h-3 fill-current"/> Trailer
                    </a>
                  </div>
                </div>
              </div>);
        })}
        </div>
      </div>
    </div>);
};
export default TrendingBentoGrid;
