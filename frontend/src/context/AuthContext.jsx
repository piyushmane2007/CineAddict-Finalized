import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiService, getBackendUrl, setBackendUrl } from '../services/api';
const AuthContext = createContext(undefined);
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        try {
            const storedUser = localStorage.getItem('cineaddict_user');
            return storedUser ? JSON.parse(storedUser) : null;
        }
        catch {
            return null;
        }
    });
    const [token, setToken] = useState(() => localStorage.getItem('cineaddict_token'));
    const [backendUrl, setBackendUrlState] = useState(getBackendUrl());
    const [isBackendConnected, setIsBackendConnected] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    // Favorites/Watchlist/RecentlyViewed/SearchHistory are NEVER cached in
    // localStorage and are NEVER seeded from cached frontend data. They always
    // start empty and, for an authenticated user, are populated exclusively
    // from the backend (see refreshUserData / resetCollections below). Guests
    // and brand-new users simply never have anything fetched for them, so
    // their collections stay empty.
    const [favorites, setFavorites] = useState([]);
    const [watchlist, setWatchlist] = useState([]);
    const [recentlyViewed, setRecentlyViewed] = useState([]);
    const [searchHistory, setSearchHistory] = useState([]);
    // Clears all in-memory collections. Used whenever the active identity
    // changes (login, register, logout, app init) so no stale/previous
    // user's data can ever leak into the new session before a fresh
    // backend fetch (or, for guests, permanently).
    const resetCollections = () => {
        setFavorites([]);
        setWatchlist([]);
        setRecentlyViewed([]);
        setSearchHistory([]);
    };
    // Ping backend to check connection
    const checkBackendConnection = async () => {
        try {
            await apiService.checkHealth();
            setIsBackendConnected(true);
            return true;
        }
        catch {
            setIsBackendConnected(false);
            return false;
        }
    };
    const updateBackendUrl = async (newUrl) => {
        setBackendUrl(newUrl);
        setBackendUrlState(newUrl);
        return await checkBackendConnection();
    };
    // Sync user data with backend
    const refreshUserData = async () => {
        // `token` here can be a stale closure value if this is called in the
        // same tick as setToken(...) (e.g. right after login/register), since
        // the state update hasn't been applied to this render's closure yet.
        // Fall back to reading the just-persisted value directly so the
        // backend fetch always actually runs when there IS a valid session.
        const activeToken = token || localStorage.getItem('cineaddict_token');
        if (!activeToken)
            return;
        try {
            const profile = await apiService.getProfile();
            if (profile)
                setUser(profile.user || profile);
            // Fetch user specific collections from Flask backend
            const [favs, wl, rv, sh] = await Promise.allSettled([
                apiService.getFavorites(),
                apiService.getWatchlist(),
                apiService.getRecentlyViewed(),
                apiService.getSearchHistory()
            ]);
            // Every collection is fully REPLACED with what the backend just
            // returned for this user - never merged with whatever was in
            // state before. If a call fails, the collection is set to empty
            // rather than left holding a previous (possibly different
            // user's) value.
            if (favs.status === 'fulfilled' && Array.isArray(favs.value)) {
                const normalizedFavs = favs.value.map((f) => ({
                    ...f,
                    id: f.movie_id || f.id,
                    title: f.movie_title || f.title || f.name,
                    poster_path: f.poster_url || f.poster_path,
                }));
                setFavorites(normalizedFavs);
            }
            else {
                setFavorites([]);
            }
            if (wl.status === 'fulfilled' && Array.isArray(wl.value)) {
                const normalizedWl = wl.value.map((w) => ({
                    ...w,
                    id: w.movie_id || w.id,
                    title: w.movie_title || w.title || w.name,
                    poster_path: w.poster_url || w.poster_path,
                }));
                setWatchlist(normalizedWl);
            }
            else {
                setWatchlist([]);
            }
            if (rv.status === 'fulfilled' && Array.isArray(rv.value)) {
                const normalizedRv = rv.value.map((r) => ({
                    ...r,
                    id: r.movie_id || r.id,
                    title: r.movie_title || r.title || r.name,
                    poster_path: r.poster_url || r.poster_path,
                }));
                setRecentlyViewed(normalizedRv);
            }
            else {
                setRecentlyViewed([]);
            }
            if (sh.status === 'fulfilled' && Array.isArray(sh.value)) {
                const normalizedSh = sh.value.map((s, idx) => ({
                    id: s.id || idx,
                    query: s.search_query || s.query || '',
                    timestamp: s.created_at || new Date().toISOString(),
                    count: 1,
                }));
                setSearchHistory(normalizedSh);
            }
            else {
                setSearchHistory([]);
            }
        }
        catch (err) {
            console.warn('Could not refresh backend user profile:', err);
        }
    };
    useEffect(() => {
        const initApp = async () => {
            setIsLoading(true);
            await checkBackendConnection();
            const storedToken = localStorage.getItem('cineaddict_token');
            if (storedToken) {
                setToken(storedToken);
                const storedUser = localStorage.getItem('cineaddict_user');
                if (storedUser) {
                    try {
                        const parsedUser = JSON.parse(storedUser);
                        setUser(parsedUser);
                    }
                    catch {
                        setUser(null);
                    }
                }
                // Collections are never restored from localStorage. Start
                // clean and let refreshUserData populate them straight from
                // the backend for this user.
                resetCollections();
                await refreshUserData();
            }
            else {
                // No session -> guest. Guests always have empty collections.
                resetCollections();
            }
            setIsLoading(false);
        };
        initApp();
    }, []);
    const login = async (email, pass) => {
        const response = await apiService.login(email, pass);
        const authToken = response.token || response.access_token || response.jwt;
        const userData = response.user || { email, username: email.split('@')[0], id: Date.now() };
        if (authToken) {
            localStorage.setItem('cineaddict_token', authToken);
            setToken(authToken);
        }
        localStorage.setItem('cineaddict_user', JSON.stringify(userData));
        setUser(userData);
        // Wipe whatever was in memory (e.g. guest's empty state, or a
        // previous user's data) before pulling this user's real collections
        // from the backend. Never reuse cached frontend data here.
        resetCollections();
        await refreshUserData();
    };
    const register = async (username, email, pass) => {
        const response = await apiService.register(username, email, pass);
        const authToken = response.token || response.access_token;
        const userData = response.user || { username, email, id: Date.now() };
        if (authToken) {
            localStorage.setItem('cineaddict_token', authToken);
            setToken(authToken);
        }
        localStorage.setItem('cineaddict_user', JSON.stringify(userData));
        setUser(userData);
        // A brand-new account has nothing yet. Reset locally and fetch from
        // the backend (which will correctly return empty collections for a
        // new user_id) rather than ever reusing any previous local state.
        resetCollections();
        await refreshUserData();
    };
    const logout = () => {
        localStorage.removeItem('cineaddict_token');
        localStorage.removeItem('cineaddict_user');
        setToken(null);
        setUser(null);
        // Guest always starts (and stays) with empty collections - nothing
        // is fetched or restored for a guest.
        resetCollections();
    };
    const isFavorite = (movieId) => {
        return favorites.some((m) => String(m.id) === String(movieId));
    };
    const toggleFavorite = async (movie) => {
        const exists = isFavorite(movie.id);
        if (exists) {
            setFavorites((prev) => prev.filter((m) => String(m.id) !== String(movie.id)));
            try {
                await apiService.removeFavorite(movie.id);
            }
            catch (e) {
                console.warn('Backend favorite remove fallback:', e);
            }
        }
        else {
            setFavorites((prev) => [movie, ...prev.filter((m) => String(m.id) !== String(movie.id))]);
            try {
                await apiService.addFavorite(movie);
            }
            catch (e) {
                console.warn('Backend favorite add fallback:', e);
            }
        }
    };
    const isInWatchlist = (movieId) => {
        return watchlist.some((m) => String(m.id) === String(movieId));
    };
    const toggleWatchlist = async (movie) => {
        const exists = isInWatchlist(movie.id);
        if (exists) {
            setWatchlist((prev) => prev.filter((m) => String(m.id) !== String(movie.id)));
            try {
                await apiService.removeFromWatchlist(movie.id);
            }
            catch (e) {
                console.warn('Backend watchlist remove fallback:', e);
            }
        }
        else {
            setWatchlist((prev) => [movie, ...prev.filter((m) => String(m.id) !== String(movie.id))]);
            try {
                await apiService.addToWatchlist(movie);
            }
            catch (e) {
                console.warn('Backend watchlist add fallback:', e);
            }
        }
    };
    const recordViewedMovie = (movie) => {
        if (!movie || !movie.id)
            return;
        setRecentlyViewed((prev) => {
            const filtered = prev.filter((m) => String(m.id) !== String(movie.id));
            return [movie, ...filtered].slice(0, 30);
        });
        apiService.addRecentlyViewed(movie);
    };
    const recordSearchQuery = (query) => {
        if (!query || !query.trim())
            return;
        const cleanQuery = query.trim();
        setSearchHistory((prev) => {
            const existing = prev.find((item) => item.query.toLowerCase() === cleanQuery.toLowerCase());
            const filtered = prev.filter((item) => item.query.toLowerCase() !== cleanQuery.toLowerCase());
            const newCount = existing ? (existing.count || 1) + 1 : 1;
            const newItem = {
                id: Date.now(),
                query: cleanQuery,
                timestamp: new Date().toISOString(),
                count: newCount,
            };
            return [newItem, ...filtered].slice(0, 50);
        });
        apiService.addSearchHistory(cleanQuery);
    };
    const clearSearchHistory = async () => {
        setSearchHistory([]);
        try {
            await apiService.clearSearchHistory();
        }
        catch (e) {
            console.warn('Backend search history clear fallback:', e);
        }
    };
    const clearRecentlyViewed = async () => {
        setRecentlyViewed([]);
        try {
            await apiService.clearRecentlyViewed();
        }
        catch (e) {
            console.warn('Backend recently viewed clear fallback:', e);
        }
    };
    return (<AuthContext.Provider value={{
            user,
            token,
            isAuthenticated: !!token || !!user,
            isLoading,
            backendUrl,
            isBackendConnected,
            favorites,
            watchlist,
            recentlyViewed,
            searchHistory,
            login,
            register,
            logout,
            updateBackendUrl,
            checkBackendConnection,
            toggleFavorite,
            isFavorite,
            toggleWatchlist,
            isInWatchlist,
            recordViewedMovie,
            recordSearchQuery,
            clearSearchHistory,
            clearRecentlyViewed,
            refreshUserData,
        }}>
      {children}
    </AuthContext.Provider>);
};
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
