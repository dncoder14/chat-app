import { useState, useEffect } from "react";
import { Zap } from "lucide-react";

const SmartReply = ({ lastMessage, onReplySelect }) => {
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    if (lastMessage?.text) {
      generateSuggestions(lastMessage.text);
    }
  }, [lastMessage]);

  const generateSuggestions = (messageText) => {
    const text = messageText.toLowerCase();
    let replies = [];

    // Simple AI-like logic for smart replies
    if (text.includes("how are you") || text.includes("how's it going")) {
      replies = ["I'm good, thanks!", "Great! How about you?", "Doing well 😊"];
    } else if (text.includes("thank") || text.includes("thanks")) {
      replies = ["You're welcome!", "No problem!", "Anytime! 😊"];
    } else if (text.includes("?")) {
      replies = ["Yes", "No", "Let me think about it"];
    } else if (text.includes("hello") || text.includes("hi")) {
      replies = ["Hello!", "Hi there!", "Hey! 👋"];
    } else if (text.includes("bye") || text.includes("goodbye")) {
      replies = ["Goodbye!", "See you later!", "Take care! 👋"];
    } else {
      replies = ["👍", "😊", "Sounds good!"];
    }

    setSuggestions(replies);
  };

  if (suggestions.length === 0) return null;

  return (
    <div className="px-4 py-2 bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
      <div className="flex items-center space-x-2 mb-2">
        <Zap className="w-4 h-4 text-primary-500" />
        <span className="text-sm text-gray-600 dark:text-gray-400">Smart Replies</span>
      </div>
      <div className="flex space-x-2 overflow-x-auto">
        {suggestions.map((suggestion, index) => (
          <button
            key={index}
            onClick={() => onReplySelect(suggestion)}
            className="flex-shrink-0 px-3 py-1 bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 rounded-full text-sm hover:bg-primary-200 dark:hover:bg-primary-800 transition-colors"
          >
            {suggestion}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SmartReply;