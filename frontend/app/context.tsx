"use client";

import { createContext, useReducer, useContext, ReactNode } from "react";
import { reducer } from "@/app/reducer";
import { AppState, Action, Categories } from "./types";

const initialState: AppState = {
  selectedCategory: Categories.ALL,
  channelList: [],
  allVideos: [],
  video: {
    id: "",
    title: "",
    description: "",
    thumbnail: "",
    muxAssetId: "",
    muxPlaybackId: "",
    duration: 0,
    releaseDate: "",
    views: 0,
    createdAt: "",
    updatedAt: "",
    categories: [],
    aspectRatio: ""
  },
  isSidebar: false,
  loadingCategories: true
};

const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<Action>;
} | null>({
  state: initialState,
  dispatch: () => null,
});

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};
