import { buildAudioStreamUrl } from "@/helpers/buildAudioStreamUrl";
import {
  useEffect,
  useRef,
  useState,
  createContext,
  useContext,
  type ReactNode,
} from "react";
import api from "@/lib/api"; // axios instance

interface AudioPlayerContextType {
  isPlaying: boolean;
  currentUrl: string | null;
  duration: number;
  currentTime: number;
  togglePlay: (url: string) => void;
}

const AudioPlayerContext = createContext<AudioPlayerContextType>({
  isPlaying: false,
  currentUrl: null,
  duration: 0,
  currentTime: 0,
  togglePlay: () => {},
});

export const AudioPlayerProvider = ({ children }: { children: ReactNode }) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [currentUrl, setCurrentUrl] = useState<string | null>(null);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  // local derived state from element
  const [isPlaying, setIsPlaying] = useState(false);

  const lastObjectUrl = useRef<string | null>(null);

  useEffect(() => {
    const audio = new Audio();
    audioRef.current = audio;

    const syncState = () => {
      if (!audioRef.current) return;
      setIsPlaying(!audioRef.current.paused && !audioRef.current.ended);
      setDuration(audioRef.current.duration || 0);
      setCurrentTime(audioRef.current.currentTime || 0);
    };

    audio.addEventListener("play", syncState);
    audio.addEventListener("pause", syncState);
    audio.addEventListener("ended", syncState);
    audio.addEventListener("timeupdate", syncState);
    audio.addEventListener("loadedmetadata", syncState);

    return () => {
      audio.removeEventListener("play", syncState);
      audio.removeEventListener("pause", syncState);
      audio.removeEventListener("ended", syncState);
      audio.removeEventListener("timeupdate", syncState);
      audio.removeEventListener("loadedmetadata", syncState);
      audio.pause();
      if (lastObjectUrl.current) {
        URL.revokeObjectURL(lastObjectUrl.current);
      }
    };
  }, []);

  const play = async (relativePath: string) => {
    const audio = audioRef.current;
    if (!audio) return;

    const url = buildAudioStreamUrl(relativePath);

    if (url !== currentUrl) {
      const response = await api.get(url, { responseType: "blob" });

      if (lastObjectUrl.current) {
        URL.revokeObjectURL(lastObjectUrl.current);
      }

      const objectUrl = URL.createObjectURL(response.data);
      lastObjectUrl.current = objectUrl;

      audio.src = objectUrl;
      audio.load();
      setCurrentUrl(url);
    }

    await audio.play();
  };

  const pause = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0; // rewind to start
    }
  };

  const togglePlay = async (relativePath: string) => {
    const url = buildAudioStreamUrl(relativePath);

    if (currentUrl === url && isPlaying) {
      pause();
      return;
    }

    await play(relativePath);
  };

  return (
    <AudioPlayerContext.Provider
      value={{ isPlaying, currentUrl, togglePlay, duration, currentTime }}
    >
      {children}
    </AudioPlayerContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAudioPlayer = () => {
  return useContext(AudioPlayerContext);
};
