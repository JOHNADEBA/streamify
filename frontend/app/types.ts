import {
  SET_CHANNEL_LIST,
  SET_CATEGORY,
  SET_ALL_VIDEOS,
  SET_VIDEO,
  CLOSE_SIDEBAR,
  TOGGLE_SIDEBAR,
  LOADING_CATEGORIES,
} from "./actions";

export interface AppState {
  selectedCategory: Categories;
  channelList: Video[];
  allVideos: AllCategories[];
  video: Video;
  isSidebar: boolean;
  loadingCategories: boolean;
}

export type Action =
  | { type: typeof SET_CATEGORY; payload: string }
  | { type: typeof SET_CHANNEL_LIST; payload: Video[] }
  | { type: typeof SET_ALL_VIDEOS; payload: AllCategories[] }
  | { type: typeof SET_VIDEO; payload: Video }
  | { type: typeof CLOSE_SIDEBAR }
  | { type: typeof TOGGLE_SIDEBAR }
  | { type: typeof LOADING_CATEGORIES; payload: boolean };
// | { type: typeof SET_FAVORITES; payload: DashboardFavAndHistoryVideo[] };

export enum Categories {
  ALL = "All",
  KIDS = "Kids",
  SPORTS = "Sports",
  FOUR_K = "4K",
  HD = "HD",
  MUSIC = "Music",
  MOVIES = "Movies",
  INFORMATIVE = "Informative",
  ENTERTAINMENT = "Entertainment",
  DOCUMENTARY = "Documentary",
  LOCAL = "Local",
  REGIONAL = "Regional",
  INTERNATIONAL = "International",
  ADULT = "Adult",
}

export interface CategoriesResponse {
  id: string;
  name: string;
  videos: Video[];
}

export interface AllCategories extends CategoriesResponse {
  icon?: React.ReactElement;
}

export interface SidebarProps {
  showChannels: boolean;
  setShowChannels: (state: boolean) => void;
  toggleChannels: () => void;
}

export interface WatchHistoryResponse {
  id: string;
  userId: string;
  videoId: string;
  watchedAt: string;
  video: Video;
}

export interface Video {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  muxAssetId: string;
  muxPlaybackId: string;
  duration: number;
  releaseDate: string;
  views: number;
  categories: { id: string; name: string }[];
  aspectRatio: string;
  createdAt: string;
  updatedAt: string;
}

export interface DashboardFavAndHistoryVideo {
  id: string;
  title: string;
  thumbnail: string;
  videoUrl: string;
  videoId: string;
}

export interface SectionProps {
  title: string;
  videos: Video[];
  loading: boolean;
  toggleFavorite: (video: Video) => void;
  favorites: Video[];
}
