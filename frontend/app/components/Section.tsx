import React from "react";
import Link from "next/link";
import Image from "next/image";

import { FiHeart } from "react-icons/fi";
import { SectionProps } from "../types";
import LoadingSpinner from "./LoadingSpinner";
import { SET_VIDEO } from "../actions";
import { useAppContext } from "../context";

const Section = React.memo(
  ({ title, videos, loading, toggleFavorite, favorites }: SectionProps) => {
    const { dispatch } = useAppContext();

    return (
      <div className="mb-6">
        <h2 className="text-xl font-bold mb-2">{title}</h2>
        {loading ? (
          <div className="text-center py-4">
            <LoadingSpinner />
          </div>
        ) : videos && videos.length < 1 ? (
          <p className="text-gray-500">No videos found</p>
        ) : (
          <div
            className="flex overflow-x-auto space-x-4 scrollbar-hide"
            style={{
              scrollbarWidth: "thin",
              scrollbarColor: "#4A5568 #2D3748",
            }}
          >
            {videos.map((video) => (
              <Link
                key={video.id}
                href={`/details/${video.id}`}
                passHref
                onClick={() => dispatch({ type: SET_VIDEO, payload: video })}
              >
                <div className="w-40 mb-4 flex-shrink-0 relative transform transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-lg hover:bg-gray-800">
                  <Image
                    src={video.thumbnail}
                    alt={video.title}
                    width={440}
                    height={560}
                    priority
                    className="object-cover rounded-lg"
                  />
                  <div className="absolute top-2 right-2 flex space-x-2">
                    {/* Favorite Toggle */}
                    <div
                      className="p-1 rounded-full"
                      onClick={(e) => {
                        e.preventDefault();
                        toggleFavorite(video);
                      }}
                    >
                      <FiHeart
                        className={`w-6 h-6 transition-all transform duration-200 ease-in-out ${
                          favorites.some((fav) => fav.id === video.id)
                            ? "fill-red-500 text-red-500 hover:scale-110 hover:fill-transparent hover:text-white"
                            : "fill-transparent hover:scale-110 hover:fill-red-500 hover:text-red-500"
                        }`}
                      />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    );
  }
);

export default Section;
