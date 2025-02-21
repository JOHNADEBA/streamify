"use client";

import React, { useState, useEffect } from "react";
import {
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton,
  useUser,
  useAuth,
} from "@clerk/nextjs";
import Link from "next/link";

import { FiSettings, FiTv, FiUser } from "react-icons/fi";
import { FaCalendarAlt, FaClock } from "react-icons/fa";

import { useAppContext } from "../context";

import {
  Categories,
  CategoriesResponse,
  AllCategories,
  SidebarProps,
  Video,
} from "../types";
import api from "../services/api";
import { categories } from "../utils";
import LoadingSpinner from "./LoadingSpinner";
import {
  CLOSE_SIDEBAR,
  LOADING_CATEGORIES,
  SET_ALL_VIDEOS,
  SET_CATEGORY,
  SET_CHANNEL_LIST,
  TOGGLE_SIDEBAR,
} from "../actions";

const Sidebar: React.FC<SidebarProps> = ({
  showChannels,
  setShowChannels,
  toggleChannels,
}) => {
  const { state, dispatch } = useAppContext();
  const { user, isLoaded } = useUser();
  const { getToken } = useAuth();

  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const [mounted, setMounted] = useState<boolean>(false);
  const [allCategories, setAllCategories] = useState<AllCategories[]>([]);

  useEffect(() => {
    // Prevent hydration mismatch by waiting until the component is mounted
    setMounted(true);

    // Get categories
    fetchAllCategories();

    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const checkUser = async () => {
      if (isLoaded && user) {
        const token = await getToken();
        if (token) {
          await api.get("/auth/me", { authToken: token }); // ✅ Pass token
        }
      }
    };

    checkUser();
  }, [isLoaded, user, getToken]);

  const fetchAllCategories = async () => {
    dispatch({ type: LOADING_CATEGORIES, payload: true });
    const response = await api.get<CategoriesResponse[]>("/categories", {});
    const fetchedCategories: CategoriesResponse[] = response.data || [];

    // add icon to the correct category
    const mappedCategories = fetchedCategories.map(
      (category: CategoriesResponse) => {
        const icon = categories.find((cat) => cat.name === category.name)?.icon;
        return { ...category, icon };
      }
    );

    // set initial channels to all category
    const videosFromAllCategory = mappedCategories.filter(
      (cat) => cat.name === Categories.ALL
    );

    dispatch({ type: SET_ALL_VIDEOS, payload: mappedCategories });
    dispatch({
      type: SET_CHANNEL_LIST,
      payload: videosFromAllCategory[0]?.videos,
    });

    dispatch({ type: LOADING_CATEGORIES, payload: false });
    setAllCategories(mappedCategories);
  };

  const setCategory = (payload: Categories, videos: Video[]) => {
    dispatch({ type: SET_CATEGORY, payload });
    dispatch({ type: SET_CHANNEL_LIST, payload: videos });
    dispatch({ type: CLOSE_SIDEBAR });
  };

  const handleSettings = () => {
    setShowChannels(false);
    dispatch({ type: TOGGLE_SIDEBAR });
  };

  // Don't render the content until the component is mounted
  if (!mounted) return null;

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className={`absolute top-16 left-0 w-64 h-[calc(100vh-4rem)] bg-gray-900 text-white shadow-lg p-4 flex flex-col transform transition-transform duration-300 ease-in-out overflow-hidden ${
        state.isSidebar ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      {/* Top Section */}
      <div className="space-y-2">
        <button
          className="w-full flex items-center space-x-3 p-2 rounded-md hover:bg-gray-700"
          onClick={toggleChannels}
        >
          <FiTv size={20} />
          <span>Channels</span>
        </button>

        {/* Channels Section (Animated) */}
        <div
          className={`overflow-y-auto transition-all duration-500 ease-in-out ${
            showChannels ? "h-[350px]" : "h-0"
          }`}
          style={{
            scrollbarWidth: "thin", // Firefox scrollbar
            scrollbarColor: "#4A5568 #2D3748", // Firefox colors
          }}
        >
          {state.loadingCategories ? (
            <LoadingSpinner />
          ) : (
            <ul className="space-y-2 w-[80%] ml-7">
              {allCategories.map(({ id, name, icon, videos }) => (
                <li key={id}>
                  <Link legacyBehavior href={`/`} passHref>
                    <a
                      onClick={() => setCategory(name as Categories, videos)}
                      className="flex items-center space-x-3 p-2 rounded-md hover:bg-gray-700"
                    >
                      {icon} <span>{name}</span>
                    </a>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="border-t border-gray-700 " />

        <Link href="/settings" legacyBehavior passHref>
          <a
            onClick={handleSettings}
            className="w-full flex items-center space-x-3 p-2 rounded-md hover:bg-gray-700"
          >
            <FiSettings size={20} />
            <span>Settings</span>
          </a>
        </Link>
        <div className="border-t border-gray-700 " />
        {user?.id && (
          <Link href="/dashboard" legacyBehavior passHref>
            <a
              onClick={handleSettings}
              className="w-full flex items-center space-x-3 p-2 rounded-md hover:bg-gray-700"
            >
              <FiUser size={20} />
              <span>Dashboard</span>
            </a>
          </Link>
        )}
      </div>

      {/* Spacer to push bottom content */}
      <div className="flex-grow mt-5" />

      {/* Bottom Section */}
      <div className="flex justify-between items-center text-sm">
        {/* Left Section (Date and Time) */}
        <div className="flex flex-col items-start space-y-1">
          <div className="flex items-center space-x-2">
            <FaCalendarAlt size={16} />
            <span>
              {currentTime.toLocaleDateString("en-US", {
                weekday: "short",
                day: "numeric",
                month: "short",
              })}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <FaClock size={16} />
            <span>{currentTime.toLocaleTimeString()}</span>
          </div>
        </div>

        {/* Right Section (Sign-in Button / User Button) */}
        <div onClick={handleSettings}>
          <SignedOut>
            <SignInButton />
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
