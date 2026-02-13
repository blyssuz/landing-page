import { Star } from 'lucide-react';
import Image from 'next/image';
import type { Review } from '@/data/reviews';

interface ReviewCardProps {
  review: Review;
}

export function ReviewCard({ review }: ReviewCardProps) {
  return (
    <div className="bg-gray-50 rounded-2xl p-6">
      <div className="flex gap-1">
        {Array.from({ length: review.stars }).map((_, i) => (
          <Star
            key={i}
            size={16}
            fill="#F59E0B"
            stroke="#F59E0B"
          />
        ))}
      </div>

      <h3 className="font-semibold mt-3">
        {review.title}
      </h3>

      <p className="text-sm text-gray-600 mt-2 line-clamp-3">
        {review.text}
      </p>

      <div className="flex items-center gap-3 mt-4">
        <Image
          src={review.avatar}
          alt={review.name}
          width={40}
          height={40}
          className="w-10 h-10 rounded-full object-cover"
        />
        <div>
          <p className="font-medium text-sm">
            {review.name}
          </p>
          <p className="text-xs text-gray-400">
            {review.city}
          </p>
        </div>
      </div>
    </div>
  );
}
