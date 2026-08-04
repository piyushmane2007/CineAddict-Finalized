import React from 'react';
import { getImageUrl } from '../utils/movieHelpers';
export const CastCard = ({ cast }) => {
    if (!cast)
        return null;
    const photoPath = cast.profile_path || cast.profile_url || cast.photo;
    const actorName = cast.name || 'Unknown Actor';
    const character = cast.character || cast.role || '';
    return (<div className="shrink-0 w-28 sm:w-36 bg-[#131927]/90 backdrop-blur-md rounded-2xl overflow-hidden border border-white/10 hover:border-purple-500/60 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-[0_4px_20px_rgba(139,92,246,0.3)] snap-start">
      <div className="aspect-[3/4] w-full bg-slate-950 overflow-hidden relative">
        <img src={getImageUrl(photoPath, 'profile')} alt={actorName} loading="lazy" className="w-full h-full object-cover" onError={(e) => {
            e.target.src =
                'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80';
        }}/>
      </div>
      <div className="p-3 space-y-0.5">
        <p className="font-bold text-xs text-white line-clamp-1" title={actorName}>
          {actorName}
        </p>
        {character && (<p className="text-[11px] line-clamp-1 font-medium text-purple-300/80" title={character}>
            {character}
          </p>)}
      </div>
    </div>);
};
export default CastCard;

