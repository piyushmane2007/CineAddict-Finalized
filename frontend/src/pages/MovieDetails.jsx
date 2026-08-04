import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Star, Clock, Calendar, Heart, Bookmark, Play, Share2, Check, MessageSquare, Users, Film, } from 'lucide-react';
import { apiService } from '../services/api';
import { getImageUrl, getReleaseYear, formatRuntime, formatRating, getYoutubeTrailerUrl } from '../utils/movieHelpers';
import { useAuth } from '../context/AuthContext';
import CastCard from '../components/CastCard';
import ReviewCard from '../components/ReviewCard';
import MovieCarousel from '../components/MovieCarousel';
import LoadingSpinner from '../components/LoadingSpinner';
export const MovieDetails = () => {
    const { id } = useParams();
    const { toggleFavorite, isFavorite, toggleWatchlist, isInWatchlist, recordViewedMovie, isAuthenticated, user } = useAuth();
    const [movie, setMovie] = useState(null);
    const [cast, setCast] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [similar, setSimilar] = useState([]);
    const [recommended, setRecommended] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [trailerData, setTrailerData] = useState(null);
    const [directorName, setDirectorName] = useState('');
    const [writerName, setWriterName] = useState('');
    const [copied, setCopied] = useState(false);
    useEffect(() => {
        if (!id)
            return;
        let isMounted = true;
        const fetchDetails = async () => {
            setIsLoading(true);
            try {
                const detailsData = await apiService.getMovieDetails(id);
                if (isMounted && detailsData) {
                    setMovie(detailsData);
                    recordViewedMovie(detailsData);
                }
                const movieTitle = detailsData?.title || detailsData?.name || '';
                // Fetch sub-resources in parallel
                const fetchReviewsFn = apiService.get_movie_reviews || apiService.getMovieReviews || apiService.getReviews;
                const [castRes, reviewRes, simRes, recRes, trailerRes, creditsRes] = await Promise.allSettled([
                    apiService.getMovieCast(id),
                    fetchReviewsFn(id),
                    apiService.getSimilarMovies(id),
                    apiService.getRecommendedMovies(id),
                    apiService.getMovieTrailer(id, movieTitle),
                    apiService.getMovieCredits(id),
                ]);
                if (isMounted) {
                    if (trailerRes.status === 'fulfilled' && trailerRes.value) {
                        setTrailerData(trailerRes.value);
                    }
                    const rawCast = castRes.status === 'fulfilled' ? castRes.value : [];
                    const creditsInfo = creditsRes.status === 'fulfilled' ? creditsRes.value : null;
                    // Extract Director
                    const dir = detailsData?.director ||
                        creditsInfo?.director ||
                        creditsInfo?.crew?.find((c) => c.job === 'Director')?.name ||
                        '';
                    setDirectorName(dir);
                    // Extract Writer
                    const wrt = detailsData?.writer ||
                        creditsInfo?.writer ||
                        creditsInfo?.crew
                            ?.filter((c) => c.job === 'Writer' || c.job === 'Screenplay' || c.department === 'Writing')
                            ?.map((c) => c.name)
                            ?.filter(Boolean)
                            ?.join(', ') ||
                        '';
                    setWriterName(wrt);
                    setCast(rawCast);
                    if (reviewRes.status === 'fulfilled')
                        setReviews(reviewRes.value);
                    if (simRes.status === 'fulfilled')
                        setSimilar(simRes.value);
                    if (recRes.status === 'fulfilled')
                        setRecommended(recRes.value);
                }
            }
            catch (err) {
                console.error('Failed to load movie details:', err);
            }
            finally {
                if (isMounted)
                    setIsLoading(false);
            }
        };
        fetchDetails();
        return () => {
            isMounted = false;
        };
    }, [id]);
    const handleShare = () => {
        navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };
    if (isLoading) {
        return <LoadingSpinner fullPage message="Loading movie details..."/>;
    }
    if (!movie) {
        return (<div className="py-20 text-center space-y-4">
        <Film className="w-16 h-16 text-gray-600 mx-auto"/>
        <h2 className="text-2xl font-bold text-white">Movie Not Found</h2>
        <p className="text-gray-400 text-sm">Could not find movie with ID {id}.</p>
      </div>);
    }
    const title = movie.title || movie.name || 'Untitled Movie';
    const posterPath = movie.poster_path || movie.poster_url || movie.poster;
    const backdropPath = movie.backdrop_path || movie.backdrop_url || movie.backdrop;
    const rating = movie.vote_average ?? movie.rating;
    const releaseYear = getReleaseYear(movie.release_date || movie.first_air_date || movie.year);
    const favorited = isFavorite(movie.id);
    const watchlisted = isInWatchlist(movie.id);
    const youtubeTrailerUrl = getYoutubeTrailerUrl(title, movie.youtube_id || trailerData?.youtube_id, movie.trailer_url || trailerData?.trailer_url);
    // Genre display normalization
    const genresList = Array.isArray(movie.genres)
        ? movie.genres.map((g) => (typeof g === 'string' ? g : g.name))
        : movie.genre_names || [];
    return (<div className="space-y-12 pb-12">
      {/* Hero Backdrop Section with Immersive Blurring Container */}
      <div className="relative w-full min-h-[50vh] sm:min-h-[60vh] lg:min-h-[65vh] rounded-3xl overflow-hidden bg-slate-950 border border-white/10 flex items-end shadow-2xl hover:border-purple-500/40 transition-all duration-500">
        {/* Dynamic Immersive Background Blurring Layer */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <img src={getImageUrl(backdropPath, 'backdrop')} alt={title} className="w-full h-full object-cover filter brightness-75 transform scale-105"/>
          <div className="absolute inset-0 bg-gradient-to-t from-[#0b0f19] via-[#0b0f19]/80 to-transparent"/>
          <div className="absolute inset-0 bg-gradient-to-r from-[#0b0f19] via-[#0b0f19]/60 to-transparent max-w-2xl"/>
        </div>

        {/* Content Banner Overlay */}
        <div className="relative z-10 p-6 sm:p-8 lg:p-10 w-full flex flex-col md:flex-row items-end md:items-start gap-6 lg:gap-8">
          {/* Poster image */}
          <div className="w-36 sm:w-48 lg:w-56 shrink-0 aspect-[2/3] rounded-2xl overflow-hidden border-2 border-white/10 shadow-2xl bg-slate-900 hidden sm:block">
            <img src={getImageUrl(posterPath, 'poster')} alt={title} className="w-full h-full object-cover"/>
          </div>

          {/* Details Column */}
          <div className="space-y-4 flex-grow">
            <div className="flex flex-wrap items-center gap-2.5 text-xs sm:text-sm font-semibold">
              {rating !== undefined && rating !== null && (<span className="flex items-center gap-1 text-amber-400 bg-amber-500/10 border border-amber-500/30 px-3 py-1 rounded-full backdrop-blur-md">
                  <Star className="w-4 h-4 fill-amber-400"/>
                  {formatRating(rating)} / 10
                </span>)}

              {releaseYear && (<span className="flex items-center gap-1 text-gray-300 bg-slate-950/80 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
                  <Calendar className="w-3.5 h-3.5 text-purple-400"/>
                  {releaseYear}
                </span>)}

              {movie.runtime ? (<span className="flex items-center gap-1 text-gray-300 bg-slate-950/80 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
                  <Clock className="w-3.5 h-3.5 text-purple-400"/>
                  {formatRuntime(movie.runtime)}
                </span>) : null}
            </div>

            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">{title}</h1>

            {movie.tagline && <p className="text-sm italic text-purple-300 font-medium">&quot;{movie.tagline}&quot;</p>}

            {/* Genre Pills */}
            {genresList.length > 0 && (<div className="flex flex-wrap gap-2 pt-1">
                {genresList.map((genre, idx) => (<span key={idx} className="px-3 py-1 bg-slate-900/80 border border-white/10 rounded-xl text-xs font-semibold text-purple-200">
                    {genre}
                  </span>))}
              </div>)}

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-3">
              <a href={youtubeTrailerUrl} target="_blank" rel="noopener noreferrer" className="px-5 py-3 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-purple-600/30 flex items-center gap-2 text-sm border border-purple-400/30">
                <Play className="w-4 h-4 fill-current"/> Watch Trailer
              </a>

              <button type="button" onClick={() => toggleWatchlist(movie)} className={`px-4 py-3 font-semibold rounded-xl border transition-all flex items-center gap-2 text-sm ${watchlisted
            ? 'bg-amber-500 text-black border-amber-400 shadow-lg shadow-amber-500/20'
            : 'bg-slate-900/80 hover:bg-slate-800 text-white border-white/15'}`}>
                {watchlisted ? <Check className="w-4 h-4 stroke-[3]"/> : <Bookmark className="w-4 h-4"/>}
                {watchlisted ? 'In Watchlist' : 'Watchlist'}
              </button>

              <button type="button" onClick={() => toggleFavorite(movie)} className={`p-3 rounded-xl border transition-all ${favorited
            ? 'bg-purple-600 text-white border-purple-400 shadow-lg shadow-purple-600/30'
            : 'bg-slate-900/80 hover:bg-slate-800 text-gray-300 border-white/15'}`} title={favorited ? 'Remove Favorite' : 'Add Favorite'}>
                <Heart className={`w-5 h-5 ${favorited ? 'fill-current' : ''}`}/>
              </button>

              <button type="button" onClick={handleShare} className="p-3 bg-slate-900/80 hover:bg-slate-800 text-gray-300 border border-white/15 rounded-xl transition-colors relative" title="Share link">
                {copied ? <Check className="w-5 h-5 text-emerald-400"/> : <Share2 className="w-5 h-5"/>}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Overview & Cast */}
        <div className="lg:col-span-2 min-w-0 space-y-8">
          {/* Overview */}
          <div className="bg-[#131927]/80 backdrop-blur-md border border-white/10 rounded-2xl p-6 space-y-3 shadow-md">
            <h3 className="text-lg font-bold text-white tracking-wide border-b border-white/10 pb-2">Overview</h3>
            <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
              {movie.overview || 'No overview synopsis provided for this title.'}
            </p>
          </div>

          {/* Cast */}
          {cast && cast.length > 0 && (<div className="space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-2">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-purple-400"/>
                  <h3 className="text-lg font-bold text-white">Top Cast</h3>
                </div>
                <span className="text-xs text-purple-300 font-semibold">{cast.length} members</span>
              </div>

              <div className="flex gap-4 overflow-x-auto pb-4 pt-1 px-1 snap-x scroll-smooth no-scrollbar focus:outline-none w-full">
                {cast.slice(0, 18).map((member, idx) => (<CastCard key={member.id || idx} cast={member}/>))}
              </div>
            </div>)}

          {/* Reviews Section */}
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-purple-400"/>
                <h3 className="text-lg font-bold text-white">User Reviews ({reviews.length})</h3>
              </div>
            </div>

            {/* Reviews List */}
            {reviews.length > 0 ? (<div className="space-y-4">
                {reviews.map((review, idx) => (<ReviewCard key={review.id || idx} review={review}/>))}
              </div>) : (<p className="text-xs text-gray-400 italic text-center py-6 bg-[#131927]/80 backdrop-blur-md rounded-2xl border border-white/10">
                No user reviews available for this movie.
              </p>)}
          </div>
        </div>

        {/* Right Column: Quick Stats / Meta */}
        <div className="space-y-6">
          <div className="bg-[#131927]/80 backdrop-blur-md border border-white/10 rounded-2xl p-6 space-y-4 shadow-md text-sm">
            <h4 className="font-bold text-white text-base border-b border-white/10 pb-2">Movie Info</h4>

            <div className="space-y-3 text-xs">
              <div>
                <span className="text-gray-400 block uppercase tracking-wider text-[10px]">Status</span>
                <span className="text-gray-200 font-medium">Released</span>
              </div>

              <div>
                <span className="text-gray-400 block uppercase tracking-wider text-[10px]">Release Date</span>
                <span className="text-gray-200 font-medium">{movie.release_date || movie.year || 'N/A'}</span>
              </div>

              {directorName && directorName !== 'N/A' && (<div>
                  <span className="text-gray-400 block uppercase tracking-wider text-[10px]">Director</span>
                  <span className="text-purple-300 font-bold">{directorName}</span>
                </div>)}

              {writerName && writerName !== 'N/A' && (<div>
                  <span className="text-gray-400 block uppercase tracking-wider text-[10px]">Writer</span>
                  <span className="text-gray-200 font-medium">{writerName}</span>
                </div>)}

              {movie.runtime && (<div>
                  <span className="text-gray-400 block uppercase tracking-wider text-[10px]">Runtime</span>
                  <span className="text-gray-200 font-medium">{formatRuntime(movie.runtime)}</span>
                </div>)}

              {genresList.length > 0 && (<div>
                  <span className="text-gray-400 block uppercase tracking-wider text-[10px]">Genres</span>
                  <span className="text-gray-200 font-medium">{genresList.join(', ')}</span>
                </div>)}
            </div>
          </div>
        </div>
      </div>

      {/* Carousels: Similar & Recommended */}
      {similar.length > 0 && <MovieCarousel title="Similar Movies" movies={similar} icon="now"/>}
      {recommended.length > 0 && <MovieCarousel title="Recommended for You" movies={recommended} icon="top"/>}
    </div>);
};
export default MovieDetails;
