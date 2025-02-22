"use client";

import { MouseEvent as ReactMouseEvent, useEffect, useState } from "react";
import { useUser, useAuth } from "@clerk/nextjs";
import MuxPlayer from "@mux/mux-player-react";
import api from "../../services/api";
import { useAppContext } from "../../context";
import { CLOSE_SIDEBAR } from "@/app/actions";
import ErrorMessage from "@/app/components/ErrorMessage";

const Stream: React.FC = () => {
  const { state, dispatch } = useAppContext();
  const { getToken } = useAuth();
  const { user } = useUser();
  const { id, muxAssetId, muxPlaybackId, title, aspectRatio } = state.video;

  const [error, setError] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);

  // Prevent hydration mismatch by ensuring this runs only on the client
  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    const checkVideoAvailabilityOnMux = async () => {
      try {
        const response = await fetch(
          `https://api.mux.com/video/v1/assets/${muxAssetId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Basic ${Buffer.from(
                `${process.env.NEXT_PUBLIC_MUX_TOKEN_ID}:${process.env.NEXT_PUBLIC_MUX_TOKEN_SECRET}`
              ).toString("base64")}`,
            },
          }
        );

        if (!response.ok) {
          setError("Video not found");
        }
      } catch (error) {
        setError("Video not found");
      }
    };

    checkVideoAvailabilityOnMux();
  }, [muxPlaybackId]);

  useEffect(() => {
    const trackWatchHistory = async () => {
      const token = await getToken();
      if (token && user?.id && id) {
        await Promise.all([
          api.post(`/watch-history`, { userId: user.id, videoId: id }, { authToken: token }),
          api.patch(`/videos/${id}`, {}),
        ]);
      }
    };
    trackWatchHistory();
  }, []);

  const closeSidebar = (e: ReactMouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation();
    dispatch({ type: CLOSE_SIDEBAR });
  };

  const [numerator, denominator] = aspectRatio?.split(":").map(Number) ?? [16, 9];

  // Prevent rendering on the server to avoid mismatch
  if (!isClient) return null;

  if (error) {
    return (
      <div className="mt-5 col-span-full text-center text-red-500">
        <ErrorMessage message={error} />
      </div>
    );
  }

  return (
    <div
      onClick={(e) => closeSidebar(e)}
      className="stream-container flex justify-center items-center h-[calc(100vh-4rem)] bg-gray-800"
    >
      <div className="flex justify-center items-center rounded w-3/4 h-full">
        <MuxPlayer
          playbackId={muxPlaybackId}
          accent-color="#111827"
          style={{ height: "70%" }} // , aspectRatio:numerator/denominator
          metadata={{
            video_id: id,
            video_title: title,
            viewer_user_id: user?.id,
          }}
        />
      </div>
    </div>
  );
};

export default Stream;
