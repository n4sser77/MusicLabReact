import { buildAudioStreamUrl } from "@/helpers/buildAudioStreamUrl";
import api from "@/lib/api";
import {
  useEffect,
  useRef,
  useState,
  createContext,
  useContext,
  type ReactNode,
} from "react";
import { useAuth } from "./AuthContext";

// 1. Define context type
interface AudioPlayerContextType {
  isPlaying: boolean;
  currentUrl: string | null;
  duration: number;
  currentTime: number;
  togglePlay: (url: string) => void;
}

// 2. Create the context with a default dummy fallback
const AudioPlayerContext = createContext<AudioPlayerContextType>({
  isPlaying: false,
  currentUrl: null,
  duration: 0,
  currentTime: 0,
  togglePlay: () => {},
});

type blobItem = { blob: Blob; url: string };
// 3. AudioPlayerProvider wraps around children and provides the value
export const AudioPlayerProvider = ({ children }: { children: ReactNode }) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentUrl, setCurrentUrl] = useState<string | null>(null);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const { getSignedUrl } = useAuth();

  useEffect(() => {
    const audio = new Audio();
    audioRef.current = audio;

    const onEnded = () => setIsPlaying(false);
    const onLoadedMetadata = () => setDuration(audio.duration);
    const onTimeUpdate = () => setCurrentTime(audio.currentTime);

    audio.addEventListener("ended", onEnded);
    audio.addEventListener("loadedmetadata", onLoadedMetadata);
    audio.addEventListener("timeupdate", onTimeUpdate);

    return () => {
      audio.removeEventListener("ended", onEnded);
      audio.removeEventListener("loadedmetadata", onLoadedMetadata);
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.pause();
    };
  }, []);

  const play = async (fullUrl: string) => {
    const audio = audioRef.current;

    if (!audio) return;
    if (!fullUrl) return;

    const addSigToUrl = async (url: string) => {
      const parts = url.split("/");
      const fileName = parts[parts.length - 1];
      const signedUrl = await getSignedUrl(fileName);
      return signedUrl;
    };

    if (fullUrl !== currentUrl) {
      const newUrl = await addSigToUrl(fullUrl);
      console.log("new url:", newUrl);
      audio.src = newUrl;
      audio.load();
      setCurrentUrl(fullUrl);
    }

    audio.play();
    setIsPlaying(true);
  };

  const pause = () => {
    audioRef.current?.pause();
    setIsPlaying(false);
  };

  const togglePlay = async (relativePath: string) => {
    if (!audioRef.current) return;
    const fullUrl = buildAudioStreamUrl(relativePath);

    if (currentUrl === fullUrl && isPlaying) {
      pause();
      return;
    }

    play(fullUrl);
  };

  return (
    <AudioPlayerContext
      value={{ isPlaying, currentUrl, togglePlay, duration, currentTime }}
    >
      {children}
    </AudioPlayerContext>
  );
};

// 4. Custom hook to consume the context
export const useAudioPlayer = () => {
  return useContext(AudioPlayerContext);
};
