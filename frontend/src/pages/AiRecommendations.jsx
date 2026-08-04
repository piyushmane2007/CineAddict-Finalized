import React, { useState } from 'react';
import { Sparkles, Send, Film, AlertCircle } from 'lucide-react';
import { apiService } from '../services/api';
import MovieCard from '../components/MovieCard';
import LoadingSpinner from '../components/LoadingSpinner';
export const AiRecommendations = () => {
    const [prompt, setPrompt] = useState('');
    const [recommendations, setRecommendations] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [searched, setSearched] = useState(false);
    const [error, setError] = useState(null);
    const samplePrompts = [
        'Mind-bending psychological thrillers with high stakes and unexpected twists',
        'Feel-good nostalgic 80s sci-fi adventure movies for a Friday night',
        'Gripping crime detective mystery set in rain-soaked moody cities',
        'Epic space opera with stunning visuals, aliens, and deep space exploration',
    ];
    const handleGetRecommendations = async (e) => {
        if (e)
            e.preventDefault();
        if (!prompt.trim())
            return;
        setIsLoading(true);
        setSearched(true);
        setError(null);
        try {
            const results = await apiService.getAiRecommendations(prompt.trim());
            if (results && results.length > 0) {
                setRecommendations(results);
            }
            else {
                const trending = await apiService.getTrendingMovies();
                setRecommendations(trending.slice(0, 10));
            }
        }
        catch (err) {
            console.error('AI Recommendation Error:', err);
            try {
                const trending = await apiService.getTrendingMovies();
                setRecommendations(trending.slice(0, 10));
            }
            catch (fallbackErr) {
                setError('Unable to fetch recommendations at this moment. Please check network connection.');
                setRecommendations([]);
            }
        }
        finally {
            setIsLoading(false);
        }
    };
    const handleSampleClick = (sample) => {
        setPrompt(sample);
    };
    return (<div className="space-y-8 py-6">
      <div className="max-w-3xl mx-auto text-center space-y-4">
        <div className="inline-flex p-3.5 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-500 text-white shadow-xl shadow-purple-600/30 mb-1 border border-purple-400/30">
          <Sparkles className="w-8 h-8"/>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">AI Movie Recommendations</h1>
        <p className="text-sm text-gray-400 max-w-xl mx-auto leading-relaxed">
          Describe what mood, plot, theme, or vibe you are craving. CineAddict AI will match your request with curated movie cards.
        </p>

        {/* Input Form */}
        <form onSubmit={handleGetRecommendations} className="relative mt-6">
          <textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} rows={3} placeholder="e.g. I want an atmospheric sci-fi movie with time travel, emotional storytelling, and a haunting synth soundtrack..." className="w-full p-4 pr-36 bg-[#131927]/90 backdrop-blur-xl border border-white/10 rounded-2xl text-white text-sm sm:text-base placeholder-gray-400 focus:outline-none focus:border-purple-500/80 focus:ring-2 focus:ring-purple-500/30 shadow-2xl resize-none"/>

          <button type="submit" disabled={isLoading || !prompt.trim()} className="absolute right-3 bottom-3 px-5 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 disabled:opacity-50 text-white font-bold text-xs sm:text-sm rounded-xl transition-all shadow-lg shadow-purple-600/30 flex items-center gap-1.5 border border-purple-400/30">
            {isLoading ? 'Analyzing...' : 'Get Recommendations'}
            {!isLoading && <Send className="w-4 h-4"/>}
          </button>
        </form>

        {/* Sample Prompt Chips */}
        <div className="pt-2 text-left space-y-2">
          <span className="text-xs font-bold text-gray-300 uppercase tracking-wider">Try an idea:</span>
          <div className="flex flex-wrap gap-2">
            {samplePrompts.map((sample, idx) => (<button key={idx} type="button" onClick={() => handleSampleClick(sample)} className="px-3 py-1.5 bg-slate-900/80 hover:bg-purple-900/40 hover:text-purple-300 border border-white/10 hover:border-purple-500/40 rounded-xl text-xs text-gray-200 transition-colors text-left shadow-sm">
                &quot;{sample}&quot;
              </button>))}
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (<div className="bg-amber-950/80 border border-amber-500/40 rounded-2xl p-4 text-amber-200 text-xs flex items-center gap-3 max-w-2xl mx-auto backdrop-blur-md">
          <AlertCircle className="w-5 h-5 text-amber-400 shrink-0"/>
          <span>{error}</span>
        </div>)}

      {/* Loading state */}
      {isLoading && (<div className="py-12">
          <LoadingSpinner message="Consulting AI recommendation engine..."/>
        </div>)}

      {/* Results Display as Movie Cards */}
      {!isLoading && searched && (<div className="space-y-6">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-400"/> AI Matched Recommendations
            </h2>
            <span className="text-xs text-purple-400 font-bold">{recommendations.length} movies found</span>
          </div>

          {recommendations.length === 0 ? (<div className="flex flex-col items-center justify-center p-12 bg-[#131927]/80 backdrop-blur-md rounded-2xl border border-white/10 text-center space-y-3">
              <Film className="w-12 h-12 text-purple-400/50 stroke-1 animate-pulse"/>
              <h3 className="text-base font-semibold text-gray-300">No matching recommendations found</h3>
              <p className="text-xs text-gray-400 max-w-sm">
                Try refining your prompt with more specific themes, actors, or movie titles.
              </p>
            </div>) : (<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-5">
              {recommendations.map((item, idx) => (<MovieCard key={item.id ? `${item.id}-${idx}` : idx} movie={item}/>))}
            </div>)}
        </div>)}
    </div>);
};
export default AiRecommendations;
