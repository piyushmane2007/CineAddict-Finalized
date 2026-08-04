import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Heart, Bookmark, Clock, History, Server, LogOut, Settings, CheckCircle2, AlertTriangle, RefreshCw, } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
export const Profile = () => {
    const { user, isAuthenticated, logout, favorites, watchlist, recentlyViewed, searchHistory, backendUrl, isBackendConnected, updateBackendUrl, checkBackendConnection, } = useAuth();
    const navigate = useNavigate();
    const [urlInput, setUrlInput] = useState(backendUrl);
    const [isUpdatingUrl, setIsUpdatingUrl] = useState(false);
    const [urlMessage, setUrlMessage] = useState(null);
    const handleLogout = () => {
        logout();
        navigate('/login');
    };
    const handleSaveUrl = async (e) => {
        e.preventDefault();
        setIsUpdatingUrl(true);
        setUrlMessage(null);
        const success = await updateBackendUrl(urlInput);
        setIsUpdatingUrl(false);
        if (success) {
            setUrlMessage('Backend URL updated and verified successfully!');
        }
        else {
            setUrlMessage(`Unable to connect to ${urlInput}. Please confirm your Flask server is running.`);
        }
    };
    const handleTestConnection = async () => {
        setIsUpdatingUrl(true);
        setUrlMessage(null);
        const connected = await checkBackendConnection();
        setIsUpdatingUrl(false);
        if (connected) {
            setUrlMessage('Connection test passed! Flask server is active.');
        }
        else {
            setUrlMessage(`Connection test failed for ${backendUrl}. Check Flask server.`);
        }
    };
    return (<div className="space-y-8 py-6 max-w-4xl mx-auto">
      {/* Profile Header */}
      <div className="bg-[#131927]/90 backdrop-blur-xl border border-white/10 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-2xl shadow-purple-950/20">
        <div className="flex items-center gap-5 text-center sm:text-left flex-col sm:flex-row">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-purple-600 to-indigo-500 flex items-center justify-center text-white text-3xl font-black shadow-xl shadow-purple-600/30 border border-purple-400/30">
            {user?.username?.[0]?.toUpperCase() || 'C'}
          </div>
          <div className="space-y-1">
            <h1 className="text-2xl font-black text-white">{user?.username || 'CineAddict Guest'}</h1>
            <p className="text-xs text-gray-300 flex items-center justify-center sm:justify-start gap-1.5">
              <Mail className="w-3.5 h-3.5 text-purple-400"/>
              {user?.email || 'guest@cineaddict.app'}
            </p>
            <p className="text-[11px] text-gray-400 font-medium pt-1">
              Member Status: <span className="text-purple-400 font-bold">{isAuthenticated ? 'Active User' : 'Guest Session'}</span>
            </p>
          </div>
        </div>

        {isAuthenticated ? (<button type="button" onClick={handleLogout} className="px-5 py-2.5 bg-slate-900/80 hover:bg-purple-900/40 border border-white/10 text-purple-300 font-bold text-xs rounded-xl transition-all flex items-center gap-2 shadow-md">
            <LogOut className="w-4 h-4"/> Sign Out
          </button>) : (<button type="button" onClick={() => navigate('/login')} className="px-5 py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-purple-600/30 transition-all border border-purple-400/30">
            Sign In
          </button>)}
      </div>

      {/* Stats Summary Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div onClick={() => navigate('/favorites')} className="bg-[#131927]/80 hover:bg-[#182035] backdrop-blur-md border border-white/10 hover:border-purple-500/50 rounded-2xl p-4 cursor-pointer transition-all space-y-1 group shadow-md">
          <div className="flex items-center justify-between text-purple-400">
            <Heart className="w-5 h-5 fill-current"/>
            <span className="text-2xl font-black text-white">{favorites.length}</span>
          </div>
          <p className="text-xs font-bold text-gray-300 group-hover:text-purple-300 transition-colors">Favorites</p>
        </div>

        <div onClick={() => navigate('/watchlist')} className="bg-[#131927]/80 hover:bg-[#182035] backdrop-blur-md border border-white/10 hover:border-amber-500/50 rounded-2xl p-4 cursor-pointer transition-all space-y-1 group shadow-md">
          <div className="flex items-center justify-between text-amber-400">
            <Bookmark className="w-5 h-5 fill-current"/>
            <span className="text-2xl font-black text-white">{watchlist.length}</span>
          </div>
          <p className="text-xs font-bold text-gray-300 group-hover:text-amber-300 transition-colors">Watchlist</p>
        </div>

        <div onClick={() => navigate('/recently-viewed')} className="bg-[#131927]/80 hover:bg-[#182035] backdrop-blur-md border border-white/10 hover:border-blue-500/50 rounded-2xl p-4 cursor-pointer transition-all space-y-1 group shadow-md">
          <div className="flex items-center justify-between text-blue-400">
            <Clock className="w-5 h-5"/>
            <span className="text-2xl font-black text-white">{recentlyViewed.length}</span>
          </div>
          <p className="text-xs font-bold text-gray-300 group-hover:text-blue-300 transition-colors">Recently Viewed</p>
        </div>

        <div onClick={() => navigate('/search-history')} className="bg-[#131927]/80 hover:bg-[#182035] backdrop-blur-md border border-white/10 hover:border-indigo-500/50 rounded-2xl p-4 cursor-pointer transition-all space-y-1 group shadow-md">
          <div className="flex items-center justify-between text-indigo-400">
            <History className="w-5 h-5"/>
            <span className="text-2xl font-black text-white">{searchHistory.length}</span>
          </div>
          <p className="text-xs font-bold text-gray-300 group-hover:text-indigo-300 transition-colors">Search Logs</p>
        </div>
      </div>

      {/* Flask Backend Settings Section */}
      <div className="bg-[#131927]/90 backdrop-blur-xl border border-white/10 rounded-3xl p-6 sm:p-8 space-y-5 shadow-2xl">
        <div className="flex items-center justify-between border-b border-white/10 pb-3 flex-wrap gap-2">
          <div className="flex items-center gap-2.5">
            <Server className="w-5 h-5 text-purple-400"/>
            <h3 className="text-lg font-bold text-white">Flask Backend Settings</h3>
          </div>

          <div className="flex items-center gap-2">
            {isBackendConnected ? (<span className="px-2.5 py-1 bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 text-xs font-bold rounded-full flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5"/> Connected
              </span>) : (<span className="px-2.5 py-1 bg-amber-950/80 border border-amber-500/40 text-amber-400 text-xs font-bold rounded-full flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5"/> Offline
              </span>)}
          </div>
        </div>

        <p className="text-xs text-gray-300 leading-relaxed">
          Configure the REST API endpoint address for your local or remote Flask CineAddict backend server.
        </p>

        <form onSubmit={handleSaveUrl} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-300 uppercase tracking-wider">
              Flask Base URL (Default: http://127.0.0.1:5000)
            </label>
            <div className="flex items-center gap-2">
              <input type="text" value={urlInput} onChange={(e) => setUrlInput(e.target.value)} placeholder="http://127.0.0.1:5000" className="flex-grow px-4 py-2.5 bg-slate-950/80 border border-white/10 rounded-xl text-white font-mono text-sm focus:outline-none focus:border-purple-500"/>
              <button type="submit" disabled={isUpdatingUrl} className="px-4 py-2.5 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white font-bold text-xs rounded-xl transition-all flex items-center gap-1.5 shrink-0 shadow-md shadow-purple-600/30 border border-purple-400/30">
                {isUpdatingUrl && <RefreshCw className="w-3.5 h-3.5 animate-spin"/>}
                Save URL
              </button>
            </div>
          </div>
        </form>

        {urlMessage && (<p className={`text-xs p-3 rounded-xl font-semibold ${isBackendConnected
                ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/40'
                : 'bg-red-950/80 text-red-300 border border-red-500/40'}`}>
            {urlMessage}
          </p>)}

        <div className="pt-2 flex justify-between items-center text-xs text-gray-400">
          <span>Active URL: <code className="text-purple-300 font-mono">{backendUrl}</code></span>
          <button type="button" onClick={handleTestConnection} className="text-purple-400 hover:text-purple-300 font-bold underline flex items-center gap-1">
            <Settings className="w-3.5 h-3.5"/> Test Connection Now
          </button>
        </div>
      </div>
    </div>);
};
export default Profile;
