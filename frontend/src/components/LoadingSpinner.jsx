import React from 'react';
import { Film, Sparkles } from 'lucide-react';
export const LoadingSpinner = ({ message = 'Loading CineAddict experience...', fullPage = false, }) => {
    const content = (<div className="flex flex-col items-center justify-center p-8 space-y-4 text-center">
      <div className="relative flex items-center justify-center">
        {/* Glowing Background Pulse */}
        <div className="absolute w-20 h-20 bg-purple-600/20 rounded-full blur-xl animate-pulse"></div>

        {/* Outer Spinning Ring */}
        <div className="w-16 h-16 border-2 border-purple-500/20 border-t-purple-500 border-r-indigo-500 rounded-full animate-spin"></div>

        {/* Inner Counter-spinning Ring */}
        <div className="absolute w-10 h-10 border-2 border-purple-400/20 border-b-amber-400 rounded-full animate-[spin_1.5s_linear_infinite_reverse]"></div>

        {/* Center Film Icon with Pulse */}
        <Film className="absolute w-6 h-6 text-purple-400 animate-pulse stroke-[2]"/>
      </div>

      {message && (<div className="flex items-center gap-2 text-purple-200/90 text-sm font-semibold tracking-wide animate-pulse">
          <Sparkles className="w-3.5 h-3.5 text-amber-400"/>
          <span>{message}</span>
        </div>)}
    </div>);
    if (fullPage) {
        return (<div className="min-h-[70vh] flex items-center justify-center">
        <div className="bg-[#131927]/80 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl shadow-purple-950/30">
          {content}
        </div>
      </div>);
    }
    return content;
};
export default LoadingSpinner;
