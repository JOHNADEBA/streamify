import {
  SET_CHANNEL_LIST,
  SET_CATEGORY,
  SET_ALL_VIDEOS,
  SET_VIDEO,
  TOGGLE_SIDEBAR,
  CLOSE_SIDEBAR,
  LOADING_CATEGORIES,
} from "./actions";
import { AppState, Action, Categories, AllCategories, Video } from "./types";

export const reducer = (state: AppState, action: Action): AppState => {
  switch (action.type) {
    case SET_CHANNEL_LIST:
      return {
        ...state,
        channelList: action.payload as Video[],
      };

    case SET_CATEGORY:
      return {
        ...state,
        selectedCategory: action.payload as Categories,
      };

    case SET_ALL_VIDEOS:
      return {
        ...state,
        allVideos: action.payload as AllCategories[],
      };

    case SET_VIDEO:
      return {
        ...state,
        video: action.payload as Video,
      };

    case CLOSE_SIDEBAR:
      return {
        ...state,
        isSidebar: false as boolean,
      };

    case TOGGLE_SIDEBAR:
      return {
        ...state,
        isSidebar: !state.isSidebar as boolean,
      };

    case LOADING_CATEGORIES:
      return {
        ...state,
        loadingCategories: action.payload as boolean,
      };

    default:
      return state;
  }
};
