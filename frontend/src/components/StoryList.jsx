import { useStoryStore } from "../store/useStoryStore";

const StoryList = ({ stories }) => {
  const { setSelectedStory } = useStoryStore();

  const groupedStories = stories.reduce((acc, story) => {
    const ownerId = story.owner._id;
    if (!acc[ownerId]) {
      acc[ownerId] = {
        owner: story.owner,
        stories: []
      };
    }
    acc[ownerId].stories.push(story);
    return acc;
  }, {});

  return (
    <div className="flex space-x-3 overflow-x-auto pb-2">
      {Object.values(groupedStories).map(({ owner, stories }) => (
        <button
          key={owner._id}
          onClick={() => setSelectedStory(stories[0])}
          className="flex-shrink-0 text-center"
        >
          <div className="relative">
            <img
              src={owner.profilePic || "/avatar.png"}
              alt={owner.fullName}
              className="w-16 h-16 rounded-full object-cover border-2 border-primary-500 p-0.5"
            />
            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-primary-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
              {stories.length}
            </div>
          </div>
          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 truncate w-16">
            {owner.fullName.split(' ')[0]}
          </p>
        </button>
      ))}
    </div>
  );
};

export default StoryList;