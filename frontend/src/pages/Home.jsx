import React, { useState, useEffect } from 'react';
import { apiService } from '../services/api';
import TrendingBentoGrid from '../components/TrendingBentoGrid';
import MovieCarousel from '../components/MovieCarousel';
import LoadingSpinner from '../components/LoadingSpinner';
import { AlertCircle } from 'lucide-react';
export const Home = () => {
    const [trending, setTrending] = useState([]);
    const [popular, setPopular] = useState([]);
    const [topRated, setTopRated] = useState([]);
    const [upcoming, setUpcoming] = useState([]);
    const [nowPlaying, setNowPlaying] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    useEffect(() => {
        let isMounted = true;
        const fetchHomeData = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const [trendingRes, popularRes, topRes, upcomingRes, nowRes] = await Promise.allSettled([
                    apiService.getTrendingMovies(),
                    apiService.getPopularMovies(),
                    apiService.getTopRatedMovies(),
                    apiService.getUpcomingMovies(),
                    apiService.getNowPlayingMovies(),
                ]);
                if (isMounted) {
                    if (trendingRes.status === 'fulfilled')
                        setTrending(trendingRes.value);
                    if (popularRes.status === 'fulfilled')
                        setPopular(popularRes.value);
                    if (topRes.status === 'fulfilled')
                        setTopRated(topRes.value);
                    if (upcomingRes.status === 'fulfilled')
                        setUpcoming(upcomingRes.value);
                    if (nowRes.status === 'fulfilled')
                        setNowPlaying(nowRes.value);
                }
            }
            catch (err) {
                if (isMounted) {
                    setError('Failed to fetch movies from backend. Ensure your Flask backend is running on http://127.0.0.1:5000.');
                }
            }
            finally {
                if (isMounted)
                    setIsLoading(false);
            }
        };
        fetchHomeData();
        return () => {
            isMounted = false;
        };
    }, []);
    if (isLoading) {
        return <LoadingSpinner fullPage message="Loading CineAddict cinematic universe..."/>;
    }
    const hasMovies = trending.length > 0 || popular.length > 0 || topRated.length > 0;
    return (<div className="space-y-10 sm:space-y-14">
      {/* Bento Grid Hero for Trending Movies */}
      {trending.length > 0 ? (<TrendingBentoGrid movies={trending}/>) : (!hasMovies && error && (<div className="bg-amber-950/40 border border-amber-500/30 rounded-2xl p-6 text-amber-200 text-sm flex items-center gap-3 my-4 backdrop-blur-md">
            <AlertCircle className="w-5 h-5 text-amber-400 shrink-0"/>
            <div>
              <p className="font-bold">Unable to connect to Flask backend at http://127.0.0.1:5000</p>
              <p className="text-xs text-amber-300/80 mt-1">
                Please make sure your Flask app server is active or update your backend URL in the header status indicator.
              </p>
            </div>
          </div>))}

      {/* Carousels for Genres & Categories */}
      <div className="space-y-10 sm:space-y-12">
        {popular.length > 0 && <MovieCarousel title="Popular Movies" movies={popular} icon="popular"/>}
        {topRated.length > 0 && <MovieCarousel title="Top Rated Movies" movies={topRated} icon="top"/>}
        {upcoming.length > 0 && <MovieCarousel title="Upcoming Releases" movies={upcoming} icon="upcoming"/>}
        {nowPlaying.length > 0 && <MovieCarousel title="Now Playing in Theaters" movies={nowPlaying} icon="now"/>}
      </div>
    </div>);
};
export default Home;
