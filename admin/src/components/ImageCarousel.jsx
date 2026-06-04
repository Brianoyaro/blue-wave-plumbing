import React, { useState, useEffect, useRef } from "react";

const ImageCarousel = ({ images, itemName, fallbackImage }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const carouselRef = useRef(null);

  const minSwipeDistance = 50;

  // Handle touch start
  const handleTouchStart = (e) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  // Handle touch end
  const handleTouchEnd = (e) => {
    setTouchEnd(e.changedTouches[0].clientX);
    handleSwipe();
  };

  // Handle swipe logic
  const handleSwipe = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      handleNext();
    } else if (isRightSwipe) {
      handlePrev();
    }
  };

  // Navigate to previous image
  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  // Navigate to next image
  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "ArrowRight") handleNext();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  if (!images || images.length === 0) {
    return (
      <div className="relative overflow-hidden rounded-2xl shadow-lg bg-gray-50 aspect-square sm:aspect-auto w-full">
        <img
          src={fallbackImage}
          alt="No image available"
          className="w-full h-full sm:h-96 object-contain"
        />
      </div>
    );
  }

  return (
    <div
      ref={carouselRef}
      className="relative overflow-hidden rounded-2xl shadow-lg bg-gray-50 aspect-square sm:aspect-auto w-full"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Main Image */}
      <div className="relative w-full h-full">
        <img
          src={images[currentIndex] || fallbackImage}
          alt={`${itemName}-${currentIndex + 1}`}
          className="w-full h-full sm:h-96 object-contain transition-opacity duration-300"
          onError={(e) => (e.currentTarget.src = fallbackImage)}
        />

        {/* Overlay gradient for better button visibility */}
        {images.length > 1 && (
          <>
            {/* Left gradient */}
            <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-black/30 to-transparent pointer-events-none" />
            {/* Right gradient */}
            <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-black/30 to-transparent pointer-events-none" />
          </>
        )}
      </div>

      {/* Navigation Buttons */}
      {images.length > 1 && (
        <>
          {/* Previous Button */}
          <button
            onClick={handlePrev}
            aria-label="Previous image"
            className="absolute left-2 sm:left-4 top-1/2 transform -translate-y-1/2 z-10 bg-white/80 hover:bg-white text-gray-900 rounded-full p-2 sm:p-3 transition-all shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <svg
              className="w-5 h-5 sm:w-6 sm:h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>

          {/* Next Button */}
          <button
            onClick={handleNext}
            aria-label="Next image"
            className="absolute right-2 sm:right-4 top-1/2 transform -translate-y-1/2 z-10 bg-white/80 hover:bg-white text-gray-900 rounded-full p-2 sm:p-3 transition-all shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <svg
              className="w-5 h-5 sm:w-6 sm:h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </>
      )}

      {/* Image Counter and Indicators */}
      {images.length > 1 && (
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3 sm:p-4">
          {/* Dot Indicators */}
          <div className="flex justify-center gap-1 sm:gap-2 mb-2 sm:mb-3">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                aria-label={`Go to image ${index + 1}`}
                className={`rounded-full transition-all ${
                  index === currentIndex
                    ? "bg-white w-2 h-2 sm:w-3 sm:h-3"
                    : "bg-white/50 w-1.5 h-1.5 sm:w-2 sm:h-2 hover:bg-white/80"
                }`}
              />
            ))}
          </div>

          {/* Image Counter */}
          <div className="text-center text-white text-xs sm:text-sm font-medium">
            {currentIndex + 1} / {images.length}
          </div>
        </div>
      )}

      {/* Mobile Swipe Hint */}
      {images.length > 1 && (
        <div className="absolute top-2 right-2 sm:hidden bg-black/60 text-white text-xs px-2 py-1 rounded-full">
          Swipe →
        </div>
      )}
    </div>
  );
};

export default ImageCarousel;
