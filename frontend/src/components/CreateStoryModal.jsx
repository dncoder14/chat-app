import { useState, useRef } from "react";
import { Image as ImageIcon, Type } from "lucide-react";
import { useStoryStore } from "../store/useStoryStore";
import toast from "react-hot-toast";
import Modal from "./ui/Modal";

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
    <Modal onClose={onClose} title="Create Story">
      <div className="flex gap-2 mb-4">
        <button
          type="button"
          onClick={() => setMediaType("text")}
          className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-2 text-sm font-medium transition-colors ${
            mediaType === "text"
              ? "bg-primary text-white"
              : "bg-surface-secondary text-muted hover:text-foreground"
          }`}
        >
          <Type className="w-4 h-4" />
          <span>Text</span>
        </button>
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-2 text-sm font-medium transition-colors ${
            mediaType === "image"
              ? "bg-primary text-white"
              : "bg-surface-secondary text-muted hover:text-foreground"
          }`}
        >
          <ImageIcon className="w-4 h-4" />
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

        <div className="mb-5">
          <label htmlFor="story-content" className="sr-only">
            Story content
          </label>
          <textarea
            id="story-content"
            className="w-full px-3.5 py-2.5 border border-border rounded-lg bg-background text-foreground placeholder-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors resize-none"
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

        <div className="flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-4 py-2.5 text-sm font-medium text-foreground bg-surface-secondary rounded-lg hover:bg-border transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isCreatingStory || !content.trim()}
            className="flex-1 px-4 py-2.5 bg-primary hover:bg-primary-hover text-white text-sm font-medium rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isCreatingStory ? "Creating..." : "Create Story"}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default CreateStoryModal;
