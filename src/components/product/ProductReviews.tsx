import React, { useState } from 'react';
import { Star, CheckCircle2, MessageSquarePlus } from 'lucide-react';
import { Review } from '../../types';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { useToast } from '../ui/Toast';

interface ProductReviewsProps {
  reviews: Review[];
  rating: number;
  reviewCount: number;
}

export const ProductReviews: React.FC<ProductReviewsProps> = ({
  reviews: initialReviews,
  rating,
  reviewCount,
}) => {
  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newRating, setNewRating] = useState(5);
  const [name, setName] = useState('');
  const [comment, setComment] = useState('');
  const { addToast } = useToast();

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !comment.trim()) {
      addToast('Please provide your name and review', 'error');
      return;
    }

    const newReview: Review = {
      id: `rev-${Date.now()}`,
      userName: name.trim(),
      rating: newRating,
      date: 'Just now',
      comment: comment.trim(),
      verified: true,
    };

    setReviews([newReview, ...reviews]);
    setName('');
    setComment('');
    setIsModalOpen(false);
    addToast('Review submitted successfully! Thank you.', 'success');
  };

  return (
    <div className="space-y-8">
      {/* Overview Score Card */}
      <div className="p-6 rounded-2xl bg-surface border border-surface-border flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-5 text-center sm:text-left">
          <div className="text-4xl sm:text-5xl font-extrabold text-text-primary tracking-tight">
            {rating}
          </div>
          <div>
            <div className="flex items-center gap-1 text-amber-400">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < Math.round(rating) ? 'fill-current' : 'text-slate-300 dark:text-slate-700'
                  }`}
                />
              ))}
            </div>
            <p className="text-xs text-text-muted mt-1">Based on {reviewCount} verified customers</p>
          </div>
        </div>

        <Button
          variant="outline"
          onClick={() => setIsModalOpen(true)}
          leftIcon={<MessageSquarePlus className="w-4 h-4" />}
        >
          Write a Review
        </Button>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.map((rev) => (
          <div
            key={rev.id}
            className="p-5 rounded-2xl bg-surface/70 border border-surface-border space-y-2.5 transition-colors hover:border-indigo-500/30"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-text-primary">{rev.userName}</span>
                {rev.verified && (
                  <span className="flex items-center gap-1 text-[10px] text-emerald-500 font-medium">
                    <CheckCircle2 className="w-3 h-3" /> Verified Buyer
                  </span>
                )}
              </div>
              <span className="text-[11px] text-text-muted">{rev.date}</span>
            </div>

            <div className="flex items-center gap-0.5 text-amber-400">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`w-3.5 h-3.5 ${
                    i < rev.rating ? 'fill-current' : 'text-slate-300 dark:text-slate-700'
                  }`}
                />
              ))}
            </div>

            <p className="text-xs text-text-secondary leading-relaxed">{rev.comment}</p>
          </div>
        ))}
      </div>

      {/* Write Review Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Write a Customer Review"
        description="Share your genuine impressions of this product."
      >
        <form onSubmit={handleSubmitReview} className="space-y-4 pt-2">
          {/* Rating selector */}
          <div>
            <label className="block text-xs font-medium text-text-secondary mb-1.5">
              Your Rating
            </label>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setNewRating(star)}
                  className="p-1 text-amber-400 hover:scale-110 transition-transform"
                >
                  <Star
                    className={`w-6 h-6 ${
                      star <= newRating ? 'fill-current' : 'text-slate-300 dark:text-slate-700'
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          <Input
            label="Your Name"
            placeholder="e.g. Karthikeyan"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <div>
            <label className="block text-xs font-medium text-text-secondary mb-1.5">
              Your Review
            </label>
            <textarea
              rows={4}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="What did you like or dislike about this product? How does it feel in hand?"
              required
              className="w-full p-3 bg-surface text-text-primary rounded-xl border border-surface-border text-xs outline-none focus:border-indigo-500 transition-colors placeholder:text-text-muted"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Submit Review
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
