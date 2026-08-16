import { useEffect } from "react";
import { useChatStore } from "../store/useChatStore";
import { useStoryStore } from "../store/useStoryStore";

import Sidebar from "../components/Sidebar";
import NoChatSelected from "../components/NoChatSelected";
import ChatContainer from "../components/ChatContainer";
import StoryViewer from "../components/StoryViewer";

const HomePage = () => {
  const { selectedUser } = useChatStore();
  const { getStories } = useStoryStore();

  useEffect(() => {
    getStories();
  }, [getStories]);

  return (
    <div className="h-screen bg-background overflow-hidden">
      <div className="flex h-full">
        <div
          className={`${
            selectedUser ? "hidden md:flex" : "flex"
          } w-full md:w-80 lg:w-[23rem] shrink-0 h-full`}
        >
          <Sidebar />
        </div>
        <div className={`${selectedUser ? "flex" : "hidden md:flex"} flex-1 min-w-0 h-full`}>
          {!selectedUser ? <NoChatSelected /> : <ChatContainer />}
        </div>
      </div>
      <StoryViewer />
    </div>
  );
};

export default HomePage;
