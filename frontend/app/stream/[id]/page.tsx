"use client";

import { MouseEvent as ReactMouseEvent, useEffect } from "react";
import { useUser, useAuth } from "@clerk/nextjs";
import MuxPlayer from "@mux/mux-player-react";
import api from "../../services/api";
import { useAppContext } from "../../context";
import { CLOSE_SIDEBAR } from "@/app/actions";

const Stream: React.FC = () => {
  const { state, dispatch } = useAppContext();

  const { getToken } = useAuth();
  const { user } = useUser();
  const { id, muxPlaybackId, title, aspectRatio } = state.video;

  useEffect(() => {
    const trackWatchHistory = async () => {
      const token = await getToken();
      if (token && user?.id && id) {
        await Promise.all([
          api.post(`/watch-history`, { userId: user.id, videoId:id }, { authToken: token }),
          api.patch(`/videos/${id}`, {})
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
  
  return (
    <div
      onClick={(e) => closeSidebar(e)}
      className="stream-container flex justify-center items-center h-[calc(100vh-4rem)] bg-gray-800"
    >
      <div className="flex justify-center items-center rounded w-3/4 h-full">
        <MuxPlayer
          playbackId={muxPlaybackId}
          accent-color="#111827"
          style={{  height: "70%" }} // , aspectRatio:numerator/denominator
          metadata={{
            video_id: { id },
            video_title: { title },
            viewer_user_id: user?.id,
          }}
        />
      </div>
    </div>
  );
};

export default Stream;
