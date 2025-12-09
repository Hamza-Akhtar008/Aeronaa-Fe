import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Star, Sparkles } from 'lucide-react';
import { useState } from "react";

export function ReviewModal({
  open,
  onOpenChange,
  onSubmit,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: { rating: number; description: string }) => void;
}) {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [description, setDescription] = useState("");

  const handleSubmit = () => {
    onSubmit({ rating, description });
    setRating(0);
    setDescription("");
  };

  const ratingLabels = ["", "Poor", "Fair", "Good", "Very Good", "Excellent"];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
     <DialogContent className="rounded-3xl shadow-2xl border-0 max-w-lg w-full bg-transparent p-0 overflow-hidden animate-in fade-in-30 zoom-in-100 duration-500 ">
        {/* Animated gradient border */}
        <div className="relative rounded-3xl bg-gradient-to-r from-[#023e8a] via-[#0077b6] to-[#00b4d8] p-[2px] animate-pulse">
          {/* Sparkle effects */}
          <div className="absolute -top-1 -left-1 w-3 h-3 bg-white rounded-full animate-ping opacity-30"></div>
          <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-[#00b4d8] rounded-full animate-ping opacity-75 animation-delay-1000"></div>
          
          <div className="bg-white rounded-[22px] p-8 relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[#00b4d8]/10 to-transparent rounded-full -translate-y-16 translate-x-16"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-[#023e8a]/10 to-transparent rounded-full translate-y-12 -translate-x-12"></div>
            
            <DialogHeader className="relative z-10">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-6 h-6 text-[#00b4d8] animate-pulse" />
                <DialogTitle className="text-3xl font-bold bg-gradient-to-r from-[#023e8a] to-[#00b4d8] bg-clip-text text-transparent">
                  Post a Review
                </DialogTitle>
              </div>
              <DialogDescription className="text-gray-600 mb-6 text-base">
                Share your experience and help others make informed decisions.
              </DialogDescription>
            </DialogHeader>

            {/* Star Rating Section */}
            <div className="relative z-10 mb-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Rate your experience</h3>
              <div className="flex items-center gap-2 mb-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoveredRating(star)}
                    onMouseLeave={() => setHoveredRating(0)}
                    className={`w-8 h-8 cursor-pointer transition-all duration-200 transform hover:scale-110 ${
                      star <= (hoveredRating || rating)
                        ? "fill-yellow-400 text-yellow-400 drop-shadow-lg animate-pulse"
                        : "text-gray-300 hover:text-yellow-200"
                    }`}
                  />
                ))}
              </div>
              {/* Rating label */}
              <p className="text-sm font-medium text-[#023e8a] min-h-[20px] transition-all duration-200">
                {ratingLabels[hoveredRating || rating]}
              </p>
            </div>

            {/* Description Section */}
            <div className="relative z-10 mb-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Write your review</h3>
              <div className="relative">
                <textarea
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-4 border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-[#00b4d8] focus:ring-4 focus:ring-[#00b4d8]/20 transition-all duration-300 resize-none placeholder:text-gray-400 text-gray-700 bg-gradient-to-br from-gray-50 to-white"
                  placeholder="Tell us about your experience... What did you love? What could be improved?"
                  maxLength={500}
                />
                <div className="absolute bottom-3 right-3 text-xs text-gray-400">
                  {description.length}/500
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="relative z-10 flex justify-end gap-4">
              <DialogClose asChild>
                <Button 
                  variant="outline" 
                  className="rounded-2xl px-6 py-3 border-2 border-gray-200 hover:border-[#023e8a] hover:text-[#023e8a] transition-all duration-300 transform hover:scale-105 font-semibold"
                >
                  Cancel
                </Button>
              </DialogClose>
              <Button
                onClick={handleSubmit}
                disabled={!rating || !description.trim()}
                className="rounded-2xl px-8 py-3 bg-gradient-to-r from-[#023e8a] to-[#00b4d8] text-white font-bold hover:from-[#0353a4] hover:to-[#0096c7] transition-all duration-300 transform hover:scale-105 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none relative overflow-hidden group animate-bounce"
              >
                <span className="relative z-10">Submit Review</span>
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
