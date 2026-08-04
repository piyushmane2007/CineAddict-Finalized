import React from 'react';
import { Link } from 'react-router-dom';
import { Film, Heart, Shield, Sparkles, Clapperboard, Tv } from 'lucide-react';
export const Footer = () => {
    return (<footer className="bg-[#0b0f19]/90 backdrop-blur-xl border-t border-white/10 text-gray-300 py-12 px-4 sm:px-6 lg:px-8 mt-20 relative z-10">
      <div className="max-w-7xl mx-auto space-y-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
          {/* Col 1: Brand */}
          <div className="space-y-4 md:col-span-1">
            <Link to="/" className="flex items-center gap-2.5 font-black text-2xl text-white group">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-amber-500 flex items-center justify-center text-white shadow-lg shadow-purple-600/30 group-hover:scale-105 transition-transform border border-purple-400/30">
                <Film className="w-5 h-5 stroke-[2.5]"/>
              </div>
              <span className="tracking-tight">
                Cine<span className="text-purple-400">Addict</span>
              </span>
            </Link>
            <p className="text-xs leading-relaxed text-gray-400">
              The premier destination for film lovers. Discover trending blockbusters, curate custom watchlists, review cast profiles, and receive AI-driven recommendations.
            </p>

            {/* Removed badges per user request */}
          </div>

          {/* Col 2: Explore */}
          <div className="space-y-3">
            <h4 className="text-xs font-extrabold text-white uppercase tracking-wider flex items-center gap-1.5">
              <Tv className="w-3.5 h-3.5 text-purple-400"/> Discover
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link to="/" className="text-gray-400 hover:text-purple-300 transition-colors flex items-center gap-2">
                  <span>Trending Movies</span>
                </Link>
              </li>
              <li>
                <Link to="/search" className="text-gray-400 hover:text-purple-300 transition-colors flex items-center gap-2">
                  <span>Search Catalog</span>
                </Link>
              </li>
              <li>
                <Link to="/recommendations" className="text-gray-400 hover:text-purple-300 transition-colors flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400"/>
                  <span>AI Recommendations</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Library */}
          <div className="space-y-3">
            <h4 className="text-xs font-extrabold text-white uppercase tracking-wider flex items-center gap-1.5">
              <Clapperboard className="w-3.5 h-3.5 text-purple-400"/> My Library
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link to="/favorites" className="text-gray-400 hover:text-purple-300 transition-colors">
                  Favorite Movies
                </Link>
              </li>
              <li>
                <Link to="/watchlist" className="text-gray-400 hover:text-purple-300 transition-colors">
                  Watchlist & Bookmarks
                </Link>
              </li>
              <li>
                <Link to="/recently-viewed" className="text-gray-400 hover:text-purple-300 transition-colors">
                  Recently Viewed
                </Link>
              </li>
              <li>
                <Link to="/search-history" className="text-gray-400 hover:text-purple-300 transition-colors">
                  Search Log History
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Integration */}
          <div className="space-y-3">
            <h4 className="text-xs font-extrabold text-white uppercase tracking-wider flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-purple-400"/> System Integration
            </h4>
            <div className="p-4 bg-[#131927]/90 rounded-2xl border border-white/10 space-y-2 text-xs text-gray-300 shadow-md">
              <div className="flex items-center gap-1.5 text-purple-300 font-bold">
                <Shield className="w-4 h-4 text-purple-400"/> Flask Backend API
              </div>
              <p className="text-[11px] text-gray-400 leading-relaxed">
                Seamless synchronization with custom Flask REST endpoints for watchlists and search queries.
              </p>
              <Link to="/profile" className="inline-block text-[11px] text-purple-400 hover:text-purple-300 font-bold underline pt-1">
                Configure Endpoint Settings →
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-400 gap-4">
          <p>© {new Date().getFullYear()} CineAddict. Crafted for cinematic passion.</p>
          <div className="flex items-center gap-1 text-gray-400 font-medium">
            <span>Made with</span>
            <Heart className="w-3.5 h-3.5 text-purple-400 fill-current inline mx-0.5"/>
            <span>for cinephiles everywhere.</span>
          </div>
        </div>
      </div>
    </footer>);
};
export default Footer;
