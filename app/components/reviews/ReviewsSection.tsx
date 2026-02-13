import { reviews } from '@/data/reviews';
import { ReviewCard } from './ReviewCard';

export function ReviewsSection() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-16">
      <h2 className="text-2xl font-bold mb-8">
        Reviews
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {reviews.map((review) => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </div>
    </div>
  );
}
