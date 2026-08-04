import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiService, getBackendUrl, setBackendUrl } from '../services/api';
const AuthContext = createContext(undefined);
// Helper to determine active user storage scope key
const getUserKey = (u) => {
    if (!u)
        return 'guest';
    return String(u.id || u.email || u.username || 'user');
};
const getScopedCollection = (key, userKey) => {
    try {
        const stored = localStorage.getItem(`cineaddict_${key}_${userKey}`);
        if (stored)
            return JSON.parse(stored);
        // Legacy fallback for initial migration from un-scoped keys
        if (userKey !== 'guest') {
            const legacy = localStorage.getItem(`cineaddict_${key}`);
            if (legacy)
                return JSON.parse(legacy);
        }
    }
    catch {
        // Ignore JSON errors
    }
    return [];
};
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
    // App features local + backend synced states (isolated per user)
    const initialUserKey = getUserKey(user);
    const [favorites, setFavorites] = useState(() => getScopedCollection('favorites', initialUserKey));
    const [watchlist, setWatchlist] = useState(() => getScopedCollection('watchlist', initialUserKey));
    const [recentlyViewed, setRecentlyViewed] = useState(() => getScopedCollection('recently_viewed', initialUserKey));
    const [searchHistory, setSearchHistory] = useState(() => getScopedCollection('search_history', initialUserKey));
    // Sync state to user-scoped local storage for client UI persistence
    useEffect(() => {
        const currentKey = getUserKey(user);
        localStorage.setItem(`cineaddict_favorites_${currentKey}`, JSON.stringify(favorites));
    }, [favorites, user]);
    useEffect(() => {
        const currentKey = getUserKey(user);
        localStorage.setItem(`cineaddict_watchlist_${currentKey}`, JSON.stringify(watchlist));
    }, [watchlist, user]);
    useEffect(() => {
        const currentKey = getUserKey(user);
        localStorage.setItem(`cineaddict_recently_viewed_${currentKey}`, JSON.stringify(recentlyViewed));
    }, [recentlyViewed, user]);
    useEffect(() => {
        const currentKey = getUserKey(user);
        localStorage.setItem(`cineaddict_search_history_${currentKey}`, JSON.stringify(searchHistory));
    }, [searchHistory, user]);
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
        if (!token)
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
            if (favs.status === 'fulfilled' && Array.isArray(favs.value)) {
                const normalizedFavs = favs.value.map((f) => ({
                    ...f,
                    id: f.movie_id || f.id,
                    title: f.movie_title || f.title || f.name,
                    poster_path: f.poster_url || f.poster_path,
                }));
                setFavorites(normalizedFavs);
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
            if (rv.status === 'fulfilled' && Array.isArray(rv.value)) {
                const normalizedRv = rv.value.map((r) => ({
                    ...r,
                    id: r.movie_id || r.id,
                    title: r.movie_title || r.title || r.name,
                    poster_path: r.poster_url || r.poster_path,
                }));
                setRecentlyViewed(normalizedRv);
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
                        const uKey = getUserKey(parsedUser);
                        setFavorites(getScopedCollection('favorites', uKey));
                        setWatchlist(getScopedCollection('watchlist', uKey));
                        setRecentlyViewed(getScopedCollection('recently_viewed', uKey));
                        setSearchHistory(getScopedCollection('search_history', uKey));
                    }
                    catch {
                        setUser(null);
                    }
                }
                await refreshUserData();
            }
            setIsLoading(false);
        };
        initApp();
    }, []);
    const login = async (email, pass) => {
        const response = await apiService.login(email, pass);
        const authToken = response.token || response.access_token || response.jwt;
        const userData = response.user || { email, username: email.split('@')[0], id: Date.now() };
        const newKey = getUserKey(userData);
        if (authToken) {
            localStorage.setItem('cineaddict_token', authToken);
            setToken(authToken);
        }
        localStorage.setItem('cineaddict_user', JSON.stringify(userData));
        setUser(userData);
        // Instantly switch state to newly logged in user scope
        setFavorites(getScopedCollection('favorites', newKey));
        setWatchlist(getScopedCollection('watchlist', newKey));
        setRecentlyViewed(getScopedCollection('recently_viewed', newKey));
        setSearchHistory(getScopedCollection('search_history', newKey));
        await refreshUserData();
    };
    const register = async (username, email, pass) => {
        const response = await apiService.register(username, email, pass);
        const authToken = response.token || response.access_token;
        const userData = response.user || { username, email, id: Date.now() };
        const newKey = getUserKey(userData);
        if (authToken) {
            localStorage.setItem('cineaddict_token', authToken);
            setToken(authToken);
        }
        localStorage.setItem('cineaddict_user', JSON.stringify(userData));
        setUser(userData);
        // Instantly switch state to newly registered user scope
        setFavorites(getScopedCollection('favorites', newKey));
        setWatchlist(getScopedCollection('watchlist', newKey));
        setRecentlyViewed(getScopedCollection('recently_viewed', newKey));
        setSearchHistory(getScopedCollection('search_history', newKey));
        await refreshUserData();
    };
    const logout = () => {
        localStorage.removeItem('cineaddict_token');
        localStorage.removeItem('cineaddict_user');
        setToken(null);
        setUser(null);
        // Reset user state to guest scope
        setFavorites(getScopedCollection('favorites', 'guest'));
        setWatchlist(getScopedCollection('watchlist', 'guest'));
        setRecentlyViewed(getScopedCollection('recently_viewed', 'guest'));
        setSearchHistory(getScopedCollection('search_history', 'guest'));
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
