import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

export const useStoryStore = create((set, get) => ({
  stories: [],
  isStoriesLoading: false,
  isCreatingStory: false,
  selectedStory: null,

  getStories: async () => {
    set({ isStoriesLoading: true });
    try {
      const res = await axiosInstance.get("/stories");
      set({ stories: res.data });
    } catch (error) {
      console.error("Error fetching stories:", error);
    } finally {
      set({ isStoriesLoading: false });
    }
  },

  createStory: async (storyData) => {
    set({ isCreatingStory: true });
    try {
      const res = await axiosInstance.post("/stories", storyData);
      set({ stories: [res.data, ...get().stories] });
      toast.success("Story created successfully");
      return res.data;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create story");
      throw error;
    } finally {
      set({ isCreatingStory: false });
    }
  },

  deleteStory: async (storyId) => {
    try {
      await axiosInstance.delete(`/stories/${storyId}`);
      set({ stories: get().stories.filter(story => story._id !== storyId) });
      toast.success("Story deleted successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete story");
    }
  },

  setSelectedStory: (story) => {
    set({ selectedStory: story });
  },
}));