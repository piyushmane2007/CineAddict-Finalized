import React from 'react';
import { Star, User as UserIcon } from 'lucide-react';
import { formatRating } from '../utils/movieHelpers';
export const ReviewCard = ({ review }) => {
    if (!review)
        return null;
    const authorName = review.author || review.username || 'CineAddict User';
    const rating = review.rating;
    const content = review.content || review.review || '';
    return (<div className="bg-[#131927]/80 backdrop-blur-md border border-white/10 rounded-2xl p-4 sm:p-5 space-y-3 shadow-md hover:border-purple-500/40 transition-all duration-300">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-600 to-indigo-500 flex items-center justify-center text-white font-bold text-sm shrink-0 overflow-hidden shadow-md shadow-purple-600/20">
            {review.avatar_url ? (<img src={review.avatar_url} alt={authorName} className="w-full h-full object-cover"/>) : (<UserIcon className="w-5 h-5 text-white"/>)}
          </div>
          <div>
            <h4 className="font-bold text-sm text-gray-200">{authorName}</h4>
            {review.created_at && (<p className="text-xs text-purple-300/70">
                {new Date(review.created_at).toLocaleDateString(undefined, {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
            })}
              </p>)}
          </div>
        </div>

        {rating !== undefined && rating !== null && (<div className="px-2.5 py-1 bg-amber-500/10 border border-amber-500/30 rounded-xl flex items-center gap-1 text-xs font-bold text-amber-400">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400"/>
            <span>{formatRating(rating)} / 10</span>
          </div>)}
      </div>

      <p className="text-sm text-gray-300 leading-relaxed whitespace-pre-line">{content}</p>
    </div>);
};
export default ReviewCard;
