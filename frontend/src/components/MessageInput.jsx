import { useState, useRef, useEffect } from "react";
import { useChatStore } from "../store/useChatStore";
import { Send, Image as ImageIcon, X } from "lucide-react";
import toast from "react-hot-toast";

const MessageInput = () => {
  const [text, setText] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [isSending, setIsSending] = useState(false);
  const fileInputRef = useRef(null);
  const textareaRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const { sendMessage, selectedUser, setTyping } = useChatStore();
  const selectedUserId = selectedUser._id || selectedUser.id;

  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    textarea.style.height = "auto";
    textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`;
  }, [text]);

  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    };
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      toast.error("Please select an image file");
    }
  };

  const removeImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const stopTyping = () => {
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    setTyping(selectedUserId, false);
  };

  const handleSendMessage = async (e) => {
    e?.preventDefault();
    if (!text.trim() && !imagePreview) return;

    setIsSending(true);
    stopTyping();
    try {
      await sendMessage({
        text: text.trim(),
        image: imagePreview,
      });

      setText("");
      setImagePreview(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (error) {
      console.error("Failed to send message:", error);
    } finally {
      setIsSending(false);
    }
  };

  const handleTextChange = (e) => {
    setText(e.target.value);
    setTyping(selectedUserId, e.target.value.length > 0);

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      setTyping(selectedUserId, false);
    }, 1000);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="bg-surface border-t border-border px-4 sm:px-6 py-3 sm:py-4">
      <div className="mx-auto w-full max-w-3xl">
        {imagePreview && (
          <div className="mb-3 relative inline-flex">
            <img
              src={imagePreview}
              alt="Preview"
              className="w-20 h-20 object-cover rounded-xl border border-border shadow-sm"
            />
            <button
              onClick={removeImage}
              aria-label="Remove image"
              className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-foreground/80 flex items-center justify-center text-white hover:bg-foreground transition-colors shadow-sm"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        )}

        <form onSubmit={handleSendMessage} className="flex items-end gap-2">
          <div className="flex-1 flex items-end gap-1 bg-surface-secondary border border-transparent rounded-2xl pl-1.5 pr-2 py-1.5 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/30 transition-colors">
            <button
              type="button"
              aria-label="Attach image"
              className="p-2 text-muted hover:text-primary hover:bg-surface rounded-full transition-colors duration-150 shrink-0"
              onClick={() => fileInputRef.current?.click()}
            >
              <ImageIcon className="w-5 h-5" />
            </button>
            <textarea
              ref={textareaRef}
              rows={1}
              className="flex-1 resize-none bg-transparent border-0 py-2 text-sm text-foreground placeholder-muted focus:outline-none max-h-[120px]"
              placeholder="Type a message..."
              value={text}
              onChange={handleTextChange}
              onKeyDown={handleKeyDown}
            />
            <input
              type="file"
              accept="image/*"
              className="hidden"
              ref={fileInputRef}
              onChange={handleImageChange}
            />
          </div>

          <button
            type="submit"
            aria-label="Send message"
            disabled={(!text.trim() && !imagePreview) || isSending}
            className="p-3 bg-primary hover:bg-primary-hover active:bg-primary-hover text-white rounded-full shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none transition-colors shrink-0"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default MessageInput;
