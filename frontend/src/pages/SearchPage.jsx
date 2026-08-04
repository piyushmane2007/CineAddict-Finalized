import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import SearchBar from '../components/SearchBar';
import MovieGrid from '../components/MovieGrid';
import { apiService } from '../services/api';
import { Search, Film } from 'lucide-react';
export const SearchPage = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const queryParam = searchParams.get('q') || '';
    const [query, setQuery] = useState(queryParam);
    const [results, setResults] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [searched, setSearched] = useState(false);
    useEffect(() => {
        if (queryParam) {
            handlePerformSearch(queryParam);
        }
    }, [queryParam]);
    const handlePerformSearch = async (q) => {
        setQuery(q);
        setSearchParams(q ? { q } : {});
        if (!q.trim()) {
            setResults([]);
            setSearched(false);
            return;
        }
        setIsLoading(true);
        setSearched(true);
        try {
            const data = await apiService.searchMovies(q);
            setResults(data);
        }
        catch (err) {
            console.error('Search request failed:', err);
            setResults([]);
        }
        finally {
            setIsLoading(false);
        }
    };
    return (<div className="space-y-8 py-6">
      <div className="max-w-3xl mx-auto text-center space-y-4">
        <div className="inline-flex p-3.5 rounded-2xl bg-purple-600/10 border border-purple-500/20 text-purple-400 mb-1 shadow-md shadow-purple-600/10">
          <Search className="w-8 h-8"/>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">Search Movie Catalog</h1>
        <p className="text-sm text-gray-400">
          Find movies by title, actor, director, genre, or keyword from your backend catalog.
        </p>

        <SearchBar initialQuery={query} onSearch={handlePerformSearch} placeholder="e.g. Inception, Christopher Nolan, Sci-Fi..." autoFocus/>
      </div>

      {searched && (<div className="space-y-4">
          <div className="flex items-center justify-between text-xs sm:text-sm text-gray-400 border-b border-white/10 pb-2">
            <span>
              Search results for <strong className="text-white">&quot;{query}&quot;</strong>
            </span>
            <span className="font-bold text-purple-400">{results.length} movies found</span>
          </div>

          <MovieGrid movies={results} isLoading={isLoading} emptyMessage={`No movies found matching "${query}". Try searching another keyword.`}/>
        </div>)}

      {!searched && (<div className="flex flex-col items-center justify-center py-16 text-center space-y-3 bg-[#131927]/80 backdrop-blur-md rounded-3xl border border-white/10 p-8 shadow-xl">
          <Film className="w-12 h-12 text-purple-400/50 stroke-1 animate-pulse"/>
          <h3 className="text-base font-semibold text-gray-300">Ready to search</h3>
          <p className="text-xs text-gray-400 max-w-md">
            Type any movie title, director, or genre in the search bar above to query your backend.
          </p>
        </div>)}
    </div>);
};
export default SearchPage;
