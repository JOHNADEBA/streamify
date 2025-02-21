"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAuth, useUser } from "@clerk/nextjs";
import { FiHeart } from "react-icons/fi";

import { useAppContext } from "../context";

import ErrorMessage from "./ErrorMessage";
import { extractVideoData, toggleFavorite } from "../utils";
import api from "../services/api";
import { Video, WatchHistoryResponse } from "../types";
import { SET_VIDEO } from "../actions";
import LoadingSpinner from "./LoadingSpinner";

const ChannelList: React.FC = () => {
  const { getToken } = useAuth();
  const { user } = useUser();
  const { dispatch, state } = useAppContext();
  const { channelList } = state;

  const [favorites, setFavorites] = useState<Video[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      if (!user?.id) return;

      const token = await getToken();
      if (token) {
        const favoritesRes = await api.get<WatchHistoryResponse[]>(
          `/favorites/${user.id}`,
          { authToken: token }
        );

        if (favoritesRes.data) {
          setFavorites(extractVideoData(favoritesRes.data));
        }
      }
    };

    fetchData();
  }, [user?.id, getToken]);

  if (state.loadingCategories) {
    return (
      <div className="flex justify-center items-center h-full">
        <LoadingSpinner />
      </div>
    );
  }

  if (channelList && channelList.length < 1) {
    return (
      <div className="col-span-full text-center text-red-500">
        <ErrorMessage message="No channels available for the selected category." />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 p-6">
      {channelList.map((channel, id) => (
        <Link
          key={channel.id + id}
          href={`/details/${channel.id}`}
          passHref
          onClick={() => dispatch({ type: SET_VIDEO, payload: channel })}
        >
          <div className="bg-white shadow-md rounded-lg flex flex-col items-center w-full border-2 border-gray-300 relative transform transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-lg hover:bg-gray-800">
            <Image
              src={channel.thumbnail}
              alt={channel.title}
              width={440}
              height={660}
              priority
              className="object-cover rounded-lg"
            />
            {user?.id && (
              <div className="absolute top-2 right-2 flex space-x-2">
                {/* Favorite Toggle */}
                <div
                  className="p-1 rounded-full"
                  onClick={(e) => {
                    e.preventDefault();
                    toggleFavorite(
                      user!.id,
                      channel,
                      favorites,
                      setFavorites,
                      getToken
                    );
                  }}
                >
                  <FiHeart
                    className={`w-6 h-6 ${
                      favorites.some((fav) => fav.id === channel.id)
                        ? "fill-red-500 text-red-500"
                        : "fill-transparent"
                    }`}
                  />
                </div>
              </div>
            )}
          </div>
        </Link>
      ))}
    </div>
  );
};

export default ChannelList;
