import React from 'react';
import { useNavigate } from 'react-router-dom';
import { History, Trash2, Search, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
export const SearchHistoryPage = () => {
    const { searchHistory, clearSearchHistory } = useAuth();
    const navigate = useNavigate();
    const handleQueryClick = (query) => {
        navigate(`/search?q=${encodeURIComponent(query)}`);
    };
    return (<div className="space-y-6 py-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between border-b border-white/10 pb-4 flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-purple-600/20 border border-purple-500/30 text-purple-400 shadow-md shadow-purple-600/20">
            <History className="w-6 h-6"/>
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">Search History</h1>
            <p className="text-xs sm:text-sm text-gray-400">Log of all your movie queries executed on CineAddict.</p>
          </div>
        </div>

        {searchHistory.length > 0 && (<button type="button" onClick={clearSearchHistory} className="px-3.5 py-2 bg-slate-900/80 hover:bg-purple-900/40 text-gray-300 hover:text-purple-300 border border-white/10 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-md">
            <Trash2 className="w-4 h-4"/> Clear Search Log
          </button>)}
      </div>

      {searchHistory.length === 0 ? (<div className="flex flex-col items-center justify-center p-12 bg-[#131927]/80 backdrop-blur-md rounded-3xl border border-white/10 text-center space-y-3">
          <Search className="w-12 h-12 text-purple-400/50 stroke-1 animate-pulse"/>
          <h3 className="text-base font-semibold text-gray-300">No search logs recorded</h3>
          <p className="text-xs text-gray-400 max-w-sm">
            Queries executed in the search bar will appear here for fast replay.
          </p>
        </div>) : (<div className="space-y-3">
          {searchHistory.map((item, idx) => (<div key={item.id || idx} onClick={() => handleQueryClick(item.query)} className="group bg-[#131927]/80 hover:bg-[#182035] backdrop-blur-md border border-white/10 hover:border-purple-500/50 rounded-2xl p-4 flex items-center justify-between cursor-pointer transition-all shadow-md hover:shadow-purple-950/20">
              <div className="flex items-center gap-3.5">
                <div className="p-2.5 rounded-xl bg-slate-950 text-purple-400 group-hover:scale-110 transition-transform">
                  <Search className="w-4 h-4"/>
                </div>
                <div>
                  <h4 className="font-bold text-sm text-gray-200 group-hover:text-purple-300 transition-colors">
                    &quot;{item.query}&quot;
                  </h4>
                  <div className="flex items-center gap-2 text-[11px] text-gray-400 mt-0.5">
                    {item.timestamp && (<span>
                        {new Date(item.timestamp).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                    })}
                      </span>)}
                    {item.count && item.count > 1 && (<span className="px-1.5 py-0.2 bg-purple-950/80 text-purple-200 border border-purple-800/60 rounded font-bold">
                        {item.count} searches
                      </span>)}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs font-bold text-gray-400 group-hover:text-purple-400 transition-colors">
                <span>Replay Search</span>
                <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform"/>
              </div>
            </div>))}
        </div>)}
    </div>);
};
export default SearchHistoryPage;
