import { useQuery } from "@tanstack/react-query";
import axios from "axios";

interface SpotifyTrack {
  isPlaying: boolean;
  title: string;
  artist: string;
  album: string;
  albumArt?: string;
  spotifyUrl: string;
}

const REFRESH_TOKEN = process.env.REACT_APP_SPOTIFY_REFRESH_TOKEN;
const CLIENT_ID = process.env.REACT_APP_SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = process.env.REACT_APP_SPOTIFY_CLIENT_SECRET;

const getAccessToken = async () => {
  const response = await axios.post(
    "https://accounts.spotify.com/api/token",
    new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: REFRESH_TOKEN!,
      client_id: CLIENT_ID!,
    }).toString(),
    {
      headers: {
        Authorization: `Basic ${btoa(`${CLIENT_ID}:${CLIENT_SECRET}`)}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );

  return response.data.access_token;
};

const getCurrentTrack = async (): Promise<SpotifyTrack | null> => {
  try {
    const accessToken = await getAccessToken();

    const response = await axios.get(
      "https://api.spotify.com/v1/me/player/currently-playing",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    // If no track is playing, return null
    if (response.status === 204 || !response.data) {
      return null;
    }

    const track = response.data;

    return {
      isPlaying: track.is_playing,
      title: track.item.name,
      artist: track.item.artists
        .map((artist: { name: string }) => artist.name)
        .join(", "),
      album: track.item.album.name,
      albumArt: track.item.album.images[0]?.url,
      spotifyUrl: track.item.external_urls.spotify,
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(
        "Error fetching current track:",
        error.response?.data || error.message
      );
    }
    return null;
  }
};

export function useSpotify() {
  return useQuery({
    queryKey: ["spotify-current"],
    queryFn: getCurrentTrack,
    refetchInterval: 30000, // Refetch every 30 seconds
    staleTime: 10000, // Consider data stale after 10 seconds
  });
}
