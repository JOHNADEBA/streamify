"use client";

import { useEffect, useState } from "react";
import { useUser, useAuth } from "@clerk/nextjs";

import api from "../services/api";
import { extractVideoData, toggleFavorite } from "../utils";
import { Video, WatchHistoryResponse } from "../types";
import Section from "./Section";

const Dashboard = () => {
  const { getToken } = useAuth();
  const { user } = useUser();

  const [watchHistory, setWatchHistory] = useState<
  Video[]
  >([]);
  const [favorites, setFavorites] = useState<Video[]>([]);
  const [loadingFavorites, setLoadingFavorites] = useState<boolean>(true);
  const [loadingHistory, setLoadingHistory] = useState<boolean>(true);
  const [loadingSubscriptions, setLoadingSubscriptions] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!user?.id) return;

      const token = await getToken();
      if (token) {
        const [historyRes, favoritesRes, subscriptionsRes] = await Promise.all([
          api.get<WatchHistoryResponse[]>(
            `/watch-history/${user.id}`,
            { authToken: token },
            setLoadingHistory
          ),
          api.get<WatchHistoryResponse[]>(
            `/favorites/${user.id}`,
            { authToken: token },
            setLoadingFavorites
          ),
          api.get<WatchHistoryResponse[]>(`/subscriptions/${user.id}`, { authToken: token }, setLoadingSubscriptions),
        ]);

        if (historyRes.data) {
          setWatchHistory(extractVideoData(historyRes.data));
        }
        if (favoritesRes.data) {
          setFavorites(extractVideoData(favoritesRes.data));
        }

        if (subscriptionsRes.data) {
        //   setSubscriptions(extractVideoData(subscriptionsRes.data));
        }
   
      }
    };

    fetchData();
  }, [user?.id, getToken]);

  return (
    <div className="p-4">
      <Section
        title="Watch History"
        videos={watchHistory}
        toggleFavorite={(video) =>
          toggleFavorite(user!.id, video, favorites, setFavorites, getToken)
        }
        loading={loadingHistory}
        favorites={favorites}
      />
      <Section
        title="Favorites"
        videos={favorites}
        toggleFavorite={(video) =>
          toggleFavorite(user!.id, video, favorites, setFavorites, getToken)
        }
        loading={loadingFavorites}
        favorites={favorites}
      />
      {/* <Section title="Subscriptions" videos={subscriptions} toggleFavorite={toggleFavorite} toggleSubscription={toggleSubscription} loading={loadingSubscriptions} favorites={favorites} subscriptions={subscriptions} /> */}
   
    </div>
  );
};

export default Dashboard;
