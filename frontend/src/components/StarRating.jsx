import React from 'react';

export default function StarRating({ rating, onRate }) {
  return (
    <div>
      {[1, 2, 3, 4, 5].map((star) => (
        <span key={star} onClick={() => onRate(star)}>
          {star <= rating ? '★' : '☆'}
        </span>
      ))}
    </div>
  );
}
