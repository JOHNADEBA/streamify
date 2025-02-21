import { NextResponse } from "next/server";
import api from "@/app/services/api";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { type, data } = body;

    if (type === "video.asset.ready") {
      const muxPlaybackId = data.playback_ids?.[0]?.id;

      const dataToBeSaved = {
        title: "Test Video 1",
        description: "This is a test video 1 description",
        thumbnail: `https://image.mux.com/${muxPlaybackId}/thumbnail.webp`,
        muxAssetId: data.id,
        muxPlaybackId,
        duration: data.duration,
        aspectRatio: data.aspect_ratio,
        categories: {
          connect: [{ id: "1c39c013-a947-4953-99c6-bde4d86eef3a" }], // always replace with with categories needed
        },
      };
      await api.post("/videos", dataToBeSaved, {});
    }
    return new Response(JSON.stringify({ message: "ok" }), { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
