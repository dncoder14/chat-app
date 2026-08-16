import { useState, useEffect } from "react";
import { useStoryStore } from "../store/useStoryStore";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

const StoryViewer = () => {
  const { selectedStory, setSelectedStory, stories } = useStoryStore();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userStories, setUserStories] = useState([]);

  useEffect(() => {
    if (selectedStory) {
      const selectedOwnerId = selectedStory.owner._id || selectedStory.owner.id;
      const selectedStoryId = selectedStory._id || selectedStory.id;
      const ownerStories = stories.filter(story => (story.owner._id || story.owner.id) === selectedOwnerId);
      setUserStories(ownerStories);
      const index = ownerStories.findIndex(story => (story._id || story.id) === selectedStoryId);
      setCurrentIndex(index);
    }
  }, [selectedStory, stories]);

  useEffect(() => {
    if (!selectedStory) return;
    const handleKeyDown = (e) => {
      if (e.key === "Escape") setSelectedStory(null);
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [selectedStory, setSelectedStory]);

  if (!selectedStory) return null;

  const currentStory = userStories[currentIndex];

  if (!currentStory) return null;

  const nextStory = () => {
    if (currentIndex < userStories.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setSelectedStory(null);
    }
  };

  const prevStory = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/90 flex items-center justify-center z-50"
      role="dialog"
      aria-modal="true"
      aria-label={`${currentStory.owner.fullName}'s story`}
    >
      <div className="relative w-full max-w-md h-full bg-black">
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
          <div className="flex items-center space-x-3">
            <img
              src={currentStory.owner.profilePic || "/avatar.png"}
              alt={currentStory.owner.fullName}
              className="w-10 h-10 rounded-full"
            />
            <div>
              <p className="text-white font-medium">{currentStory.owner.fullName}</p>
              <p className="text-gray-300 text-sm">
                {new Date(currentStory.createdAt).toLocaleTimeString()}
              </p>
            </div>
          </div>
          <button
            onClick={() => setSelectedStory(null)}
            aria-label="Close story"
            className="text-white hover:text-gray-300 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex items-center justify-center h-full p-4">
          {currentStory.mediaType === "image" ? (
            <img
              src={currentStory.mediaUrl}
              alt="Story"
              className="max-w-full max-h-full object-contain"
            />
          ) : (
            <div className="text-white text-center p-8">
              <p className="text-lg">{currentStory.content}</p>
            </div>
          )}
        </div>

        {userStories.length > 1 && (
          <>
            {currentIndex > 0 && (
              <button
                onClick={prevStory}
                aria-label="Previous story"
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 transition-colors"
              >
                <ChevronLeft className="w-8 h-8" />
              </button>
            )}
            {currentIndex < userStories.length - 1 && (
              <button
                onClick={nextStory}
                aria-label="Next story"
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 transition-colors"
              >
                <ChevronRight className="w-8 h-8" />
              </button>
            )}
          </>
        )}

        <div className="absolute bottom-4 left-4 right-4">
          <div className="flex space-x-1">
            {userStories.map((_, index) => (
              <div
                key={index}
                className={`flex-1 h-1 rounded ${
                  index === currentIndex ? "bg-white" : "bg-gray-600"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoryViewer;
