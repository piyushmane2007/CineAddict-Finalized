import React, { useState, useEffect } from 'react';
import { Search, X, History } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
export const SearchBar = ({ initialQuery = '', onSearch, placeholder = 'Search movies by title, director, genre...', autoFocus = false, }) => {
    const [query, setQuery] = useState(initialQuery);
    const { searchHistory, recordSearchQuery } = useAuth();
    const [showHistory, setShowHistory] = useState(false);
    useEffect(() => {
        setQuery(initialQuery);
    }, [initialQuery]);
    const handleSubmit = (e) => {
        e.preventDefault();
        if (query.trim()) {
            recordSearchQuery(query.trim());
            onSearch(query.trim());
            setShowHistory(false);
        }
    };
    const handleClear = () => {
        setQuery('');
        onSearch('');
    };
    const handleHistorySelect = (historyQuery) => {
        setQuery(historyQuery);
        recordSearchQuery(historyQuery);
        onSearch(historyQuery);
        setShowHistory(false);
    };
    return (<div className="relative w-full">
      <form onSubmit={handleSubmit} className="relative flex items-center">
        <div className="absolute left-4 text-gray-400 pointer-events-none">
          <Search className="w-5 h-5 text-gray-400"/>
        </div>

        <input type="text" value={query} onChange={(e) => setQuery(e.target.value)} onFocus={() => setShowHistory(true)} placeholder={placeholder} autoFocus={autoFocus} className="w-full pl-12 pr-24 py-3.5 bg-[#131927]/90 backdrop-blur-md border border-white/10 rounded-2xl text-white text-sm sm:text-base placeholder-gray-400 focus:outline-none focus:border-purple-500/80 focus:ring-2 focus:ring-purple-500/30 shadow-xl transition-all"/>

        <div className="absolute right-3 flex items-center gap-1.5">
          {query && (<button type="button" onClick={handleClear} className="p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors" title="Clear text">
              <X className="w-4 h-4"/>
            </button>)}

          <button type="submit" className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs sm:text-sm rounded-xl transition-colors shadow-md shadow-purple-600/30 border border-purple-400/30">
            Search
          </button>
        </div>
      </form>

      {/* History Popup */}
      {showHistory && searchHistory.length > 0 && !query && (<div className="absolute left-0 right-0 top-full mt-2 bg-[#131927]/95 backdrop-blur-xl border border-white/10 rounded-2xl p-3.5 shadow-2xl z-30">
          <div className="flex items-center justify-between px-2 pb-2 mb-1 border-b border-white/10">
            <span className="text-xs font-bold text-gray-300 uppercase tracking-wider flex items-center gap-1.5">
              <History className="w-3.5 h-3.5 text-purple-400"/> Recent Searches
            </span>
            <button type="button" onClick={() => setShowHistory(false)} className="text-xs text-gray-400 hover:text-gray-200">
              Close
            </button>
          </div>

          <div className="flex flex-wrap gap-1.5 pt-1">
            {searchHistory.slice(0, 8).map((item) => (<button key={item.id || item.query} type="button" onClick={() => handleHistorySelect(item.query)} className="px-3 py-1.5 bg-slate-900/80 hover:bg-purple-900/40 hover:text-purple-300 border border-white/10 hover:border-purple-500/40 rounded-xl text-xs text-gray-200 transition-colors text-left">
                {item.query}
              </button>))}
          </div>
        </div>)}
    </div>);
};
export default SearchBar;
