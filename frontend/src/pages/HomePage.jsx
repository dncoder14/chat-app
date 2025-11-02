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
        <div className="w-full md:w-80 lg:w-96">
          <Sidebar />
        </div>
        <div className="flex-1 hidden md:flex">
          {!selectedUser ? <NoChatSelected /> : <ChatContainer />}
        </div>
      </div>
      <StoryViewer />
    </div>
  );
};

export default HomePage;