import { useState, useRef } from "react";
import { X, Image, Type } from "lucide-react";
import { useStoryStore } from "../store/useStoryStore";
import toast from "react-hot-toast";

const CreateStoryModal = ({ onClose }) => {
  const [content, setContent] = useState("");
  const [mediaType, setMediaType] = useState("text");
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);
  const { createStory, isCreatingStory } = useStoryStore();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setMediaType("image");
      };
      reader.readAsDataURL(file);
    } else {
      toast.error("Please select an image file");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    try {
      await createStory({
        content: content.trim(),
        mediaType,
        image: imagePreview,
      });
      onClose();
    } catch (error) {
      console.error("Failed to create story:", error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Create Story</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex space-x-2 mb-4">
          <button
            onClick={() => setMediaType("text")}
            className={`flex-1 p-2 rounded-lg flex items-center justify-center space-x-2 ${
              mediaType === "text"
                ? "bg-primary-500 text-white"
                : "bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300"
            }`}
          >
            <Type className="w-4 h-4" />
            <span>Text</span>
          </button>
          <button
            onClick={() => fileInputRef.current?.click()}
            className={`flex-1 p-2 rounded-lg flex items-center justify-center space-x-2 ${
              mediaType === "image"
                ? "bg-primary-500 text-white"
                : "bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300"
            }`}
          >
            <Image className="w-4 h-4" />
            <span>Image</span>
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {imagePreview && (
            <div className="mb-4">
              <img
                src={imagePreview}
                alt="Preview"
                className="w-full h-48 object-cover rounded-lg"
              />
            </div>
          )}

          <div className="mb-4">
            <textarea
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
              placeholder={mediaType === "image" ? "Add a caption..." : "What's on your mind?"}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={4}
              required
            />
          </div>

          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={handleImageChange}
          />

          <div className="flex space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-600 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isCreatingStory || !content.trim()}
              className="flex-1 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isCreatingStory ? "Creating..." : "Create Story"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateStoryModal;