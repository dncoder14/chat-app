import { useEffect } from "react";
import { useChatStore } from "../store/useChatStore";
import { useStoryStore } from "../store/useStoryStore";

import Sidebar from "../components/Sidebar";
import NoChatSelected from "../components/NoChatSelected";
import ChatContainer from "../components/ChatContainer";
import StoryViewer from "../components/StoryViewer";

const HomePage = () => {
  const { selectedUser } = useChatStore();
  const { getStories, selectedStory } = useStoryStore();

  useEffect(() => {
    getStories();
  }, [getStories]);

  return (
    <div className="h-screen bg-white dark:bg-gray-900">
      <div className="flex h-full">
        <Sidebar />
        {!selectedUser ? <NoChatSelected /> : <ChatContainer />}
      </div>
      <StoryViewer />
    </div>
  );
};

export default HomePage;