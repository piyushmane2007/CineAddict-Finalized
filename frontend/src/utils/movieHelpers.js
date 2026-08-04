export const getImageUrl = (path, type = 'poster') => {
    if (!path) {
        if (type === 'poster')
            return 'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=500&q=80';
        if (type === 'backdrop')
            return 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=1200&q=80';
        return 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80';
    }
    // If path is already a full URL
    if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('data:')) {
        return path;
    }
    // Standard TMDB URL resolution
    const size = type === 'poster' ? 'w500' : type === 'backdrop' ? 'w1280' : 'w185';
    return `https://image.tmdb.org/t/p/${size}${path.startsWith('/') ? '' : '/'}${path}`;
};
export const getReleaseYear = (dateStr) => {
    if (!dateStr)
        return '';
    const str = String(dateStr);
    if (str.length >= 4)
        return str.substring(0, 4);
    return str;
};
export const formatRuntime = (minutes) => {
    if (!minutes)
        return '2h 15m';
    const hrs = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hrs > 0 ? `${hrs}h ${mins}m` : `${mins}m`;
};
export const formatRating = (rating) => {
    if (rating === undefined || rating === null)
        return 'N/A';
    return Number(rating).toFixed(1);
};
export const getYoutubeTrailerUrl = (movieTitle, youtubeId, trailerUrl) => {
    const cleanTitle = (movieTitle || '').trim();
    if (cleanTitle) {
        const searchQuery = encodeURIComponent(`${cleanTitle} official trailer`);
        return `https://www.youtube.com/results?search_query=${searchQuery}`;
    }
    if (trailerUrl && (trailerUrl.startsWith('http://') || trailerUrl.startsWith('https://')) && !trailerUrl.includes('3B8-K_rN7Uo')) {
        return trailerUrl;
    }
    if (youtubeId && youtubeId !== '3B8-K_rN7Uo') {
        return `https://www.youtube.com/watch?v=${youtubeId}`;
    }
    return `https://www.youtube.com/results?search_query=official+movie+trailer`;
};
