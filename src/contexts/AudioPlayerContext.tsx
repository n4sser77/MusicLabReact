import {
  useEffect,
  useRef,
  useState,
  createContext,
  useContext,
  type ReactNode,
} from "react";

// 1. Define context type
interface AudioPlayerContextType {
  isPlaying: boolean;
  currentUrl: string | null;
  togglePlay: (url: string) => void;
}

// 2. Create the context with a default dummy fallback
const AudioPlayerContext = createContext<AudioPlayerContextType>({
  isPlaying: false,
  currentUrl: null,
  togglePlay: () => {},
});

// 3. AudioPlayerProvider wraps around children and provides the value
export const AudioPlayerProvider = ({ children }: { children: ReactNode }) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentUrl, setCurrentUrl] = useState<string | null>(null);
  

  useEffect(() => {
    const audio = new Audio();
    audioRef.current = audio;

    const onEnded = () => setIsPlaying(false);
    audio.addEventListener("ended", onEnded);

    return () => {
      audio.removeEventListener("ended", onEnded);
      audio.pause();
    };
  }, []);

  const play = (url: string) => {
    const audio = audioRef.current;
    if (!audio) return;

    if (url !== currentUrl) {
      audio.src = url;
      setCurrentUrl(url);
    }

    audio.play();
    setIsPlaying(true);
  };

  const pause = () => {
    audioRef.current?.pause();
    setIsPlaying(false);
  };

  const baseUrl = "http://localhost:5106/api/audio/stream";

const togglePlay = (relativePath: string) => {
  if (!audioRef.current) return;

  const parts = relativePath.split('/');
  if (parts.length !== 2) {
    console.error("Invalid relative path format");
    return;
  }

  const userDir = parts[0]; // e.g. "user_6"
  const fileName = parts[1]; // e.g. "February_5th_108BPM.m4a"

  // Extract userId from userDir by removing "user_" prefix
  const userId = userDir.replace("user_", "");

  // Construct the full streaming URL
  const url = `${baseUrl}/${userId}/${encodeURIComponent(fileName)}`;

  if (currentUrl === url && isPlaying) {
    pause();
  } else {
    play(url);
  }
};

  return (
    <AudioPlayerContext value={{ isPlaying, currentUrl, togglePlay }}>
      {children}
    </AudioPlayerContext>
  );
};

// 4. Custom hook to consume the context
export const useAudioPlayer = () => {
  return useContext(AudioPlayerContext);
};
