import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Film, Search, Sparkles, Heart, Bookmark, Clock, History, User, LogIn, Menu, X, Server, LogOut, } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
export const Navbar = () => {
    const { user, isAuthenticated, logout, isBackendConnected, favorites, watchlist } = useAuth();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const navigate = useNavigate();
    const navLinks = [
        { path: '/', label: 'Home', icon: Film },
        { path: '/search', label: 'Search', icon: Search },
        { path: '/recommendations', label: 'AI Recommendations', icon: Sparkles, badge: 'AI' },
        { path: '/favorites', label: 'Favorites', icon: Heart, count: favorites.length },
        { path: '/watchlist', label: 'Watchlist', icon: Bookmark, count: watchlist.length },
        { path: '/recently-viewed', label: 'Recently Viewed', icon: Clock },
        { path: '/search-history', label: 'Search History', icon: History },
    ];
    const handleLogout = () => {
        logout();
        navigate('/');
        setMobileMenuOpen(false);
    };
    return (<header className="sticky top-0 z-40 w-full bg-[#0b0f19]/80 backdrop-blur-xl border-b border-white/10 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2.5 group font-black text-xl sm:text-2xl tracking-wider text-white">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-violet-500 flex items-center justify-center text-white shadow-lg shadow-purple-600/30 group-hover:scale-105 transition-transform">
            <Film className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.5]"/>
          </div>
          <span className="bg-gradient-to-r from-white via-gray-100 to-purple-400 bg-clip-text text-transparent font-extrabold tracking-tight">
            Cine<span className="text-purple-400">Addict</span>
          </span>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
          {navLinks.map((link) => {
            const Icon = link.icon;
            return (<NavLink key={link.path} to={link.path} className={({ isActive }) => `px-3 py-2 rounded-xl text-xs xl:text-sm font-semibold flex items-center gap-1.5 transition-all ${isActive
                    ? 'bg-purple-600/20 text-purple-300 border border-purple-500/40 shadow-[0_0_15px_rgba(139,92,246,0.25)]'
                    : 'text-gray-300 hover:text-white hover:bg-white/5 hover:border hover:border-white/10'}`}>
                <Icon className="w-4 h-4"/>
                <span>{link.label}</span>
                {link.badge && (<span className="ml-0.5 px-1.5 py-0.2 bg-gradient-to-r from-purple-600 to-indigo-500 text-[10px] font-extrabold text-white rounded-full uppercase tracking-widest shadow-sm">
                    {link.badge}
                  </span>)}
                {link.count !== undefined && link.count > 0 && (<span className="ml-1 px-1.5 py-0.5 bg-purple-950/80 text-[10px] font-bold text-purple-200 border border-purple-800/60 rounded-full">
                    {link.count}
                  </span>)}
              </NavLink>);
        })}
        </nav>

        {/* User Auth & Actions */}
        <div className="hidden lg:flex items-center gap-3">
          {/* Backend Status Indicator */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-900/90 border border-white/10 text-xs text-gray-400" title={`Flask Backend: ${isBackendConnected ? 'Online' : 'Offline'}`}>
            <Server className="w-3.5 h-3.5 text-gray-400"/>
            <span className={`w-2 h-2 rounded-full ${isBackendConnected ? 'bg-emerald-400 shadow-sm shadow-emerald-400' : 'bg-amber-400'}`}/>
          </div>

          {isAuthenticated ? (<div className="flex items-center gap-2">
              <Link to="/profile" className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-purple-950/40 border border-white/10 hover:border-purple-500/40 text-sm font-medium text-gray-200 transition-colors">
                <div className="w-6 h-6 rounded-full bg-purple-600 flex items-center justify-center text-xs font-bold text-white shadow-sm">
                  {user?.username?.[0]?.toUpperCase() || 'U'}
                </div>
                <span className="max-w-[100px] truncate">{user?.username || 'Profile'}</span>
              </Link>

              <button type="button" onClick={handleLogout} className="p-2 text-gray-400 hover:text-purple-400 rounded-xl hover:bg-white/5 transition-colors" title="Logout">
                <LogOut className="w-4 h-4"/>
              </button>
            </div>) : (<Link to="/login" className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs sm:text-sm rounded-xl transition-all shadow-lg shadow-purple-600/30 flex items-center gap-1.5 border border-purple-400/30 hover:shadow-purple-600/50">
              <LogIn className="w-4 h-4"/> Sign In
            </Link>)}
        </div>

        {/* Mobile Toggle Button */}
        <button type="button" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="lg:hidden p-2 text-gray-300 hover:text-white rounded-xl hover:bg-white/10">
          {mobileMenuOpen ? <X className="w-6 h-6"/> : <Menu className="w-6 h-6"/>}
        </button>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (<div className="lg:hidden bg-[#0e1320]/95 backdrop-blur-2xl border-b border-white/10 px-4 py-6 space-y-4 shadow-2xl">
          <div className="space-y-1">
            {navLinks.map((link) => {
                const Icon = link.icon;
                return (<NavLink key={link.path} to={link.path} onClick={() => setMobileMenuOpen(false)} className={({ isActive }) => `px-4 py-3 rounded-xl text-sm font-semibold flex items-center justify-between transition-colors ${isActive ? 'bg-purple-600/20 text-purple-300 font-bold border border-purple-500/30' : 'text-gray-300 hover:bg-white/5'}`}>
                  <div className="flex items-center gap-3">
                    <Icon className="w-5 h-5 text-purple-400"/>
                    <span>{link.label}</span>
                  </div>
                  {link.count !== undefined && link.count > 0 && (<span className="px-2 py-0.5 bg-purple-950 text-xs font-bold text-purple-200 border border-purple-800/60 rounded-full">
                      {link.count}
                    </span>)}
                </NavLink>);
            })}
          </div>

          <div className="pt-4 border-t border-white/10 flex items-center justify-between">
            {isAuthenticated ? (<div className="flex items-center justify-between w-full">
                <Link to="/profile" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2 text-sm font-bold text-gray-200">
                  <User className="w-5 h-5 text-purple-400"/>
                  <span>{user?.username || 'My Profile'}</span>
                </Link>

                <button onClick={handleLogout} className="px-3 py-1.5 bg-slate-900 hover:bg-purple-900/50 text-purple-300 text-xs rounded-lg font-bold transition-colors border border-white/10">
                  Logout
                </button>
              </div>) : (<Link to="/login" onClick={() => setMobileMenuOpen(false)} className="w-full py-3 bg-purple-600 hover:bg-purple-500 text-white font-bold text-center rounded-xl transition-all shadow-lg shadow-purple-600/30 flex items-center justify-center gap-2 border border-purple-400/30">
                <LogIn className="w-4 h-4"/> Login / Register
              </Link>)}
          </div>
        </div>)}
    </header>);
};
export default Navbar;
