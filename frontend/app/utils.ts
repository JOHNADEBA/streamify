import React from "react";

import {
  MdLiveTv,
  MdLibraryBooks,
  MdSportsSoccer,
  MdMovie,
  MdMusicNote,
  MdLocalMovies,
  MdOutlineDocumentScanner,
  MdLocalPlay,
  MdPublic,
  MdNoAdultContent,
} from "react-icons/md";
import api from "./services/api";
import { Video, WatchHistoryResponse } from "./types";

// Define the structure of category data
export const categories = [
  { name: "All", icon: React.createElement(MdLiveTv, { size: 20 }) },
  { name: "Kids", icon: React.createElement(MdLibraryBooks, { size: 20 }) },
  { name: "Sports", icon: React.createElement(MdSportsSoccer, { size: 20 }) },
  { name: "4K", icon: React.createElement(MdMovie, { size: 20 }) },
  { name: "HD", icon: React.createElement(MdMovie, { size: 20 }) },
  { name: "Music", icon: React.createElement(MdMusicNote, { size: 20 }) },
  { name: "Movies", icon: React.createElement(MdLocalMovies, { size: 20 }) },
  {
    name: "Informative",
    icon: React.createElement(MdLibraryBooks, { size: 20 }),
  },
  { name: "Entertainment", icon: React.createElement(MdLiveTv, { size: 20 }) },
  {
    name: "Documentary",
    icon: React.createElement(MdOutlineDocumentScanner, { size: 20 }),
  },
  { name: "Local", icon: React.createElement(MdLocalPlay, { size: 20 }) },
  { name: "Regional", icon: React.createElement(MdLocalPlay, { size: 20 }) },
  { name: "International", icon: React.createElement(MdPublic, { size: 20 }) },
  { name: "Adult", icon: React.createElement(MdNoAdultContent, { size: 20 }) },
];

export const toggleFavorite = async (
  userId: string,
  video: Video,
  favorites: Video[],
  setFavorites: (favorites: Video[] | ((prev: Video[]) => Video[])) => void,
  getToken: () => Promise<string | null>
) => {
  const token = await getToken();
  if (!token) return;

  const isFavorite = favorites.some((fav) => fav.id === video.id);

  // Optimistically update the UI by immediately updating the state
  if (isFavorite) {
    setFavorites((prev) => prev.filter((fav) => fav.id !== video.id));
  } else {
    setFavorites((prev) => [...prev, video]);
  }

  try {
    if (isFavorite) {
      await api.delete(`/favorites/${userId}/${video.id}`, {
        authToken: token,
      });
    } else {
      await api.post(
        `/favorites`,
        { userId, videoId: video.id },
        { authToken: token }
      );
    }
  } catch (error) {
    console.error("Error toggling favorite:", error);
  }
};

export const extractVideoData = (data: WatchHistoryResponse[]): Video[] =>
  Array.isArray(data) ? data.map((entry) => entry.video) : [];

// Format Release Date to ddMMYYYY
export const formattedDate = (releaseDate: string): string =>
  new Date(releaseDate).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

export const formattedMinString = (time: number): string =>
  time > 1 ? "mins" : "min";

export const formatCategoryDisplay = (
  categories: { id: string; name: string }[]
) => {
  // Filter categories to exclude "All" and map to their names
  const filteredCategories = categories
    .filter((category) => category.name !== "All")
    .map((category) => category.name);

  // Get the first category as the main category
  const mainCategory = filteredCategories[0];

  // Join the rest of the categories as secondary categories, if any
  const secondaryCategories = filteredCategories.slice(1).join(", ");

  // Return formatted string
  return `${mainCategory}${
    secondaryCategories ? `, ${secondaryCategories}` : ""
  }`;
};
