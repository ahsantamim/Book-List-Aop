'use client';

import { useState } from 'react';
import { StarIcon } from '@heroicons/react/24/solid';
import { StarIcon as StarOutlineIcon } from '@heroicons/react/24/outline';

interface RatingStarsProps {
  rating: number;
  onRate?: (rating: number) => Promise<void>;
  readonly?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const sizeClasses = {
  sm: 'h-4 w-4',
  md: 'h-5 w-5',
  lg: 'h-6 w-6',
};

export default function RatingStars({
  rating,
  onRate,
  readonly = false,
  size = 'md',
}: RatingStarsProps) {
  const [hoveredRating, setHoveredRating] = useState<number | null>(null);
  const [isRating, setIsRating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const displayRating = hoveredRating ?? rating ?? 0;
  const sizeClass = sizeClasses[size];

  const handleRate = async (newRating: number) => {
    if (readonly || isRating || !onRate) return;
    
    setIsRating(true);
    setError(null);
    
    try {
      await onRate(newRating);
      setHoveredRating(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update rating');
      setHoveredRating(rating);
    } finally {
      setIsRating(false);
    }
  };

  return (
    <div className="space-y-1">
      <div 
        className="flex items-center gap-1"
        onMouseLeave={() => !isRating && setHoveredRating(null)}
      >
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            disabled={readonly || isRating}
            className={`${
              readonly ? 'cursor-default' : isRating ? 'cursor-wait' : 'cursor-pointer'
            } transition-colors duration-150 ${
              isRating ? 'opacity-50' : ''
            }`}
            onMouseEnter={() => !readonly && !isRating && setHoveredRating(star)}
            onClick={() => handleRate(star)}
            aria-label={`Rate ${star} stars`}
          >
            {star <= displayRating ? (
              <StarIcon 
                className={`${sizeClass} ${error ? 'text-red-400' : 'text-yellow-400'}`} 
              />
            ) : (
              <StarOutlineIcon 
                className={`${sizeClass} ${
                  error ? 'text-red-300' : 'text-gray-300 hover:text-yellow-400'
                }`} 
              />
            )}
          </button>
        ))}
        <span className={`ml-2 text-sm ${error ? 'text-red-500' : 'text-gray-500'}`}>
          {error || (isRating ? 'Updating...' : displayRating > 0 ? `${displayRating} stars` : 'Rate this book')}
        </span>
      </div>
    </div>
  );
}
