import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Bookmark, Heart, Play } from 'lucide-react';
import { getImageUrl, getReleaseYear, formatRating } from '../utils/movieHelpers';
import { useAuth } from '../context/AuthContext';
export const MovieCard = ({ movie, className = '', showHoverActions = true, }) => {
    const { toggleFavorite, isFavorite, toggleWatchlist, isInWatchlist, recordViewedMovie } = useAuth();
    if (!movie)
        return null;
    const title = movie.title || movie.name || 'Untitled Movie';
    const posterPath = movie.poster_path || movie.poster_url || movie.poster;
    const rating = movie.vote_average ?? movie.rating;
    const releaseDate = movie.release_date || movie.first_air_date || movie.year;
    const year = getReleaseYear(releaseDate);
    const favorited = isFavorite(movie.id);
    const watchlisted = isInWatchlist(movie.id);
    const handleCardClick = () => {
        recordViewedMovie(movie);
    };
    const handleFavoriteClick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleFavorite(movie);
    };
    const handleWatchlistClick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleWatchlist(movie);
    };
    return (<div className={`group relative flex flex-col bg-[#131927]/80 backdrop-blur-md rounded-2xl overflow-hidden border border-white/10 hover:border-purple-500/50 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-[0_10px_30px_-5px_rgba(139,92,246,0.35)] ${className}`}>
      <Link to={`/movie/${movie.id}`} onClick={handleCardClick} className="block relative aspect-[2/3] w-full overflow-hidden bg-slate-950">
        <img src={getImageUrl(posterPath, 'poster')} alt={title} loading="lazy" className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500 ease-out" onError={(e) => {
            e.target.src =
                'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=500&q=80';
        }}/>

        {/* Rating Badge */}
        {rating !== undefined && rating !== null && (<div className="absolute top-2.5 left-2.5 bg-slate-950/80 backdrop-blur-md px-2.5 py-1 rounded-xl border border-white/10 flex items-center gap-1 text-xs font-bold text-amber-400 z-10 shadow-lg">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400"/>
            <span>{formatRating(rating)}</span>
          </div>)}

        {/* Quick Action Overlay on Hover */}
        {showHoverActions && (<div className="absolute inset-0 bg-gradient-to-t from-[#0b0f19]/95 via-[#0b0f19]/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-3.5 z-20">
            <div className="flex justify-end gap-2">
              <button type="button" onClick={handleFavoriteClick} title={favorited ? 'Remove from Favorites' : 'Add to Favorites'} className={`p-2 rounded-full backdrop-blur-md transition-transform duration-200 hover:scale-110 ${favorited ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/50' : 'bg-slate-900/80 text-gray-200 hover:text-purple-300 hover:bg-slate-900'}`}>
                <Heart className={`w-4 h-4 ${favorited ? 'fill-current' : ''}`}/>
              </button>

              <button type="button" onClick={handleWatchlistClick} title={watchlisted ? 'Remove from Watchlist' : 'Add to Watchlist'} className={`p-2 rounded-full backdrop-blur-md transition-transform duration-200 hover:scale-110 ${watchlisted ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/50' : 'bg-slate-900/80 text-gray-200 hover:text-amber-400 hover:bg-slate-900'}`}>
                <Bookmark className={`w-4 h-4 ${watchlisted ? 'fill-current' : ''}`}/>
              </button>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-1.5 text-xs text-purple-400 font-bold tracking-wider uppercase">
                <Play className="w-3.5 h-3.5 fill-current"/>
                <span>Explore Movie</span>
              </div>
            </div>
          </div>)}
      </Link>

      {/* Movie Info */}
      <div className="p-3.5 flex flex-col justify-between flex-grow">
        <div>
          <Link to={`/movie/${movie.id}`} onClick={handleCardClick} className="font-bold text-sm text-gray-100 group-hover:text-purple-300 transition-colors line-clamp-1 leading-snug" title={title}>
            {title}
          </Link>
          <div className="flex items-center justify-between text-xs text-gray-400 mt-1">
            <span>{year || 'Movie'}</span>
            {movie.genres && Array.isArray(movie.genres) && movie.genres.length > 0 && (<span className="truncate max-w-[100px] text-gray-400">
                {typeof movie.genres[0] === 'string' ? movie.genres[0] : movie.genres[0]?.name}
              </span>)}
          </div>
        </div>
      </div>
    </div>);
};
export default MovieCard;
